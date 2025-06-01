import ClipIcon from '@/components/icons/ClipIcon';
import DropdownOutlineDownIcon from '@/components/icons/DropdownOutlineDownIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView as RNScrollView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SaveClipModal from '../../components/audio/SaveClipModal';
import { useAudioRecorder } from '../../components/audio/useAudioRecorder';
import { ClipListModal } from '../../components/ClipListModal';
import { FolderDropdown } from '../../components/FolderDropdown';
import { AddIcon, ChevronLeftIcon, KebabIcon, MicIcon, PlayIcon } from '../../components/icons';
import GoArrowRightIcon from '../../components/icons/goArrowRightIcon';
import SongActionsModal from '../../components/SongActionsModal';
import { MUSICAL_KEYS, MusicalKey } from '../../constants/musicalKeys';
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
    const [showKeyPicker, setShowKeyPicker] = useState(false);
    const db = useSQLiteContext();
    const [clipCount, setClipCount] = useState(0);
    const [showRecorder, setShowRecorder] = useState(false);
    const [showSaveClipModal, setShowSaveClipModal] = useState(false);
    const {
        state: recorderState,
        duration,
        waveform,
        startRecording,
        stopRecording,
        saveRecording,
        reset: resetRecorder,
    } = useAudioRecorder();
    const [isClipsModalVisible, setIsClipsModalVisible] = useState(false);
    
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

    useEffect(() => {
        if (!song) return;
        let isMounted = true;
        db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM song_clip_rel WHERE song_id = ?',
            [song.id]
        ).then(result => {
            if (isMounted && result) setClipCount(result.count);
        });
        return () => { isMounted = false; };
    }, [song, db]);

    // Start recording when modal opens
    useEffect(() => {
        if (showRecorder && recorderState === 'idle') {
            startRecording();
        }
        // Only reset if we're explicitly closing the recorder and not in the middle of saving
        if (!showRecorder && recorderState !== 'idle' && !showSaveClipModal) {
            resetRecorder();
        }
    }, [showRecorder, recorderState, showSaveClipModal]);

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

    const handleStopRecording = () => {
        stopRecording();
        // Don't hide the recorder UI immediately
        // setShowRecorder(false);
    };

    const handleSaveClip = async (title: string, selectedSongIds: string[]) => {
        if (!song) return;
        
        // Always close the UI first
        setShowSaveClipModal(false);
        setShowRecorder(false);
        
        try {
            const clip = await saveRecording(title);
            if (!clip) {
                console.error('Failed to save clip');
                resetRecorder(); // Reset the recorder state first
                cleanupRecording();
                return;
            }

            // Create song-clip relationships for selected songs
            for (const songId of selectedSongIds) {
                await db.runAsync(
                    'INSERT INTO song_clip_rel (song_id, clip_id) VALUES (?, ?)',
                    [songId, clip.id]
                );
            }

            // Update clip count
            const result = await db.getFirstAsync<{ count: number }>(
                'SELECT COUNT(*) as count FROM song_clip_rel WHERE song_id = ?',
                [song.id]
            );
            if (result) setClipCount(result.count);

            // Reset the recorder state first, then clean up
            resetRecorder();
            cleanupRecording();
        } catch (error) {
            console.error('Error saving clip:', error);
            // If save fails, reset the recorder state first, then clean up
            resetRecorder();
            cleanupRecording();
        }
    };

    const cleanupRecording = () => {
        if (recorderState === 'recording') {
            stopRecording();
        }
        setShowRecorder(false);
        resetRecorder();
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
                        onPress: () => {
                            cleanupRecording();
                            router.back();
                        }
                    },
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Save",
                        onPress: async () => {
                            await handleSave();
                            cleanupRecording();
                        }
                    }
                ]
            );
        } else {
            cleanupRecording();
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
                        <Text className={`${currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'} text-[17px] font-semibold`}>Save</Text>
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
                        <View className="px-6 pb-3 flex-row items-center justify-between border-b" style={{ borderColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }}>
                            <Text className={classes.textSize('text-lg', 'placeholder')}>Attachments</Text>
                            <View className="flex-row gap-4">
                                <TouchableOpacity className="flex-row items-center gap-1 h-9 pl-1 pr-2 rounded-lg" onPress={() => setShowRecorder(true)}>
                                    <MicIcon width={24} height={24} fill={colorPalette.icon.primary} />
                                    <Text className={classes.textSize('text-lg font-medium')}>Record</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className="flex-row items-center gap-1 h-9 pl-1 pr-2.5 rounded-lg" 
                                    style={{ backgroundColor: colorPalette.surface1 }}
                                    onPress={() => setIsClipsModalVisible(true)}
                                >
                                    <ClipIcon width={28} height={28} fill={colorPalette.icon.primary} />
                                    <Text className={classes.textSize('text-lg font-medium')}>{clipCount}</Text>  
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="px-6 flex-row justify-stretch items-center gap-4">
                            <View className="flex-row py-3 grow items-center justify-between">
                                <Text className={classes.textSize('text-lg', 'placeholder')}>Key</Text>  
                                <TouchableOpacity
                                    className="flex-row items-center justify-center gap-1 h-9 rounded-lg w-12"
                                    style={{ backgroundColor: colorPalette.surface1 }}
                                    onPress={() => setShowKeyPicker((v) => !v)}
                                >
                                    <Text className={classes.textSize('text-lg font-medium')}>
                                        {selectedKey || 'Key'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="w-[1px] h-full" style={{ backgroundColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }}></View>
                            <View className="flex-row py-4 grow items-center justify-between">
                                <Text className={currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'}>Tempo</Text>
                                <View className="flex-row gap-1">
                                    <Text className={classes.textSize('text-lg')}>120</Text>  
                                    <Text className={classes.textSize('text-lg', 'placeholder')}>BPM</Text>  
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                {showKeyPicker && (
                    <View className={`px-6 py-2 ${currentTheme === 'dark' ? 'bg-dark-surface-1' : 'bg-light-surface-1'}`}>
                        <RNScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 0 }}
                        >
                            {MUSICAL_KEYS.map((key) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => {
                                        setSelectedKey(key);
                                        setShowKeyPicker(false);
                                    }}
                                    className={`px-4 py-2 mr-2 rounded-lg ${
                                        selectedKey === key
                                            ? currentTheme === 'dark'
                                                ? 'bg-dark-surface-inverted'
                                                : 'bg-light-surface-inverted'
                                            : currentTheme === 'dark'
                                            ? 'bg-dark-surface1'
                                            : 'bg-light-surface1'
                                    }`}
                                >
                                    <Text
                                        className={`text-lg font-medium ${
                                            selectedKey === key
                                                ? currentTheme === 'dark'
                                                    ? 'text-dark-text-inverted'
                                                    : 'text-light-text-inverted'
                                                : currentTheme === 'dark'
                                                ? 'text-light-text-inverted'
                                                : 'text-dark-text-inverted'
                                        }`}
                                    >
                                        {key}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </RNScrollView>
                    </View>
                )}
                <ScrollView className="px-6 pt-1">
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

            {/* <Modal visible={showRecorder} transparent animationType="fade" onRequestClose={() => setShowRecorder(false)}>
                <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={() => setShowRecorder(false)}>
                    <View className="bg-white dark:bg-dark-bg rounded-2xl p-6 w-11/12 items-center">
                        <Text className="text-lg font-semibold mb-4">Recording...</Text>
                        <View className="h-12 w-full bg-gray-200 dark:bg-dark-surface1 rounded mb-4" />
                        <TouchableOpacity className="bg-red-600 rounded-full px-6 py-3" onPress={handleStopRecording}>
                            <Text className="text-white text-lg font-bold">Stop</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="absolute top-4 right-4" onPress={() => setShowRecorder(false)}>
                            <Text className="text-lg">✕</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal> */}

            {/* Bottom bar with create/close button, waveform, and stop button */}
            <View
                style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 36,
                paddingHorizontal: 24,
                flexDirection: 'row',
                alignItems: 'center',
                zIndex: 1000,
                }}
            >
                {/* Close Button (only visible during recording/stopped) */}
                {(recorderState === 'recording' || recorderState === 'stopped') && (
                    <TouchableOpacity
                        onPress={cleanupRecording}
                        style={{
                            backgroundColor: colorPalette.button.bgInverted,
                            borderRadius: 9999,
                            width: 56,
                            height: 56,
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: [{ rotate: '45deg' }],
                        }}
                    >
                        <AddIcon width={28} height={28} fill={colorPalette.icon.inverted} />
                    </TouchableOpacity>
                )}

                {/* Only show waveform and stop/next button when recording or stopped */}
                {(recorderState === 'recording' || recorderState === 'stopped') && (
                <>
                    {/* Waveform placeholder (with PlayIcon if stopped) */}
                    <View style={{
                    flex: 1,
                    height: 56,
                    paddingLeft: 12,
                    backgroundColor: colorPalette.button.bgInverted,
                    marginHorizontal: 8,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    borderRadius: 40,
                    flexDirection: 'row',
                    }}>
                    {recorderState === 'recording' ? (
                        <Text style={{ color: colorPalette.textInverted }}>
                        Recording...
                        </Text>
                    ) : (
                        <PlayIcon width={32} height={32} fill={colorPalette.icon.inverted} />
                    )}
                    </View>
                    {/* Stop button */}
                    {recorderState === 'recording' ? (
                    <TouchableOpacity
                        onPress={stopRecording}
                        style={{ 
                        height: 56, 
                        width: 56, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        backgroundColor: colorPalette.button.bgInverted,
                        borderRadius: 40 
                        }}
                    >
                        <View style={{ width: 14, height: 14, backgroundColor: colorPalette.icon.inverted, borderRadius: 1 }} />
                    </TouchableOpacity>
                    ) : (
                    <TouchableOpacity
                        onPress={() => setShowSaveClipModal(true)}
                        style={{ 
                        height: 56, 
                        width: 56, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        backgroundColor: colorPalette.button.bgInverted,
                        borderRadius: 40 
                        }}
                    >
                        <GoArrowRightIcon width={28} height={28} fill={colorPalette.icon.inverted} />
                    </TouchableOpacity>
                    )}
                </>
                )}
            </View>

            <SaveClipModal
                visible={showSaveClipModal}
                onClose={() => setShowSaveClipModal(false)}
                onSave={handleSaveClip}
                songs={songs}
            />

            <ClipListModal 
                visible={isClipsModalVisible}
                onClose={() => setIsClipsModalVisible(false)}
                title="Song Clips"
                clips={[]}
            />
        </>
    );
};

export default Details;