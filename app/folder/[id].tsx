import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, KebabIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { useFolders } from '../../context/folderContext';
import { useSongs } from '../../context/songContext';

export default function FolderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { folders, updateFolder } = useFolders();
  const { songs } = useSongs();

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
      <SafeAreaView className="flex-1 items-center justify-center bg-light-bg">
        <Text className="text-light-text-body">Folder not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-light-bg">
      <View className="flex-row pl-6 pr-6 pt-4 pb-1 items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon width={28} height={28} fill={theme.colors.light.icon.primary} />
        </TouchableOpacity>
        <View className="flex-1 mx-2">
          <TextInput
            value={title}
            onChangeText={setTitle}
            onBlur={handleTitleSave}
            editable={true}
            className="text-2xl font-semibold text-light-text-header text-left"
            onFocus={() => setEditing(true)}
            selectTextOnFocus
          />
        </View>
        <TouchableOpacity>
          <KebabIcon width={28} height={28} fill={theme.colors.light.icon.secondary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={songsInFolder}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/song/[id]', params: { id: item.id } })}
            className="px-6 py-4 border-b border-light-surface-2"
          >
            <Text className="text-light-text-body text-lg">{item.title || 'Untitled'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-light-text-secondary text-center mt-8">No songs in this folder.</Text>
        }
      />
    </SafeAreaView>
  );
}