import DropdownOutlineDownIcon from '@/components/icons/DropdownOutlineDownIcon';
import DOMComponent from '@/components/RichTextEditor';
import { MusicalKey } from '@/constants/musicalKeys';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FolderDropdown } from '../components/FolderDropdown';
import { CloseIcon, KebabIcon } from '../components/icons';
import SongActionsModal from '../components/SongActionsModal';
import theme from '../constants/theme';
import { useSongs } from '../context/songContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../utils/theme';

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { theme: currentTheme } = useTheme();
    const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
    const classes = useThemeClasses();

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
                    <Text className={currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'} style={{ fontSize: 18, fontWeight: '600' }}>Save</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center pt-4 pl-6 pr-4 pb-1">
                <TextInput 
                    className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-3xl font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'}`}
                    placeholder="Untitled"
                    value={title} 
                    onChangeText={setTitle}
                />
                <TouchableOpacity onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <View style={{ transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }] }}>
                        <DropdownOutlineDownIcon width={28} height={28} fill={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder} />
                    </View>
                </TouchableOpacity>
            </View>
            {isDropdownOpen && (
                <View className={`mt-2 pt-3 ${currentTheme === 'dark' ? 'bg-dark-surface2' : 'bg-light-surface1'} border-y ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
                <View className="px-6 pb-4 flex-row items-center justify-between border-b" style={{ borderColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }}>
                    <Text className={classes.textSize('text-lg', 'placeholder')}>Attachments</Text>
                    <Text className={classes.textSize('text-lg')}>0</Text>  
                </View>
                <View className="px-6 flex-row justify-stretch items-center gap-4">
                    <View className="flex-row py-3 grow items-center justify-between">
                        <Text className={classes.textSize('text-lg', 'placeholder')}>Key</Text>  
                        <Text className={classes.textSize('text-lg')}>Cmaj</Text>  
                    </View>
                    <View className="w-[1px] h-full" style={{ backgroundColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }}></View>
                    <View className="flex-row py-4 grow items-center justify-between">
                        <Text className={currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'}>Tempo</Text>
                        <View className="flex-row gap-1">
                            <Text className={classes.textSize('text-lg')}>84</Text>  
                            <Text className={classes.textSize('text-lg', 'placeholder')}>BPM</Text>  
                        </View>
                    </View>
                </View>
            </View>
            )}
            <ScrollView className="px-6 pt-1">
                <TextInput 
                    className={`text-xl font-normal ${currentTheme === 'dark' ? 'text-dark-text placeholder:text-dark-text-placeholder' : 'text-light-text placeholder:text-light-text-placeholder'} ${currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}`}
                    placeholder="I heard there was a secret chord..."
                    multiline={true}
                    textAlignVertical="top"
                    value={content}
                    onChangeText={setContent}
                />
                <DOMComponent 
                    className="text-xl/9 font-normal"
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