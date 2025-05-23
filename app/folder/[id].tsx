import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, KebabIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { useFolders } from '../../context/folderContext';
import { useSongs } from '../../context/songContext';
import { useTheme } from '../../context/ThemeContext';

export default function FolderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { folders, updateFolder } = useFolders();
  const { songs } = useSongs();
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  const folder = folders.find(f => f.id.toString() === id?.toString());
  const [title, setTitle] = useState(folder?.title || '');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTitle(folder?.title || '');
  }, [folder]);

  const handleTitleSave = () => {
    if (folder && title !== folder.title) {
      updateFolder(folder.id, { title });
    }
    setEditing(false);
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
      <View className={`flex-row pl-6 pr-6 pt-4 pb-3 items-center justify-between border-b ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon width={28} height={28} fill={colorPalette.icon.primary} />
        </TouchableOpacity>
        <View className="flex-1 mx-2">
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
        <TouchableOpacity>
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
            className={`px-6 py-2`}
          >
            <Text className={currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'} style={{ fontSize: 16, fontWeight: '500' }}>
              {item.title || 'Untitled'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className={currentTheme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'} style={{ textAlign: 'center', marginTop: 32 }}>
            No songs in this folder.
          </Text>
        }
      />
    </SafeAreaView>
  );
}