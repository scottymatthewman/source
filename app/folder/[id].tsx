import ThumbIcon from '@/components/icons/ThumbIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, LayoutRectangle, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FolderActionsModal from '../../components/FolderActionsModal';
import { ChevronLeftIcon, GoIcon, KebabIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { useFolders } from '../../context/folderContext';
import { useSongs } from '../../context/songContext';
import { useTheme } from '../../context/ThemeContext';

export default function FolderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { folders, updateFolder, deleteFolder, createFolder } = useFolders();
  const { songs, deleteSong, updateSong } = useSongs();
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  const folder = folders.find(f => f.id.toString() === id?.toString());
  const [title, setTitle] = useState(folder?.title || '');
  const [editing, setEditing] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
  const buttonRef = useRef<View>(null);

  useEffect(() => {
    setTitle(folder?.title || '');
  }, [folder]);

  const handleTitleSave = () => {
    if (folder && title !== folder.title) {
      updateFolder(folder.id, { title });
    }
    setEditing(false);
  };

  const handleMakeCopy = async () => {
    if (folder) {
      const newTitle = `${folder.title} (Copy)`;
      await createFolder(newTitle);
    }
  };

  const handleDelete = async () => {
    if (folder) {
      await deleteFolder(folder.id);
      router.back();
    }
  };

  const handleEmptyAndDelete = async () => {
    if (folder) {
      // Remove folder_id from all songs in the folder (set to null)
      const songsInFolder = songs.filter(song => song.folder_id === folder.id);
      for (const song of songsInFolder) {
        await updateSong(song.id, { folder_id: null });
      }
      // Then delete the folder
      await deleteFolder(folder.id);
      router.back();
    }
  };

  const handleKebabPress = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        setButtonLayout({ x: pageX, y: pageY, width, height });
        setShowActionsModal(true);
      });
    }
  };

  const songsInFolder = songs.filter(song => song.folder_id === folder?.id);

  if (!folder) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
        <Text className={currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}>Folder not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <View className={`flex-row pl-6 pr-6 pt-4 pb-3 items-start justify-between gap-2 border-b ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon width={28} height={28} fill={colorPalette.icon.primary} />
        </TouchableOpacity>
        <View className="flex-row items-center justify-start gap-2 w-full flex-1">
          <TextInput
            value={title}
            onChangeText={setTitle}
            onBlur={handleTitleSave}
            editable={true}
            className={`text-2xl font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'} text-left`}
            onFocus={() => setEditing(true)}
            selectTextOnFocus
          />
        </View>
        <TouchableOpacity ref={buttonRef} onPress={handleKebabPress}>
          <KebabIcon width={28} height={28} fill={colorPalette.icon.secondary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={songsInFolder}
        keyExtractor={item => item.id}
        className={`px-2 py-4`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/song/[id]', params: { id: item.id } })}
              className={`pl-4 pr-5 py-2 flex-row items-center justify-between`}
            >
              <View className="flex-row items-center">
                <ThumbIcon width={24} height={24} fill={colorPalette.icon.tertiary} />
                <Text className={`${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'} text-xl font-medium`}>{item.title || 'Untitled'}</Text>
              </View>
              <GoIcon width={24} height={24} fill={colorPalette.icon.secondary} />
            </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className={currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} style={{ textAlign: 'center', marginTop: 32 }}>
            No songs in this folder.
          </Text>
        }
      />
      <FolderActionsModal
        visible={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        onMakeCopy={handleMakeCopy}
        onDelete={handleDelete}
        onEmptyAndDelete={handleEmptyAndDelete}
        buttonLayout={buttonLayout}
      />
    </SafeAreaView>
  );
}