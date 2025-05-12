import React from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronDownIcon, CloseIcon } from '../../components/icons';
import theme from '../../constants/theme';

const NewSong = () => {
    return (
        <SafeAreaView className="flex-1 items-left justify-left bg-light-bg">
            <View className="flex-row pl-6 pr-6 pt-4 pb-1 items-center justify-between">
                <TouchableOpacity>
                    <CloseIcon width={28} height={28} fill={theme.colors.light.icon.primary} />
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity className="flex-row items-center gap-1 pt-1 pb-1 pl-3.5 pr-1.5 bg-light-surface-2 rounded-full">
                        <Text className="text-light-text">Folder</Text>
                        <ChevronDownIcon width={20} height={20} fill={theme.colors.light.icon.secondary} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text className="text-light-text text-lg font-semibold">Save</Text>
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