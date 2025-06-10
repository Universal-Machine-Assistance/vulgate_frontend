import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChurch, faBrain, faGlobe } from '@fortawesome/free-solid-svg-icons';

interface InterpretationLayersProps {
  theological_layer?: string[];
  symbolic_layer?: string[];
  cosmological_layer?: string[];
}

const InterpretationLayersComponent: React.FC<InterpretationLayersProps> = ({
  theological_layer = [],
  symbolic_layer = [],
  cosmological_layer = []
}) => {
  const layerCard = (title: string, latin: string, icon: any, points: string[], bg: string, border: string) => (
    <div className={`${bg} ${border} rounded-lg p-4 shadow`}>
      <h3 className="text-xl font-bold mb-2 flex items-center">
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {title}
      </h3>
      <div className="italic text-gray-700 mb-1">{latin}</div>
      <ul className="list-disc list-inside text-gray-800 space-y-1">
        {points.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {layerCard('Theological Layer', 'Stratum Theologicum', faChurch, theological_layer, 'bg-yellow-100', 'border-l-8 border-yellow-400')}
      {layerCard('Symbolic Layer (Jungian & Campbell)', 'Stratum Symbolicum (Jungianum & Campbell)', faBrain, symbolic_layer, 'bg-purple-100', 'border-l-8 border-purple-400')}
      {layerCard('Cosmological-Historical Layer', 'Stratum Cosmologicum-Historicum', faGlobe, cosmological_layer, 'bg-orange-100', 'border-l-8 border-orange-400')}
    </div>
  );
};

export default InterpretationLayersComponent; 