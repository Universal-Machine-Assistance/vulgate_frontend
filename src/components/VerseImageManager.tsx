import React, { useState, useEffect, useRef } from 'react';
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
  faPhotoVideo,
  faChevronLeft,
  faChevronRight,
  faSearchPlus,
  faSearchMinus,
  faUndo,
  faHand,
  faInfoCircle,
  faEyeSlash
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [autoOpenedUpload, setAutoOpenedUpload] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Pan and zoom state for full-size image modal
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVerseImages();
  }, [bookAbbr, chapter, verse]);

  // Auto-open upload area ONLY if no images exist when component first loads
  useEffect(() => {
    if (!isLoading && isInitialMount) {
      // Only auto-open file picker when there are NO images
      if (images.length === 0 && !showUploadArea) {
        setShowUploadArea(true);
        setAutoOpenedUpload(true);
        // Automatically trigger file picker when auto-opened
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 100);
      }
      // Reset initial mount flag after first load completes
      setIsInitialMount(false);
    }
  }, [isLoading, images.length, showUploadArea, isInitialMount]);

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
    if (!files.length) {
      // If no files selected and was auto-opened, close the upload area
      if (autoOpenedUpload) {
        setShowUploadArea(false);
        setAutoOpenedUpload(false);
      }
      return;
    }
    
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
        setAutoOpenedUpload(false);
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

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
    console.log('Drag entered target area');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragOver to false if we're leaving the upload area entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      console.log('Drag left target area');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Set the correct drop effect
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    console.log('Drop handled in target area');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      console.log(`Uploading ${files.length} files`);
      handleImageUpload(files);
    }
    
    return false; // Ensure no further propagation
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

  // Generate a nice display name for images
  const getImageDisplayName = (image: VerseImage): string => {
    if (image.description && image.description.trim()) {
      return image.description.length > 40 
        ? `${image.description.substring(0, 37)}...`
        : image.description;
    }
    
    // Extract base filename without UUID prefix and extension
    const filename = image.filename;
    const parts = filename.split('_');
    if (parts.length > 1) {
      // Remove UUID (first part) and reconstruct name
      const nameWithExt = parts.slice(1).join('_');
      const nameWithoutExt = nameWithExt.replace(/\.[^/.]+$/, '');
      return nameWithoutExt.length > 30 
        ? `${nameWithoutExt.substring(0, 27)}...`
        : nameWithoutExt;
    }
    
    // Fallback to original filename without extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt.length > 30 
      ? `${nameWithoutExt.substring(0, 27)}...`
      : nameWithoutExt;
  };

  // Navigation functions
  const goToPreviousImage = () => {
    if (images.length === 0) return;
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(newIndex);
    resetImageView();
  };

  const goToNextImage = () => {
    if (images.length === 0) return;
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    resetImageView();
  };

  // Pan and zoom functions
  const resetImageView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setLastPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setPan(newPan);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setLastPan(pan);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && zoom > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const newPan = {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      };
      setPan(newPan);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setLastPan(pan);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Reset pan and zoom when image changes
  useEffect(() => {
    resetImageView();
  }, [currentImageIndex]);

  // Prevent default drag behaviors globally to stop Chrome from opening images
  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Set dropEffect to copy to show the correct cursor
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Prevent browser from opening the file
      console.log('Global drop prevented');
    };

    // Add event listeners to prevent default drag/drop behavior
    document.addEventListener('dragenter', preventDefaults, false);
    document.addEventListener('dragover', handleGlobalDragOver, false);
    document.addEventListener('drop', handleGlobalDrop, false);
    document.addEventListener('dragleave', preventDefaults, false);

    return () => {
      document.removeEventListener('dragenter', preventDefaults, false);
      document.removeEventListener('dragover', handleGlobalDragOver, false);
      document.removeEventListener('drop', handleGlobalDrop, false);
      document.removeEventListener('dragleave', preventDefaults, false);
    };
  }, []);

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
    <div 
      className="verse-image-manager bg-slate-800/50 rounded-lg p-3 border border-slate-700"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Only show add images button when no images exist */}
      {images.length === 0 && !showUploadArea && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowUploadArea(!showUploadArea)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add Images
          </button>
        </div>
      )}

      {/* Upload Area */}
      {showUploadArea && (
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 group ${
              isDragOver 
                ? 'border-purple-400 bg-purple-500/10 scale-[1.02]' 
                : 'border-purple-500/50 hover:border-purple-400/70'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FontAwesomeIcon 
              icon={faUpload} 
              className={`text-3xl mb-3 transition-all duration-200 ${
                isDragOver 
                  ? 'text-purple-300 scale-110' 
                  : 'text-purple-400 group-hover:text-purple-300'
              }`} 
            />
            <div className={`transition-opacity duration-200 ${
              isDragOver ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
            }`}>
              <p className={`text-sm mb-3 transition-colors duration-200 ${
                isDragOver 
                  ? 'text-slate-200 font-medium' 
                  : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                {isDragOver ? 'Drop images here!' : 'Drag & drop images here or click below'}
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            {!isDragOver && (
              <label
                htmlFor="image-upload"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block"
              >
                Choose Images
              </label>
            )}
            {isUploading && (
              <div className="mt-3 flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-400 mr-2" />
                <span className="text-purple-300">Uploading images...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Image Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-400 mr-2" />
          <span className="text-purple-300">Loading images...</span>
        </div>
      ) : images.length > 0 ? (
        <div className="space-y-4">
          {/* Main Image Container */}
          <div 
            className={`relative bg-slate-900 rounded-lg overflow-hidden border transition-all duration-200 ${
              isDragOver 
                ? 'border-purple-400 ring-2 ring-purple-300/50 bg-purple-500/5' 
                : 'border-slate-600'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Main Image - Full Width */}
            <div className="relative aspect-[16/10] max-h-96">
              <img
                src={images[currentImageIndex]?.url}
                alt={images[currentImageIndex]?.description || images[currentImageIndex]?.filename}
                className="w-full h-full object-contain bg-slate-800"
              />
              
              {/* Drag Overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <FontAwesomeIcon icon={faUpload} className="text-purple-300 text-4xl mb-2" />
                    <p className="text-purple-200 font-medium">Drop images here!</p>
                  </div>
                </div>
              )}
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                    title="Previous image"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                    title="Next image"
                  >
                    <FontAwesomeIcon icon={faChevronRight} size="lg" />
                  </button>
                </>
              )}

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => setSelectedImage(images[currentImageIndex])}
                  className="bg-black/50 hover:bg-purple-600 text-white p-2 rounded-full transition-colors"
                  title="Full screen with zoom"
                >
                  <FontAwesomeIcon icon={faExpand} size="sm" />
                </button>
                <button
                  onClick={() => {
                    const image = images[currentImageIndex];
                    const newDesc = prompt('Edit description:', image.description || '');
                    if (newDesc !== null) {
                      handleImageEdit(image.id, newDesc);
                    }
                  }}
                  className="bg-black/50 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                  title="Edit description"
                >
                  <FontAwesomeIcon icon={faEdit} size="sm" />
                </button>
                <button
                  onClick={() => handleImageDelete(images[currentImageIndex].id)}
                  className="bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  title="Delete image"
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </button>
              </div>

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Image Info */}
            <div className="p-3 bg-slate-800/50">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm font-medium truncate flex-1" title={images[currentImageIndex]?.filename}>
                  {getImageDisplayName(images[currentImageIndex])}
                </p>
                <button
                  onClick={() => setShowMetadata(!showMetadata)}
                  className="ml-2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title={showMetadata ? "Hide details" : "Show details"}
                >
                  <FontAwesomeIcon icon={showMetadata ? faEyeSlash : faInfoCircle} size="sm" />
                </button>
              </div>
              
              {showMetadata && (
                <div className="mt-2 space-y-1">
                  <p className="text-slate-400 text-xs" title={images[currentImageIndex]?.filename}>
                    File: {images[currentImageIndex]?.filename}
                  </p>
                  {images[currentImageIndex]?.description && (
                    <p className="text-slate-400 text-xs" title={images[currentImageIndex]?.description}>
                      Description: {images[currentImageIndex]?.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatFileSize(images[currentImageIndex]?.file_size)}</span>
                    <span>{new Date(images[currentImageIndex]?.upload_date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'border-purple-500 ring-2 ring-purple-300'
                      : 'border-slate-600 hover:border-purple-400'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.description || image.filename}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Add Images Button - Below main display */}
          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload-main"
            />
            <label
              htmlFor="image-upload-main"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors inline-flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} size="sm" />
              <span>Add More Images</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <FontAwesomeIcon icon={faImage} className="text-4xl mb-3 opacity-50" />
          <p>No images for this verse yet</p>
          <p className="text-sm">Click "Add Images" to upload</p>
        </div>
      )}

      {/* Enhanced Full Size Image Modal with Pan & Zoom */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-60 flex items-center justify-center">
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center space-x-2">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                {bookAbbr} {chapter}:{verse}
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs">
                {Math.round(zoom * 100)}%
              </div>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="bg-black/50 backdrop-blur-sm text-white hover:text-gray-300 p-3 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 space-y-2">
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 5}
                className="block w-10 h-10 text-white hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Zoom In"
              >
                <FontAwesomeIcon icon={faSearchPlus} />
              </button>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="block w-10 h-10 text-white hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Zoom Out"
              >
                <FontAwesomeIcon icon={faSearchMinus} />
              </button>
              <button
                onClick={resetImageView}
                className="block w-10 h-10 text-white hover:text-purple-300 transition-colors"
                title="Reset View"
              >
                <FontAwesomeIcon icon={faUndo} />
              </button>
            </div>
          </div>

          {/* Pan Hint */}
          {zoom > 1 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs max-w-32">
                <FontAwesomeIcon icon={faHand} className="mr-2" />
                <span className="hidden sm:inline">Drag to pan</span>
                <span className="sm:hidden">Drag</span>
              </div>
            </div>
          )}

          {/* Navigation Arrows for Multiple Images */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => {
                  goToPreviousImage();
                  setSelectedImage(images[currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1]);
                }}
                className="absolute left-4 bottom-1/2 transform translate-y-1/2 bg-black/50 backdrop-blur-sm text-white hover:text-purple-300 p-3 rounded-lg transition-colors z-20"
                title="Previous image"
              >
                <FontAwesomeIcon icon={faChevronLeft} size="lg" />
              </button>
              <button
                onClick={() => {
                  goToNextImage();
                  setSelectedImage(images[currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0]);
                }}
                className="absolute right-4 bottom-1/2 transform translate-y-1/2 bg-black/50 backdrop-blur-sm text-white hover:text-purple-300 p-3 rounded-lg transition-colors z-20"
                title="Next image"
              >
                <FontAwesomeIcon icon={faChevronRight} size="lg" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <img
              ref={imageRef}
              src={selectedImage.url}
              alt={selectedImage.description || selectedImage.filename}
              className="max-w-none h-auto select-none transition-transform duration-100"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                maxHeight: zoom === 1 ? '90vh' : 'none',
                maxWidth: zoom === 1 ? '90vw' : 'none',
              }}
              draggable={false}
            />
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {getImageDisplayName(selectedImage)}
                  </p>
                  {selectedImage.description && (
                    <p className="text-gray-300 text-xs sm:text-sm mt-1 truncate">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="ml-4 flex-shrink-0 bg-black/50 px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Instructions */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none sm:hidden">
            {zoom === 1 && (
              <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg opacity-75">
                Pinch to zoom • Swipe to navigate
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerseImageManager; 