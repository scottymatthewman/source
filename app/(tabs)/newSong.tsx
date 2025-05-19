import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronDownIcon, CloseIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { db } from '../../lib/db';
import { insertSong } from '../../lib/queries';

const NewSong = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = async () => {
        console.log('Save button pressed');
        console.log('Title:', title);
        console.log('Content:', content);
        if (!title.trim() || !content.trim()) {
            Alert.alert('Error', 'Please fill in title and content');
            return;
        }
        await insertSong(db, { title, content });
        console.log('Song inserted successfully');
        Alert.alert('Success', 'Song created successfully');
    };

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
                />
            </ScrollView>
        </SafeAreaView>
    );
}

export default NewSong;