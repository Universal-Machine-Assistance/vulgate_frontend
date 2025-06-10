import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faArrowRight, 
  faBook, 
  faPlay, 
  faPause, 
  faStop, 
  faMicrophone, 
  faUpload, 
  faBrain, 
  faSpinner, 
  faLanguage,
  faPhotoVideo,
  faExpand
} from '@fortawesome/free-solid-svg-icons';
import { 
  GrammarColorKey, 
  GRAMMAR_COLORS, 
  BOOK_NAMES,
  Verse 
} from '../types';
import { 
  getColorsFromGrammarClass, 
  normalizeLatin 
} from '../utils/grammarUtils';
import { renderMarkdown } from '../utils/markdownUtils';
import BookDropdown from './BookDropdown';
import ChapterDropdown from './ChapterDropdown';
import VerseDropdown from './VerseDropdown';
import LanguageDropdown from './LanguageDropdown';
import AnimatedWrapper from './AnimatedWrapper';
import VerseImageManager from './VerseImageManager';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

interface VerseAnalysis {
  [key: string]: {
    partOfSpeech?: string;
  };
}

interface VerseAnalysisState {
  analysis: VerseAnalysis;
  selectedWordIndex: number | null;
  hoveredWord?: string | null;
  selectedWord?: string | null;
  isAnalysisDone: boolean;
  translations: { [key: string]: string };
}

interface VerseDisplayComponentProps {
  // Navigation props
  selectedBookAbbr: string;
  setSelectedBookAbbr: (abbr: string) => void;
  currentChapter: number;
  setCurrentChapter: (chapter: number) => void;
  selectedVerse: Verse | null;
  books: any[];
  chapters: number[];
  verses: Verse[];
  navigationInProgress: boolean;
  isTransitioning: boolean;
  
  // Verse analysis state
  verseAnalysisState: VerseAnalysisState;
  
  // Translation props
  selectedTranslationLang: string;
  setSelectedTranslationLang: (lang: string) => void;
  
  // Audio props
  audioAvailable: boolean;
  isPlaying: boolean;
  audioSource: any;
  setIsPlaying: (playing: boolean) => void;
  setAudioSource: (source: any) => void;
  currentlyPlayingWordIndex: number | null;
  
  // Recording props
  isRecording: boolean;
  recording: Blob | null;
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadStatus: string;
  
  // AI Analysis props
  isOpenAIAnalyzing: boolean;
  brainButtonHovered: boolean;
  setBrainButtonHovered: (hovered: boolean) => void;
  hoverTimeoutId: NodeJS.Timeout | null;
  setHoverTimeoutId: (id: NodeJS.Timeout | null) => void;
  showFloatingTranslation: boolean;
  isGeneratingTranslations: boolean;
  
  // Animation props
  verseAnimation: string;
  
  // Event handlers
  navigateToPreviousVerse: () => void;
  navigateToNextVerse: () => void;
  updateURL: (book: string, chapter: number, verse: number) => void;
  handleVerseChange: (verseNumber: number) => void;
  setIsBookInfoOpen: (open: boolean) => void;
  handleWordClick: (index: number) => void;
  handleGrammarWordClick: (word: string) => void;
  playAudioWithWordHighlighting: () => void;
  handleRecordClick: () => void;
  uploadRecording: (blob: Blob) => void;
  handleEnhanceClick: (event: React.MouseEvent) => void;
  handleForceTranslations: () => void;
  
  // Location object
  location: {
    pathname: string;
  };
}

// Language cycle indicator component
const LanguageCycleIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
    </div>
  );
};

const VerseDisplayComponent: React.FC<VerseDisplayComponentProps> = ({
  // Navigation props
  selectedBookAbbr,
  setSelectedBookAbbr,
  currentChapter,
  setCurrentChapter,
  selectedVerse,
  books,
  chapters,
  verses,
  navigationInProgress,
  isTransitioning,
  
  // Verse analysis state
  verseAnalysisState,
  
  // Translation props
  selectedTranslationLang,
  setSelectedTranslationLang,
  
  // Audio props
  audioAvailable,
  isPlaying,
  audioSource,
  setIsPlaying,
  setAudioSource,
  currentlyPlayingWordIndex,
  
  // Recording props
  isRecording,
  recording,
  isUploading,
  uploadSuccess,
  uploadStatus,
  
  // AI Analysis props
  isOpenAIAnalyzing,
  brainButtonHovered,
  setBrainButtonHovered,
  hoverTimeoutId,
  setHoverTimeoutId,
  showFloatingTranslation,
  isGeneratingTranslations,
  
  // Animation props
  verseAnimation,
  
  // Event handlers
  navigateToPreviousVerse,
  navigateToNextVerse,
  updateURL,
  handleVerseChange,
  setIsBookInfoOpen,
  handleWordClick,
  handleGrammarWordClick,
  playAudioWithWordHighlighting,
  handleRecordClick,
  uploadRecording,
  handleEnhanceClick,
  handleForceTranslations,
  
  // Location object
  location
}) => {
  const [showImageManager, setShowImageManager] = useState(false);
  return (
    <div className="bg-white border-4 border-black rounded-2xl shadow-lg shadow-gray-200/40 p-6 w-full">
      {/* Verse navigation/selector */}
      <div className="bg-white border-4 border-black rounded-xl shadow-2xl shadow-gray-400/50 p-4 w-full flex flex-wrap gap-4 justify-center items-center mb-6">
        <button
          onClick={navigateToPreviousVerse}
          disabled={!selectedVerse || (selectedVerse.verse_number <= 1 && currentChapter <= 1) || isTransitioning || navigationInProgress}
          className="w-12 h-12 text-lg font-black text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-30 transition-all duration-200 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center"
          title="Previous verse (← arrow key) - crosses chapters"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <BookDropdown 
          books={books} 
          selectedBookAbbr={selectedBookAbbr} 
          setSelectedBookAbbr={setSelectedBookAbbr}
          onBookChange={(book, chapter, verse) => {
            updateURL(book, chapter, verse);
          }}
        />
        <ChapterDropdown 
          chapters={chapters} 
          currentChapter={currentChapter} 
          setCurrentChapter={setCurrentChapter}
          onChapterChange={(chapter) => {
            updateURL(selectedBookAbbr, chapter, 1);
          }}
        />
        <VerseDropdown verses={verses} selectedVerseNumber={selectedVerse?.verse_number || 1} handleVerseChange={handleVerseChange} />
        {/* Language dropdown - always visible with Latin as default */}
        <LanguageDropdown
          languages={['latin', ...Object.keys(verseAnalysisState.translations || {}).filter(lang => lang !== 'latin')]}
          selectedLang={selectedTranslationLang}
          setSelectedLang={setSelectedTranslationLang}
          translations={{
            latin: selectedVerse?.macronized_text || selectedVerse?.text || '',
            ...(verseAnalysisState.translations || {})
          }}
        />
        <button
          onClick={navigateToNextVerse}
          disabled={!selectedVerse || (selectedVerse.verse_number >= verses.length && currentChapter >= chapters.length) || isTransitioning || navigationInProgress}
          className="w-12 h-12 text-lg font-black text-white bg-purple-500 hover:bg-purple-600 disabled:opacity-30 transition-all duration-200 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center"
          title="Next verse (→ arrow key) - crosses chapters"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {/* Verse and translation */}
      <div className="w-full">
        <div className="font-bold text-lg mb-2 flex items-center gap-2 justify-center">
          <button
            onClick={() => setIsBookInfoOpen(true)}
            className="text-purple-600 hover:text-purple-800 hover:scale-110 transition-all duration-200 p-1 rounded"
            title="Informatio Libri - Click for book information"
          >
            <FontAwesomeIcon icon={faBook} />
          </button>
          {BOOK_NAMES[selectedBookAbbr] || selectedBookAbbr} {currentChapter}:{selectedVerse?.verse_number}

          {/* Verse Images Button */}
          <button
            onClick={() => setShowImageManager(!showImageManager)}
            className="text-purple-600 hover:text-purple-800 hover:scale-110 transition-all duration-200 p-1 rounded ml-2"
            title="Imagines Versus - Manage verse images"
          >
            <FontAwesomeIcon icon={showImageManager ? faExpand : faPhotoVideo} />
          </button>

          {/* Sync verification */}
          {selectedVerse && location.pathname !== `/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}` && !navigationInProgress && (
            <span className="text-sm text-red-600 ml-2" title="Verse may be out of sync">
              ⚠️ Syncing...
            </span>
          )}
        </div>

        {/* Verse Image Manager */}
        {showImageManager && selectedVerse && (
          <div className="mb-4">
            <VerseImageManager
              bookAbbr={selectedBookAbbr}
              chapter={currentChapter}
              verse={selectedVerse.verse_number}
              API_BASE_URL={API_BASE_URL}
              isCompact={false}
            />
          </div>
        )}
        <div className="verse-container min-h-[120px] flex items-center justify-center px-4 py-2 bg-white rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100">
          {selectedVerse && (
            <div className={`verse-content ${verseAnimation !== 'none' ? verseAnimation : ''}`}>
              <div className="text-2xl font-bold text-center break-words whitespace-pre-line w-full max-w-full text-black leading-relaxed">
                {(selectedVerse?.macronized_text || selectedVerse?.text)?.split(' ').map((word, index) => {
                  const cleanWord = word.replace(/[.,:;?!]$/, '');
                  const normalized = normalizeLatin(cleanWord);
                  const wordInfo = verseAnalysisState.analysis[normalized];
                  const partOfSpeech = (wordInfo?.partOfSpeech?.toLowerCase() || 'unknown') as GrammarColorKey;
                  const isSelected = verseAnalysisState.selectedWord === normalized;
                  const isHovered = verseAnalysisState.hoveredWord === normalized;
                  const isClickSelected = verseAnalysisState.selectedWordIndex === index;
                  const isCurrentlyPlaying = currentlyPlayingWordIndex === index;
                  
                  // Analysis completed animation class
                  const analysisCompleteClass = verseAnalysisState.isAnalysisDone ? 'analysis-complete' : '';
                  
                  let className = `mx-1 break-words inline-block font-black cursor-pointer transition-all duration-500 ${analysisCompleteClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 focus:bg-blue-50`;
                  let style: React.CSSProperties = {
                    transformOrigin: 'center',
                    willChange: 'transform',
                    padding: '0.15em 0.2em',
                    margin: '0 0.1em'
                  };
                  
                  // Show highlights only if analysis is done and interaction is happening
                  if (verseAnalysisState.isAnalysisDone && (isSelected || isHovered || isClickSelected || isCurrentlyPlaying)) {
                    const colorClass = GRAMMAR_COLORS[partOfSpeech] || GRAMMAR_COLORS.default;
                    const colors = getColorsFromGrammarClass(colorClass);
                    
                    style.backgroundColor = colors.bg;
                    style.color = colors.text;
                    
                    style.borderRadius = '0.5rem';
                    style.padding = '0.15em 0.4em';
                    style.position = 'relative';
                    style.zIndex = 1;
                    style.border = 'none';
                    
                    if (isSelected) {
                      style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
                    }
                    if (isHovered) {
                      style.transform = 'scale(1.05)';
                      style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }
                    if (isCurrentlyPlaying) {
                      // Keep the grammar-based background color but add playing effects
                      style.transform = 'scale(1.1)';
                      style.boxShadow = '0 0 0 4px rgba(251, 191, 36, 0.8), 0 8px 16px rgba(0, 0, 0, 0.2)'; 
                      style.fontWeight = '900';
                      style.animation = 'pulse 0.5s ease-in-out';
                      // Add a subtle golden border to indicate it's currently playing
                      style.border = '2px solid #fbbf24';
                    }
                  } else {
                    // Default black text - no highlighting until analysis completes
                    className += 'text-black hover:bg-gray-100 hover:rounded hover:shadow-sm ';
                    style.border = 'none';
                    style.background = 'transparent';
                  }
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleWordClick(index);
                        handleGrammarWordClick(cleanWord);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleWordClick(index);
                          handleGrammarWordClick(cleanWord);
                        }
                      }}
                      className={className}
                      style={style}
                      tabIndex={0}
                      aria-label={`Word: ${word}, Part of speech: ${partOfSpeech}`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Translation display */}
        <AnimatedWrapper 
          show={selectedTranslationLang !== 'latin' && verseAnalysisState.translations && !!verseAnalysisState.translations[selectedTranslationLang]}
          enterClass="smooth-entrance"
          exitClass="smooth-exit"
        >
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            {(() => {
              const translationText = verseAnalysisState.translations?.[selectedTranslationLang];
              if (!translationText) return null;
              
              return (
                <div className="text-center">
                  <div className="text-sm text-blue-800 leading-snug font-medium italic">
                    {renderMarkdown(translationText)}
                  </div>
                </div>
              );
            })()}
          </div>
        </AnimatedWrapper>
      </div>

      {/* Play/Pause and Record buttons */}
      <div className="flex gap-4 justify-center mt-4 flex-wrap">
        <button
          className={`p-3 rounded-full transition-all duration-300 ${
            audioAvailable 
              ? isPlaying 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white shadow`}
          title={
            audioAvailable 
              ? isPlaying 
                ? 'Pause audio (P key)' 
                : 'Play audio with word highlighting (P key)'
              : 'Audio not available for this verse'
          }
          onClick={() => {
            if (audioAvailable) {
              if (isPlaying) {
                if (audioSource) audioSource.stop();
                setIsPlaying(false);
                setAudioSource(null);
              } else {
                playAudioWithWordHighlighting();
              }
            }
          }}
          disabled={!selectedVerse || !audioAvailable}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button
          className={`p-3 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-pink-500 hover:bg-pink-600'} text-white shadow transition-all duration-200 hover:scale-130`}
          title={isRecording ? 'Stop recording (R key)' : 'Start recording (R key)'}
          onClick={handleRecordClick}
          disabled={!selectedVerse}
        >
          <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
        </button>
        {/* Manual upload button - appears when there's a recording but upload failed or didn't happen */}
        {recording && !isUploading && !uploadSuccess && !audioAvailable && (
          <button
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow transition-colors duration-200"
            title="Upload recording"
            onClick={() => uploadRecording(recording)}
            disabled={!selectedVerse}
          >
            <FontAwesomeIcon icon={faUpload} />
          </button>
        )}
        {/* Enhanced OpenAI Analysis button with floating translation icon */}
        <div className="relative floating-translation-container">
          <button
            className={`p-3 rounded-full border-2 border-black ${
              isOpenAIAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
            } text-white shadow transition-all duration-200 hover:scale-130`}
            title="Enhance analysis with Greb AI (G key) | Hover to show translation generator"
            onClick={handleEnhanceClick}
            onMouseEnter={() => {
              if (hoverTimeoutId) {
                clearTimeout(hoverTimeoutId);
                setHoverTimeoutId(null);
              }
              setBrainButtonHovered(true);
            }}
            onMouseLeave={() => {
              const timeoutId = setTimeout(() => {
                setBrainButtonHovered(false);
              }, 1500); // 1.5 second delay
              setHoverTimeoutId(timeoutId);
            }}
            disabled={!selectedVerse || isOpenAIAnalyzing}
          >
            {isOpenAIAnalyzing ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faBrain} />
            )}
          </button>
          
          {/* Floating Translation Icon - shows on hover */}
          {(showFloatingTranslation || brainButtonHovered) && (
            <div 
              className="absolute -top-9 -right-2 z-50"
              onMouseEnter={() => {
                if (hoverTimeoutId) {
                  clearTimeout(hoverTimeoutId);
                  setHoverTimeoutId(null);
                }
                setBrainButtonHovered(true);
              }}
              onMouseLeave={() => {
                const timeoutId = setTimeout(() => {
                  setBrainButtonHovered(false);
                }, 1500); // 1.5 second delay
                setHoverTimeoutId(timeoutId);
              }}
            >
              <button
                onClick={handleForceTranslations}
                disabled={isGeneratingTranslations}
                className={`w-8 h-8 rounded-full border-2 border-black shadow-lg transform transition-all duration-300 ease-out ${
                  isGeneratingTranslations 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-110 animate-bounce'
                } text-white flex items-center justify-center relative overflow-hidden`}
                style={{
                  animation: (showFloatingTranslation || brainButtonHovered)
                    ? 'floatingTranslationPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' 
                    : undefined
                }}
                title="Force generate all translations"
              >
                {isGeneratingTranslations ? (
                  <div className="relative">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
                    <LanguageCycleIndicator />
                  </div>
                ) : (
                  <FontAwesomeIcon icon={faLanguage} className="text-xs" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Recording status */}
      {uploadStatus && (
        <div className="mt-2 text-center">
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default VerseDisplayComponent; 