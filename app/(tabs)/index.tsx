import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddIcon, SearchIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { Folder, useFolders } from '../../context/folderContext';
import { Song, useSongs } from '../../context/songContext';

const SongItem = ({ song }: { song: Song }) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      onPress={() => router.push({ pathname: '/song/[id]', params: { id: song.id } })}
      className="px-6 py-4 border-b border-light-surface-2"
    >
      <Text className="text-light-text-body text-lg">{song.title || 'Untitled'}</Text>
    </TouchableOpacity>
  );
};

const FolderItem = ({ folder }: { folder: Folder }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/folder/[id]', params: { id: folder.id } })}
      className="px-6 py-4 border-b border-light-surface-2"
    >
      <Text className="text-light-text-body text-lg">{folder.title || 'Untitled Folder'}</Text>
    </TouchableOpacity>
  );
};

const CreateOverlay = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const router = useRouter();
  const { createFolder } = useFolders();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

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
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={handleCancel}
      >
        <View 
          className="bg-light-bg rounded-2xl w-[280px] overflow-hidden"
          style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
        >
          {!isCreatingFolder ? (
            <>
              <TouchableOpacity 
                onPress={handleNewSong}
                className="px-6 py-4 border-b border-light-surface-2"
              >
                <Text className="text-light-text-body text-lg">New Song</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleNewFolder}
                className="px-6 py-4"
              >
                <Text className="text-light-text-body text-lg">New Folder</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="p-4">
              <Text className="text-light-text-body text-lg mb-4">Create New Folder</Text>
              <TextInput
                className="bg-light-surface-2 rounded-lg px-4 py-3 mb-4 text-light-text-body"
                placeholder="Folder name"
                placeholderTextColor={theme.colors.light.textPlaceholder}
                value={folderName}
                onChangeText={setFolderName}
                autoFocus
              />
              <View className="flex-row justify-end gap-2">
                <TouchableOpacity 
                  onPress={handleCancel}
                  className="px-4 py-2"
                >
                  <Text className="text-light-text-body">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleCreateFolder}
                  className="px-4 py-2 bg-light-surface-2 rounded-lg"
                  disabled={!folderName.trim()}
                >
                  <Text className="text-light-text-body">Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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

  // Sort and slice for recent songs
  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.date_modified!).getTime() - new Date(a.date_modified!).getTime())
    .slice(0, 8);

  // console.log('Available songs:', songs);

  return (
    <SafeAreaView className="flex-1 bg-light-bg">
      <View className="flex-row items-center justify-between px-6 pt-4 pb-3">
        <Text className="text-3xl text-light-text-header font-semibold">Home</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <SearchIcon width={24} height={24} fill={theme.colors.light.icon.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCreateOverlay(true)}>
            <AddIcon width={24} height={24} fill={theme.colors.light.icon.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View className="flex-row items-bottom justify-between pr-6 pt-4 pb-2">
          <Text className="text-light-text-placeholder text-md font-semibold px-6 pb-2">Recent</Text>
          <TouchableOpacity onPress={() => router.push('/allSongs')}>
            <Text className="text-light-text-secondary text-md font-semibold">View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentSongs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 18 }}
          className="pb-5"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/song/[id]', params: { id: item.id } })}
              className="mr-4 bg-light-surface-2 rounded-xl p-4 w-48 h-32 flex-col justify-end"
            >
              <Text className="text-lg font-semibold text-light-text-header mt-auto" numberOfLines={2}>
                {item.title || 'Untitled'}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-light-text-secondary px-6">No recent songs.</Text>
          }
        />
        <Text className="text-light-text-placeholder text-md font-semibold px-6 pt-6 pb-1">Folders</Text>
      <FlatList
          data={folders}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <TouchableOpacity
              onPress={() => router.push('/allSongs')}
              className="px-6 py-4 border-b border-light-surface-2"
            >
              <Text className="text-light-text-body text-lg">All Songs</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/folder/[id]', params: { id: item.id } })}
              className="px-6 py-4 border-b border-light-surface-2"
            >
              <Text className="text-light-text-body text-lg">{item.title || 'Untitled Folder'}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-light-text-secondary px-6">No folders yet.</Text>
          }
        />
      </View>
      <CreateOverlay 
        visible={showCreateOverlay} 
        onClose={() => setShowCreateOverlay(false)} 
      />
    </SafeAreaView>
  );
}
