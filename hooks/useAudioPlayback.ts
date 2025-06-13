import { AudioStatus, useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';

export interface AudioPlayerStatus {
  isLoaded: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  metering?: number;
}

export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const player = useAudioPlayer();

  // Handle playback status updates
  useEffect(() => {
    const handlePlaybackStatusUpdate = (status: AudioStatus) => {
      if (status.isLoaded) {
        setIsPlaying(status.playing);
        setPlaybackPosition(status.currentTime * 1000); // Convert seconds to milliseconds
      }
    };

    // Set up event listener
    player.addListener('playbackStatusUpdate', handlePlaybackStatusUpdate);

    return () => {
      // Clean up event listener
      player.removeListener('playbackStatusUpdate', handlePlaybackStatusUpdate);
      player.remove();
      setIsPlaying(false);
      setPlaybackPosition(0);
    };
  }, [player]);

  const play = async (uri: string) => {
    try {
      console.log('Loading audio from URI:', uri);
      await player.replace(uri);
      console.log('Audio loaded, starting playback');
      await player.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  };

  const pause = async () => {
    try {
      player.pause();
    } catch (error) {
      console.error('Failed to pause audio:', error);
    }
  };

  const stop = async () => {
    try {
      player.remove();
      setPlaybackPosition(0);
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  };

  return {
    isPlaying,
    playbackPosition,
    play,
    pause,
    stop,
  };
} 