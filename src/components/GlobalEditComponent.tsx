import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faSpinner, 
  faSave, 
  faTimes, 
  faBrain 
} from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

interface EditSession {
  session_token: string;
  session_id: number;
  verse_id: number;
  session_data: {
    verse_text: string;
    grammar_breakdown: any[];
    interpretation_layers: any[];
  };
  created_at: string;
  updated_at: string;
}

interface FieldEdit {
  id: number;
  field_type: string;
  field_identifier: string;
  current_value: string;
  is_modified: boolean;
  ai_suggested_value?: string;
  confidence_score?: number;
}

interface GlobalEditState {
  isActive: boolean;
  session?: EditSession;
  fields: FieldEdit[];
  selectedField?: number;
  isLoading: boolean;
}

interface GlobalEditComponentProps {
  book: string;
  chapter: number;
  verse: number;
  onEditModeChange: (isActive: boolean) => void;
}

const GlobalEditComponent: React.FC<GlobalEditComponentProps> = ({ book, chapter, verse, onEditModeChange }) => {
  const [globalEditState, setGlobalEditState] = useState<GlobalEditState>({
    isActive: false,
    fields: [],
    isLoading: false
  });

  const startGlobalEdit = async () => {
    setGlobalEditState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/edit/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book, chapter, verse })
      });

      const sessionData = await response.json();
      
      if (response.ok) {
        const fieldsResponse = await fetch(`${API_BASE_URL}/analysis/edit/session/${sessionData.session_token}`);
        const fieldsData = await fieldsResponse.json();
        
        setGlobalEditState({
          isActive: true,
          session: {
            session_token: sessionData.session_token,
            session_id: sessionData.session_id,
            verse_id: fieldsData.verse_id,
            session_data: sessionData.verse_data,
            created_at: fieldsData.created_at,
            updated_at: fieldsData.updated_at
          },
          fields: fieldsData.fields,
          isLoading: false
        });
        onEditModeChange(true);
      }
    } catch (error) {
      console.error('Error starting global edit:', error);
      setGlobalEditState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateField = async (fieldId: number, newValue: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/edit/field/${fieldId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_value: newValue })
      });

      if (response.ok) {
        setGlobalEditState(prev => ({
          ...prev,
          fields: prev.fields.map(field => 
            field.id === fieldId 
              ? { ...field, current_value: newValue, is_modified: true }
              : field
          )
        }));
      }
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const generateAISuggestion = async (fieldId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/edit/field/${fieldId}/ai-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const suggestion = await response.json();
      
      if (response.ok) {
        setGlobalEditState(prev => ({
          ...prev,
          fields: prev.fields.map(field => 
            field.id === fieldId 
              ? { 
                  ...field, 
                  ai_suggested_value: suggestion.suggested_value,
                  confidence_score: suggestion.confidence_score
                }
              : field
          )
        }));
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
    }
  };

  const saveAllChanges = async () => {
    if (!globalEditState.session) return;
    
    setGlobalEditState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/edit/session/${globalEditState.session.session_token}/save`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (response.ok) {
        setGlobalEditState({
          isActive: false,
          fields: [],
          isLoading: false
        });
        onEditModeChange(false);
        
        // Reload the page to show updated content
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setGlobalEditState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const cancelEdit = () => {
    setGlobalEditState({
      isActive: false,
      fields: [],
      isLoading: false
    });
    onEditModeChange(false);
  };

  if (!globalEditState.isActive) {
    return (
      <div className="mt-4 p-4 bg-purple-50 border border-purple-300 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faEdit} />
              Global Edit Mode
            </h3>
            <p className="text-sm text-purple-600 mt-1">
              Edit all fields in this verse including text, definitions, and theological insights.
            </p>
          </div>
          <button
            onClick={startGlobalEdit}
            disabled={globalEditState.isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
          >
            {globalEditState.isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            ) : (
              'Start Editing'
            )}
          </button>
        </div>
      </div>
    );
  }

  const modifiedFields = globalEditState.fields.filter(field => field.is_modified);

  return (
    <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-400 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faEdit} />
          Global Edit Mode - Active
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-600">
            {modifiedFields.length} field(s) modified
          </span>
          <button
            onClick={saveAllChanges}
            disabled={globalEditState.isLoading || modifiedFields.length === 0}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSave} className="mr-1" />
            Save All
          </button>
          <button
            onClick={cancelEdit}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-1" />
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {globalEditState.fields.map((field) => (
          <div key={field.id} className="p-3 bg-white border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-purple-800">
                  {field.field_type.replace('_', ' ')}
                </span>
                {field.field_identifier !== 'main' && (
                  <span className="text-xs text-gray-500">({field.field_identifier})</span>
                )}
                {field.is_modified && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Modified
                  </span>
                )}
              </div>
              <button
                onClick={() => generateAISuggestion(field.id)}
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faBrain} className="mr-1" />
                AI Suggest
              </button>
            </div>

            <textarea
              value={field.current_value}
              onChange={(e) => updateField(field.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
              rows={field.field_type === 'verse_text' ? 3 : 2}
            />

            {field.ai_suggested_value && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-800">AI Suggestion</span>
                  {field.confidence_score && (
                    <span className="text-xs text-blue-600">
                      {Math.round(field.confidence_score * 100)}% confidence
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-700">{field.ai_suggested_value}</p>
                <button
                  onClick={() => updateField(field.id, field.ai_suggested_value!)}
                  className="mt-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Apply Suggestion
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalEditComponent; 