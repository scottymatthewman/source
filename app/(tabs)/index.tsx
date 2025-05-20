import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { AddIcon, SearchIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { Song, useSongs } from '../../context/songContext';

const SongItem = ({ song }: { song: Song }) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      onPress={() => router.push(`/song/${song.id}`)}
      className="px-6 py-4 border-b border-light-surface-2"
    >
      <Text className="text-light-text-body text-lg">{song.title || 'Untitled'}</Text>
    </TouchableOpacity>
  );
};

export default function Index() {
  const { songs } = useSongs();
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-light-bg">
      <View className="flex-row items-center justify-between px-6 pt-4 pb-3">
        <Text className="text-3xl text-light-text-header font-semibold">Home</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <SearchIcon width={24} height={24} fill={theme.colors.light.icon.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/newSong')}>
            <AddIcon width={24} height={24} fill={theme.colors.light.icon.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        className="flex-1"
        data={songs}
        renderItem={({ item }) => <SongItem song={item} />}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
