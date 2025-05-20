import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronDownIcon, CloseIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { useSongs } from '../../context/songContext';

const NewSong = () => {
    const { createSong, updateSong } = useSongs();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const router = useRouter();

    const clearInputs = () => {
        setTitle("");
        setContent("");
    };

    const handleSave = async () => {
        try {
            const newSong = await createSong();
            if (newSong) {
                await updateSong(newSong.id, { 
                    title: title || 'Untitled',
                    content: content || '',
                    modifiedDate: new Date()
                });
                clearInputs();
                router.back();
            }
        } catch (error) {
            console.error('Error creating song:', error);
        }
    };

    const handleDiscard = () => {
        if (title || content) {
            Alert.alert(
                "Discard Changes?",
                "Are you sure you want to discard your changes?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Discard",
                        style: "destructive",
                        onPress: () => {
                            clearInputs();
                            router.back();
                        }
                    }
                ]
            );
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView className="flex-1 items-left justify-left bg-light-bg">
            <View className="flex-row pl-6 pr-6 pt-4 pb-1 items-center justify-between">
                <TouchableOpacity onPress={handleDiscard}>
                    <CloseIcon width={28} height={28} fill={theme.colors.light.icon.primary} />
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity className="flex-row items-center gap-1 pt-1 pb-1 pl-3.5 pr-1.5 bg-light-surface-2 rounded-full">
                        <Text className="text-light-text">Folder</Text>
                        <ChevronDownIcon width={20} height={20} fill={theme.colors.light.icon.secondary} />
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
                    value={content} 
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default NewSong;