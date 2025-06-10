import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, 
  faUpload, 
  faTimes, 
  faSpinner,
  faTrash,
  faExpand,
  faDownload,
  faEdit,
  faPlus,
  faPhotoVideo
} from '@fortawesome/free-solid-svg-icons';

interface VerseImage {
  id: string;
  url: string;
  filename: string;
  description?: string;
  upload_date: string;
  file_size?: number;
  mime_type?: string;
}

interface VerseImageManagerProps {
  bookAbbr: string;
  chapter: number;
  verse: number;
  API_BASE_URL: string;
  isCompact?: boolean; // For smaller displays in verse view
}

const VerseImageManager: React.FC<VerseImageManagerProps> = ({ 
  bookAbbr, 
  chapter, 
  verse, 
  API_BASE_URL,
  isCompact = false 
}) => {
  const [images, setImages] = useState<VerseImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [selectedImage, setSelectedImage] = useState<VerseImage | null>(null);
  const [imageDescriptions, setImageDescriptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchVerseImages();
  }, [bookAbbr, chapter, verse]);

  const fetchVerseImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verses/${bookAbbr}/${chapter}/${verse}/images`);
      
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
        console.log(`Loaded ${data.images?.length || 0} images for ${bookAbbr} ${chapter}:${verse}`);
      } else if (response.status === 404) {
        // No images found - normal case
        setImages([]);
      } else {
        console.warn('Failed to fetch verse images:', response.status);
        setImages([]);
        if (response.status === 404) {
          console.info('Image API not implemented yet. This is normal during development.');
        }
      }
    } catch (error) {
      console.error('Error fetching verse images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach((file, index) => {
      formData.append('images', file);
      // Add description if provided
      const description = imageDescriptions[`new_${index}`] || '';
      if (description) {
        formData.append(`descriptions[${index}]`, description);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/verses/${bookAbbr}/${chapter}/${verse}/images`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Uploaded ${files.length} images for ${bookAbbr} ${chapter}:${verse}`);
        await fetchVerseImages(); // Refresh the list
        setShowUploadArea(false);
        setImageDescriptions({});
      } else {
        const errorMsg = response.status === 404 
          ? 'Image upload API not implemented yet. Please implement the backend endpoint first.'
          : `Upload failed: ${response.status}`;
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      const message = error instanceof Error && error.message.includes('not implemented') 
        ? 'API nondum implementata est. Backend endpoints needed.'
        : 'Imagines transmittere non potuit. Please try again.';
      alert(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (!window.confirm('Delete this image? Hanc imaginem delere vis?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/verses/${bookAbbr}/${chapter}/${verse}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Deleted image ${imageId} from ${bookAbbr} ${chapter}:${verse}`);
        await fetchVerseImages(); // Refresh the list
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Imaginem delere non potuit. Please try again.');
    }
  };

  const handleImageEdit = async (imageId: string, newDescription: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verses/${bookAbbr}/${chapter}/${verse}/images/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: newDescription }),
      });

      if (response.ok) {
        console.log(`Updated description for image ${imageId}`);
        await fetchVerseImages(); // Refresh the list
      } else {
        throw new Error(`Update failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Imaginis descriptionem renovare non potuit. Please try again.');
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb > 1) return `${mb.toFixed(1)}MB`;
    return `${kb.toFixed(1)}KB`;
  };

  if (isCompact) {
    return (
      <div className="verse-images-compact">
        {images.length > 0 && (
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faPhotoVideo} className="text-purple-400 text-sm" />
            <span className="text-purple-300 text-xs">
              {images.length} {images.length === 1 ? 'imago' : 'imagines'}
            </span>
            <div className="flex space-x-1">
              {images.slice(0, 3).map((image, index) => (
                <div
                  key={image.id}
                  className="w-6 h-6 rounded border border-purple-500/50 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img 
                    src={image.url} 
                    alt={image.description || image.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {images.length > 3 && (
                <div className="w-6 h-6 rounded border border-purple-500/50 bg-purple-600/30 flex items-center justify-center">
                  <span className="text-xs text-purple-300">+{images.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="verse-image-manager bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center">
          <FontAwesomeIcon icon={faImage} className="mr-2" />
          Imagines Versus ({bookAbbr} {chapter}:{verse})
        </h3>
        <button
          onClick={() => setShowUploadArea(!showUploadArea)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Add Images
        </button>
      </div>

      {/* Upload Area */}
      {showUploadArea && (
        <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <div className="border-2 border-dashed border-purple-500/50 rounded-lg p-6 text-center">
            <FontAwesomeIcon icon={faUpload} className="text-purple-400 text-3xl mb-3" />
            <p className="text-slate-300 mb-3">
              Drag & drop images here or click to select
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block"
            >
              Choose Images
            </label>
            {isUploading && (
              <div className="mt-3 flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-400 mr-2" />
                <span className="text-purple-300">Uploading images...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Images Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-400 mr-2" />
          <span className="text-purple-300">Loading images...</span>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
                <img
                  src={image.url}
                  alt={image.description || image.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full"
                      title="View full size"
                    >
                      <FontAwesomeIcon icon={faExpand} size="sm" />
                    </button>
                    <button
                      onClick={() => {
                        const newDesc = prompt('Edit description:', image.description || '');
                        if (newDesc !== null) {
                          handleImageEdit(image.id, newDesc);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                      title="Edit description"
                    >
                      <FontAwesomeIcon icon={faEdit} size="sm" />
                    </button>
                    <button
                      onClick={() => handleImageDelete(image.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      title="Delete image"
                    >
                      <FontAwesomeIcon icon={faTrash} size="sm" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Image Info */}
              <div className="mt-2">
                <p className="text-slate-300 text-xs truncate" title={image.filename}>
                  {image.filename}
                </p>
                {image.description && (
                  <p className="text-slate-400 text-xs italic truncate" title={image.description}>
                    {image.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>{formatFileSize(image.file_size)}</span>
                  <span>{new Date(image.upload_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <FontAwesomeIcon icon={faImage} className="text-4xl mb-3 opacity-50" />
          <p>No images for this verse yet</p>
          <p className="text-sm">Click "Add Images" to upload</p>
        </div>
      )}

      {/* Full Size Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.description || selectedImage.filename}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {selectedImage.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 rounded-b-lg">
                <p className="text-center">{selectedImage.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerseImageManager; 