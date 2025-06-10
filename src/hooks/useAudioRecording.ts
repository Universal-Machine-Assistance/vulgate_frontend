import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../constants/index';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecording(blob);
        setUploadStatus('Recording completed successfully!');
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setUploadStatus('Recording...');
    } catch (error) {
      console.error('Error starting recording:', error);
      setUploadStatus('Error: Could not access microphone');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [mediaRecorder, isRecording]);

  const uploadRecording = useCallback(async (audioBlob: Blob, selectedVerse: any, selectedBookAbbr: string, currentChapter: number) => {
    if (!selectedVerse) return;
    
    setIsUploading(true);
    setUploadStatus('Uploading...');
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('book', selectedBookAbbr);
    formData.append('chapter', currentChapter.toString());
    formData.append('verse', selectedVerse.verse_number.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/audio/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Upload successful!');
        setUploadSuccess(true);
        
        setTimeout(() => {
          setUploadStatus('');
          setUploadSuccess(false);
          setRecording(null);
        }, 3000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading recording:', error);
      setUploadStatus('Upload failed. Please try again.');
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleRecordClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  return {
    isRecording,
    recording,
    uploadStatus,
    isUploading,
    uploadSuccess,
    startRecording,
    stopRecording,
    uploadRecording,
    handleRecordClick
  };
}; 