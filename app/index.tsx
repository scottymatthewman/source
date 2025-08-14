import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioRecorder } from '../components/audio/AudioRecorder';
import { AddIcon, FolderIcon, MicIcon, NewFolderIcon, WriteIcon } from '../components/icons';
import MoonIcon from '../components/icons/MoonIcon';
import SunIcon from '../components/icons/SunIcon';
import ThumbIcon from '../components/icons/ThumbIcon';
import theme from '../constants/theme';
import { Folder, useFolders } from '../context/folderContext';
import { Song, useSongs } from '../context/songContext';
import { useTheme } from '../context/ThemeContext';
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
        className="flex-1 bg-black/30"
        onPress={handleCancel}
      >
        <View 
          className={`${classes.bg.main} rounded-3xl overflow-hidden`}
          style={[
            { 
              backgroundColor: colorPalette.surface1,
              elevation: 5, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.25, 
              shadowRadius: 3.84,
              position: 'absolute',
              bottom: isCreatingFolder ? keyboardHeight + 20 : 108,
              // Expand to full width when creating folder, otherwise use fixed width
              ...(isCreatingFolder ? {
                left: 20,
                right: 20,
                width: undefined,
              } : {
                left: 20,
                right: 20,
                width: 240,
                alignSelf: 'flex-start'
              })
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
            <View className={`px-4 pt-5 pb-3 ${currentTheme === 'dark' ? theme.colors.dark.surface2 : theme.colors.light.surface2} rounded-lg`}>
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
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();

  // When user taps Record in the create menu
  const handleStartRecording = () => {
    setShowCreateOverlay(false);
    setShowRecorder(true);
  };

  // Sort and slice for recent songs
  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.date_modified!).getTime() - new Date(a.date_modified!).getTime())
    .slice(0, 8);

  // console.log('Available songs:', songs);



  // Button and menu positions
  const CREATE_BUTTON_SIZE = 56;
  const CREATE_BUTTON_LEFT = 24;
  const MENU_GAP = 12;

  return (
    <View style={{ flex: 1, backgroundColor: colorPalette.bg }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.bg }}>
        {/* Main content */}
        <View style={{ flex: 1, backgroundColor: colorPalette.bg }}>
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
            {/* Settings Icon for when we want it */}
            {/* <View className="flex-row items-center">
              <TouchableOpacity>
                <SettingsIcon width={28} height={28} color={colorPalette.icon.primary} />
              </TouchableOpacity> */}
            {/* </View> */}
          </View>
          
          {activeToggle === 'folders' ? (
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
                    className={`rounded-2xl px-4 py-2 mt-4 w-200 items-center justify-center`}
                    style={{
                      backgroundColor: colorPalette.surface2,
                    }}
                  > 
                    <Text className={`${classes.text.body} text-center text-lg font-medium`}>Create your first folder</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
          ) : (
            <View className="pt-2 flex-1">
              <FlatList
                data={recentSongs}
                className="px-4"
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
                      className={`rounded-2xl px-4 py-2 mt-4 w-200 items-center justify-center`}
                      style={{
                        backgroundColor: colorPalette.surface2,
                      }}
                    > 
                      <Text className={`${classes.text.body} text-center text-lg font-medium`}>Write your first song</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            </View>
          )}
        </View>

        {/* Create Overlay */}
        <CreateOverlay
          visible={showCreateOverlay}
          onClose={() => setShowCreateOverlay(false)}
          onStartRecording={handleStartRecording}
          initialMode={createOverlayMode}
        />

        {/* Create Button */}
        <TouchableOpacity 
          onPress={() => {
            setCreateOverlayMode('menu');
            setShowCreateOverlay((v) => !v);
          }}
          style={{
            position: 'absolute',
            left: CREATE_BUTTON_LEFT,
            bottom: insets.bottom,
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
      </SafeAreaView>

      {/* Audio Recorder - positioned outside SafeAreaView to extend to bottom */}
      {showRecorder && (
        <AudioRecorder
          mode="index"
          onClose={() => setShowRecorder(false)}
          autoStart={true}
        />
      )}
    </View>
  );
}
