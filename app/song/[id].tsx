import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronDownIcon, ChevronLeftIcon, KebabIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { useSongs } from '../../context/songContext';

const Details = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { songs, updateSong } = useSongs();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    
    // Convert id to string for comparison and add logging
    console.log('URL ID:', id, 'Type:', typeof id);
    console.log('Available songs:', songs);
    
    const song = songs.find((song) => song.id.toString() === id?.toString());

    useEffect(() => {
        if (song) {
            setTitle(song.title || '');
            setContent(song.content || '');
        }
    }, [song]);

    const handleSave = async () => {
        if (song) {
            await updateSong(song.id, {
                title,
                content,
                modifiedDate: new Date()
            });
            router.back();
        }
    };

    if (!song) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-light-bg">
                <Text className="text-light-text-body">Song not found</Text>
                <Text className="text-light-text-secondary mt-2">ID: {id}</Text>
            </SafeAreaView>
        );
    }

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
                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-light-text text-lg font-semibold">Save</Text>
                </TouchableOpacity>
            </View>
            <TextInput 
                className="placeholder:text-light-text-placeholder text-3xl font-semibold pt-4 pl-6 pr-6 pb-3" 
                placeholder="Untitled"
                value={title} 
                onChangeText={setTitle}
            />
            <ScrollView className="pl-6 pr-6">
                <TextInput 
                    className="placeholder:text-light-text-placeholder text-xl font-medium" 
                    placeholder="I heard there was a secret chord..."
                    multiline={true}
                    textAlignVertical="top"
                    value={content}
                    onChangeText={setContent}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Details;