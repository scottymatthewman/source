import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  duration: number;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function RecordButton({ isRecording, onPress, duration }: RecordButtonProps) {
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: colorPalette.surface2 },
        isRecording && { backgroundColor: colorPalette.recordingRed }
      ]}
    >
      <View style={[
        styles.recordIcon,
        { 
          backgroundColor: isRecording ? colorPalette.bg : colorPalette.recordingRed,
          borderColor: colorPalette.bg
        }
      ]} />
      
      {isRecording && (
        <Text style={[styles.duration, { color: colorPalette.text }]}>
          {formatDuration(duration)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
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
});
