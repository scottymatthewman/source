import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FolderDropdown } from '../../components/FolderDropdown';
import { CloseIcon, KebabIcon } from '../../components/icons';
import SongActionsModal from '../../components/SongActionsModal';
import theme from '../../constants/theme';
import { useSongs } from '../../context/songContext';

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
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const clearInputs = () => {
        setTitle("");
        setContent("");
        setSelectedFolderId(null);
    };

    const handleSave = async () => {
        try {
            const newSong = await createSong();
            if (newSong) {
                await updateSong(newSong.id, { 
                    title: title || 'Untitled',
                    content: content || '',
                    modifiedDate: new Date(),
                    folder_id: selectedFolderId
                });
                clearInputs();
                router.back();
            }
        } catch (error) {
            console.error('Error creating song:', error);
        }
    };

    const handleDiscard = () => {
        if (title || content || selectedFolderId) {
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
                    <FolderDropdown 
                        selectedFolderId={selectedFolderId}
                        onSelectFolder={setSelectedFolderId}
                    />
                    <TouchableOpacity onPress={() => setShowActions(true)}>
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