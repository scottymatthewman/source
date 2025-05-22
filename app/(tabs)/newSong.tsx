import { MusicalKey } from '@/constants/musicalKeys';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FolderDropdown } from '../../components/FolderDropdown';
import { CloseIcon, KebabIcon } from '../../components/icons';
import SongActionsModal from '../../components/SongActionsModal';
import theme from '../../constants/theme';
import { useSongs } from '../../context/songContext';
import { useTheme } from '../../context/ThemeContext';

const NewSong = () => {
    const { createSong, updateSong } = useSongs();
    const params = useLocalSearchParams();
    const [title, setTitle] = useState(params.title ? String(params.title) : "");
    const [content, setContent] = useState(params.content ? String(params.content) : "");
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
        params.folder_id ? String(params.folder_id) : null
    );
    const router = useRouter();
    const [showActions, setShowActions] = useState(false);
    const [selectedKey, setSelectedKey] = useState<MusicalKey | null>(null);
    const { theme: currentTheme } = useTheme();
    const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

    const clearInputs = () => {
        setTitle("");
        setContent("");
        setSelectedFolderId(null);
        setSelectedKey(null);
    };

    const handleSave = async () => {
        try {
            const newSong = await createSong();
            if (newSong) {
                await updateSong(newSong.id, { 
                    title: title || 'Untitled',
                    content: content || '',
                    date_modified: new Date(),
                    folder_id: selectedFolderId,
                    key: selectedKey
                });
                clearInputs();
                router.back();
            }
        } catch (error) {
            console.error('Error creating song:', error);
        }
    };

    const handleDiscard = () => {
        if (title || content || selectedFolderId || selectedKey) {
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
        <SafeAreaView className={`flex-1 items-left justify-left ${currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
            <View className="flex-row pl-6 pr-6 pt-4 pb-1 items-center justify-between">
                <TouchableOpacity onPress={handleDiscard}>
                    <CloseIcon width={28} height={28} fill={colorPalette.icon.primary} />
                </TouchableOpacity>
                <View className="flex-row items-center gap-2">
                    <FolderDropdown 
                        selectedFolderId={selectedFolderId}
                        onSelectFolder={setSelectedFolderId}
                    />
                    <TouchableOpacity onPress={() => setShowActions(true)}>
                        <KebabIcon width={28} height={28} fill={colorPalette.icon.secondary} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleSave}>
                    <Text className={currentTheme === 'dark' ? 'text-dark-text' : 'text-light-text'} style={{ fontSize: 18, fontWeight: '600' }}>Save</Text>
                </TouchableOpacity>
            </View>
            <TextInput 
                className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-3xl font-semibold pt-4 pl-6 pr-6 pb-3 ${currentTheme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
                placeholder="Untitled"
                value={title} 
                onChangeText={setTitle}
            />
            <ScrollView className="pl-6 pr-6">
                <TextInput 
                    className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-xl font-medium ${currentTheme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
                    placeholder="I heard there was a secret chord..."
                    multiline={true}
                    textAlignVertical="top"
                    value={content}
                    onChangeText={setContent}
                />
            </ScrollView>
            <SongActionsModal
                visible={showActions}
                onClose={() => setShowActions(false)}
                selectedKey={selectedKey}
                onSelectKey={setSelectedKey}
                mode="keyOnly"
            />
        </SafeAreaView>
    );
};

export default NewSong;