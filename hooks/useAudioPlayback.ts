import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';

// Audio configuration for playback (main speakers)
const PLAYBACK_AUDIO_CONFIG = {
  allowsRecording: false,
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'mixWithOthers' as const,
  shouldRouteThroughEarpiece: false, // CRITICAL: Use main speakers
};

export function useAudioPlayback(audioUri: string | null) {
  const player = useAudioPlayer(audioUri);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(async () => {
    if (!audioUri) return;
    try {
      // Set audio mode for playback (main speakers)
      await setAudioModeAsync(PLAYBACK_AUDIO_CONFIG);
      
      // Set volume to maximum before playing
      player.volume = 1.0;
      
      await player.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback error:', error);
    }
  }, [audioUri, player]);

  const pause = useCallback(async () => {
    try {
      await player.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error('Pause error:', error);
    }
  }, [player]);

  const stop = useCallback(async () => {
    try {
      await player.pause();
      await player.seekTo(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Stop error:', error);
    }
  }, [player]);

  // Reset playing state when audio URI changes
  useEffect(() => {
    setIsPlaying(false);
  }, [audioUri]);

  return { isPlaying, play, pause, stop };
}
