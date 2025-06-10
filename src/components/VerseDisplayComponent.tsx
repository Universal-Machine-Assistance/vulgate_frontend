import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faArrowLeft, 
  faArrowRight, 
  faPlay, 
  faPause, 
  faStop, 
  faMicrophone, 
  faUpload 
} from '@fortawesome/free-solid-svg-icons';
import { Verse, VerseAnalysisState, GrammarColorKey, GRAMMAR_COLORS } from '../types';
import BookDropdown from './BookDropdown';
import ChapterDropdown from './ChapterDropdown';
import VerseDropdown from './VerseDropdown';
import LanguageDropdown from './LanguageDropdown';
import AnimatedWrapper from './AnimatedWrapper';

interface VerseDisplayComponentProps {
  // Verse data
  selectedVerse: Verse | null;
  selectedBookAbbr: string;
  currentChapter: number;
  verseAnalysisState: VerseAnalysisState;
  
  // Book/Chapter/Verse data
  books: any[];
  chapters: any[];
  verses: Verse[];
  
  // Navigation
  navigationInProgress: boolean;
  isTransitioning: boolean;
  location: any;
  verseAnimation: string;
  onNavigateToPrevious: () => void;
  onNavigateToNext: () => void;
  onBookChange: (book: string, chapter: number, verse: number) => void;
  onChapterChange: (chapter: number) => void;
  onVerseChange: (verse: number) => void;
  
  // Translation
  selectedTranslationLang: string;
  setSelectedTranslationLang: (lang: string) => void;
  
  // Audio/Recording
  audioAvailable: boolean;
  isPlaying: boolean;
  isRecording: boolean;
  recording: Blob | null;
  isUploading: boolean;
  uploadSuccess: boolean;
  audioSource: any;
  currentlyPlayingWordIndex: number | null;
  onPlayPause: () => void;
  onRecord: () => void;
  onUploadRecording: () => void;
  
  // Word interaction
  onWordClick: (index: number) => void;
  onWordHover: (word: string | null) => void;
  onGrammarWordClick: (word: string) => void;
  
  // UI state
  isVerseLoading: boolean;
  setIsBookInfoOpen: (open: boolean) => void;
  
  // Utility functions
  normalizeLatin: (word: string) => string;
  getColorsFromGrammarClass: (colorClass: string) => any;
  renderMarkdown: (text: string) => JSX.Element;
  
  // Constants
  BOOK_NAMES: { [key: string]: string };
}

const VerseDisplayComponent: React.FC<VerseDisplayComponentProps> = ({
  selectedVerse,
  selectedBookAbbr,
  currentChapter,
  verseAnalysisState,
  books,
  chapters,
  verses,
  navigationInProgress,
  isTransitioning,
  location,
  verseAnimation,
  onNavigateToPrevious,
  onNavigateToNext,
  onBookChange,
  onChapterChange,
  onVerseChange,
  selectedTranslationLang,
  setSelectedTranslationLang,
  audioAvailable,
  isPlaying,
  isRecording,
  recording,
  isUploading,
  uploadSuccess,
  audioSource,
  currentlyPlayingWordIndex,
  onPlayPause,
  onRecord,
  onUploadRecording,
  onWordClick,
  onWordHover,
  onGrammarWordClick,
  isVerseLoading,
  setIsBookInfoOpen,
  normalizeLatin,
  getColorsFromGrammarClass,
  renderMarkdown,
  BOOK_NAMES
}) => {
  return (
    <div className="bg-white border-4 border-black rounded-2xl shadow-lg shadow-gray-200/40 p-6 w-full">
      {/* Verse navigation/selector */}
      <div className="bg-white border-4 border-black rounded-xl shadow-2xl shadow-gray-400/50 p-4 w-full flex flex-wrap gap-4 justify-center items-center mb-6">
        <button
          onClick={onNavigateToPrevious}
          disabled={!selectedVerse || (selectedVerse.verse_number <= 1 && currentChapter <= 1) || isTransitioning || navigationInProgress}
          className="w-12 h-12 text-lg font-black text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-30 transition-all duration-200 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center"
          title="Previous verse (← arrow key) - crosses chapters"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <BookDropdown 
          books={books} 
          selectedBookAbbr={selectedBookAbbr} 
          setSelectedBookAbbr={() => {}} // Handled by parent
          onBookChange={onBookChange}
        />
        <ChapterDropdown 
          chapters={chapters} 
          currentChapter={currentChapter} 
          setCurrentChapter={() => {}} // Handled by parent
          onChapterChange={onChapterChange}
        />
        <VerseDropdown verses={verses} selectedVerseNumber={selectedVerse?.verse_number || 1} handleVerseChange={onVerseChange} />
        {/* Language dropdown shows when translations available */}
        <AnimatedWrapper 
          show={verseAnalysisState.translations && Object.keys(verseAnalysisState.translations).length > 0}
          enterClass="smooth-entrance"
          exitClass="smooth-exit"
        >
          <LanguageDropdown
            languages={Object.keys(verseAnalysisState.translations || {})}
            selectedLang={selectedTranslationLang}
            setSelectedLang={setSelectedTranslationLang}
            translations={verseAnalysisState.translations || {}}
          />
        </AnimatedWrapper>
        <button
          onClick={onNavigateToNext}
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
          {/* Navigation state indicator */}
          {navigationInProgress && (
            <span className="text-sm text-blue-600 animate-pulse ml-2">
              ⏳ Navigating...
            </span>
          )}
          {/* Sync verification */}
          {selectedVerse && location.pathname !== `/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}` && !navigationInProgress && (
            <span className="text-sm text-red-600 ml-2" title="Verse may be out of sync">
              ⚠️ Syncing...
            </span>
          )}
        </div>
        <div className="verse-container min-h-[120px] flex items-center justify-center px-4 py-2 bg-white rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-100">
          {selectedVerse && (
            <div className={`verse-content ${verseAnimation !== 'none' ? verseAnimation : ''}`}>
              <p className="text-xl font-bold text-center break-words whitespace-pre-line w-full max-w-full text-black leading-relaxed">
              {selectedVerse?.text.split(' ').map((word, index) => {
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
                    onWordClick(index);
                    onGrammarWordClick(cleanWord);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onWordClick(index);
                      onGrammarWordClick(cleanWord);
                    }
                  }}
                  onMouseEnter={() => onWordHover(cleanWord)}
                  onMouseLeave={() => onWordHover(null)}
                  className={className}
                  style={{
                    ...style,
                    border: 'none',
                    background: style.backgroundColor || 'transparent',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    textDecoration: 'none',
                    outline: 'none'
                  }}
                  title={wordInfo ? `${wordInfo.partOfSpeech}: ${wordInfo.definition}` : 'Click for definition'}
                  tabIndex={0}
                  role="button"
                  aria-label={`Word: ${cleanWord}${wordInfo ? ` - ${wordInfo.partOfSpeech}: ${wordInfo.definition}` : ''}`}
                >
                  {word}
                </button>
              );
            })}
              </p>
            </div>
          )}
        </div>
        
        {/* Loading indicator below verse */}
        {isVerseLoading && !verseAnalysisState.isAnalysisDone && (
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span className="text-sm">Analyzing verse...</span>
          </div>
        )}
        
        {/* Simplified Translation Display */}
        <AnimatedWrapper 
          show={!isVerseLoading && verseAnalysisState.translations && Object.keys(verseAnalysisState.translations).length > 0}
          enterClass="smooth-entrance-up"
          exitClass="smooth-exit-down"
        >
          <div className="mt-4 border-t border-gray-200 pt-3">
            {(() => {
              const currentTranslation = verseAnalysisState.translations?.[selectedTranslationLang] || '';
              
              return (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-gray-800 leading-relaxed text-sm">
                    {renderMarkdown(currentTranslation)}
                  </div>
                </div>
              );
            })()}
          </div>
        </AnimatedWrapper>
      </div>

      {/* Play/Pause and Record buttons */}
      <div className="flex gap-4 justify-center mt-4 flex-wrap">
        {audioAvailable && (
          <button
            className={`p-3 rounded-full ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white shadow transition-all duration-200`}
            title={isPlaying ? 'Pause audio (P key)' : 'Play audio with word highlighting (P key)'}
            onClick={onPlayPause}
            disabled={!selectedVerse}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
        )}
        <button
          className={`p-3 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-pink-500 hover:bg-pink-600'} text-white shadow transition-all duration-200 hover:scale-130`}
          title={isRecording ? 'Stop recording (R key)' : 'Start recording (R key)'}
          onClick={onRecord}
          disabled={!selectedVerse}
        >
          <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
        </button>
        {/* Manual upload button - appears when there's a recording but upload failed or didn't happen */}
        {recording && !isUploading && !uploadSuccess && !audioAvailable && (
          <button
            className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow transition-colors duration-200"
            title="Upload recording"
            onClick={onUploadRecording}
            disabled={!selectedVerse}
          >
            <FontAwesomeIcon icon={faUpload} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VerseDisplayComponent; 