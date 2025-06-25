import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Keyboard, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecordingControls } from '../components/audio/RecordingControls';
import SaveClipModal from '../components/audio/SaveClipModal';
import { AddIcon, FolderIcon, MicIcon, NewFolderIcon, WriteIcon } from '../components/icons';
import MoonIcon from '../components/icons/MoonIcon';
import SunIcon from '../components/icons/SunIcon';
import ThumbIcon from '../components/icons/ThumbIcon';
import theme from '../constants/theme';
import { Folder, useFolders } from '../context/folderContext';
import { Song, useSongs } from '../context/songContext';
import { useTheme } from '../context/ThemeContext';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { useThemeClasses } from '../utils/theme';

const SongItem = ({ song }: { song: Song }) => {
  const router = useRouter();
  const classes = useThemeClasses();
  return (
    <TouchableOpacity 
      onPress={() => router.push({ pathname: '/song/[id]', params: { id: song.id } })}
      className={`px-6 py-4 border-b ${classes.border.border}`}
    >
      <Text className={classes.text.body} style={{ fontSize: 18 }}>
        {song.title || 'Untitled'}
      </Text>
    </TouchableOpacity>
  );
};

const FolderItem = ({ folder }: { folder: Folder }) => {
  const router = useRouter();
  const classes = useThemeClasses();
  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/folder/[id]', params: { id: folder.id } })}
      className={`px-6 py-4 border-b ${classes.border.border}`}
    >
      <Text className={classes.text.body} style={{ fontSize: 18 }}>
        {folder.title || 'Untitled Folder'}
      </Text>
    </TouchableOpacity>
  );
};

const CreateOverlay = ({ visible, onClose, onStartRecording, initialMode = 'menu' }: { visible: boolean; onClose: () => void; onStartRecording: () => void; initialMode?: 'menu' | 'folder' }) => {
  const router = useRouter();
  const { createFolder } = useFolders();
  const [isCreatingFolder, setIsCreatingFolder] = useState(initialMode === 'folder');
  const [folderName, setFolderName] = useState('');
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const { createSong } = useSongs();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setIsCreatingFolder(initialMode === 'folder');
      setFolderName('');
    }
  }, [visible, initialMode]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleNewSong = async () => {
    onClose();
    const song = await createSong();
    if (song && song.id) {
      router.push({ pathname: '/newSong', params: { songId: song.id } });
    } else {
      Alert.alert('Error', 'Failed to create new song');
    }
  };

  const handleNewFolder = () => {
    setIsCreatingFolder(true);
  };

  const handleCreateFolder = async () => {
    if (folderName.trim()) {
      await createFolder(folderName.trim());
      setFolderName('');
      setIsCreatingFolder(false);
      onClose();
    }
  };

  const handleRecord = () => {
    onClose();
    onStartRecording();
  };

  const handleCancel = () => {
    setFolderName('');
    setIsCreatingFolder(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable 
        className="flex-1 bg-black/70"
        onPress={handleCancel}
      >
        <View 
          className={`${classes.bg.main} rounded-2xl overflow-hidden`}
          style={[
            { 
              elevation: 5, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 3.84,
              position: 'absolute',
              left: 20,
              right: 20,
              bottom: isCreatingFolder ? keyboardHeight + 20 : 108,
              alignSelf: 'flex-start'
            }
          ]}
        >
          {!isCreatingFolder ? (
            <>
              <TouchableOpacity 
                onPress={handleNewSong}
                className={`px-5 py-4 flex-row items-center gap-2`}
              >
                <WriteIcon width={24} height={24} fill={colorPalette.icon.primary} />
                <Text className={`${classes.text.body} text-lg`}>New Song</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleNewFolder}
                className={`px-5 py-4 flex-row items-center gap-2`}
              >
                <NewFolderIcon width={24} height={24} fill={colorPalette.icon.primary} />
                <Text className={`${classes.text.body} text-lg`}>New Folder</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleRecord}
                className={`px-5 py-4 flex-row items-center gap-2`}
              >
                <MicIcon width={24} height={24} fill={colorPalette.icon.primary} />
                <Text className={`${classes.text.body} text-lg`}>Record</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className={`px-4 pt-5 pb-3 ${currentTheme === 'dark' ? theme.colors.dark.surface2 : theme.colors.light.surface1} rounded-lg`}>
              <View className="flex-row gap-0 items-left">
                <FolderIcon width={28} height={28} fill={colorPalette.textPlaceholder} />
                <TextInput 
                  className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-3xl px-2 pb-2 font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'}`}
                  placeholder="Folder name"
                  placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                  value={folderName}
                  onChangeText={setFolderName}
                  autoFocus
                />
              </View>
              <View className="flex-row justify-between w-full items-center h-10">
                <TouchableOpacity 
                  onPress={handleCancel}
                  className={`px-2 py-2 ${classes.button.bg} items-start justify-center rounded-lg w-1/2 h-10`}
                >
                  <Text className={`${classes.text.body} font-medium`} style={{ fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleCreateFolder}
                  className={`px-2 py-2 ${classes.button.bgInverted} items-end justify-center font-medium rounded-lg w-1/2 h-10`}
                  disabled={!folderName.trim()}
                >
                  <Text className={`${classes.text.body} font-medium`} style={{ fontSize: 14 }}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  recordingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default function Index() {
  const { songs, createSong } = useSongs();
  const { folders } = useFolders();
  const router = useRouter();
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [createOverlayMode, setCreateOverlayMode] = useState<'menu' | 'folder'>('menu');
  const [activeToggle, setActiveToggle] = useState<'files' | 'folders'>('folders');
  const { theme: currentTheme, toggleTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
  const { 
    startRecording, 
    stopRecording, 
    isRecording,
    isPlaying,
    duration,
    saveRecording,
    stopPlayback,
    playRecording,
    pauseRecording,
    audioUri, 
    cleanupRecording,
    setIsRecording
  } = useAudioRecording();
  const [showSaveClipModal, setShowSaveClipModal] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const RECORDING_PANEL_HEIGHT = 120;
  const RECORDING_PANEL_MARGIN = 24;
  const bottomSafeArea = insets.bottom;
  const shrunkHeight = windowHeight - (RECORDING_PANEL_HEIGHT + RECORDING_PANEL_MARGIN + 12);
  const heightAnim = useRef(new Animated.Value(-1)).current;
  const [clipTitle, setClipTitle] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    if (showRecordingControls) {
      Animated.timing(heightAnim, {
        toValue: shrunkHeight,
        duration: 350,
        useNativeDriver: false,
      }).start();
      if (!isRecording && !isPlaying) {
        startRecording();
      }
    } else {
      Animated.timing(heightAnim, {
        toValue: -1,
        duration: 350,
        useNativeDriver: false,
      }).start();
    }
  }, [showRecordingControls, shrunkHeight]);

  // When user taps Record in the create menu
  const handleStartRecording = () => {
    setShowCreateOverlay(false);
    setShowRecordingControls(true);
  };

  // When user closes the recording controls
  const handleCloseRecordingControls = () => {
    setShowRecordingControls(false);
    if (isRecording) {
      stopRecording();
    }
    if (isPlaying) {
      stopPlayback();
    }
    cleanupRecording();
  };

  // Animated style for main content
  const mainContentStyle = showRecordingControls
    ? { height: heightAnim }
    : { flex: 1 };

  // Show recorder UI if not idle
  const showRecorder = isRecording || isPlaying;

  // Sort and slice for recent songs
  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.date_modified!).getTime() - new Date(a.date_modified!).getTime())
    .slice(0, 8);

  // console.log('Available songs:', songs);

  const handleSaveClip = async (title: string, selectedSongIds: string[]) => {
    try {
      if (!audioUri) {
        console.error('No audio URI available to save');
        Alert.alert('Error', 'No recording available to save');
        return;
      }

      // Save the recording with the correct audioUri
      const clip = await saveRecording(title, audioUri);
      if (!clip) {
        console.error('Failed to save clip');
        cleanupRecording();
        return;
      }
      console.log('[handleSaveClip] new clip id:', clip.id);

      // Create relationships for each selected song
      for (const songId of selectedSongIds) {
        console.log('[handleSaveClip] Inserting into song_clip_rel: song_id=' + songId + ', clip_id=' + clip.id);
        try {
          await db.runAsync(
            'INSERT INTO song_clip_rel (song_id, clip_id) VALUES (?, ?)',
            [songId, clip.id]
          );
          console.log('[handleSaveClip] Successfully inserted into song_clip_rel: song_id=' + songId + ', clip_id=' + clip.id);
        } catch (e) {
          console.error('[handleSaveClip] Failed to insert into song_clip_rel:', e);
        }
      }

      // Clean up recording state and hide controls
      await cleanupRecording();
      setIsRecording(false);
      setShowSaveClipModal(false);
    } catch (error) {
      console.error('Error saving clip:', error);
      Alert.alert('Error', 'Failed to save clip');
      // Also clean up on error
      await cleanupRecording();
      setIsRecording(false);
    }
  };

  // Button and menu positions
  const CREATE_BUTTON_SIZE = 56;
  const CREATE_BUTTON_LEFT = 24;
  const MENU_GAP = 12;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.bg }}>
      {/* Recording Controls Panel */}
      <RecordingControls
        isRecording={isRecording}
        isPlaying={isPlaying}
        duration={duration}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onPlayRecording={playRecording}
        onPauseRecording={pauseRecording}
        onStopPlayback={stopPlayback}
        onSaveRecording={() => setShowSaveClipModal(true)}
        onCancelRecording={handleCloseRecordingControls}
        showControls={showRecordingControls}
      />

      {/* Main content: flex: 1 by default, animates to height when controls are shown */}
      <Animated.View
        style={{
          ...mainContentStyle,
          borderBottomLeftRadius: showRecordingControls ? 32 : 0,
          borderBottomRightRadius: showRecordingControls ? 32 : 0,
          overflow: 'hidden',
          backgroundColor: colorPalette.bg,
          shadowColor: showRecordingControls ? '#000' : 'transparent',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: showRecordingControls ? 0.12 : 0,
          shadowRadius: showRecordingControls ? 12 : 0,
          position: 'relative',
          zIndex: 1, // Main content above controls
        }}
      >
        <View className={`flex-row items-center justify-between px-6 pt-4 pb-3`}>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity onPress={() => setActiveToggle('folders')}>
              <Text className={`text-3xl font-semibold ${activeToggle === 'folders' ? (currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header') : (currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder')}`}>
                Folders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveToggle('files')}>
              <Text className={`text-3xl font-semibold ${activeToggle === 'files' ? (currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header') : (currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder')}`}>
                All Songs
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-1">  
            <TouchableOpacity onPress={toggleTheme}>
              {currentTheme === 'dark' ? 
                <MoonIcon width={24} height={24} fill={colorPalette.icon.primary} /> : 
                <SunIcon width={24} height={24} fill={colorPalette.icon.primary} />
              }
            </TouchableOpacity>
          </View>
          {/* <View className="flex-row items-center">
            <TouchableOpacity>
              <SettingsIcon width={28} height={28} color={colorPalette.icon.primary} />
            </TouchableOpacity> */}
          {/* </View> */}
        </View>
        
        {activeToggle === 'files' ? (
          <View className="pt-2 flex-1">
            <FlatList
              data={recentSongs}
              className="pl-4"
              key="songs-list"
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                onPress={() => router.push({ pathname: '/song/[id]', params: { id: item.id } })}
                  className={`pr-6 py-2 flex-row items-center`}
                >
                  <ThumbIcon width={24} height={24} fill={colorPalette.icon.tertiary} />
                  <Text className={`${classes.text.header} text-xl font-medium`}>{item.title || 'Untitled'}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center">
                  <TouchableOpacity 
                    onPress={async () => {
                      const song = await createSong();
                      if (song && song.id) {
                        router.push({ pathname: '/newSong', params: { songId: song.id } });
                      } else {
                        Alert.alert('Error', 'Failed to create new song');
                      }
                    }}
                    className={`${classes.bg.surface2} rounded-lg px-4 py-2 mt-4 w-200 items-center justify-center`}
                  > 
                    <Text className={`${classes.text.body} text-center text-lg`}>Write your first song</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        ) : (
          <View className="pt-2 flex-1 w-full">
            <FlatList
              data={folders}
              className="px-4"
              key="folders-list"
              numColumns={2}
              columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/folder/[id]', params: { id: item.id } })}
                  className={`p-4 rounded-3xl flex-row items-center`}
                  style={{ height: 140, width: '48%', backgroundColor: colorPalette.surface1, alignItems: 'flex-end' }}
                >
                  <Text className={`${classes.text.header} text-xl font-medium pl-1`}>{item.title || 'Untitled Folder'}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center"> 
                  <TouchableOpacity 
                    onPress={() => {
                      setCreateOverlayMode('folder');
                      setShowCreateOverlay(true);
                    }}
                    className={`${classes.bg.surface2} rounded-lg px-4 py-2 mt-4 w-200 items-center justify-center`}
                  > 
                    <Text className={`${classes.text.body} text-center text-lg`}>Create your first folder</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        )}
      </Animated.View>

      {/* Create Overlay */}
      <CreateOverlay
        visible={showCreateOverlay}
        onClose={() => setShowCreateOverlay(false)}
        onStartRecording={handleStartRecording}
        initialMode={createOverlayMode}
      />

      {/* Create Button (always fixed at bottom left, hidden when controls are open) */}
      {!showRecordingControls && (
        <TouchableOpacity 
          onPress={() => {
            setCreateOverlayMode('menu');
            setShowCreateOverlay((v) => !v);
          }}
          style={{
            position: 'absolute',
            left: CREATE_BUTTON_LEFT,
            bottom: bottomSafeArea,
            width: CREATE_BUTTON_SIZE,
            height: CREATE_BUTTON_SIZE,
            borderRadius: CREATE_BUTTON_SIZE / 2,
            backgroundColor: colorPalette.button.bgInverted,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex: 2,
          }}
        >
          <View style={showCreateOverlay ? { transform: [{ rotate: '45deg' }] } : undefined}>
            <AddIcon 
              width={28} 
              height={28} 
              fill={colorPalette.icon.inverted} 
            />
          </View>
        </TouchableOpacity>
      )}

      <SaveClipModal
        visible={showSaveClipModal}
        onClose={() => setShowSaveClipModal(false)}
        onSave={handleSaveClip}
        songs={songs}
        mode="index"
      />
    </SafeAreaView>
  );
}
