import DropdownOutlineDownIcon from '@/components/icons/DropdownOutlineDownIcon';
import { MUSICAL_KEYS, MusicalKey } from '@/constants/musicalKeys';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Keyboard, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecordingControls } from '../components/audio/RecordingControls';
import SaveClipModal from '../components/audio/SaveClipModal';
import { ClipListModal } from '../components/ClipListModal';
import { FolderDropdown } from '../components/FolderDropdown';
import { CloseIcon, MicIcon } from '../components/icons';
import ClipIcon from '../components/icons/ClipIcon';
import RichTextEditor from '../components/RichTextEditor';
import SongActionsModal from '../components/SongActionsModal';
import theme from '../constants/theme';
import { Clip } from '../context/clipContext';
import { useSongs } from '../context/songContext';
import { useTheme } from '../context/ThemeContext';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { useThemeClasses } from '../utils/theme';

// Add this interface after imports
interface RichTextEditorWrapperProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    isDarkMode?: boolean;
}

const RichTextEditorWrapper = (props: RichTextEditorWrapperProps) => {
    'use dom';
    return (
        <div style={{ flex: 1, minHeight: 300, display: "flex" }}>
            <RichTextEditor {...props} />
        </div>
    );
};

const NewSong = () => {
    const { updateSong, songs, deleteSong } = useSongs();
    const params = useLocalSearchParams();
    const songId = params.songId ? String(params.songId) : null;
    const [title, setTitle] = useState(params.title ? String(params.title) : "");
    const [content, setContent] = useState(params.content ? String(params.content) : "");
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
        params.folder_id ? String(params.folder_id) : null
    );
    const router = useRouter();
    const [showActions, setShowActions] = useState(false);
    const [selectedKey, setSelectedKey] = useState<MusicalKey | null>(null);
    const [bpm, setBpm] = useState<number | null>(null);
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
        isRecording,
        isPlaying,
        duration,
        startRecording,
        stopRecording,
        saveRecording,
        stopPlayback,
        playRecording,
        pauseRecording,
        audioUri,
    } = useAudioRecording();
    const [pendingClipId, setPendingClipId] = useState<string | null>(null);
    const db = useSQLiteContext();
    const insets = useSafeAreaInsets();
    const windowHeight = Dimensions.get('window').height;
    const RECORDING_PANEL_HEIGHT = 120;
    const RECORDING_PANEL_MARGIN = 24;
    const bottomSafeArea = insets.bottom;
    const shrunkHeight = windowHeight - (RECORDING_PANEL_HEIGHT + RECORDING_PANEL_MARGIN + 12);
    const heightAnim = useRef(new Animated.Value(-1)).current;
    const hasStartedRecordingRef = useRef(false);
    const [relatedClips, setRelatedClips] = useState<Clip[]>([]);

    // Disable swipe gesture for this screen
    useFocusEffect(
        React.useCallback(() => {
            // This disables the swipe gesture when the screen is focused
        }, [])
    );

    // Fetch and update the clip count for this song
    useEffect(() => {
        const fetchClipCount = async () => {
            if (songId) {
                const result = await db.getFirstAsync(
                    'SELECT COUNT(*) as count FROM song_clip_rel WHERE song_id = ?',
                    [songId]
                ) as { count?: number } | undefined;
                setClipCount((result && typeof result.count === 'number') ? result.count : 0);
            }
        };
        fetchClipCount();
    }, [songId, showSaveClipModal]);

    // Fetch related clips for this song
    useEffect(() => {
        const fetchRelatedClips = async () => {
            if (songId) {
                const rows = await db.getAllAsync<{ clip_id: string }>(
                    'SELECT clip_id FROM song_clip_rel WHERE song_id = ?',
                    [songId]
                );
                if (rows && rows.length > 0) {
                    const ids = rows.map(r => r.clip_id);
                    const clips = await db.getAllAsync<Clip>(
                        `SELECT * FROM clips WHERE id IN (${ids.map(() => '?').join(',')})`,
                        ...ids
                    );
                    setRelatedClips(clips);
                } else {
                    setRelatedClips([]);
                }
            }
        };
        fetchRelatedClips();
    }, [songId, showSaveClipModal]);

    // Start recording when modal opens (only once per open session)
    useEffect(() => {
        if (showRecorder && !isRecording && !isPlaying && !hasStartedRecordingRef.current) {
            startRecording();
            hasStartedRecordingRef.current = true;
        }
        // Only reset if we're explicitly closing the recorder and not in the middle of saving
        if (!showRecorder && (isRecording || isPlaying) && !showSaveClipModal) {
            if (isRecording) {
                stopRecording();
            }
            if (isPlaying) {
                stopPlayback();
            }
            hasStartedRecordingRef.current = false;
        }
    }, [showRecorder, isRecording, isPlaying, showSaveClipModal]);

    // Animate content height when recording starts/stops
    useEffect(() => {
        if (showRecorder) {
            Animated.timing(heightAnim, {
                toValue: shrunkHeight,
                duration: 350,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(heightAnim, {
                toValue: -1,
                duration: 350,
                useNativeDriver: false,
            }).start();
        }
    }, [showRecorder, shrunkHeight]);

    // Animated style for main content
    const mainContentStyle = showRecorder
        ? { height: heightAnim }
        : { flex: 1 };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title for the song');
            return;
        }
        if (!songId) {
            Alert.alert('Error', 'No song ID available');
            return;
        }
        try {
            await updateSong(songId, {
                title: title.trim(),
                content: content.trim(),
                date_modified: new Date(),
                folder_id: selectedFolderId,
                key: selectedKey,
                bpm
            });
            router.back();
        } catch (error) {
            console.error('Error saving song:', error);
            Alert.alert('Error', 'Failed to save song');
        }
    };

    const handleBack = () => {
        if (title.trim() || content.trim()) {
            Alert.alert(
                "Unsaved Changes",
                "Do you want to save your changes before leaving?",
                [
                    {
                        text: "Don't Save",
                        style: "destructive",
                        onPress: async () => {
                            if (songId) {
                                await deleteSong(songId);
                            }
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
            if (songId) {
                deleteSong(songId);
            }
            cleanupRecording();
            router.back();
        }
    };

    const handleSaveClip = async (title: string, selectedSongIds: string[]) => {
        if (!audioUri || !songId) {
            console.error('No audio URI or song ID available');
            cleanupRecording();
            return;
        }
        try {
            const clip = await saveRecording(title, audioUri);
            if (!clip) {
                console.error('Failed to save clip');
                cleanupRecording();
                return;
            }
            // Create relationships for each selected song
            for (const songId of selectedSongIds) {
                await db.runAsync(
                    'INSERT INTO song_clip_rel (song_id, clip_id) VALUES (?, ?)',
                    [songId, clip.id]
                );
            }
            setShowSaveClipModal(false);
            setShowRecorder(false);
            cleanupRecording();
            // Update the clip counter
            const result = await db.getFirstAsync(
                'SELECT COUNT(*) as count FROM song_clip_rel WHERE song_id = ?',
                [songId]
            ) as { count?: number } | undefined;
            setClipCount((result && typeof result.count === 'number') ? result.count : 0);
        } catch (error) {
            console.error('Error saving clip:', error);
            cleanupRecording();
        }
    };

    const handleDeleteClip = async (clipId: string) => {
        try {
            // Delete the clip relationship
            await db.runAsync(
                'DELETE FROM song_clip_rel WHERE song_id = ? AND clip_id = ?',
                [songId, clipId]
            );
            // Update the clip count
            const result = await db.getFirstAsync(
                'SELECT COUNT(*) as count FROM song_clip_rel WHERE song_id = ?',
                [songId]
            ) as { count?: number } | undefined;
            setClipCount((result && typeof result.count === 'number') ? result.count : 0);
            // Refresh the clips list
            setRelatedClips(prev => prev.filter(clip => clip.id !== clipId));
        } catch (error) {
            console.error('Error deleting clip:', error);
        }
    };

    // Robust cleanup logic for closing the recording controls
    const handleCloseRecordingControls = async () => {
        setShowRecorder(false);
        if (isRecording) {
            await stopRecording();
        }
        if (isPlaying) {
            await stopPlayback();
        }
        await cleanupRecording();
    };

    const cleanupRecording = () => {
        if (isRecording) {
            stopRecording();
        }
        if (isPlaying) {
            stopPlayback();
        }
        setShowRecorder(false);
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: colorPalette.bg }}>
                {/* Recording Controls Panel */}
                <RecordingControls
                    isRecording={isRecording}
                    isPlaying={isPlaying}
                    duration={duration}
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                    onPlayRecording={playRecording}
                    onPauseRecording={pauseRecording}
                    onStopPlayback={stopPlayback}
                    onSaveRecording={() => setShowSaveClipModal(true)}
                    onCancelRecording={handleCloseRecordingControls}
                    showControls={showRecorder}
                />

                {/* Main content: flex: 1 by default, animates to height when controls are shown */}
                <Animated.View
                    style={{
                        ...mainContentStyle,
                        borderBottomLeftRadius: showRecorder ? 32 : 0,
                        borderBottomRightRadius: showRecorder ? 32 : 0,
                        overflow: 'hidden',
                        backgroundColor: colorPalette.bg,
                        shadowColor: showRecorder ? '#000' : 'transparent',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: showRecorder ? 0.12 : 0,
                        shadowRadius: showRecorder ? 12 : 0,
                        position: 'relative',
                        zIndex: 1, // Main content above controls
                    }}
                >
                    <View className="flex-row pl-6 pr-6 pt-4 pb-1 items-center justify-between">
                        <TouchableOpacity onPress={handleBack}>
                            <CloseIcon width={28} height={28} fill={colorPalette.icon.primary} />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-2">
                            <FolderDropdown 
                                selectedFolderId={selectedFolderId}
                                onSelectFolder={setSelectedFolderId}
                            />
                        </View>
                        <TouchableOpacity onPress={handleSave}>
                            <Text className={`${currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'} text-[17px] font-semibold`}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center w-full pt-6 pl-6 pr-4 pb-2">
                        <TextInput 
                            className={`flex-1 text-3xl font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'}`}
                            placeholder="Untitled"
                            placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                            value={title} 
                            onChangeText={setTitle}
                        />
                        <TouchableOpacity onPress={() => setIsDropdownOpen(!isDropdownOpen)} className="ml-2">
                            <View style={{ transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }] }}>
                                <DropdownOutlineDownIcon width={28} height={28} fill={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {isDropdownOpen && (
                        <View className={`mt-2 pt-3 border-y ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}>
                            <View className="px-6 pb-3 flex-row items-center justify-between border-b" style={{ borderColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }}>
                                <Text className={classes.textSize('text-lg', 'placeholder')}>Attachments</Text>
                                <View className="flex-row gap-4">
                                    <TouchableOpacity className="flex-row items-center gap-1 h-9 pl-1 pr-2 rounded-lg" onPress={() => {
                                        Keyboard.dismiss();
                                        setShowRecorder(true);
                                    }}>
                                        <MicIcon width={24} height={24} fill={colorPalette.icon.primary} />
                                        <Text className={classes.textSize('text-lg font-medium')}>Record</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        className="flex-row items-center gap-1 h-9 pl-1 pr-2.5 rounded-lg" 
                                        style={{ backgroundColor: colorPalette.surface2 }}
                                        onPress={() => setIsClipsModalVisible(true)}
                                    >
                                        <ClipIcon width={28} height={28} fill={colorPalette.icon.primary} />
                                        <Text className={classes.textSize('text-lg font-medium')}>{clipCount}</Text>  
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="px-6 flex-row justify-stretch items-center gap-4">
                                <View className="flex-1 flex-row py-3 items-center justify-between">
                                    <Text className={classes.textSize('text-lg', 'placeholder')}>Key</Text>
                                    <TouchableOpacity
                                        className="flex-row items-center justify-center gap-1 h-9 rounded-lg w-12"
                                        style={{ backgroundColor: colorPalette.surface2 }}
                                        onPress={() => setShowKeyPicker((v) => !v)}
                                    >
                                        <Text className={classes.textSize('text-lg font-medium')}>
                                            {selectedKey || 'Key'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="w-[1px] h-full" style={{ backgroundColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }} />
                                <View className="flex-1 flex-row py-4 items-center justify-between">
                                    <Text className={currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'}>Tempo</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <TextInput
                                            className={classes.textSize('text-lg')}
                                            placeholder="-"
                                            placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                                            value={bpm?.toString() || ''}
                                            onChangeText={(text) => {
                                                const sanitized = text.replace(/[^0-9]/g, '').slice(0, 3);
                                                setBpm(sanitized ? parseInt(sanitized) : null);
                                            }}
                                            keyboardType="number-pad"
                                            maxLength={3}
                                            style={{
                                                color: bpm ? (currentTheme === 'dark' ? theme.colors.dark.text : theme.colors.light.text) : (currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder),
                                                width: 80,
                                                height: 24,
                                                textAlign: 'right',
                                                paddingVertical: 0,
                                                paddingHorizontal: 0,
                                                includeFontPadding: false,
                                                fontSize: 16,
                                                lineHeight: 20,
                                            }}
                                        />
                                        <Text
                                            className={classes.textSize('text-lg', 'placeholder')}
                                            style={{
                                                height: 20,
                                                lineHeight: 20,
                                                textAlignVertical: 'center',
                                            }}
                                        >
                                            BPM
                                        </Text>
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
                    <ScrollView className="px-6 pt-1" contentContainerStyle={{ flexGrow: 1 }}>
                        <TextInput 
                            className={`text-xl/6 font-normal ${currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}`}
                            placeholder="I heard there was a secret chord..."
                            placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                            multiline={true}
                            textAlignVertical="top"
                            value={content}
                            onChangeText={setContent}
                        />
                    </ScrollView>
                </Animated.View>
            </SafeAreaView>

            <SongActionsModal
                visible={showActions}
                onClose={() => setShowActions(false)}
            />

            <SaveClipModal
                visible={showSaveClipModal}
                onClose={() => setShowSaveClipModal(false)}
                onSave={handleSaveClip}
                songs={songs}
                mode="songDetail"
                currentSongId={songId || undefined}
            />

            <ClipListModal
                visible={isClipsModalVisible}
                onClose={() => setIsClipsModalVisible(false)}
                title={`Clips (${clipCount})`}
                clips={relatedClips}
                onDeleteClip={handleDeleteClip}
            />
        </>
    );
};

export default NewSong;