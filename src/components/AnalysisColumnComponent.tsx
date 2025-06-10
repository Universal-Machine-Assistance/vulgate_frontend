import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faSun } from '@fortawesome/free-solid-svg-icons';
import { NameOccurrence } from '../types';
import WordInfoComponent from './WordInfoComponent';
import InterpretationLayersComponent from './InterpretationLayersComponent';
import NameOccurrencesComponent from './NameOccurrencesComponent';
import AnimatedWrapper from './AnimatedWrapper';

interface AnalysisColumnComponentProps {
  verseAnalysisState: any; // Use the actual VerseAnalysisState from App.tsx
  theologicalInterpretation: string | null;
  onNavigateToOccurrence: (book: string, chapter: number, verse: number) => void;
  analysisResultHasLayers: (state: any) => boolean | undefined;
}

const AnalysisColumnComponent: React.FC<AnalysisColumnComponentProps> = ({
  verseAnalysisState,
  theologicalInterpretation,
  onNavigateToOccurrence,
  analysisResultHasLayers
}) => {
  return (
    <div className="flex-[3] min-w-[280px]">
      <div className="bg-white border-4 border-black rounded-2xl shadow-lg shadow-gray-200/40 p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          <FontAwesomeIcon icon={faBrain} className="mr-2" />
          Analysis
        </h3>
        <div className="space-y-4">
          {/* Word Definition Card */}
          <AnimatedWrapper 
            show={!!verseAnalysisState.wordInfo}
            enterClass="smooth-entrance"
            exitClass="smooth-exit"
          >
            <WordInfoComponent 
              wordInfo={verseAnalysisState.wordInfo}
              onNavigateToVerse={(reference: string) => {
                const parts = reference.split(' ');
                if (parts.length >= 2) {
                  const [book, chapterVerse] = parts;
                  const [chapter, verse] = chapterVerse.split(':');
                  onNavigateToOccurrence(book, parseInt(chapter), parseInt(verse));
                }
              }}
            />
          </AnimatedWrapper>
          
          {/* Theological interpretation */}
          {analysisResultHasLayers(verseAnalysisState) ? (
            <InterpretationLayersComponent 
              theological_layer={verseAnalysisState.theological_layer}
              symbolic_layer={verseAnalysisState.symbolic_layer}
              cosmological_layer={verseAnalysisState.cosmological_layer}
            />
          ) : (
            <div className="bg-gray-50 border-4 border-gray-300 rounded-lg shadow-md p-4">
              <h4 className="text-md font-bold mb-2 text-gray-700">
                <FontAwesomeIcon icon={faSun} className="mr-2" />
                Theological Interpretation
              </h4>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {theologicalInterpretation}
              </div>
            </div>
          )}
          
          {/* Name occurrences */}
          <NameOccurrencesComponent 
            occurrences={verseAnalysisState.nameOccurrences || []} 
            onNavigate={onNavigateToOccurrence}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisColumnComponent; 