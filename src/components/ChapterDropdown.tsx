import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScroll, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface ChapterDropdownProps {
  chapters: number[];
  currentChapter: number;
  setCurrentChapter: (chapter: number) => void;
  onChapterChange?: (chapter: number) => void;
}

const ChapterDropdown: React.FC<ChapterDropdownProps> = ({ chapters, currentChapter, setCurrentChapter, onChapterChange }) => {
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
        className="bg-white border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 flex items-center gap-2 font-black text-lg cursor-pointer min-w-[120px]"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <FontAwesomeIcon icon={faScroll} className="text-black" />
        Chapter {currentChapter}
        <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-500" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 z-30 bg-white border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-full max-h-80 overflow-y-auto custom-scrollbar hide-scrollbar"
          role="listbox"
        >
          {chapters.map(chapter => (
            <button
              key={chapter}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 font-bold text-lg hover:bg-yellow-100 focus:bg-yellow-200 transition rounded ${currentChapter === chapter ? 'bg-yellow-200' : ''}`}
              onClick={() => { 
                setCurrentChapter(chapter); 
                setOpen(false);
                if (onChapterChange) {
                  onChapterChange(chapter);
                }
              }}
              role="option"
              aria-selected={currentChapter === chapter}
              tabIndex={0}
            >
              Chapter {chapter}
              {currentChapter === chapter && <span className="ml-auto">✔️</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterDropdown; 