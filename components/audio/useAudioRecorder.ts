import { AudioQuality, IOSOutputFormat, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder as useExpoAudioRecorder } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { useClips } from '../../context/clipContext';

export type RecorderState = 'idle' | 'recording' | 'stopped' | 'playing' | 'paused';

export function useAudioRecorder() {
  const [state, setState] = useState<RecorderState>('idle');
  const [duration, setDuration] = useState<number>(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const { createClip } = useClips();

  // Initialize recorder at the top level
  const recorder = useExpoAudioRecorder({
    extension: '.m4a',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    isMeteringEnabled: true,
    ios: {
      outputFormat: IOSOutputFormat.MPEG4AAC,
      audioQuality: AudioQuality.HIGH,
    },
    android: {
      outputFormat: 'mpeg4',
      audioEncoder: 'aac',
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      try {
        recorder.stop();
      } catch (error) {
        console.error('Error stopping recorder:', error);
      }
    };
  }, [recorder]);

  const startRecording = async () => {
    try {
      // Request permissions
      await requestRecordingPermissionsAsync();
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      
      setState('recording');
      setDuration(0);
      setWaveform([]);

      // Start duration timer
      durationInterval.current = setInterval(() => {
        setDuration(prev => prev + 1);
        // Get metering data if available
        if (recorder.getStatus().metering) {
          setWaveform(prev => [...prev, recorder.getStatus().metering!]);
        } else {
          setWaveform(prev => [...prev, Math.random()]);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setState('idle');
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      const status = recorder.getStatus();
      setAudioUri(status.url);
      setState('stopped');
      
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const saveRecording = async (title: string) => {
    if (!audioUri) {
      console.error('No audio URI available to save');
      return null;
    }

    try {
        const clip = await createClip(audioUri, title, duration);
        if (!clip) {
          console.error('Failed to create clip');
          return null;
        }

        // Reset state
        setState('idle');
        setDuration(0);
        setWaveform([]);
        setAudioUri(null);

        return clip;
    } catch (error) {
        console.error('Failed to save recording:', error);
        // Don't reset state on error, let the caller handle it
        throw error;
    }
  };

  const reset = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    try {
      recorder.stop();
    } catch (error) {
      console.error('Error stopping recorder:', error);
    }
    setState('idle');
    setDuration(0);
    setWaveform([]);
    setAudioUri(null);
  };

  return {
    state,
    duration,
    waveform,
    startRecording,
    stopRecording,
    saveRecording,
    reset,
  };
} 