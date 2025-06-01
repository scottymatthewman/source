import NoteIcon from '@/components/icons/NoteIcon';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Modal, Platform, Pressable, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAudioRecorder } from '../components/audio/useAudioRecorder';
import { AddIcon, ChevronLeftIcon, FolderIcon, MicIcon, NewFolderIcon, PlayIcon, WriteIcon } from '../components/icons';
import GoArrowRightIcon from '../components/icons/goArrowRightIcon';
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

const CreateOverlay = ({ visible, onClose, onStartRecording }: { visible: boolean; onClose: () => void; onStartRecording: () => void }) => {
  const router = useRouter();
  const { createFolder } = useFolders();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  useEffect(() => {
    if (!visible) return;

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [visible]);

  const handleNewSong = () => {
    onClose();
    router.push('/newSong');
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
        className="flex-1 bg-black/70 justify-end items-start"
        style={{ paddingBottom: isCreatingFolder ? keyboardHeight + 16 : 108, paddingLeft: 22, paddingRight: 22 }}
        onPress={handleCancel}
      >
        <View 
          className={`${classes.bg.main} rounded-2xl overflow-hidden`}
          style={[
            { elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
            isCreatingFolder ? { width: '100%', alignSelf: 'center' } : { width: 210 }
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

const SaveClipModal = ({ 
  visible, 
  onClose, 
  onSave,
  songs,
}: { 
  visible: boolean; 
  onClose: () => void; 
  onSave: (title: string, selectedSongIds: string[]) => void;
  songs: Song[];
}) => {
  const router = useRouter();
  const [clipTitle, setClipTitle] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  useEffect(() => {
    if (!visible) return;

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [visible]);

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const handleSave = () => {
    if (clipTitle.trim()) {
      onSave(clipTitle.trim(), selectedSongs);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/70 justify-end items-start"
        style={{ paddingLeft: 22, paddingRight: 22, paddingBottom: 32 }}
        onPress={onClose}
      >
        <View 
          className={`${classes.bg.main} rounded-2xl overflow-hidden w-full`}
          style={{ 
            elevation: 5, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 3.84,
            height: '75%'
          }}
        >
          <View className="p-4 flex-1">
            <View className="flex-row gap-0 items-center justify-between w-full">
              <TouchableOpacity onPress={onClose}>
                <ChevronLeftIcon width={24} height={24} fill={colorPalette.icon.primary} />
              </TouchableOpacity>
              <TextInput 
                className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-3xl px-2 pb-2 font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'}`}
                style={{ flex: 1 }}
                placeholder="Clip title"
                placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                value={clipTitle}
                onChangeText={setClipTitle}
                autoFocus
              />
              <TouchableOpacity
                onPress={handleSave}
                disabled={!clipTitle.trim()}
                className={`flex-row py-3 rounded-lg ${classes.button.bgInverted} items-center justify-end`}
              >
                <Text className={`${classes.text.body} font-medium`}>Save</Text>
              </TouchableOpacity>
            </View>
            
            {/* Song Selection */}
            <View className="flex-1 mt-4">
              <FlatList
                data={songs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleSongSelection(item.id)}
                    className={`px-4 py-3 flex-row items-center justify-between ${classes.bg.surface1} rounded-lg mb-2`}
                  >
                    <Text className={`${classes.text.body} text-lg`}>{item.title || 'Untitled'}</Text>
                    {selectedSongs.includes(item.id) && (
                      <View style={{ 
                        width: 20, 
                        height: 20, 
                        backgroundColor: colorPalette.button.bgInverted,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Text style={{ color: colorPalette.textInverted }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default function Index() {
  const { songs } = useSongs();
  const { folders } = useFolders();
  const router = useRouter();
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const { theme: currentTheme, toggleTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
  const {
    state: recorderState,
    duration,
    waveform,
    startRecording,
    stopRecording,
    saveRecording,
    reset: resetRecorder,
  } = useAudioRecorder();
  const [showSaveClipModal, setShowSaveClipModal] = useState(false);

  // Show recorder UI if not idle
  const showRecorder = recorderState !== 'idle';

  // Sort and slice for recent songs
  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.date_modified!).getTime() - new Date(a.date_modified!).getTime())
    .slice(0, 8);

  // console.log('Available songs:', songs);

  const handleSaveClip = async (title: string, selectedSongIds: string[]) => {
    try {
      // Always close the UI first
      setShowSaveClipModal(false);

      const clip = await saveRecording(title);
      if (!clip) {
        console.error('Failed to save clip');
        resetRecorder();
        return;
      }

      // TODO: Create song-clip relationships
      resetRecorder();
    } catch (error) {
      console.error('Error saving clip:', error);
      resetRecorder();
    }
  };

  return (
    <SafeAreaView className={`${classes.bg.main} flex-1`}>
      <View className="flex-row items-center justify-between px-6 pt-4 pb-3">
        <View className="flex-row items-center">
          <Text className={classes.text.header} style={{ fontSize: 32, fontWeight: 'bold' }}>
            Home
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: 12 }}>
            {currentTheme === 'dark' ? 
              <MoonIcon width={24} height={24} fill={colorPalette.icon.primary} /> : 
              <SunIcon width={24} height={24} fill={colorPalette.icon.primary} />
            }
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View className="flex-row items-bottom justify-between pl-5 pr-6 pt-4 pb-2">
          <View className="flex-row items-center justify start gap-1">
            <NoteIcon width={22} height={22} fill={colorPalette.textPlaceholder} />
            <Text className={`${classes.text.placeholder} text-base font-semibold pb-1`}>
                Recent Songs
              </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/allSongs')}>
            <Text className={`${classes.text.header} text-base font-semibold`}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentSongs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 18, }}
          className="pb-2"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/song/[id]', params: { id: item.id } })}
              className={`mr-4 ${classes.bg.surface1} rounded-xl px-4 py-3 w-40 h-28 flex-col justify-end`}
            >
              <Text className={`text-lg font-semibold ${classes.text.header} mt-auto`} numberOfLines={2}>
                {item.title || 'Untitled'}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className={`${classes.text.placeholder} px-1`}>No recent songs.</Text>
          }
        />
        <View className="flex-row items-center justify-start gap-1 pl-5 pr-6 pt-6 pb-1">
          <FolderIcon width={22} height={22} fill={colorPalette.textPlaceholder} />
          <Text className={`${classes.text.placeholder} text-base font-medium`}>
            Folders
          </Text>
        </View>
        <FlatList
          data={folders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/folder/[id]', params: { id: item.id } })}
              className={`pr-6 py-2 flex-row items-center`}
            >
              <ThumbIcon width={24} height={24} fill={colorPalette.icon.tertiary} />
              <Text className={`${classes.text.header} text-lg font-medium`}>{item.title || 'Untitled Folder'}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className={`${classes.text.placeholder} px-6`}>No folders yet.</Text>
          }
        />
      </View>
      <CreateOverlay 
        visible={showCreateOverlay} 
        onClose={() => setShowCreateOverlay(false)} 
        onStartRecording={() => startRecording()}
      />

      {/* Bottom bar with create/close button, waveform, and stop button */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 36,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1000,
        }}
      >
        {/* Create/Close Button (always visible) */}
        <TouchableOpacity
          onPress={recorderState === 'idle' ? () => setShowCreateOverlay(true) : resetRecorder}
          style={{
            backgroundColor: colorPalette.button.bgInverted,
            borderRadius: 9999,
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: recorderState === 'idle' ? '0deg' : '45deg' }],
          }}
        >
          <AddIcon width={28} height={28} fill={colorPalette.icon.inverted} />
        </TouchableOpacity>

        {/* Only show waveform and stop/next button when recording or stopped */}
        {(recorderState === 'recording' || recorderState === 'stopped') && (
          <>
            {/* Waveform placeholder (with PlayIcon if stopped) */}
            <View style={{
              flex: 1,
              height: 56,
              paddingLeft: 12,
              backgroundColor: colorPalette.button.bgInverted,
              marginHorizontal: 8,
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderRadius: 40,
              flexDirection: 'row',
            }}>
              {recorderState === 'recording' ? (
                <Text style={{ color: colorPalette.textInverted }}>
                  Recording...
                </Text>
              ) : (
                <PlayIcon width={32} height={32} fill={colorPalette.icon.inverted} />
              )}
            </View>
            {/* Stop button */}
            {recorderState === 'recording' ? (
              <TouchableOpacity
                onPress={stopRecording}
                style={{ 
                  height: 56, 
                  width: 56, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  backgroundColor: colorPalette.button.bgInverted,
                  borderRadius: 40 
                }}
              >
                <View style={{ width: 14, height: 14, backgroundColor: colorPalette.icon.inverted, borderRadius: 1 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setShowSaveClipModal(true)}
                style={{ 
                  height: 56, 
                  width: 56, 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  backgroundColor: colorPalette.button.bgInverted,
                  borderRadius: 40 
                }}
              >
                <GoArrowRightIcon width={28} height={28} fill={colorPalette.icon.inverted} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <CreateOverlay 
        visible={showCreateOverlay} 
        onClose={() => setShowCreateOverlay(false)} 
        onStartRecording={() => startRecording()}
      />

      <SaveClipModal
        visible={showSaveClipModal}
        onClose={() => setShowSaveClipModal(false)}
        onSave={handleSaveClip}
        songs={songs}
      />
    </SafeAreaView>
  );
}
