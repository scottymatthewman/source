import { ChevronLeftIcon } from '@/components/icons';
import theme from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSongs } from '../context/songContext';

export default function AllSongs() {
  const { songs } = useSongs();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-light-bg">
      <View className="flex-row pl-6 pr-6 pt-4 pb-1 items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon width={28} height={28} fill={theme.colors.light.icon.primary} />
        </TouchableOpacity>
        <View className="flex-1 mx-2">
          <TextInput
            value="All Songs"
            className="text-2xl font-semibold text-light-text-header text-left"
          />
        </View>
      </View>
      <FlatList
        data={songs}
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
          <Text className="text-light-text-secondary text-center mt-8">No songs found.</Text>
        }
      />
    </SafeAreaView>
  );
}
