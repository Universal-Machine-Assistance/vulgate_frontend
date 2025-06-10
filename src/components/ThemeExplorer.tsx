import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faSpinner, 
  faSearch, 
  faQuoteLeft,
  faArrowRight,
  faBook,
  faGem,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

interface ThemeVerse {
  reference: string;
  text: string;
  navigation_url: string;
  book_name: string;
  book_abbr: string;
  chapter: number;
  verse: number;
  relevance_score?: number;
}

interface ThemeExplorerProps {
  theme: string;
  isOpen: boolean;
  onClose: () => void;
  API_BASE_URL: string;
}

const ThemeExplorer: React.FC<ThemeExplorerProps> = ({ 
  theme, 
  isOpen, 
  onClose, 
  API_BASE_URL 
}) => {
  const navigate = useNavigate();
  const [verses, setVerses] = useState<ThemeVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (isOpen && theme) {
      fetchThemeVerses();
    }
  }, [isOpen, theme]);

  const fetchThemeVerses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call backend endpoint to get all verses for this theme
      const response = await fetch(`${API_BASE_URL}/themes/${encodeURIComponent(theme)}/verses`);
      
      if (response.ok) {
        const data = await response.json();
        setVerses(data.verses || []);
        console.log(`Found ${data.verses?.length || 0} verses for theme: ${theme}`);
      } else if (response.status === 404) {
        // Fallback: generate some example verses if backend doesn't have this endpoint yet
        console.warn(`Theme endpoint not available, generating sample data for: ${theme}`);
        setVerses(generateSampleThemeVerses(theme));
      } else {
        throw new Error(`Failed to fetch theme verses: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching theme verses:', err);
      // Fallback to sample data
      setVerses(generateSampleThemeVerses(theme));
      setError(null); // Don't show error, just use fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Temporary function to generate sample data while backend is being developed
  const generateSampleThemeVerses = (theme: string): ThemeVerse[] => {
    const sampleVerses: { [key: string]: ThemeVerse[] } = {
      'Creatio': [
        {
          reference: 'Gn 1:1',
          text: 'In principio creavit Deus caelum et terram.',
          navigation_url: '/Gn/1/1',
          book_name: 'Genesis',
          book_abbr: 'Gn',
          chapter: 1,
          verse: 1,
          relevance_score: 1.0
        },
        {
          reference: 'Gn 1:27',
          text: 'Et creavit Deus hominem ad imaginem suam: ad imaginem Dei creavit illum, masculum et feminam creavit eos.',
          navigation_url: '/Gn/1/27',
          book_name: 'Genesis',
          book_abbr: 'Gn',
          chapter: 1,
          verse: 27,
          relevance_score: 0.95
        },
        {
          reference: 'Ps 8:4',
          text: 'Quid est homo quod memor es eius? aut filius hominis, quoniam visitas eum?',
          navigation_url: '/Ps/8/4',
          book_name: 'Psalms',
          book_abbr: 'Ps',
          chapter: 8,
          verse: 4,
          relevance_score: 0.8
        }
      ],
      'Foedus Divinum': [
        {
          reference: 'Gn 12:2',
          text: 'Faciamque te in gentem magnam, et benedicam tibi, et magnificabo nomen tuum, erisque benedictio.',
          navigation_url: '/Gn/12/2',
          book_name: 'Genesis',
          book_abbr: 'Gn',
          chapter: 12,
          verse: 2,
          relevance_score: 1.0
        },
        {
          reference: 'Ex 19:5',
          text: 'Si ergo audieritis vocem meam, et custodieritis pactum meum, eritis mihi in peculium de cunctis populis.',
          navigation_url: '/Ex/19/5',
          book_name: 'Exodus',
          book_abbr: 'Ex',
          chapter: 19,
          verse: 5,
          relevance_score: 0.9
        }
      ],
      'Caritas': [
        {
          reference: '1Cor 13:4',
          text: 'Caritas patiens est, benigna est caritas: non aemulatur, non agit perperam, non inflatur.',
          navigation_url: '/1Cor/13/4',
          book_name: '1 Corinthians',
          book_abbr: '1Cor',
          chapter: 13,
          verse: 4,
          relevance_score: 1.0
        }
      ]
    };

    return sampleVerses[theme] || [
      {
        reference: 'Gn 1:1',
        text: `Exempla versuum pro themate "${theme}" adhuc in elaboratione sunt...`,
        navigation_url: '/Gn/1/1',
        book_name: 'Genesis',
        book_abbr: 'Gn',
        chapter: 1,
        verse: 1,
        relevance_score: 0.5
      }
    ];
  };

  const handleVerseClick = (verse: ThemeVerse) => {
    navigate(verse.navigation_url);
    onClose();
  };

  const filteredVerses = verses.filter(verse => 
    verse.text.toLowerCase().includes(searchFilter.toLowerCase()) ||
    verse.reference.toLowerCase().includes(searchFilter.toLowerCase()) ||
    verse.book_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-indigo-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-indigo-200 transition-colors p-2"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <FontAwesomeIcon icon={faGem} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Thema: {theme}
              </h1>
              <p className="text-indigo-200">
                Versus per totam Scripturam Sacram
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" 
            />
            <input
              type="text"
              placeholder="Quaere in versibus..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-indigo-400 text-3xl animate-spin mr-4" />
              <span className="text-indigo-300">Colligendo versus...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faBook} className="text-red-400 text-4xl mb-4" />
              <p className="text-red-300">{error}</p>
            </div>
          ) : filteredVerses.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-indigo-300">
                  {filteredVerses.length} {filteredVerses.length === 1 ? 'Versus' : 'Versus'} Inventus
                </h2>
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Purgare filtrum
                  </button>
                )}
              </div>

              {filteredVerses.map((verse, index) => (
                <div
                  key={`${verse.reference}-${index}`}
                  className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer group"
                  onClick={() => handleVerseClick(verse)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {verse.reference}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {verse.book_name}
                      </span>
                      {verse.relevance_score && (
                        <div className="flex items-center space-x-1">
                          <FontAwesomeIcon icon={faHeart} className="text-red-400 text-xs" />
                          <span className="text-xs text-slate-400">
                            {Math.round(verse.relevance_score * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <FontAwesomeIcon 
                      icon={faArrowRight} 
                      className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-indigo-400 text-sm mt-1 flex-shrink-0" />
                    <p className="text-slate-300 leading-relaxed italic">
                      {verse.text}
                    </p>
                  </div>

                  <div className="mt-3 text-xs text-indigo-400 opacity-75">
                    → Click to navigate to {verse.reference}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSearch} className="text-slate-400 text-4xl mb-4" />
              <p className="text-slate-400">
                {searchFilter ? 'Nullus versus filtro respondet' : 'Nulli versus pro hoc themate inventi'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeExplorer; 