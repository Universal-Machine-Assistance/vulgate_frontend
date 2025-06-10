# Vulgate Backend API Specification for Image Management

## Overview
The frontend image management system expects these REST API endpoints to be implemented on your backend server.

## Base URL
```
http://127.0.0.1:8000/api/v1
```

## Authentication
- **Current**: No authentication required (development mode)
- **Future**: Add JWT/session-based authentication for image uploads

## API Endpoints

### 1. Verse Images

#### Get Images for a Specific Verse
```http
GET /verses/{book}/{chapter}/{verse}/images
```

**Parameters:**
- `book` (string): Book abbreviation (e.g., "Gn", "Ex", "Mt")
- `chapter` (integer): Chapter number
- `verse` (integer): Verse number

**Response:**
```json
{
  "images": [
    {
      "id": "uuid-string",
      "url": "https://your-domain.com/images/verse_images/gn_1_1_image1.jpg",
      "filename": "creation_scene.jpg",
      "description": "Beautiful depiction of the creation",
      "upload_date": "2024-01-15T10:30:00Z",
      "file_size": 245760,
      "mime_type": "image/jpeg"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `404`: No images found (return empty array)
- `400`: Invalid parameters

#### Upload Images for a Verse
```http
POST /verses/{book}/{chapter}/{verse}/images
Content-Type: multipart/form-data
```

**Parameters:**
- `book`, `chapter`, `verse`: Same as GET

**Request Body:**
```
images: [File, File, ...] // Multiple image files
descriptions[0]: string   // Optional description for first image
descriptions[1]: string   // Optional description for second image
...
```

**Response:**
```json
{
  "success": true,
  "uploaded_count": 2,
  "images": [
    {
      "id": "new-uuid-1",
      "url": "https://your-domain.com/images/verse_images/gn_1_1_new1.jpg",
      "filename": "uploaded_image_1.jpg",
      "description": "User provided description",
      "upload_date": "2024-01-15T10:30:00Z",
      "file_size": 245760,
      "mime_type": "image/jpeg"
    }
  ]
}
```

**Status Codes:**
- `201`: Images uploaded successfully
- `400`: Invalid files or parameters
- `413`: File too large
- `422`: Unsupported file type

#### Update Image Description
```http
PATCH /verses/{book}/{chapter}/{verse}/images/{image_id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "description": "Updated description text"
}
```

**Response:**
```json
{
  "success": true,
  "image": {
    "id": "uuid-string",
    "description": "Updated description text",
    // ... other image fields
  }
}
```

#### Delete Image
```http
DELETE /verses/{book}/{chapter}/{verse}/images/{image_id}
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### 2. Book Images

#### Get All Images for a Book
```http
GET /books/{book}/images
```

**Parameters:**
- `book` (string): Book abbreviation

**Response:**
```json
{
  "images": [
    {
      "id": "uuid-string",
      "url": "https://your-domain.com/images/verse_images/gn_1_1_image1.jpg",
      "filename": "creation_scene.jpg",
      "description": "Beautiful depiction of the creation",
      "upload_date": "2024-01-15T10:30:00Z",
      "file_size": 245760,
      "mime_type": "image/jpeg",
      "verse_reference": {
        "chapter": 1,
        "verse": 1,
        "full_reference": "Gn 1:1"
      }
    }
  ]
}
```

#### Get Images for a Specific Chapter
```http
GET /books/{book}/chapters/{chapter}/images
```

**Parameters:**
- `book` (string): Book abbreviation
- `chapter` (integer): Chapter number

**Response:** Same format as book images, filtered by chapter

## Database Schema Suggestions

### Images Table
```sql
CREATE TABLE verse_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_abbr VARCHAR(10) NOT NULL,
    chapter_number INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_verse_images_reference ON verse_images(book_abbr, chapter_number, verse_number);
CREATE INDEX idx_verse_images_book ON verse_images(book_abbr);
CREATE INDEX idx_verse_images_chapter ON verse_images(book_abbr, chapter_number);
```

## File Storage Strategy

### Option 1: Local File Storage
```
/storage/images/verse_images/
  ├── gn/
  │   ├── 1/
  │   │   ├── 1/
  │   │   │   ├── {uuid}_creation_scene.jpg
  │   │   │   └── {uuid}_another_image.png
  │   │   └── 2/
  │   └── 2/
  └── ex/
```

### Option 2: Cloud Storage (AWS S3, etc.)
```
bucket-name/verse_images/gn/1/1/{uuid}_creation_scene.jpg
```

## Implementation Example (Python/FastAPI)

```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from typing import List, Optional
import uuid
import os
from PIL import Image

app = FastAPI()

@app.get("/api/v1/verses/{book}/{chapter}/{verse}/images")
async def get_verse_images(book: str, chapter: int, verse: int):
    # Query database for images
    images = await get_images_from_db(book, chapter, verse)
    return {"images": images}

@app.post("/api/v1/verses/{book}/{chapter}/{verse}/images")
async def upload_verse_images(
    book: str, 
    chapter: int, 
    verse: int,
    images: List[UploadFile] = File(...),
    descriptions: Optional[List[str]] = None
):
    uploaded_images = []
    
    for i, image in enumerate(images):
        # Validate file type
        if not image.content_type.startswith('image/'):
            raise HTTPException(400, "Only image files allowed")
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        ext = os.path.splitext(image.filename)[1]
        filename = f"{file_id}_{image.filename}"
        
        # Save file
        file_path = f"storage/images/verse_images/{book}/{chapter}/{verse}/{filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as f:
            content = await image.read()
            f.write(content)
        
        # Save to database
        image_record = await save_image_to_db({
            "id": file_id,
            "book_abbr": book,
            "chapter_number": chapter,
            "verse_number": verse,
            "filename": filename,
            "original_filename": image.filename,
            "description": descriptions[i] if descriptions and i < len(descriptions) else None,
            "file_path": file_path,
            "file_size": len(content),
            "mime_type": image.content_type
        })
        
        uploaded_images.append(image_record)
    
    return {
        "success": True,
        "uploaded_count": len(uploaded_images),
        "images": uploaded_images
    }

@app.patch("/api/v1/verses/{book}/{chapter}/{verse}/images/{image_id}")
async def update_image(book: str, chapter: int, verse: int, image_id: str, data: dict):
    # Update image description in database
    updated_image = await update_image_in_db(image_id, data)
    return {"success": True, "image": updated_image}

@app.delete("/api/v1/verses/{book}/{chapter}/{verse}/images/{image_id}")
async def delete_image(book: str, chapter: int, verse: int, image_id: str):
    # Delete file and database record
    await delete_image_from_db(image_id)
    return {"success": True, "message": "Image deleted successfully"}
```

## Testing with curl

### Upload an image:
```bash
curl -X POST \
  http://127.0.0.1:8000/api/v1/verses/Gn/1/1/images \
  -F "images=@/path/to/your/creation_image.jpg" \
  -F "descriptions[0]=Beautiful creation scene"
```

### Get images:
```bash
curl http://127.0.0.1:8000/api/v1/verses/Gn/1/1/images
```

## Security Considerations

1. **File Validation**: Check file types, sizes, and scan for malware
2. **Rate Limiting**: Prevent abuse of upload endpoints
3. **Authentication**: Require login for uploads
4. **Storage Quotas**: Limit storage per user/verse
5. **Input Sanitization**: Clean descriptions and filenames
6. **CORS**: Configure properly for your frontend domain

## Performance Optimizations

1. **Image Thumbnails**: Generate thumbnails for grid views
2. **CDN**: Use CloudFront/CloudFlare for image delivery
3. **Compression**: Optimize images on upload
4. **Caching**: Cache image lists with Redis
5. **Pagination**: For books with many images

This specification provides everything needed to implement the backend for your image management system! 