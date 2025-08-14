import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import PauseIcon from '../icons/PauseIcon';
import PlayIcon from '../icons/PlayIcon';
import StopIcon from '../icons/StopIcon';
import GoArrowRightIcon from '../icons/goArrowRightIcon';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
}

export function PlaybackControls({ isPlaying, onPlay, onStop, onSave }: PlaybackControlsProps) {
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={onPlay}
        style={[styles.button, { backgroundColor: colorPalette.surface2 }]}
      >
        {isPlaying ? (
          <PauseIcon width={24} height={24} fill={colorPalette.icon.primary} />
        ) : (
          <PlayIcon width={24} height={24} fill={colorPalette.icon.primary} />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onStop}
        style={[styles.button, { backgroundColor: colorPalette.surface2 }]}
      >
        <StopIcon width={24} height={24} fill={colorPalette.icon.primary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onSave}
        style={[styles.button, { backgroundColor: colorPalette.button.bgInverted }]}
      >
        <GoArrowRightIcon width={24} height={24} fill={colorPalette.icon.inverted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
