import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import PauseIcon from '../icons/PauseIcon';
import PlayIcon from '../icons/PlayIcon';
import StopIcon from '../icons/StopIcon';
import GoArrowRightIcon from '../icons/goArrowRightIcon';

interface AudioControlsProps {
  // Recording state
  isRecording: boolean;
  onRecord: () => void;
  recordingDuration: number;
  
  // Playback state  
  hasAudio: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function AudioControls({ 
  isRecording, 
  onRecord, 
  recordingDuration,
  hasAudio,
  isPlaying,
  onPlay,
  onStop,
  onSave
}: AudioControlsProps) {
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  return (
    <View style={styles.container}>
      {/* Record Button - only show when not in playback mode */}
      {!hasAudio && (
        <TouchableOpacity 
          onPress={onRecord}
          style={[
            styles.recordButton,
            { backgroundColor: colorPalette.surface2 },
            isRecording && { backgroundColor: colorPalette.recordingRed }
          ]}
        >
          {isRecording ? (
            <StopIcon width={16} height={16} fill={colorPalette.bg} />
          ) : (
            <View style={[
              styles.recordIcon,
              { 
                backgroundColor: colorPalette.recordingRed,
                borderColor: colorPalette.bg
              }
            ]} />
          )}
          
          {isRecording && (
            <Text style={[styles.duration, { color: colorPalette.text }]}>
              {formatDuration(recordingDuration)}
            </Text>
          )}
        </TouchableOpacity>
      )}
      
      {/* Playback Controls - only show when we have audio and not recording */}
      {hasAudio && !isRecording && (
        <>
          <TouchableOpacity 
            onPress={onPlay}
            style={[styles.playbackButton, { backgroundColor: colorPalette.surface2 }]}
          >
            {isPlaying ? (
              <PauseIcon width={24} height={24} fill={colorPalette.icon.primary} />
            ) : (
              <PlayIcon width={24} height={24} fill={colorPalette.icon.primary} />
            )}
          </TouchableOpacity>
          

          
          <TouchableOpacity 
            onPress={onSave}
            style={[styles.playbackButton, { backgroundColor: colorPalette.button.bgInverted }]}
          >
            <GoArrowRightIcon width={24} height={24} fill={colorPalette.icon.inverted} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  recordIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
  },
  playbackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});