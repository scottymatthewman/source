import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
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
  audioLevel: number; // 0-1 value representing current audio level
}

export function useAudioRecording() {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true, // Enable audio level metering
  });
  const recorderState = useAudioRecorderState(recorder, 100); // Update every 100ms
  const [state, setState] = useState<AudioState>({
    state: 'idle',
    duration: 0,
    audioUri: null,
    error: null,
    audioLevel: 0
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

  // Monitor audio level during recording
  useEffect(() => {
    if (state.state === 'recording' && recorderState.metering !== undefined) {
      // Convert metering value (typically -160 to 0 dB) to 0-1 scale
      const normalizedLevel = Math.max(0, Math.min(1, (recorderState.metering + 160) / 160));
      setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
    } else if (state.state !== 'recording') {
      setState(prev => ({ ...prev, audioLevel: 0 }));
    }
  }, [recorderState.metering, state.state]);

  const startRecording = useCallback(async () => {
    setState(prev => {
      if (prev.state === 'recording') {
        return prev; // Already recording, don't change state
      }
      return { ...prev, state: 'recording', error: null };
    });
    
    try {
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
    setState(prev => {
      if (prev.state !== 'recording') {
        return prev; // Not recording, don't change state
      }
      return { ...prev, state: 'idle' }; // Immediately update state to stop recording UI
    });
    
    try {
      const finalDuration = recorder.currentTime;
      await recorder.stop(); // Must await this!
      const uri = recorder.uri;
      
      setState(prev => ({ 
        ...prev, 
        audioUri: uri,
        duration: finalDuration 
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
      error: null,
      audioLevel: 0
    });
  }, []);

  return {
    state,
    startRecording,
    stopRecording,
    resetRecording,
    duration: state.state === 'recording' ? recorder.currentTime : state.duration,
    audioLevel: state.audioLevel
  };
}
