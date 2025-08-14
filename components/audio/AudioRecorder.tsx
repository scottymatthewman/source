import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { Clip, useClips } from '../../context/clipContext';
import { useSongs } from '../../context/songContext';
import { useAudioPlayback } from '../../hooks/useAudioPlayback';
import { useAudioRecording } from '../../hooks/useAudioRecording';
import { CloseIcon } from '../icons';
import { AudioControls } from './AudioControls';
import SaveClipModal from './SaveClipModal';

interface AudioRecorderProps {
  mode?: 'index' | 'songDetail';
  currentSongId?: string;
  onClose?: () => void;
  onTemporaryClipAdded?: (clip: Clip) => void; // New callback for temporary clips
  autoStart?: boolean; // Auto-start recording when component mounts
}

export function AudioRecorder({ 
  mode = 'index', 
  currentSongId, 
  onClose,
  onTemporaryClipAdded,
  autoStart = false
}: AudioRecorderProps) {
  const { state, startRecording, stopRecording, duration, resetRecording } = useAudioRecording();
  const { isPlaying, play, pause, stop } = useAudioPlayback(state.audioUri);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { createClip } = useClips();
  const { songs } = useSongs();
  const db = useSQLiteContext();
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
  const hasAutoStarted = useRef(false);

  // Auto-start recording if requested (only once)
  useEffect(() => {
    if (autoStart && state.state === 'idle' && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      startRecording();
    }
  }, [autoStart, state.state, startRecording]);

  const handleRecordPress = () => {
    if (state.state === 'recording') {
      stopRecording();
    } else if (state.state === 'idle') {
      startRecording();
    }
    // Ignore presses during other states (like error)
  };

  const handlePlayPress = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSaveClip = async (title: string, selectedSongIds: string[]) => {
    if (!state.audioUri) {
      Alert.alert('Error', 'No recording available to save');
      return;
    }

    try {
      const clip = await createClip(state.audioUri, title, duration);
      if (!clip) {
        Alert.alert('Error', 'Failed to create clip');
        return;
      }

      // If we're in song detail mode and the current song is selected, add it as a temporary clip
      if (mode === 'songDetail' && currentSongId && selectedSongIds.includes(currentSongId)) {
        // Call the callback to add the clip to the temporary state
        onTemporaryClipAdded?.(clip);
      }

      // Create permanent relationships for other selected songs (not the current song if in song detail mode)
      const songsToSave = mode === 'songDetail' && currentSongId 
        ? selectedSongIds.filter(id => id !== currentSongId)
        : selectedSongIds;

      for (const songId of songsToSave) {
        try {
          await db.runAsync(
            'INSERT INTO song_clip_rel (song_id, clip_id) VALUES (?, ?)',
            [songId, clip.id]
          );
        } catch (e) {
          console.error('Failed to insert into song_clip_rel:', e);
        }
      }

      setShowSaveModal(false);
      onClose?.();
    } catch (error) {
      console.error('Error saving clip:', error);
      Alert.alert('Error', 'Failed to save clip');
    }
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Recording',
      'Are you sure you want to discard this recording? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            resetRecording();
            onClose?.();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colorPalette.surface1 }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorPalette.text }]}>
          {state.state === 'recording' ? 'Recording...' : 
           state.audioUri ? 'Record' : 'Ready to Record'}
        </Text>
        <TouchableOpacity onPress={handleDiscard} style={styles.closeButton}>
          <CloseIcon width={20} height={20} fill={colorPalette.icon.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <AudioControls
          isRecording={state.state === 'recording'}
          onRecord={handleRecordPress}
          recordingDuration={duration}
          hasAudio={!!state.audioUri}
          isPlaying={isPlaying}
          onPlay={handlePlayPress}
          onStop={stop}
          onSave={() => setShowSaveModal(true)}
        />
      </View>

      {state.error && (
        <Text style={[styles.error, { color: colorPalette.text }]}>
          {state.error}
        </Text>
      )}
      
      <SaveClipModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveClip}
        songs={songs}
        mode={mode}
        currentSongId={currentSongId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: theme.colors.light.border,
    borderStyle: 'solid',
    height: 144,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
