import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  faBrain,
  faBookOpen,
  faChevronDown,
  faChevronUp,
  faUpload,
  faArrowRight,
  faImages
} from '@fortawesome/free-solid-svg-icons';
import { BOOK_NAMES } from '../constants/index';
import ThemeExplorer from './ThemeExplorer';
import BookImageGallery from './BookImageGallery';

// TypeScript interfaces for enhanced API structure
interface KeyVerse {
  reference: string;
  text: string;
  navigation_url: string;
}

interface ImportantSection {
  title: string;
  description: string;
  key_verses?: KeyVerse[]; // Optional for backward compatibility
  // Backward compatibility - old format
  reference?: string;
}

interface BookInfo {
  book_name: string;
  latin_name: string;
  full_name: string;
  summary: string;
  key_themes: string[];
  important_sections: ImportantSection[];
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

// Helper functions to generate book information
const generateBookSummary = (bookAbbr: string): string => {
  const summaries: { [key: string]: string } = {
    'Gn': 'Liber Genesis narrat creationem mundi, hominum primorum historiam, et patriarcharum vitam. Continet fundamenta fidei de Deo creatore et foedere cum Abraham.',
    'Ex': 'Liber Exodus describit liberationem populi Israelitici ex Aegypto, decem plagis, transitu Maris Rubri, et traditione Legis in Monte Sinai.',
    'Lev': 'Liber Leviticus exponit leges ceremoniales, sacrificia, et regulas puritatis pro sacerdotibus et populo Israelitico.',
    'Num': 'Liber Numerorum narrat iter populi per desertum quadraginta annis, cum censibus et eventibus variis.',
    'Dt': 'Deuteronomium continet ultima verba Moysi ad populum Israel antequam Terram Promissam intrarent.'
  };
  return summaries[bookAbbr] || `Liber ${BOOK_NAMES[bookAbbr] || bookAbbr} est pars importans Sacrae Scripturae cum doctrina theologica profunda.`;
};

const generateKeyThemes = (bookAbbr: string): string[] => {
  const themes: { [key: string]: string[] } = {
    'Gn': ['Creatio', 'Peccatum originale', 'Foedus', 'Providentia divina'],
    'Ex': ['Liberatio', 'Lex Dei', 'Foedus Sinaiticum', 'Theophania'],
    'Lev': ['Sanctitas', 'Sacrificium', 'Puritas ritualis', 'Sacerdotium'],
    'Num': ['Peregrinatio', 'Fidelitas Dei', 'Murmuratio populi', 'Terra Promissa'],
    'Dt': ['Lex', 'Amor Dei', 'Electio', 'Benedictio et maledictio']
  };
  return themes[bookAbbr] || ['Fides', 'Spes', 'Caritas', 'Obedientia'];
};

const generateImportantSections = (bookAbbr: string): Array<{ reference: string; title: string; description: string; }> => {
  const sections: { [key: string]: Array<{ reference: string; title: string; description: string; }> } = {
    'Gn': [
      { reference: 'Gn 1:1-31', title: 'Creatio Mundi', description: 'Narratio sex dierum creationis' },
      { reference: 'Gn 3:1-24', title: 'Lapsus', description: 'Peccatum originale et expulsio e Paradiso' },
      { reference: 'Gn 12:1-9', title: 'Vocatio Abrahae', description: 'Foedus Dei cum Abraham' }
    ],
    'Ex': [
      { reference: 'Ex 3:1-15', title: 'Rubus Ardens', description: 'Vocatio Moysi ad montem Horeb' },
      { reference: 'Ex 14:1-31', title: 'Transitus Maris Rubri', description: 'Liberatio ex Aegypto' },
      { reference: 'Ex 20:1-17', title: 'Decem Praecepta', description: 'Lex data in Monte Sinai' }
    ]
  };
  return sections[bookAbbr] || [
    { reference: `${bookAbbr} 1:1`, title: 'Initium', description: 'Principium libri' }
  ];
};

const generateHistoricalContext = (bookAbbr: string): string => {
  const contexts: { [key: string]: string } = {
    'Gn': 'Scriptus est in tempore exilii Babylonici (saec. VI a.C.) ad explicandam originem mundi et populi Israel.',
    'Ex': 'Compositio finalis ex saec. VI-V a.C., sed traditiones antiquissimae ad tempus Moysi (saec. XIII a.C.) referuntur.',
    'Lev': 'Codex sacerdotalis ex periodo post-exilica (saec. V-IV a.C.) ad ordinandum cultum templi.',
    'Num': 'Redactio finalis ex tempore post-exilico, sed memorias peregrinationis in deserto servat.',
    'Dt': 'Forma finalis ex tempore Iosiae regis (621 a.C.) et post exilium Babylonicum.'
  };
  return contexts[bookAbbr] || `Contextus historicus libri ${BOOK_NAMES[bookAbbr] || bookAbbr} adhuc investigatur a scholaribus.`;
};

const generateLiteraryGenre = (bookAbbr: string): string => {
  const genres: { [key: string]: string } = {
    'Gn': 'Narratio historico-theologica, genealogiae, etiologia',
    'Ex': 'Narratio historica, legislatio, theophania',
    'Lev': 'Codex legalis, instructiones rituales',
    'Num': 'Narratio historica, legislatio, census',
    'Dt': 'Discursus hortatorius, legislatio deuteronomica'
  };
  return genres[bookAbbr] || 'Genus litterarium varium';
};

const generateAuthorship = (bookAbbr: string): string => {
  const pentateuch = ['Gn', 'Ex', 'Lev', 'Num', 'Dt'];
  if (pentateuch.includes(bookAbbr)) {
    return 'Traditio Moysi attributa, sed compositio complexa cum fontibus variis (J, E, D, P)';
  }
  return 'Auctor incertus, secundum traditionem veterem';
};

const generateDateComposed = (bookAbbr: string): string => {
  const dates: { [key: string]: string } = {
    'Gn': 'Saec. X-VI a.C. (compositio gradatim)',
    'Ex': 'Saec. X-V a.C. (redactio finalis post-exilica)',
    'Lev': 'Saec. VI-IV a.C. (codex sacerdotalis)',
    'Num': 'Saec. VII-V a.C.',
    'Dt': 'Saec. VII-V a.C. (nucleus ex tempore Iosiae)'
  };
  return dates[bookAbbr] || 'Tempus compositionis incertum';
};

const generateTheologicalSignificance = (bookAbbr: string): string => {
  const significance: { [key: string]: string } = {
    'Gn': 'Fundamentum antropologiae christianae, doctrina de creatione, peccato originali, et promissionibus divinis.',
    'Ex': 'Paradigma liberationis divinae, basis foederis, et revelatione nominis divini.',
    'Lev': 'Doctrina de sanctitate Dei et populi, sacrificiis, et mediatione sacerdotali.',
    'Num': 'Fidelitas Dei in adversitatibus, necessitas oboedientiae, et spes Terrae Promissae.',
    'Dt': 'Centralisatio cultus, amor Dei totus, et consequentiae morales foederis.'
  };
  return significance[bookAbbr] || `Significatio theologica libri ${BOOK_NAMES[bookAbbr] || bookAbbr} est magna in traditione judaico-christiana.`;
};

const generateNotableFigures = (bookAbbr: string): string[] => {
  const figures: { [key: string]: string[] } = {
    'Gn': ['Adam', 'Eva', 'Noe', 'Abraham', 'Isaac', 'Iacob', 'Ioseph'],
    'Ex': ['Moyses', 'Aaron', 'Pharao', 'Miriam'],
    'Lev': ['Moyses', 'Aaron', 'Nadab', 'Abihu'],
    'Num': ['Moyses', 'Aaron', 'Iosue', 'Caleb', 'Core'],
    'Dt': ['Moyses', 'Iosue']
  };
  return figures[bookAbbr] || ['Figurae principales incertae'];
};

const BookInfoPanel: React.FC<BookInfoPanelProps> = ({ 
  bookAbbr, 
  isOpen, 
  onClose, 
  onNavigateToVerse 
}) => {
  const navigate = useNavigate();
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary', 'history']));
  const [imageUploadMode, setImageUploadMode] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [lastFetchedBook, setLastFetchedBook] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isThemeExplorerOpen, setIsThemeExplorerOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);

  useEffect(() => {
    if (isOpen && bookAbbr && bookAbbr !== lastFetchedBook) {
      fetchBookInfo();
      setLastFetchedBook(bookAbbr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bookAbbr]);

  const fetchBookInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Check for stored book cover image
      const storageKey = `book_cover_${bookAbbr}`;
      const storedImage = localStorage.getItem(storageKey);

      // Primary: Try enhanced book info endpoint (with 10+ important_sections from backend)
      const enhancedResponse = await fetch(`${API_BASE_URL}/books/${bookAbbr}/enhanced-info`);
      
      if (enhancedResponse.ok) {
        // Use backend enhanced data (includes important_sections from backend)
        const enhancedData = await enhancedResponse.json();
        // Add stored image if available
        if (storedImage && !enhancedData.cover_image_url) {
          enhancedData.cover_image_url = storedImage;
        }
        setBookInfo(enhancedData);
        console.log(`Enhanced book info loaded for ${bookAbbr} with ${enhancedData.important_sections?.length || 0} important sections`);
      } else {
        // Fallback: Basic book info endpoint + frontend generation
        console.warn(`Enhanced endpoint not available for ${bookAbbr}, falling back to basic info`);
        const basicResponse = await fetch(`${API_BASE_URL}/books/abbr/${bookAbbr}`);
        if (!basicResponse.ok) {
          throw new Error('Informatio libri inveniri non potest'); // "Book information could not be found"
        }
        const basicData = await basicResponse.json();
        
        // Generate frontend fallback data only when backend enhanced data is not available
        const fullBookName = BOOK_NAMES[bookAbbr] || bookAbbr;
        const fallbackBookInfo: BookInfo = {
          book_name: basicData.name || fullBookName,
          latin_name: basicData.latin_name || bookAbbr,
          full_name: fullBookName,
          summary: generateBookSummary(bookAbbr),
          key_themes: generateKeyThemes(bookAbbr),
          important_sections: generateImportantSections(bookAbbr), // Only used as fallback
          historical_context: generateHistoricalContext(bookAbbr),
          literary_genre: generateLiteraryGenre(bookAbbr),
          authorship: generateAuthorship(bookAbbr),
          date_composed: generateDateComposed(bookAbbr),
          theological_significance: generateTheologicalSignificance(bookAbbr),
          notable_figures: generateNotableFigures(bookAbbr),
          cover_image_url: storedImage || undefined // Load stored image
        };
        
        setBookInfo(fallbackBookInfo);
        console.log(`Fallback book info generated for ${bookAbbr} with ${fallbackBookInfo.important_sections.length} important sections`);
      }
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
    // Validate reference before navigation
    if (!reference || typeof reference !== 'string' || reference.trim() === '') {
      console.warn('Invalid reference in BookInfoPanel:', reference);
      return;
    }

    if (onNavigateToVerse) {
      console.log(`Navigating to reference: ${reference}`);
      onNavigateToVerse(reference);
      onClose(); // Close panel after navigation
    }
  };

  const handleThemeClick = (theme: string) => {
    console.log(`Exploring theme: ${theme}`);
    setSelectedTheme(theme);
    setIsThemeExplorerOpen(true);
  };

  const handleThemeExplorerClose = () => {
    setIsThemeExplorerOpen(false);
    setSelectedTheme(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Compress and resize image before storage
      const compressedImage = await new Promise<string>((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Calculate new dimensions (max 400x600 to reduce size)
          const maxWidth = 400;
          const maxHeight = 600;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 0.7 quality for smaller size
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        
        img.onerror = reject;
        
        // Create object URL for the uploaded file
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
      });

      // Check size before storing (should be under 1MB after compression)
      const sizeInMB = (compressedImage.length * 0.75) / (1024 * 1024); // Base64 is ~33% larger
      if (sizeInMB > 1) {
        console.warn(`Compressed image still too large: ${sizeInMB.toFixed(2)}MB`);
        alert('Image too large. Please choose a smaller image.');
        return;
      }

      // Store in localStorage for persistence
      const storageKey = `book_cover_${bookAbbr}`;
      localStorage.setItem(storageKey, compressedImage);

      // Update UI immediately
      if (bookInfo) {
        setBookInfo({
          ...bookInfo,
          cover_image_url: compressedImage
        });
      }

      console.log(`Book cover uploaded and stored for ${bookAbbr} (${sizeInMB.toFixed(2)}MB)`);
      setImageUploadMode(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please clear some data or use a smaller image.');
      } else {
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleRegenerateWithAI = async () => {
    setIsRegenerating(true);
    try {
      // Primary: Try backend AI regeneration (should return 10+ important_sections)
      const regenerateResponse = await fetch(`${API_BASE_URL}/books/${bookAbbr}/enhanced-info/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (regenerateResponse.ok) {
        // Use AI-generated backend data with enhanced important_sections
        const regeneratedData = await regenerateResponse.json();
        const newBookInfo = regeneratedData.data || regeneratedData;
        setBookInfo(newBookInfo);
        console.log(`AI regenerated book info from backend for ${bookAbbr} with ${newBookInfo.important_sections?.length || 0} important sections`);
      } else {
        // Fallback: Frontend generation only if backend AI fails
        console.warn(`Backend AI regeneration failed for ${bookAbbr}, using frontend fallback`);
        const fullBookName = BOOK_NAMES[bookAbbr] || bookAbbr;
        
        const fallbackEnhancedInfo: BookInfo = {
          book_name: fullBookName,
          latin_name: bookInfo?.latin_name || bookAbbr,
          full_name: fullBookName,
          summary: generateBookSummary(bookAbbr),
          key_themes: generateKeyThemes(bookAbbr),
          important_sections: generateImportantSections(bookAbbr), // Frontend fallback only
          historical_context: generateHistoricalContext(bookAbbr),
          literary_genre: generateLiteraryGenre(bookAbbr),
          authorship: generateAuthorship(bookAbbr),
          date_composed: generateDateComposed(bookAbbr),
          theological_significance: generateTheologicalSignificance(bookAbbr),
          notable_figures: generateNotableFigures(bookAbbr),
          cover_image_url: bookInfo?.cover_image_url
        };
        
        setBookInfo(fallbackEnhancedInfo);
        console.log(`Frontend fallback regeneration completed for ${bookAbbr} with ${fallbackEnhancedInfo.important_sections.length} important sections`);
      }
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
              onClick={() => setIsImageGalleryOpen(true)}
              className="text-white bg-white/20 hover:bg-purple-500 hover:text-white hover:shadow-lg transition-all duration-300 p-3 rounded-full"
              title="Imagines Libri - View all book images"
            >
              <FontAwesomeIcon 
                icon={faImages} 
                className="transition-transform hover:scale-110"
                size="sm" 
              />
            </button>
            <button
              onClick={handleRegenerateWithAI}
              disabled={isRegenerating}
              className={`text-white transition-all duration-300 p-3 rounded-full disabled:opacity-50 ${
                isRegenerating 
                  ? 'bg-purple-500 animate-pulse border-2 border-purple-300 shadow-lg shadow-purple-500/50' 
                  : 'bg-white/20 hover:bg-purple-500 hover:text-white hover:shadow-lg'
              }`}
              title={isRegenerating ? "AI laborat..." : "Regenerare cum AI"}
            >
              <FontAwesomeIcon 
                icon={isRegenerating ? faSpinner : faBrain} 
                className={`${isRegenerating ? 'animate-spin' : ''} transition-transform ${isRegenerating ? '' : 'hover:scale-110'}`}
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
        <div className="relative p-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
          {/* AI Regeneration Overlay */}
          {isRegenerating && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-b-2xl">
              <div className="text-center p-8">
                <div className="relative mb-6">
                  <FontAwesomeIcon 
                    icon={faBrain} 
                    className="text-purple-400 text-6xl animate-pulse" 
                  />
                  <div className="absolute -top-2 -right-2">
                    <FontAwesomeIcon 
                      icon={faSpinner} 
                      className="text-purple-300 text-2xl animate-spin" 
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">
                  AI Regenerat Informationes
                </h3>
                <p className="text-purple-400 mb-4">
                  Intellectus artificialis creat novam descriptionem libri...
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

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
            <div className={`space-y-6 transition-opacity duration-300 ${isRegenerating ? 'opacity-30' : 'opacity-100'}`}>
              {/* Book Cover and Basic Info */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="relative bg-gradient-to-br from-amber-900 to-amber-700 rounded-xl p-4 text-center shadow-lg min-h-[320px] flex flex-col">
                    {/* Image Container */}
                    <div className="relative flex-1 mb-4">
                      {bookInfo.cover_image_url ? (
                        <div className="w-full h-56 rounded-lg overflow-hidden shadow-lg">
                          <img
                            src={bookInfo.cover_image_url}
                            alt={`${bookInfo.book_name} cover`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg mb-4 flex items-center justify-center shadow-inner">
                          <div className="text-center">
                            <FontAwesomeIcon icon={faBook} className="text-amber-200 text-5xl mb-2" />
                            <p className="text-amber-300 text-xs">Click upload to add cover</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <button
                        onClick={() => setImageUploadMode(!imageUploadMode)}
                        className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-sm text-white p-2 rounded-full hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Upload book cover"
                      >
                        <FontAwesomeIcon icon={faUpload} size="sm" />
                      </button>
                    </div>

                    {/* Upload Input */}
                    {imageUploadMode && (
                      <div className="mb-4 p-3 bg-amber-800/30 rounded-lg border border-amber-600/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full text-xs text-amber-200 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer cursor-pointer"
                        />
                        <p className="text-amber-300 text-xs mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    )}

                    {/* Book Info */}
                    <div className="mt-auto">
                      <h3 className="text-amber-100 font-bold text-lg leading-tight">{bookInfo.full_name}</h3>
                      <p className="text-amber-200 text-sm mt-1">{bookInfo.literary_genre}</p>
                    </div>
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
                            <button
                              key={index}
                              onClick={() => handleThemeClick(theme)}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl cursor-pointer group"
                              title={`Explore all verses related to: ${theme}`}
                            >
                              <span className="flex items-center space-x-2">
                                <span>{theme}</span>
                                <FontAwesomeIcon 
                                  icon={faGem} 
                                  className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                                />
                              </span>
                            </button>
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
                      bookInfo.important_sections
                        .filter(section => section && (section.reference || section.key_verses) && section.title) // Filter out invalid sections
                        .map((section, index) => (
                        <div
                          key={`${section.reference || section.title}-${index}`}
                          className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => section.reference && handleVerseNavigation(section.reference)}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-purple-200">{section.title}</h4>
                            {section.reference && (
                              <span className="text-purple-400 text-sm font-mono">{section.reference}</span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mt-2">{section.description || 'Descriptio non disponibilis'}</p>
                          
                          {/* New: Key Verses Display */}
                          {section.key_verses && section.key_verses.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <h5 className="text-purple-300 text-xs font-semibold uppercase tracking-wide">Versus Principales:</h5>
                              {section.key_verses.map((verse, verseIndex) => (
                                <div
                                  key={verseIndex}
                                  className="bg-slate-600/30 rounded-lg p-3 hover:bg-slate-600/50 transition-colors cursor-pointer border-l-2 border-purple-400"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(verse.navigation_url);
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-purple-200 text-xs font-semibold">{verse.reference}</span>
                                    <FontAwesomeIcon icon={faArrowRight} className="text-purple-400 text-xs" />
                                  </div>
                                  <p className="text-slate-300 text-xs italic leading-relaxed">
                                    "{verse.text}"
                                  </p>
                                  <div className="text-purple-400 text-xs mt-1 opacity-75">
                                    → Click to navigate to {verse.reference}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
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

      {/* Book Image Gallery Modal */}
      {isImageGalleryOpen && bookInfo && (
        <BookImageGallery
          bookAbbr={bookAbbr}
          bookName={bookInfo.book_name}
          API_BASE_URL={API_BASE_URL}
          onClose={() => setIsImageGalleryOpen(false)}
        />
      )}

      {/* Theme Explorer Modal */}
      {selectedTheme && (
        <ThemeExplorer
          theme={selectedTheme}
          isOpen={isThemeExplorerOpen}
          onClose={handleThemeExplorerClose}
          API_BASE_URL={API_BASE_URL}
        />
      )}
    </div>
  );
};

export default BookInfoPanel; 