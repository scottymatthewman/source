import React from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { AddIcon, SearchIcon } from '../../components/icons';
import theme from '../../constants/theme';


export default function Index() {
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
          data={[]}
          renderItem={({item}) => null}
          keyExtractor={(item, index) => index.toString()}
        />
    </SafeAreaView>
  );
}
