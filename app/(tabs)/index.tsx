import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AddIcon, SearchIcon } from '../../components/icons';
import MoonIcon from '../../components/icons/MoonIcon';
import SunIcon from '../../components/icons/SunIcon';
import theme from '../../constants/theme';
import { Folder, useFolders } from '../../context/folderContext';
import { Song, useSongs } from '../../context/songContext';
import { useTheme } from '../../context/ThemeContext';
import { useThemeClasses } from '../../utils/theme';

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

const CreateOverlay = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const router = useRouter();
  const { createFolder } = useFolders();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

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
          className={`${classes.bg.main} rounded-2xl w-[280px] overflow-hidden`}
          style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}
        >
          {!isCreatingFolder ? (
            <>
              <TouchableOpacity 
                onPress={handleNewSong}
                className={`px-6 py-4 border-b ${classes.border.border}`}
              >
                <Text className={`${classes.text.body} text-lg`}>New Song</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleNewFolder}
                className="px-6 py-4"
              >
                <Text className={`${classes.text.body} text-lg`}>New Folder</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="p-4">
              <Text className={`${classes.text.body} text-lg mb-4`}>Create New Folder</Text>
              <TextInput
                className={`${classes.bg.surface1} ${classes.text.body} rounded-lg px-4 py-3 mb-4`}
                placeholder="Folder name"
                placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                value={folderName}
                onChangeText={setFolderName}
                autoFocus
              />
              <View className="flex-row justify-end gap-2">
                <TouchableOpacity 
                  onPress={handleCancel}
                  className="px-4 py-2"
                >
                  <Text className={classes.text.body}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleCreateFolder}
                  className={`px-4 py-2 ${classes.bg.surface1} rounded-lg`}
                  disabled={!folderName.trim()}
                >
                  <Text className={classes.text.body}>Create</Text>
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
  const { theme: currentTheme, toggleTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  // Sort and slice for recent songs
  const recentSongs = [...songs]
    .sort((a, b) => new Date(b.date_modified!).getTime() - new Date(a.date_modified!).getTime())
    .slice(0, 8);

  // console.log('Available songs:', songs);

  return (
    <SafeAreaView className={`${classes.bg.main} flex-1`}>
      <View className="flex-row items-center justify-between px-6 pt-4 pb-3">
        <View className="flex-row items-center">
          <Text className={classes.text.header} style={{ fontSize: 32, fontWeight: 'bold' }}>
            Home
          </Text>
          <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: 12 }}>
            {currentTheme === 'dark' ? 
              <MoonIcon width={24} height={24} fill={colorPalette.icon.primary} /> : 
              <SunIcon width={24} height={24} fill={colorPalette.icon.primary} />
            }
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <SearchIcon width={24} height={24} fill={colorPalette.icon.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCreateOverlay(true)}>
            <AddIcon width={24} height={24} fill={colorPalette.icon.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View className="flex-row items-bottom justify-between px-6 pt-4 pb-2">
        <Text className={`${classes.text.placeholder} text-base font-semibold pb-1`}>
            Recent Songs
          </Text>
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
              className={`mr-4 ${classes.bg.surface2} rounded-xl p-4 w-48 h-32 flex-col justify-end`}
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
        <Text className={`${classes.text.placeholder} text-base font-medium px-6 pt-6 pb-1`}>
          Folders
        </Text>
        <FlatList
          data={folders}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <TouchableOpacity
              onPress={() => router.push('/allSongs')}
              className={`px-6 py-2`}
            >
              <Text className={`${classes.text.header} text-lg font-medium`}>All Songs</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/folder/[id]', params: { id: item.id } })}
              className={`px-6 py-2 ${classes.border.border}`}
            >
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
      />
    </SafeAreaView>
  );
}
