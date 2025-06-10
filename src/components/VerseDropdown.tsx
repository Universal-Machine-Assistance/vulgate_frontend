import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Verse } from '../types';

interface VerseDropdownProps {
  verses: Verse[];
  selectedVerseNumber: number;
  handleVerseChange: (verseNumber: number) => void;
}

const VerseDropdown: React.FC<VerseDropdownProps> = ({ verses, selectedVerseNumber, handleVerseChange }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="bg-[#f8fafc] border-4 border-black rounded shadow-lg shadow-gray-300/40 px-4 py-2 flex items-center gap-2 font-black text-lg cursor-pointer min-w-[120px]"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <FontAwesomeIcon icon={faBook} className="text-black" />
        Verse {selectedVerseNumber}
        <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-500" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 z-30 bg-white border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-full max-h-80 overflow-y-auto custom-scrollbar hide-scrollbar"
          role="listbox"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {verses.map(verse => (
            <button
              key={verse.verse_number}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 font-bold text-lg hover:bg-blue-100 focus:bg-blue-200 transition rounded ${selectedVerseNumber === verse.verse_number ? 'bg-blue-200' : ''}`}
              onClick={() => { handleVerseChange(verse.verse_number); setOpen(false); }}
              role="option"
              aria-selected={selectedVerseNumber === verse.verse_number}
              tabIndex={0}
            >
              Verse {verse.verse_number}
              {selectedVerseNumber === verse.verse_number && <span className="ml-auto">✔️</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerseDropdown; 