import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { AddIcon, SearchIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { db } from '../../lib/db';
import { getAllFiles } from '../../lib/queries';

type File = {
  id: number;
  title: string;
  content: string;
  date_created: number;
  date_edited: number;
};
export default function Index() {
  const [files, setFiles] = useState<File[]>([]);

  const fetchFiles = useCallback(async () => {
    try {
      const result = await getAllFiles(db);
      console.log('Result from getAllFiles:', result);
      if (Array.isArray(result)) {
        const formattedResult = result.map(file => ({
          ...file,
          id: Number(file.id),
          title: file.title || '',
          content: file.content || '',
          date_created: Number(file.date_created),
          date_edited: Number(file.date_edited),
        }));
        setFiles(formattedResult as File[]);
      } else {
        console.error('Unexpected result:', result);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFiles();
    }, [fetchFiles])
  );

  return (
    <SafeAreaView className="flex-col items-left justify-center bg-light-bg">
      <View className="flex-row grow items-center justify-between pl-6 pr-6 pt-4 pb-3">
        <Text className="grow text-3xl text-light-text-header font-semibold">Home</Text>
        <View className="flex-row shrink items-center gap-4">
          <TouchableOpacity className="">
            <SearchIcon width={24} height={24} fill={theme.colors.light.icon.primary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <AddIcon width={24} height={24} fill={theme.colors.light.icon.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList className="flex-1"
        data={files}
        renderItem={({item}) => (
          <View className="p-4 border-b border-light-border">
            <Text className="text-lg">{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
