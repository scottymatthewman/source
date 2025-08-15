import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

interface AudioWaveformProps {
  // Recording state
  isRecording: boolean;
  recordingDuration: number;
  
  // Playback state
  isPlaying: boolean;
  playbackProgress?: number; // 0-1 value representing playback progress
  playbackDuration?: number;
  
  // Audio level data (for recording visualization)
  audioLevel?: number; // 0-1 value representing current audio level
  
  // Dimensions
  height?: number;
}

export function AudioWaveform({
  isRecording,
  recordingDuration,
  isPlaying,
  playbackProgress = 0,
  playbackDuration = 0,
  audioLevel = 0,
  height = 60
}: AudioWaveformProps) {
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
  
  // Animation values
  const recordingAnimation = useRef(new Animated.Value(0)).current;
  const playbackAnimation = useRef(new Animated.Value(0)).current;
  const levelAnimation = useRef(new Animated.Value(0)).current;
  
  // State for waveform bars
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const [recordingBars, setRecordingBars] = useState<number[]>([]);
  
  // Generate waveform bars based on recording or playback state
  useEffect(() => {
    if (isRecording) {
      // Add new bar based on audio level during recording
      const newBar = Math.max(0.1, audioLevel * 0.8 + Math.random() * 0.2);
      setRecordingBars(prev => [...prev, newBar]);
    } else if (recordingBars.length > 0) {
      // When recording stops, use the recorded bars for playback
      setWaveformBars(recordingBars);
      setRecordingBars([]);
    }
  }, [isRecording, audioLevel, recordingDuration]);

  // Generate waveform data for playback when we have duration but no recorded bars
  useEffect(() => {
    if (!isRecording && playbackDuration > 0 && waveformBars.length === 0) {
      // Generate a fixed number of bars for consistent display
      const barCount = 50; // Fixed number of bars
      const bars: number[] = [];
      for (let i = 0; i < barCount; i++) {
        // Create a more realistic waveform pattern
        const timeProgress = i / barCount;
        const baseLevel = 0.2 + Math.sin(timeProgress * Math.PI * 4) * 0.3;
        const randomVariation = (Math.random() - 0.5) * 0.2;
        bars.push(Math.max(0.1, Math.min(0.8, baseLevel + randomVariation)));
      }
      setWaveformBars(bars);
    }
  }, [isRecording, playbackDuration, waveformBars.length]);
  
  // Animate recording state
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      recordingAnimation.setValue(0);
    }
  }, [isRecording, recordingAnimation]);
  
  // Animate playback progress
  useEffect(() => {
    if (isPlaying && playbackDuration > 0) {
      Animated.timing(playbackAnimation, {
        toValue: playbackProgress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [isPlaying, playbackProgress, playbackDuration, playbackAnimation]);
  
  // Animate audio level
  useEffect(() => {
    Animated.timing(levelAnimation, {
      toValue: audioLevel,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [audioLevel, levelAnimation]);
  
  // Fixed bar dimensions for consistent display
  const barWidth = 3;
  const barGap = 1;
  
  // Generate bars for display
  const generateBars = () => {
    const bars: number[] = [];
    const sourceBars = isRecording ? recordingBars : waveformBars;
    
    if (sourceBars.length === 0) {
      // Generate placeholder bars with more visibility
      for (let i = 0; i < 50; i++) {
        // Create a more visible pattern for empty state
        const pattern = 0.2 + Math.sin(i * 0.3) * 0.15 + Math.random() * 0.1;
        bars.push(Math.max(0.15, Math.min(0.6, pattern)));
      }
    } else {
      // Use actual recorded bars or extend with random data
      for (let i = 0; i < 50; i++) {
        if (i < sourceBars.length) {
          bars.push(sourceBars[i]);
        } else {
          // Extend with smaller bars for consistency
          bars.push(0.1 + Math.random() * 0.15);
        }
      }
    }
    
    return bars;
  };
  
  const displayBars = generateBars();
  const currentProgress = isPlaying ? playbackProgress : 0;
  const progressIndex = Math.floor(currentProgress * displayBars.length);
  
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.waveformContainer}>
        {displayBars.map((barHeight, index) => {
          const isActive = isRecording || (isPlaying && index <= progressIndex);
          const isCurrent = isRecording && index === recordingBars.length - 1;
          const hasAudio = playbackDuration > 0 || isRecording;
          
          // Calculate base bar height
          const baseHeight = barHeight * height * 0.8;
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.bar,
                {
                  width: barWidth,
                  height: isRecording && isCurrent 
                    ? recordingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [baseHeight, baseHeight * 1.3],
                      })
                    : baseHeight,
                  backgroundColor: isActive 
                    ? colorPalette.recordingRed 
                    : hasAudio 
                      ? colorPalette.border 
                      : colorPalette.text,
                  opacity: isActive ? 1 : (hasAudio ? 0.5 : 0.3),
                },
              ]}
            />
          );
        })}
      </View>
      
      {/* Recording indicator */}
      {isRecording && (
        <Animated.View
          style={[
            styles.recordingIndicator,
            {
              backgroundColor: colorPalette.recordingRed,
              opacity: recordingAnimation,
            },
          ]}
        />
      )}
      
      {/* Playback progress indicator */}
      {isPlaying && playbackDuration > 0 && (
        <View
          style={[
            styles.progressIndicator,
            {
              left: `${currentProgress * 100}%`,
              backgroundColor: colorPalette.recordingRed,
            },
          ]}
        />
      )}
      
      {/* Playback indicator dot */}
      {!isRecording && playbackDuration > 0 && (
        <View
          style={[
            styles.playbackIndicator,
            {
              backgroundColor: colorPalette.recordingRed,
              opacity: isPlaying ? 1 : 0.6,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  waveformContainer: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    flex: 1,
  },
  bar: {
    borderRadius: 1,
    flex: 1,
    minWidth: 3,
  },
  recordingIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  playbackIndicator: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
