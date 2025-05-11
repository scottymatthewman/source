import React from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <SafeAreaView className="flex-col items-left justify-center bg-light-bg">
      <View className="flex-row grow items-center justify-between pl-6 pr-6 pt-3 pb-3">
        <Text className="grow text-3xl text-light-text-header font-semibold">Home</Text>
        <View className="flex-row shrink items-center gap-4">
          <TouchableOpacity className="">
            <Text className="text-light-icon-primary">Search-ic</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-light-icon-primary">New-ic</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="flex-1 bg-light-bg">
        <FlatList
          data={[]}
          renderItem={({item}) => null}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
