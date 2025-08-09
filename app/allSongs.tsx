import { ChevronLeftIcon } from '@/components/icons';
import theme from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useSongs } from '../context/songContext';
import { useTheme } from '../context/ThemeContext';

export default function AllSongs() {
  const { songs } = useSongs();
  const router = useRouter();
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
      <View className={`flex-row pl-6 pr-6 pt-4 pb-3 items-center justify-between border-b ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeftIcon width={28} height={28} fill={colorPalette.icon.primary} />
        </TouchableOpacity>
        <View className="flex-1 mx-2">
          <Text className={`text-2xl font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'} text-left`}>All Songs</Text>
        </View>
      </View>
      <FlatList
        data={songs}
        keyExtractor={item => item.id}
        className={`px-2 pt-4`}
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
            No songs found.
          </Text>
        }
      />
    </SafeAreaView>
  );
}