import DropdownOutlineDownIcon from '@/components/icons/DropdownOutlineDownIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FolderDropdown } from '../../components/FolderDropdown';
import { ChevronLeftIcon, KebabIcon } from '../../components/icons';
import SongActionsModal from '../../components/SongActionsModal';
import { MusicalKey } from '../../constants/musicalKeys';
import theme from '../../constants/theme';
import { useSongs } from '../../context/songContext';
import { useTheme } from '../../context/ThemeContext';
import { useThemeClasses } from '../../utils/theme';

const Details = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { songs, updateSong, deleteSong, createSong } = useSongs();
    const { theme: currentTheme } = useTheme();
    const classes = useThemeClasses();
    const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [selectedKey, setSelectedKey] = useState<MusicalKey | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Convert id to string for comparison and add logging
    console.log('URL ID:', id, 'Type:', typeof id);
    console.log('Available songs:', songs);
    
    const song = songs.find((song) => song.id.toString() === id?.toString());

    useEffect(() => {
        if (song) {
            setTitle(song.title || '');
            setContent(song.content || '');
            setSelectedFolderId(song.folder_id);
            setSelectedKey(song.key);
            setHasUnsavedChanges(false);
        }
    }, [song]);

    useEffect(() => {
        if (song) {
            const hasChanges = 
                title !== (song.title || '') || 
                content !== (song.content || '') ||
                selectedFolderId !== song.folder_id ||
                selectedKey !== song.key;
            setHasUnsavedChanges(hasChanges);
        }
    }, [title, content, selectedFolderId, selectedKey, song]);

    const handleSave = async () => {
        if (song) {
            await updateSong(song.id, {
                title,
                content,
                date_modified: new Date(),
                folder_id: selectedFolderId,
                key: selectedKey
            });
            setHasUnsavedChanges(false);
            router.back();
        }
    };

    const handleBack = () => {
        if (hasUnsavedChanges) {
            Alert.alert(
                "Unsaved Changes",
                "Do you want to save your changes before leaving?",
                [
                    {
                        text: "Don't Save",
                        style: "destructive",
                        onPress: () => router.back()
                    },
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Save",
                        onPress: handleSave
                    }
                ]
            );
        } else {
            router.back();
        }
    };

    const handleSetKey = () => { 
        // TODO: Implement key selection
        setShowActions(false); 
    };

    const handleMakeCopy = () => {
        if (!song) return;
        setShowActions(false);
        router.push({
            pathname: '/newSong',
            params: {
                title: `Copy of ${song.title || 'Untitled'}`,
                content: song.content || '',
                folder_id: song.folder_id || '',
            },
        });
    };

    const handleDelete = () => {
        if (!song) return;
        Alert.alert(
            "Delete Song",
            "Are you sure you want to delete this song? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteSong(song.id);
                        router.replace('/');
                    }
                }
            ]
        );
        setShowActions(false);
    };

    if (!song) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
                <Text className={currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}>Song not found</Text>
                <Text className={currentTheme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'} style={{ marginTop: 8 }}>ID: {id}</Text>
            </SafeAreaView>
        );
    }

    return (
        <>
            <SafeAreaView className={`flex-1 items-left justify-left ${currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
                <View className="flex-row pl-6 pr-6 pt-4 pb-1 items-center justify-between">
                    <TouchableOpacity onPress={handleBack}>
                        <ChevronLeftIcon width={28} height={28} fill={colorPalette.icon.primary} />
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
                <View className="flex-row justify-between items-center pt-4 pl-6 pr-4 pb-3">
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
                    <View className={`pt-3 ${currentTheme === 'dark' ? 'bg-dark-surface2' : 'bg-light-surface1'} border-y ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
                        <View className="px-6 pb-4 flex-row items-center justify-between border-b" style={{ borderColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }}>
                            <Text className={currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'}>Attachments</Text>
                            <Text className={currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}>6</Text>
                        </View>
                        <View className="px-6 flex-row justify-stretch items-center gap-4">
                            <View className="flex-row py-3 grow items-center justify-between">
                                <Text className={currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'}>Key</Text>
                                <Text className={currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}>C Major</Text>
                            </View>
                            <View className="w-[1px] h-full" style={{ backgroundColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }}></View>
                            <View className="flex-row py-4 grow items-center justify-between">
                                <Text className={currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'}>BPM</Text>
                                <Text className={currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}>120</Text>
                            </View>
                        </View>
                    </View>
                )}
                <ScrollView className="px-6 pt-2">
                    <TextInput 
                        className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-xl/9 font-normal ${currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}`}
                        placeholder="I heard there was a secret chord..."
                        multiline={true}
                        textAlignVertical="top"
                        value={content}
                        onChangeText={setContent}
                    />
                </ScrollView>
            </SafeAreaView>

            <SongActionsModal
                visible={showActions}
                onClose={() => setShowActions(false)}
                selectedKey={selectedKey}
                onSelectKey={setSelectedKey}
                onMakeCopy={handleMakeCopy}
                onDelete={handleDelete}
            />
        </>
    );
};

export default Details;