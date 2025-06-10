import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants/index';

export const useAudioPlayer = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState<boolean>(false);
  const [currentlyPlayingWordIndex, setCurrentlyPlayingWordIndex] = useState<number | null>(null);

  // Initialize AudioContext
  useEffect(() => {
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)());
  }, []);

  const checkAudioAvailability = useCallback(async (selectedVerse: any, selectedBookAbbr: string, currentChapter: number) => {
    if (!selectedVerse) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/audio/check/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`);
      setAudioAvailable(response.ok);
    } catch (error) {
      console.error('Error checking audio availability:', error);
      setAudioAvailable(false);
    }
  }, []);

  const playAudio = useCallback(async (startIndex: number, autoPlay: boolean, selectedVerse: any, selectedBookAbbr: string, currentChapter: number) => {
    if (!selectedVerse) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`);
      if (!response.ok) throw new Error('Audio not found');
      
      const audioBuffer = await response.arrayBuffer();
      const decodedAudio = await audioContext!.decodeAudioData(audioBuffer);
      
      if (audioSource) {
        audioSource.stop();
      }
      
      const source = audioContext!.createBufferSource();
      source.buffer = decodedAudio;
      source.connect(audioContext!.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        setAudioSource(null);
        setCurrentlyPlayingWordIndex(null);
      };
      
      setAudioSource(source);
      setIsPlaying(true);
      
      if (autoPlay) {
        source.start();
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioAvailable(false);
    }
  }, [audioContext, audioSource]);

  const playAudioWithWordHighlighting = useCallback(async (selectedVerse: any, selectedBookAbbr: string, currentChapter: number, grammarBreakdown: any[]) => {
    if (!selectedVerse || !audioAvailable || !grammarBreakdown?.length) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/audio/${selectedBookAbbr}/${currentChapter}/${selectedVerse.verse_number}`);
      if (!response.ok) throw new Error('Audio not found');
      
      const audioBuffer = await response.arrayBuffer();
      const decodedAudio = await audioContext!.decodeAudioData(audioBuffer);
      
      if (audioSource) {
        audioSource.stop();
      }
      
      const source = audioContext!.createBufferSource();
      source.buffer = decodedAudio;
      source.connect(audioContext!.destination);
      
      setAudioSource(source);
      setIsPlaying(true);
      setCurrentlyPlayingWordIndex(0);
      
      const audioDuration = decodedAudio.duration;
      const wordCount = grammarBreakdown.length;
      const wordDuration = audioDuration / wordCount;
      
      // Highlight words sequentially
      let currentIndex = 0;
      const highlightInterval = setInterval(() => {
        if (currentIndex < wordCount) {
          setCurrentlyPlayingWordIndex(currentIndex);
          currentIndex++;
        } else {
          clearInterval(highlightInterval);
          setCurrentlyPlayingWordIndex(null);
        }
      }, wordDuration * 1000);
      
      source.onended = () => {
        setIsPlaying(false);
        setAudioSource(null);
        setCurrentlyPlayingWordIndex(null);
        clearInterval(highlightInterval);
      };
      
      source.start();
      
    } catch (error) {
      console.error('Error playing audio with highlighting:', error);
      setAudioAvailable(false);
    }
  }, [audioContext, audioSource, audioAvailable]);

  return {
    audioContext,
    audioSource,
    isPlaying,
    audioAvailable,
    currentlyPlayingWordIndex,
    setIsPlaying,
    setAudioSource,
    setCurrentlyPlayingWordIndex,
    checkAudioAvailability,
    playAudio,
    playAudioWithWordHighlighting
  };
}; 