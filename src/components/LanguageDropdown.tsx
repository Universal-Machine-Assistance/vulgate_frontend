import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faGem } from '@fortawesome/free-solid-svg-icons';
import { Language, LANGUAGES } from '../types';

interface LanguageDropdownProps {
  languages: string[];
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  translations?: { [key: string]: string };
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ 
  languages, 
  selectedLang, 
  setSelectedLang, 
  translations = {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    setIsOpen(false);
  };

  const languageName = LANGUAGES.find(l => l.code === selectedLang)?.name || selectedLang.toUpperCase();
  const languageFlag = LANGUAGES.find(l => l.code === selectedLang)?.flag || '🌐';

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-white hover:bg-gray-50 text-black font-black border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] flex items-center gap-2 transition-all duration-200"
      >
        <span className="text-lg">{languageFlag}</span>
        <span className="font-black text-black">{languageName}</span>
        <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-gray-600" />
      </button>
      {isOpen && (
        <div className="origin-top-right absolute z-50 mt-2 w-48 bg-white border-4 border-black rounded-none shadow-lg">
          {languages.map(lang => {
            const langName = LANGUAGES.find(l => l.code === lang)?.name || lang.toUpperCase();
            const langFlag = LANGUAGES.find(l => l.code === lang)?.flag || '🌐';
            
            return (
              <button
                key={lang}
                onClick={() => handleSelect(lang)}
                className={`block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-3 ${
                  selectedLang === lang ? 'bg-gray-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <span className="text-lg">{langFlag}</span>
                <div className="flex-1">
                  <div className="font-bold text-black">{langName}</div>
                </div>
                {selectedLang === lang && (
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faGem} className="text-yellow-600" />
                    <span className="text-xs font-bold text-blue-600">ACTIVE</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown; 