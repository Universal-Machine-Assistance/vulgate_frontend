import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Book, BOOK_ICONS, getBookCategoryColor } from '../types';

interface BookDropdownProps {
  books: Book[];
  selectedBookAbbr: string;
  setSelectedBookAbbr: (abbr: string) => void;
  onBookChange?: (book: string, chapter: number, verse: number) => void;
}

const BookDropdown: React.FC<BookDropdownProps> = ({ 
  books, 
  selectedBookAbbr, 
  setSelectedBookAbbr, 
  onBookChange 
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const selectedBook = books.find(b => b.latin_name === selectedBookAbbr);

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
        <FontAwesomeIcon icon={BOOK_ICONS[selectedBookAbbr] || faBook} className="text-black" />
        {selectedBook ? selectedBook.latin_name : 'Book'}
        <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-500" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 z-30 bg-white border-4 border-black rounded shadow-lg min-w-full max-h-80 overflow-y-auto custom-scrollbar hide-scrollbar"
          role="listbox"
        >
          {books.map(book => (
            <button
              key={book.id}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 font-bold text-lg ${getBookCategoryColor(book.latin_name)} focus:ring-2 focus:ring-black transition rounded ${selectedBookAbbr === book.latin_name ? 'ring-2 ring-black' : ''}`}
              onClick={() => { 
                setSelectedBookAbbr(book.latin_name); 
                setOpen(false);
                // When book changes, navigate to chapter 1 verse 1 of the new book
                if (onBookChange) {
                  onBookChange(book.latin_name, 1, 1);
                }
              }}
              role="option"
              aria-selected={selectedBookAbbr === book.latin_name}
              tabIndex={0}
            >
              <FontAwesomeIcon icon={BOOK_ICONS[book.latin_name] || faBook} className="text-black" />
              {book.latin_name} <span className="ml-2 text-gray-500 text-base">{book.name}</span>
              {selectedBookAbbr === book.latin_name && <span className="ml-auto">✔️</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookDropdown; 