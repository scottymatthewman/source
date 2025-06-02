import DropdownOutlineDownIcon from '@/components/icons/DropdownOutlineDownIcon';
import DOMComponent from '@/components/RichTextEditor';
import { MUSICAL_KEYS, MusicalKey } from '@/constants/musicalKeys';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SaveClipModal from '../components/audio/SaveClipModal';
import { useAudioRecorder } from '../components/audio/useAudioRecorder';
import { ClipListModal } from '../components/ClipListModal';
import { FolderDropdown } from '../components/FolderDropdown';
import { AddIcon, CloseIcon, KebabIcon, MicIcon, PlayIcon } from '../components/icons';
import ClipIcon from '../components/icons/ClipIcon';
import GoArrowRightIcon from '../components/icons/goArrowRightIcon';
import SongActionsModal from '../components/SongActionsModal';
import theme from '../constants/theme';
import { useSongs } from '../context/songContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../utils/theme';

const NewSong = () => {
    const { createSong, updateSong, songs } = useSongs();
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
    const [showKeyPicker, setShowKeyPicker] = useState(false);
    const { theme: currentTheme } = useTheme();
    const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
    const classes = useThemeClasses();
    const [showRecorder, setShowRecorder] = useState(false);
    const [showSaveClipModal, setShowSaveClipModal] = useState(false);
    const [isClipsModalVisible, setIsClipsModalVisible] = useState(false);
    const [clipCount, setClipCount] = useState(0);
    const {
        state: recorderState,
        duration,
        waveform,
        startRecording,
        stopRecording,
        saveRecording,
        reset: resetRecorder,
    } = useAudioRecorder();
    const [pendingClipId, setPendingClipId] = useState<string | null>(null);
    const db = useSQLiteContext();

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

                // If we have a pending clip, associate it with the new song
                if (pendingClipId) {
                    await db.runAsync(
                        'INSERT INTO song_clip_rel (song_id, clip_id) VALUES (?, ?)',
                        [newSong.id, pendingClipId]
                    );
                    setPendingClipId(null);
                }

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

    const handleSaveClip = async (title: string, selectedSongIds: string[]) => {
        try {
            const clip = await saveRecording(title);
            if (!clip) {
                console.error('Failed to save clip');
                resetRecorder();
                cleanupRecording();
                return;
            }

            // Store the clip ID to be associated with the song after it's created
            const pendingClipId = clip.id;

            // Only close the UI after successful save
            setShowSaveClipModal(false);
            setShowRecorder(false);
            resetRecorder();
            cleanupRecording();

            // If we have a pending clip, we'll need to associate it with the song after it's created
            if (pendingClipId) {
                // Store the clip ID in state or context to be used after song creation
                // This will be handled when the song is saved
                setPendingClipId(pendingClipId);
            }
        } catch (error) {
            console.error('Error saving clip:', error);
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
                    <ScrollView
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
                    </ScrollView>
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

            <SongActionsModal
                visible={showActions}
                onClose={() => setShowActions(false)}
                selectedKey={selectedKey}
                onSelectKey={setSelectedKey}
                mode="keyOnly"
            />

            <SaveClipModal
                visible={showSaveClipModal}
                onClose={() => setShowSaveClipModal(false)}
                onSave={handleSaveClip}
                songs={songs}
                mode="newSong"
            />

            <ClipListModal 
                visible={isClipsModalVisible}
                onClose={() => setIsClipsModalVisible(false)}
                title="Song Clips"
                clips={[]}
            />
        </SafeAreaView>
    );
};

export default NewSong;