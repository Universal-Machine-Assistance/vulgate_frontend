import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { VerseRelationship, VerseRelationshipsResponse } from '../types';

interface WordVerseRelationshipsProps {
  word: string;
  onNavigateToVerse?: (reference: string) => void;
}

const API_BASE_URL = 'http://127.0.0.1:8001/api/v1';

const WordVerseRelationships: React.FC<WordVerseRelationshipsProps> = ({ 
  word, 
  onNavigateToVerse 
}) => {
  const [relationships, setRelationships] = useState<VerseRelationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchRelationships = async () => {
      if (!word) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/dictionary/word/${encodeURIComponent(word)}/verses`);
        const data: VerseRelationshipsResponse = await response.json();
        
        if (data.found && data.verses) {
          setRelationships(data.verses);
        } else {
          setRelationships([]);
        }
      } catch (error) {
        console.error('Error fetching verse relationships:', error);
        setRelationships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelationships();
  }, [word]);

  const handleVerseClick = (reference: string) => {
    if (onNavigateToVerse) {
      onNavigateToVerse(reference);
    } else {
      // Parse reference and navigate
      const parts = reference.split(' ');
      if (parts.length >= 2) {
        const book = parts[0];
        const chapterVerse = parts[1].split(':');
        if (chapterVerse.length === 2) {
          const chapter = parseInt(chapterVerse[0]);
          const verse = parseInt(chapterVerse[1]);
          window.location.href = `/${book}/${chapter}/${verse}`;
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          <span>Loading verse relationships...</span>
        </div>
      </div>
    );
  }

  if (relationships.length === 0) {
    return null; // Don't show anything if no relationships found
  }

  const displayedRelationships = expanded ? relationships : relationships.slice(0, 3);

  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="text-sm font-black text-blue-900 mb-2 uppercase tracking-wide flex items-center gap-2">
        <FontAwesomeIcon icon={faBook} className="text-blue-700" />
        Related Verses ({relationships.length})
      </h4>
      <div className="space-y-2">
        {displayedRelationships.map((relationship, index) => (
          <div 
            key={index}
            className="p-2 bg-white rounded border border-blue-200 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
            onClick={() => handleVerseClick(relationship.verse_reference)}
            title="Click to navigate to this verse"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-blue-800">
                {relationship.verse_reference}
              </span>
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="text-blue-600 text-xs opacity-75" 
              />
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              {relationship.verse_text.length > 100 
                ? `${relationship.verse_text.substring(0, 100)}...` 
                : relationship.verse_text}
            </p>
          </div>
        ))}
      </div>
      
      {relationships.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200"
        >
          {expanded ? `Show less` : `Show ${relationships.length - 3} more verses`}
        </button>
      )}
    </div>
  );
};

export default WordVerseRelationships; 