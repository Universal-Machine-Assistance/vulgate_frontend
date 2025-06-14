import React from 'react';
import { TEXT_SOURCES, getSourceColor } from '../constants';

interface SourceDropdownProps {
  currentSource: string;
  onSourceChange: (source: string) => void;
}

const SourceDropdown: React.FC<SourceDropdownProps> = ({ 
  currentSource, 
  onSourceChange 
}) => {
  const handleSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSource = event.target.value;
    onSourceChange(newSource);
  };

  return (
    <div className="relative">
      <select
        value={currentSource}
        onChange={handleSourceChange}
        className={`w-48 h-12 px-4 py-2 text-sm font-semibold border-4 border-black rounded-xl ${getSourceColor(currentSource)} 
          focus:outline-none focus:shadow-xl transition-all duration-200 appearance-none cursor-pointer
          hover:shadow-lg active:scale-95`}
        title="Select text source"
      >
        {Object.values(TEXT_SOURCES).map((source) => (
          <option key={source.id} value={source.id}>
            {source.icon} {source.displayName}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default SourceDropdown; 