import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faRobot } from '@fortawesome/free-solid-svg-icons';

// Enhanced markdown renderer with translation type styling
export const renderMarkdown = (text: string): JSX.Element => {
  if (!text) return <span>{text}</span>;
  
  // Check if text contains Literal: and Dynamic: patterns
  if (text.includes('Literal:') && text.includes('Dynamic:')) {
    // Split the text by the patterns
    const literalMatch = text.match(/Literal:\s*([\s\S]+?)(?=\s*Dynamic:|$)/);
    const dynamicMatch = text.match(/Dynamic:\s*([\s\S]+?)$/);
    
    return (
      <div className="space-y-4">
        {literalMatch && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-700" />
              <span className="font-black text-blue-700 uppercase tracking-wide">Literal:</span>
            </div>
            <div className="text-gray-800 pl-6">
              {processBasicMarkdown(literalMatch[1].trim())}
            </div>
          </div>
        )}
        {dynamicMatch && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faRobot} className="text-green-700" />
              <span className="font-black text-green-700 uppercase tracking-wide">Dynamic:</span>
            </div>
            <div className="text-gray-800 pl-6">
              {processBasicMarkdown(dynamicMatch[1].trim())}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Fallback to basic markdown processing
  return <span>{processBasicMarkdown(text)}</span>;
};

// Helper function for basic markdown processing
export const processBasicMarkdown = (text: string): JSX.Element => {
  // Split by bold markers and process
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Bold text with metallic effect
          const boldText = part.slice(2, -2);
          return (
            <strong 
              key={index} 
              className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 drop-shadow-sm"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontWeight: '900'
              }}
            >
              {boldText}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

// Language cycle indicator component for translation working state
export const LanguageCycleIndicator: React.FC = () => {
  const [currentFlag, setCurrentFlag] = React.useState(0);
  const flags = ['🇺🇸', '🇫🇷', '🇪🇸', '🇵🇹', '🇮🇹'];
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlag(prev => (prev + 1) % flags.length);
    }, 400); // Change flag every 400ms
    
    return () => clearInterval(interval);
  }, [flags.length]);
  
  return (
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center translation-working-indicator">
      <span className="text-xs" style={{ fontSize: '8px' }}>
        {flags[currentFlag]}
      </span>
    </div>
  );
};

// Enhanced translation type detection with distinct visual styling
export const getTranslationTypeIcon = (language: string, translationText: string) => {
  // Simple heuristics to determine translation type
  const hasWordForWord = translationText.includes('*') || translationText.includes('[') || translationText.includes('(');
  const isLiteral = hasWordForWord || translationText.split(' ').length <= 15;
  
  if (isLiteral) {
    return { 
      icon: faBookOpen, 
      type: 'Literal', 
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      description: 'Word-for-word',
      emoji: '📖'
    };
  } else {
    return { 
      icon: faRobot, 
      type: 'Dynamic', 
      color: 'text-green-700',
      bgColor: 'bg-green-100', 
      borderColor: 'border-green-300',
      description: 'Thought-for-thought',
      emoji: '🤖'
    };
  }
}; 