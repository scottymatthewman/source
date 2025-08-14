import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';

// Critical audio configuration to ensure audio plays through main speakers
const AUDIO_CONFIG = {
  allowsRecording: true,
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'mixWithOthers' as const,
  shouldRouteThroughEarpiece: false, // CRITICAL: Use main speakers
};

type RecordingState = 'idle' | 'recording' | 'playing' | 'error';

interface AudioState {
  state: RecordingState;
  duration: number;
  audioUri: string | null;
  error: string | null;
}

export function useAudioRecording() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [state, setState] = useState<AudioState>({
    state: 'idle',
    duration: 0,
    audioUri: null,
    error: null
  });

  // Set audio mode once on mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await setAudioModeAsync(AUDIO_CONFIG);
        const { granted } = await requestRecordingPermissionsAsync();
        if (!granted) {
          setState(prev => ({ ...prev, state: 'error', error: 'Microphone permission denied' }));
        }
      } catch (error) {
        setState(prev => ({ ...prev, state: 'error', error: 'Failed to setup audio' }));
      }
    };

    setupAudio();
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, state: 'recording', error: null }));
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        state: 'error', 
        error: error instanceof Error ? error.message : 'Failed to start recording' 
      }));
    }
  }, [recorder]);

  const stopRecording = useCallback(async () => {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      setState(prev => ({ 
        ...prev, 
        state: 'idle', 
        audioUri: uri 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        state: 'error', 
        error: error instanceof Error ? error.message : 'Failed to stop recording' 
      }));
    }
  }, [recorder]);

  const resetRecording = useCallback(() => {
    setState({
      state: 'idle',
      duration: 0,
      audioUri: null,
      error: null
    });
  }, []);

  return {
    state,
    startRecording,
    stopRecording,
    resetRecording,
    duration: recorder.currentTime
  };
}
