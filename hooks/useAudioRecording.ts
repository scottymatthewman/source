import { RecordingPresets, requestRecordingPermissionsAsync, useAudioPlayer, useAudioRecorder } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';
import { useClips } from '../context/clipContext';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { createClip } = useClips();

  // Initialize recorder with high quality preset
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  
  // Initialize player
  const player = useAudioPlayer(audioUri);

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        console.log('Requesting recording permissions...');
        const { granted } = await requestRecordingPermissionsAsync();
        console.log('Permission status:', granted ? 'granted' : 'denied');
        setHasPermission(granted);
        if (!granted) {
          setError('Permission to access microphone was denied');
        }
      } catch (err) {
        console.error('Failed to request microphone permissions:', err);
        setError('Failed to request microphone permissions');
        setHasPermission(false);
      }
    };

    requestPermissions();
  }, []);

  // Handle recording
  const startRecording = useCallback(async () => {
    try {
      console.log('Starting recording process...');
      
      // Check permissions first
      if (hasPermission === null) {
        console.log('Permission status unknown, requesting permissions...');
        const { granted } = await requestRecordingPermissionsAsync();
        setHasPermission(granted);
        if (!granted) {
          throw new Error('Microphone permission denied');
        }
      } else if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      setError(null);
      await recorder.prepareToRecordAsync();
      console.log('Recorder prepared successfully');
      await recorder.record();
      console.log('Recording started');
      setIsRecording(true);
      setIsPlaying(false); // Ensure we're not in playing state
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setIsRecording(false);
    }
  }, [recorder, hasPermission]);

  const stopRecording = useCallback(async () => {
    try {
      console.log('Stopping recording...');
      await recorder.stop();
      const uri = recorder.uri;
      console.log('Recording stopped, URI:', uri);
      setAudioUri(uri);
      setIsRecording(false);
      // Don't set isPlaying to true here - let the user explicitly start playback
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setError('Failed to stop recording');
    }
  }, [recorder]);

  // Handle playback
  const playRecording = useCallback(async () => {
    if (!audioUri) {
      console.error('Cannot play: No audio URI available');
      return;
    }
    
    try {
      console.log('Starting playback of:', audioUri);
      setError(null);
      await player.play();
      console.log('Playback started');
      setIsPlaying(true);
      setIsRecording(false); // Ensure we're not in recording state
    } catch (err) {
      console.error('Failed to play recording:', err);
      setError('Failed to play recording');
      setIsPlaying(false);
    }
  }, [audioUri, player]);

  const pauseRecording = useCallback(async () => {
    try {
      console.log('Pausing playback...');
      await player.pause();
      console.log('Playback paused');
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to pause recording:', err);
      setError('Failed to pause recording');
    }
  }, [player]);

  const stopPlayback = useCallback(async () => {
    try {
      console.log('Stopping playback...');
      await player.pause();
      await player.seekTo(0);
      console.log('Playback stopped and reset to beginning');
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to stop playback:', err);
      setError('Failed to stop playback');
    }
  }, [player]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up audio resources...');
      if (isRecording) {
        console.log('Stopping active recording...');
        recorder.stop();
      }
      if (isPlaying && audioUri) {
        console.log('Stopping active playback...');
        player.pause();
      }
    };
  }, [isRecording, isPlaying, recorder, player, audioUri]);

  /**
   * Clean up the recording state
   */
  const cleanupRecording = useCallback(async () => {
    if (isPlaying && audioUri) {
      await stopPlayback();
    }
    setIsRecording(false);
    setIsPlaying(false);
    setAudioUri(null);
    setDuration(0);
    setPosition(0);
  }, [isPlaying, audioUri, stopPlayback]);

  /**
   * Save the recording with given title and uri
   */
  const saveRecording = async (title: string, uri: string) => {
    console.log('[saveRecording] audioUri at save:', uri);
    if (!uri) {
      console.error('No audio URI available to save');
      return null;
    }
    try {
      // Create a clip using the ClipsContext
      const clip = await createClip(uri, title, duration);
      if (!clip) {
        console.error('Failed to create clip');
        return null;
      }
      // Reset state
      await cleanupRecording();
      return clip;
    } catch (error) {
      console.error('Failed to save recording:', error);
      throw error;
    }
  };

  return {
    isRecording,
    isPlaying,
    audioUri,
    duration,
    position,
    error,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
    stopPlayback,
    saveRecording,
    cleanupRecording,
    setIsRecording,
  };
}; 