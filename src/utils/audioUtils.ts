import { API_BASE_URL } from '../constants/index';

export interface AudioRecordingUtils {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  uploadRecording: (audioBlob: Blob) => Promise<void>;
  handleRecordClick: () => void;
}

export const createAudioRecordingUtils = (
  setNotification: (notification: { message: string; type: 'success' | 'error' | 'info' }) => void,
  setIsRecording: (isRecording: boolean) => void,
  isRecording: boolean,
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>,
  audioChunksRef: React.MutableRefObject<Blob[]>,
  book: string,
  chapter: number,
  verse: number,
  ensureAllTranslationsAvailable: () => Promise<void>
): AudioRecordingUtils => {

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        uploadRecording(audioBlob);
        audioChunksRef.current = [];
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setNotification({ message: 'Recording started...', type: 'info' });
    } catch (error) {
      console.error('Error starting recording:', error);
      setNotification({ message: 'Failed to start recording', type: 'error' });
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setNotification({ message: 'Recording stopped...', type: 'info' });
    }
  };

  const uploadRecording = async (audioBlob: Blob): Promise<void> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('book', book);
    formData.append('chapter', chapter.toString());
    formData.append('verse', verse.toString());
    
    try {
      setNotification({ message: 'Uploading recording...', type: 'info' });
      const response = await fetch(`${API_BASE_URL}/upload-audio/`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setNotification({ 
          message: result.message || 'Recording uploaded successfully!', 
          type: 'success' 
        });
        // Re-fetch translations to get the new audio
        await ensureAllTranslationsAvailable();
      } else {
        const errorData = await response.json();
        setNotification({ 
          message: errorData.detail || 'Failed to upload recording', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error uploading recording:', error);
      setNotification({ message: 'Network error uploading recording', type: 'error' });
    }
  };

  const handleRecordClick = (): void => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    startRecording,
    stopRecording,
    uploadRecording,
    handleRecordClick
  };
}; 