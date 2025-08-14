import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { Clip, useClips } from '../../context/clipContext';
import { useSongs } from '../../context/songContext';
import { useAudioPlayback } from '../../hooks/useAudioPlayback';
import { useAudioRecording } from '../../hooks/useAudioRecording';
import { CloseIcon } from '../icons';
import { PlaybackControls } from './PlaybackControls';
import { RecordButton } from './RecordButton';
import SaveClipModal from './SaveClipModal';

interface AudioRecorderProps {
  mode?: 'index' | 'songDetail';
  currentSongId?: string;
  onClose?: () => void;
  onTemporaryClipAdded?: (clip: Clip) => void; // New callback for temporary clips
}

export function AudioRecorder({ 
  mode = 'index', 
  currentSongId, 
  onClose,
  onTemporaryClipAdded 
}: AudioRecorderProps) {
  const { state, startRecording, stopRecording, duration, resetRecording } = useAudioRecording();
  const { isPlaying, play, pause, stop } = useAudioPlayback(state.audioUri);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { createClip } = useClips();
  const { songs } = useSongs();
  const db = useSQLiteContext();
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  const handleRecordPress = () => {
    if (state.state === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
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
    <View style={[styles.container, { backgroundColor: colorPalette.surface2 }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colorPalette.text }]}>
          {state.state === 'recording' ? 'Recording...' : 
           state.audioUri ? 'Recording Complete' : 'Ready to Record'}
        </Text>
        <TouchableOpacity onPress={handleDiscard} style={styles.closeButton}>
          <CloseIcon width={20} height={20} fill={colorPalette.icon.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <RecordButton 
          isRecording={state.state === 'recording'}
          onPress={handleRecordPress}
          duration={duration}
        />
        
        {state.audioUri && (
          <PlaybackControls
            isPlaying={isPlaying}
            onPlay={handlePlayPress}
            onStop={stop}
            onSave={() => setShowSaveModal(true)}
          />
        )}
      </View>

      {state.error && (
        <Text style={[styles.error, { color: colorPalette.error }]}>
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
    padding: 16,
    borderRadius: 16,
    margin: 16,
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
