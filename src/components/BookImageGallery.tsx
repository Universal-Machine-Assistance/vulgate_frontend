import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImages, 
  faFilter, 
  faTimes, 
  faSpinner,
  faExpand,
  faDownload,
  faMapMarkerAlt,
  faCalendarAlt,
  faSearch,
  faTh,
  faList,
  faSortAmountDown,
  faSearchPlus,
  faSearchMinus,
  faUndo,
  faHand
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

interface BookImage {
  id: string;
  url: string;
  filename: string;
  description?: string;
  upload_date: string;
  file_size?: number;
  mime_type?: string;
  verse_reference: {
    chapter: number;
    verse: number;
    full_reference: string; // e.g., "Gn 1:3"
  };
}

interface BookImageGalleryProps {
  bookAbbr: string;
  bookName: string;
  chapter?: number; // Optional: filter to specific chapter
  API_BASE_URL: string;
  onClose?: () => void;
}

const BookImageGallery: React.FC<BookImageGalleryProps> = ({ 
  bookAbbr, 
  bookName,
  chapter,
  API_BASE_URL,
  onClose 
}) => {
  const [images, setImages] = useState<BookImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<BookImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<BookImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'chapter' | 'date' | 'filename'>('chapter');
  const [filterChapter, setFilterChapter] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableChapters, setAvailableChapters] = useState<number[]>([]);
  
  // Pan and zoom state for full-size image modal
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookImages();
  }, [bookAbbr, chapter]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [images, filterChapter, searchTerm, sortBy]);

  const fetchBookImages = async () => {
    setIsLoading(true);
    try {
      const endpoint = chapter 
        ? `${API_BASE_URL}/books/${bookAbbr}/chapters/${chapter}/images`
        : `${API_BASE_URL}/books/${bookAbbr}/images`;
      
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        const imagesList = data.images || [];
        setImages(imagesList);
        
        // Extract available chapters
        const chapterSet = new Set<number>(imagesList.map((img: BookImage) => img.verse_reference.chapter));
        const chapters = Array.from(chapterSet).sort((a: number, b: number) => a - b);
        setAvailableChapters(chapters);
        
        console.log(`Loaded ${imagesList.length} images for ${bookAbbr}${chapter ? ` chapter ${chapter}` : ''}`);
      } else if (response.status === 404) {
        setImages([]);
        setAvailableChapters([]);
      } else {
        console.warn('Failed to fetch book images:', response.status);
        setImages([]);
        if (response.status === 404) {
          console.info('Book images API not implemented yet. This is normal during development.');
        }
      }
    } catch (error) {
      console.error('Error fetching book images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...images];

    // Apply chapter filter
    if (filterChapter !== '') {
      filtered = filtered.filter(img => img.verse_reference.chapter === filterChapter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(img => 
        img.filename.toLowerCase().includes(term) ||
        img.description?.toLowerCase().includes(term) ||
        img.verse_reference.full_reference.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'chapter':
          if (a.verse_reference.chapter !== b.verse_reference.chapter) {
            return a.verse_reference.chapter - b.verse_reference.chapter;
          }
          return a.verse_reference.verse - b.verse_reference.verse;
        case 'date':
          return new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime();
        case 'filename':
          return a.filename.localeCompare(b.filename);
        default:
          return 0;
      }
    });

    setFilteredImages(filtered);
  };

  const handleVerseNavigation = (image: BookImage) => {
    const { chapter, verse } = image.verse_reference;
    navigate(`/bible/${bookAbbr}/${chapter}/${verse}`);
    if (onClose) onClose();
  };

  const downloadImage = async (image: BookImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb > 1) return `${mb.toFixed(1)}MB`;
    return `${kb.toFixed(1)}KB`;
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
  }, [selectedImage]);

  const ImageGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredImages.map((image) => (
        <div key={image.id} className="relative group">
          <div className="aspect-square bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
            <img
              src={image.url}
              alt={image.description || image.filename}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute top-2 left-2">
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                  {image.verse_reference.full_reference}
                </span>
              </div>
              
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full flex-1"
                    title="View full size"
                  >
                    <FontAwesomeIcon icon={faExpand} size="sm" />
                  </button>
                  <button
                    onClick={() => handleVerseNavigation(image)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex-1"
                    title="Go to verse"
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" />
                  </button>
                  <button
                    onClick={() => downloadImage(image)}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full flex-1"
                    title="Download"
                  >
                    <FontAwesomeIcon icon={faDownload} size="sm" />
                  </button>
                </div>
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
          </div>
        </div>
      ))}
    </div>
  );

  const ImageList = () => (
    <div className="space-y-3">
      {filteredImages.map((image) => (
        <div key={image.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center space-x-4">
            {/* Thumbnail */}
            <div className="w-16 h-16 bg-slate-700 rounded-lg overflow-hidden border border-slate-600 flex-shrink-0">
              <img
                src={image.url}
                alt={image.description || image.filename}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-slate-300 truncate">{image.filename}</h4>
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded flex-shrink-0">
                  {image.verse_reference.full_reference}
                </span>
              </div>
              {image.description && (
                <p className="text-slate-400 text-sm truncate">{image.description}</p>
              )}
              <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                <span>{formatFileSize(image.file_size)}</span>
                <span>{new Date(image.upload_date).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex space-x-2 flex-shrink-0">
              <button
                onClick={() => setSelectedImage(image)}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded"
                title="View full size"
              >
                <FontAwesomeIcon icon={faExpand} size="sm" />
              </button>
              <button
                onClick={() => handleVerseNavigation(image)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                title="Go to verse"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" />
              </button>
              <button
                onClick={() => downloadImage(image)}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                title="Download"
              >
                <FontAwesomeIcon icon={faDownload} size="sm" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faImages} className="text-purple-400 text-2xl" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  Imagines - {bookName}
                  {chapter && <span className="text-purple-300"> Capitulum {chapter}</span>}
                </h2>
                <p className="text-slate-400 text-sm">
                  {filteredImages.length} {filteredImages.length === 1 ? 'imago' : 'imagines'}
                  {images.length !== filteredImages.length && ` (of ${images.length} total)`}
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-2xl"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Chapter Filter */}
            {!chapter && availableChapters.length > 1 && (
              <select
                value={filterChapter}
                onChange={(e) => setFilterChapter(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="bg-slate-700 border border-slate-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Chapters</option>
                {availableChapters.map(ch => (
                  <option key={ch} value={ch}>Capitulum {ch}</option>
                ))}
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-700 border border-slate-600 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="chapter">Sort by Chapter</option>
              <option value="date">Sort by Date</option>
              <option value="filename">Sort by Name</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-slate-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                <FontAwesomeIcon icon={faTh} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-400 mr-3 text-2xl" />
              <span className="text-purple-300 text-lg">Loading images...</span>
            </div>
          ) : filteredImages.length > 0 ? (
            viewMode === 'grid' ? <ImageGrid /> : <ImageList />
          ) : images.length > 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FontAwesomeIcon icon={faSearch} className="text-4xl mb-3 opacity-50" />
              <p>No images match your search criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterChapter('');
                }}
                className="text-purple-400 hover:text-purple-300 mt-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <FontAwesomeIcon icon={faImages} className="text-4xl mb-3 opacity-50" />
              <p>No images found for this {chapter ? 'chapter' : 'book'}</p>
            </div>
          )}
        </div>

        {/* Enhanced Full Size Image Modal with Pan & Zoom */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 z-60 flex items-center justify-center">
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center space-x-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                  {selectedImage.verse_reference.full_reference}
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
                      {selectedImage.verse_reference.full_reference}
                    </p>
                    {selectedImage.description && (
                      <p className="text-gray-300 text-xs sm:text-sm mt-1 truncate">
                        {selectedImage.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleVerseNavigation(selectedImage)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm transition-colors"
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="sm:mr-2" />
                      <span className="hidden sm:inline">Go to Verse</span>
                    </button>
                    <button
                      onClick={() => downloadImage(selectedImage)}
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm transition-colors"
                    >
                      <FontAwesomeIcon icon={faDownload} className="sm:mr-2" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Instructions */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none sm:hidden">
              {zoom === 1 && (
                <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg opacity-75">
                  Pinch to zoom • Tap controls to navigate
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookImageGallery; 