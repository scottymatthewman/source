import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import CloseIcon from '../icons/CloseIcon';
import PauseIcon from '../icons/PauseIcon';
import PlayIcon from '../icons/PlayIcon';
import StopIcon from '../icons/StopIcon';
import GoArrowRightIcon from '../icons/goArrowRightIcon';
import { AudioWaveform } from './AudioWaveform';

interface AudioControlsProps {
  // Recording state
  isRecording: boolean;
  onRecord: () => void;
  recordingDuration: number;
  audioLevel?: number; // 0-1 value representing current audio level
  
  // Playback state  
  hasAudio: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
  onDiscard: () => void; // Add discard/close functionality
  playbackProgress?: number; // 0-1 value representing playback progress
  playbackDuration?: number;
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
  audioLevel = 0,
  hasAudio,
  isPlaying,
  onPlay,
  onStop,
  onSave,
  onDiscard,
  playbackProgress = 0,
  playbackDuration = 0
}: AudioControlsProps) {
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  return (
    <View style={styles.container}>
      {/* Recording State */}
      {!hasAudio && (
        <>
          {/* Discard Button */}
          <TouchableOpacity 
            onPress={onDiscard}
            style={[styles.discardButton, { backgroundColor: colorPalette.surface2 }, { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }]}
          >
            <CloseIcon width={26} height={26} fill={colorPalette.icon.primary} />
          </TouchableOpacity>
          
          {/* Waveform */}
          <View style={styles.waveformContainer}>
            <AudioWaveform
              isRecording={isRecording}
              recordingDuration={recordingDuration}
              isPlaying={isPlaying}
              playbackProgress={playbackProgress}
              playbackDuration={playbackDuration}
              audioLevel={audioLevel}
              height={40}
            />
          </View>
          
          {/* Stop Button with Duration */}
          <TouchableOpacity 
            onPress={onRecord}
            style={[
              styles.stopButton,
              { backgroundColor: colorPalette.recordingRed },
              { width: 96, height: 44, borderRadius: 22, paddingRight: 20, alignItems: 'center', justifyContent: 'center' }
            ]}
          >
            {isRecording ? (
              <>
                <StopIcon width={24} height={24} fill={colorPalette.bg} />
                <Text style={[styles.duration, { color: colorPalette.bg }]}>
                  {formatDuration(recordingDuration)}
                </Text>
              </>
            ) : (
              <View style={[
                styles.recordIcon,
                { 
                  backgroundColor: colorPalette.bg,
                  borderColor: colorPalette.recordingRed
                }
              ]} />
            )}
          </TouchableOpacity>
        </>
      )}
      
      {/* Playback State */}
      {hasAudio && !isRecording && (
        <>
          {/* Close Button */}
          <TouchableOpacity 
            onPress={onDiscard}
            style={[styles.discardButton, { backgroundColor: colorPalette.surface2 }, { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }]}
          >
            <CloseIcon width={26} height={26} fill={colorPalette.icon.primary} />
          </TouchableOpacity>
          
          {/* Play/Pause Button */}
          <TouchableOpacity 
            onPress={onPlay}
            style={[styles.playbackButton, { backgroundColor: colorPalette.surface2 }, { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }]}
          >
            {isPlaying ? (
              <PauseIcon width={26} height={26} fill={colorPalette.icon.primary} />
            ) : (
              <PlayIcon width={26} height={26} fill={colorPalette.icon.primary} />
            )}
          </TouchableOpacity>
          
          {/* Waveform with Duration */}
          <View style={styles.waveformWithDuration}>
            <AudioWaveform
              isRecording={isRecording}
              recordingDuration={recordingDuration}
              isPlaying={isPlaying}
              playbackProgress={playbackProgress}
              playbackDuration={playbackDuration}
              audioLevel={audioLevel}
              height={40}
            />
            <Text style={[styles.duration, { color: colorPalette.text }]}>
              {formatDuration(playbackDuration)}
            </Text>
          </View>
          
          {/* Save Button */}
          <TouchableOpacity 
            onPress={onSave}
            style={[styles.saveButton, { backgroundColor: colorPalette.button.bgInverted }, { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }]}
          >
            <GoArrowRightIcon width={26} height={26} fill={colorPalette.icon.inverted} />
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
    gap: 16,
  },
  discardButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformWithDuration: {
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    minWidth: 80,
  },
  playbackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
});
