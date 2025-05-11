import React from 'react';
import { FlatList, Text, View } from "react-native";


export default function Index() {
  return (
    <View className="flex-1 items-left justify-left p-6 bg-light-bg">
      <Text className="text-3xl text-light-text-header font-semibold">Files</Text>
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
