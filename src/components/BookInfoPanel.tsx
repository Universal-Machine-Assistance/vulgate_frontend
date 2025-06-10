import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faScroll, 
  faQuoteLeft, 
  faStar, 
  faHeart, 
  faGem, 
  faTimes, 
  faSpinner,
  faBookOpen,
  faChevronDown,
  faChevronUp,
  faUpload
} from '@fortawesome/free-solid-svg-icons';

interface BookInfo {
  book_name: string;
  latin_name: string;
  full_name: string;
  summary: string;
  key_themes: string[];
  important_sections: Array<{
    reference: string;
    title: string;
    description: string;
  }>;
  historical_context: string;
  literary_genre: string;
  authorship: string;
  date_composed: string;
  theological_significance: string;
  notable_figures: string[];
  cover_image_url?: string;
}

interface BookInfoPanelProps {
  bookAbbr: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToVerse?: (reference: string) => void;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const BookInfoPanel: React.FC<BookInfoPanelProps> = ({ 
  bookAbbr, 
  isOpen, 
  onClose, 
  onNavigateToVerse 
}) => {
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary', 'history']));
  const [imageUploadMode, setImageUploadMode] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (isOpen && bookAbbr) {
      fetchBookInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bookAbbr]);

  const fetchBookInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the enhanced_dictionary.py endpoint
      const response = await fetch(`${API_BASE_URL}/dictionary/books/${bookAbbr}`);
      if (!response.ok) {
        throw new Error('Informatio libri inveniri non potest'); // "Book information could not be found"
      }
      const data = await response.json();
      
      // Parse historical_context if it's a JSON string
      if (typeof data.historical_context === 'string') {
        try {
          const parsedContext = JSON.parse(data.historical_context);
          console.log('Parsed historical context:', parsedContext);
          
          // If it's an object with historical_context property, use that
          if (parsedContext && typeof parsedContext === 'object' && parsedContext.historical_context) {
            data.historical_context = parsedContext.historical_context;
          } 
          // If it's just a string, use it directly
          else if (typeof parsedContext === 'string') {
            data.historical_context = parsedContext;
          }
          // If it's an object but no historical_context property, stringify it nicely
          else if (parsedContext && typeof parsedContext === 'object') {
            data.historical_context = JSON.stringify(parsedContext, null, 2);
          }
        } catch (parseError) {
          console.warn('Could not parse historical_context JSON:', parseError);
          console.log('Raw historical_context data:', data.historical_context);
          // Keep original string if parsing fails
        }
      }
      
      setBookInfo(data);
    } catch (err) {
      console.error('Error fetching book info:', err);
      setError(err instanceof Error ? err.message : 'Error ignotus'); // "Unknown error"
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const handleVerseNavigation = (reference: string) => {
    if (onNavigateToVerse) {
      onNavigateToVerse(reference);
      onClose(); // Close panel after navigation
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Here you would typically upload the image to your backend
    // For now, we'll just create a preview
    const imageUrl = URL.createObjectURL(file);
    if (bookInfo) {
      setBookInfo({
        ...bookInfo,
        cover_image_url: imageUrl
      });
    }
    setImageUploadMode(false);
  };

  const handleRegenerateWithAI = async () => {
    setIsRegenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dictionary/books/${bookAbbr}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Regeneratio informationis defecit'); // "Information regeneration failed"
      }
      
      // Refetch the updated book info
      await fetchBookInfo();
    } catch (err) {
      console.error('Error regenerating book info:', err);
      setError(err instanceof Error ? err.message : 'Error regenerationis'); // "Regeneration error"
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 book-panel-entrance">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30 animated-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 relative">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleRegenerateWithAI}
              disabled={isRegenerating}
              className="text-white hover:text-purple-200 transition-colors p-2 bg-white/20 rounded-full disabled:opacity-50"
              title="Regenerare cum AI"
            >
              <FontAwesomeIcon 
                icon={faSpinner} 
                className={isRegenerating ? 'animate-spin' : ''} 
                size="sm" 
              />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors p-2"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <FontAwesomeIcon icon={faBookOpen} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white glow-text">
                {bookInfo?.book_name || bookAbbr}
              </h1>
              <p className="text-purple-200 italic">
                {bookInfo?.latin_name || 'Liber Sacer'}
              </p>
              {isRegenerating && (
                <p className="text-purple-300 text-sm mt-1">
                  AI regenerans informationes...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-purple-400 text-3xl animate-spin" />
              <span className="ml-4 text-purple-300">Informatio colligitur...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faBook} className="text-red-400 text-4xl mb-4" />
              <p className="text-red-300">{error}</p>
              <button
                onClick={fetchBookInfo}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Iterum conare
              </button>
            </div>
          ) : bookInfo ? (
            <div className="space-y-6">
              {/* Book Cover and Basic Info */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="relative bg-gradient-to-br from-amber-900 to-amber-700 rounded-xl p-6 text-center shadow-lg">
                    {bookInfo.cover_image_url ? (
                      <img
                        src={bookInfo.cover_image_url}
                        alt={`${bookInfo.book_name} cover`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg mb-4 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBook} className="text-amber-200 text-6xl" />
                      </div>
                    )}
                    
                    <button
                      onClick={() => setImageUploadMode(!imageUploadMode)}
                      className="absolute top-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUpload} />
                    </button>

                    {imageUploadMode && (
                      <div className="mt-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="text-sm text-amber-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        />
                      </div>
                    )}

                    <h3 className="text-amber-100 font-bold text-lg">{bookInfo.full_name}</h3>
                    <p className="text-amber-200 text-sm mt-2">{bookInfo.literary_genre}</p>
                  </div>
                </div>

                <div className="lg:w-2/3 space-y-4">
                  {/* Summary */}
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <button
                      onClick={() => toggleSection('summary')}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h3 className="text-xl font-bold text-purple-300 flex items-center">
                        <FontAwesomeIcon icon={faQuoteLeft} className="mr-3" />
                        Summarium
                      </h3>
                      <FontAwesomeIcon 
                        icon={expandedSections.has('summary') ? faChevronUp : faChevronDown} 
                        className="text-purple-400"
                      />
                    </button>
                    {expandedSections.has('summary') && (
                      <div className="mt-4 text-slate-300 leading-relaxed">
                        {bookInfo.summary || 'Summarium non definitum.'}
                      </div>
                    )}
                  </div>

                  {/* Key Themes */}
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <button
                      onClick={() => toggleSection('themes')}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h3 className="text-xl font-bold text-purple-300 flex items-center">
                        <FontAwesomeIcon icon={faGem} className="mr-3" />
                        Themata Principalia
                      </h3>
                      <FontAwesomeIcon 
                        icon={expandedSections.has('themes') ? faChevronUp : faChevronDown} 
                        className="text-purple-400"
                      />
                    </button>
                    {expandedSections.has('themes') && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {bookInfo.key_themes && bookInfo.key_themes.length > 0 ? (
                          bookInfo.key_themes.map((theme, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                            >
                              {theme}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">Nulla themata principalia definita sunt.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Important Sections */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <button
                  onClick={() => toggleSection('sections')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-xl font-bold text-purple-300 flex items-center">
                    <FontAwesomeIcon icon={faStar} className="mr-3" />
                    Sectiones Importantes
                  </h3>
                  <FontAwesomeIcon 
                    icon={expandedSections.has('sections') ? faChevronUp : faChevronDown} 
                    className="text-purple-400"
                  />
                </button>
                {expandedSections.has('sections') && (
                  <div className="mt-4 space-y-3">
                    {bookInfo.important_sections && bookInfo.important_sections.length > 0 ? (
                      bookInfo.important_sections.map((section, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => handleVerseNavigation(section.reference)}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-purple-200">{section.title}</h4>
                            <span className="text-purple-400 text-sm font-mono">{section.reference}</span>
                          </div>
                          <p className="text-slate-300 text-sm mt-2">{section.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">Nullae sectiones importantes definitae sunt.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Historical Context */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <button
                  onClick={() => toggleSection('history')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-xl font-bold text-purple-300 flex items-center">
                    <FontAwesomeIcon icon={faScroll} className="mr-3" />
                    Contextus Historicus
                  </h3>
                  <FontAwesomeIcon 
                    icon={expandedSections.has('history') ? faChevronUp : faChevronDown} 
                    className="text-purple-400"
                  />
                </button>
                {expandedSections.has('history') && (
                  <div className="mt-4 text-slate-300 leading-relaxed">
                    {bookInfo.historical_context || 'Contextus historicus non definitum.'}
                  </div>
                )}
              </div>

              {/* Theological Significance */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <button
                  onClick={() => toggleSection('theology')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-xl font-bold text-purple-300 flex items-center">
                    <FontAwesomeIcon icon={faHeart} className="mr-3" />
                    Significatio Theologica
                  </h3>
                  <FontAwesomeIcon 
                    icon={expandedSections.has('theology') ? faChevronUp : faChevronDown} 
                    className="text-purple-400"
                  />
                </button>
                {expandedSections.has('theology') && (
                  <div className="mt-4 text-slate-300 leading-relaxed">
                    {bookInfo.theological_significance || 'Significatio theologica non definitum.'}
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-purple-300 mb-4">Detalia Libri</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-purple-400">Auctor:</span> <span className="text-slate-300">{bookInfo.authorship || 'Non definitum'}</span></div>
                    <div><span className="text-purple-400">Data Compositionis:</span> <span className="text-slate-300">{bookInfo.date_composed || 'Non definitum'}</span></div>
                    <div><span className="text-purple-400">Genus Literarium:</span> <span className="text-slate-300">{bookInfo.literary_genre || 'Non definitum'}</span></div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold text-purple-300 mb-4">Figurae Notabiles</h3>
                  <div className="flex flex-wrap gap-2">
                    {bookInfo.notable_figures && bookInfo.notable_figures.length > 0 ? (
                      bookInfo.notable_figures.map((figure, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm shadow-lg"
                        >
                          {figure}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">Nullae figurae notabiles definitae sunt.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BookInfoPanel; 