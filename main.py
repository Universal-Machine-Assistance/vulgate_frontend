from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import uuid
import os
import shutil
from datetime import datetime
import json
from pathlib import Path

# Create FastAPI app
app = FastAPI(title="Vulgate Image Management API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories for file storage
STORAGE_DIR = Path("storage")
IMAGES_DIR = STORAGE_DIR / "images" / "verse_images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Serve static files
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

# In-memory storage for demo (replace with database in production)
images_db: List[Dict[str, Any]] = []

def generate_image_url(book: str, chapter: int, verse: int, filename: str) -> str:
    """Generate URL for accessing the image"""
    return f"http://127.0.0.1:8001/storage/images/verse_images/{book}/{chapter}/{verse}/{filename}"

def save_image_file(book: str, chapter: int, verse: int, image: UploadFile) -> tuple[str, str]:
    """Save uploaded image file and return filename and file path"""
    # Create directory structure
    verse_dir = IMAGES_DIR / book / str(chapter) / str(verse)
    verse_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(image.filename)[1] if image.filename else '.jpg'
    filename = f"{file_id}_{image.filename}"
    file_path = verse_dir / filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    return filename, str(file_path)

@app.get("/")
async def root():
    return {"message": "Vulgate Image Management API", "version": "1.0.0"}

# Verse Images Endpoints
@app.get("/api/v1/verses/{book}/{chapter}/{verse}/images")
async def get_verse_images(book: str, chapter: int, verse: int):
    """Get all images for a specific verse"""
    verse_images = [
        img for img in images_db 
        if img["book_abbr"] == book and img["chapter_number"] == chapter and img["verse_number"] == verse
    ]
    return {"images": verse_images}

@app.post("/api/v1/verses/{book}/{chapter}/{verse}/images")
async def upload_verse_images(
    book: str, 
    chapter: int, 
    verse: int,
    images: List[UploadFile] = File(...),
    descriptions: Optional[List[str]] = Form(None)
):
    """Upload images for a specific verse"""
    if not images:
        raise HTTPException(status_code=400, detail="No images provided")
    
    uploaded_images = []
    
    for i, image in enumerate(images):
        # Validate file type
        if not image.content_type or not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail=f"File {image.filename} is not an image")
        
        # Validate file size (5MB limit)
        content = await image.read()
        if len(content) > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(status_code=413, detail=f"File {image.filename} is too large (max 5MB)")
        
        # Reset file pointer
        await image.seek(0)
        
        # Save file
        filename, file_path = save_image_file(book, chapter, verse, image)
        
        # Create image record
        image_record = {
            "id": str(uuid.uuid4()),
            "url": generate_image_url(book, chapter, verse, filename),
            "filename": filename,
            "description": descriptions[i] if descriptions and i < len(descriptions) else None,
            "upload_date": datetime.now().isoformat() + "Z",
            "file_size": len(content),
            "mime_type": image.content_type,
            "book_abbr": book,
            "chapter_number": chapter,
            "verse_number": verse
        }
        
        images_db.append(image_record)
        uploaded_images.append(image_record)
    
    return {
        "success": True,
        "uploaded_count": len(uploaded_images),
        "images": uploaded_images
    }

@app.patch("/api/v1/verses/{book}/{chapter}/{verse}/images/{image_id}")
async def update_image(book: str, chapter: int, verse: int, image_id: str, data: dict):
    """Update image description"""
    for img in images_db:
        if img["id"] == image_id:
            if "description" in data:
                img["description"] = data["description"]
            return {"success": True, "image": img}
    
    raise HTTPException(status_code=404, detail="Image not found")

@app.delete("/api/v1/verses/{book}/{chapter}/{verse}/images/{image_id}")
async def delete_image(book: str, chapter: int, verse: int, image_id: str):
    """Delete an image"""
    for i, img in enumerate(images_db):
        if img["id"] == image_id:
            # Delete file
            try:
                filename = img["filename"]
                file_path = IMAGES_DIR / book / str(chapter) / str(verse) / filename
                if file_path.exists():
                    file_path.unlink()
            except Exception as e:
                print(f"Error deleting file: {e}")
            
            # Remove from database
            del images_db[i]
            return {"success": True, "message": "Image deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Image not found")

# Book Images Endpoints
@app.get("/api/v1/books/{book}/images")
async def get_book_images(book: str):
    """Get all images for a book"""
    book_images = []
    for img in images_db:
        if img["book_abbr"] == book:
            # Add verse reference
            image_with_ref = img.copy()
            image_with_ref["verse_reference"] = {
                "chapter": img["chapter_number"],
                "verse": img["verse_number"],
                "full_reference": f"{book} {img['chapter_number']}:{img['verse_number']}"
            }
            book_images.append(image_with_ref)
    
    return {"images": book_images}

@app.get("/api/v1/books/{book}/chapters/{chapter}/images")
async def get_chapter_images(book: str, chapter: int):
    """Get all images for a specific chapter"""
    chapter_images = []
    for img in images_db:
        if img["book_abbr"] == book and img["chapter_number"] == chapter:
            # Add verse reference
            image_with_ref = img.copy()
            image_with_ref["verse_reference"] = {
                "chapter": img["chapter_number"],
                "verse": img["verse_number"],
                "full_reference": f"{book} {img['chapter_number']}:{img['verse_number']}"
            }
            chapter_images.append(image_with_ref)
    
    return {"images": chapter_images}

# Enhanced Dictionary endpoints (from existing system)
@app.get("/api/v1/dictionary/books/{book_name}")
async def get_book_info(book_name: str):
    """Get enhanced book information"""
    # Sample book data (replace with actual database/AI generation)
    sample_books = {
        "Gn": {
            "book_name": "Genesis",
            "latin_name": "Liber Genesis",
            "full_name": "Liber Genesis",
            "summary": "Liber Genesis narrat creationem mundi, hominum primorum historiam, et patriarcharum vitam. Continet fundamenta fidei de Deo creatore et foedere cum Abraham.",
            "key_themes": ["Creatio", "Peccatum originale", "Foedus", "Providentia divina"],
            "important_sections": [
                {
                    "reference": "Gn 1:1-31",
                    "title": "Creatio Mundi",
                    "description": "Narratio sex dierum creationis"
                }
            ],
            "historical_context": "Scriptus est in tempore exilii Babylonici (saec. VI a.C.) ad explicandam originem mundi et populi Israel.",
            "literary_genre": "Narratio historico-theologica, genealogiae, etiologia",
            "authorship": "Traditio Moysi attributa, sed compositio complexa cum fontibus variis",
            "date_composed": "Saec. X-VI a.C. (compositio gradatim)",
            "theological_significance": "Fundamentum antropologiae christianae, doctrina de creatione, peccato originali, et promissionibus divinis.",
            "notable_figures": ["Adam", "Eva", "Noe", "Abraham", "Isaac", "Iacob", "Ioseph"],
            "cover_image_url": None
        }
    }
    
    book_info = sample_books.get(book_name)
    if not book_info:
        raise HTTPException(status_code=404, detail=f"Book {book_name} not found")
    
    return book_info

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Vulgate Image Management API...")
    print("📁 Storage directory:", STORAGE_DIR.absolute())
    print("🖼️  Images directory:", IMAGES_DIR.absolute())
    uvicorn.run(app, host="127.0.0.1", port=8001) 