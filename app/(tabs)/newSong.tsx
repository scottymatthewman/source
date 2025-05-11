import React from 'react'
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

const NewSong = () => {
    return (
        <SafeAreaView className="flex-1 items-left justify-left bg-light-bg">
            <View className="flex-row pl-6 pr-6 pt-3 pb-1 items-center justify-between">
                <TouchableOpacity>
                    <Text className="text-light-icon-primary">Back-ic</Text>
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity className="flex-row items-center gap-2 px-3 py-2 bg-light-surface-2 rounded-full">
                        <Text className="text-light-text">Folder</Text>
                        <Text className="text-light-text">dropdown-ic</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-2 py-2 rounded-full">
                        <Text className="text-light-text">kebab-ic</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text className="text-light-icon-primary text-lg font-semibold">Save</Text>
                </TouchableOpacity>
            </View>
            <TextInput className="placeholder:text-light-text-placeholder text-3xl font-semibold pt-4 pl-6 pr-6 pb-3" placeholder="Untitled" />
            <ScrollView className="pl-6 pr-6">
              <TextInput className="placeholder:text-light-text-placeholder text-xl font-medium" placeholder="I heard there was a secret chord..." />
            </ScrollView>
        </SafeAreaView>
    )
}
export default NewSong