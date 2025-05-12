import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronDownIcon, ChevronLeftIcon, KebabIcon } from '../../components/icons';
import theme from '../../constants/theme';

const Details = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [title, setTitle] = useState("Song Title");
    const [lyrics, setLyrics] = useState("Song lyrics will appear here...");

    return (
        <SafeAreaView className="flex-1 items-left justify-left bg-light-bg">
            <View className="flex-row pl-6 pr-6 pt-4 pb-1 items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <ChevronLeftIcon width={28} height={28} fill={theme.colors.light.icon.primary} />
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity className="flex-row items-center gap-1 pt-1 pb-1 pl-3 pr-2 bg-light-surface-2 rounded-full">
                        <Text className="text-light-text">Folder</Text>
                        <ChevronDownIcon width={20} height={20} fill={theme.colors.light.icon.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center rounded-full">
                        <KebabIcon width={28} height={28} fill={theme.colors.light.icon.secondary} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text className="text-light-text text-lg font-semibold">Save</Text>
                </TouchableOpacity>
            </View>
            <TextInput 
                className="placeholder:text-light-text-placeholder text-3xl font-semibold pt-4 pl-6 pr-6 pb-3" 
                value={title} 
                onChangeText={setTitle}
            />
            <ScrollView className="pl-6 pr-6">
                <TextInput 
                    className="placeholder:text-light-text-placeholder text-xl font-medium" 
                    multiline={true}
                    value={lyrics}
                    onChangeText={setLyrics}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Details;