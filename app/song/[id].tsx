import ClipIcon from '@/components/icons/ClipIcon';
import DropdownOutlineDownIcon from '@/components/icons/DropdownOutlineDownIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, findNodeHandle, LayoutRectangle, ScrollView as RNScrollView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecordingControls } from '../../components/audio/RecordingControls';
import SaveClipModal from '../../components/audio/SaveClipModal';
import { ClipListModal } from '../../components/ClipListModal';
import { FolderDropdown } from '../../components/FolderDropdown';
import { ChevronLeftIcon, KebabIcon, MicIcon } from '../../components/icons';
import SongActionsModal from '../../components/SongActionsModal';
import { MUSICAL_KEYS, MusicalKey } from '../../constants/musicalKeys';
import theme from '../../constants/theme';
import { Clip } from '../../context/clipContext';
import { useSongs } from '../../context/songContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudioRecording } from '../../hooks/useAudioRecording';
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
    const [bpm, setBpm] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showKeyPicker, setShowKeyPicker] = useState(false);
    const [kebabButtonLayout, setKebabButtonLayout] = useState<LayoutRectangle | null>(null);
    const kebabButtonRef = useRef<View>(null);
    const db = useSQLiteContext();
    const [clipCount, setClipCount] = useState(0);
    const [showRecorder, setShowRecorder] = useState(false);
    const [showSaveClipModal, setShowSaveClipModal] = useState(false);
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
    const [isClipsModalVisible, setIsClipsModalVisible] = useState(false);
    const [relatedClips, setRelatedClips] = useState<Clip[]>([]);
    const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
    const insets = useSafeAreaInsets();
    const windowHeight = Dimensions.get('window').height;
    const RECORDING_PANEL_HEIGHT = 120;
    const RECORDING_PANEL_MARGIN = 24;
    const bottomSafeArea = insets.bottom;
    const shrunkHeight = windowHeight - (RECORDING_PANEL_HEIGHT + RECORDING_PANEL_MARGIN + 12);
    const heightAnim = useRef(new Animated.Value(-1)).current;
    const hasStartedRecordingRef = useRef(false);
    
    // Convert id to string for comparison and add logging
    console.log('URL ID:', id, 'Type:', typeof id);
    console.log('Available songs:', songs);
    
    const song = songs.find((song) => song.id.toString() === id?.toString());
    
    console.log('Current song:', song);
    console.log('Related clips:', relatedClips);
    console.log('Clips modal visible:', isClipsModalVisible);

    useEffect(() => {
        if (song) {
            setTitle(song.title || '');
            setContent(song.content || '');
            setSelectedFolderId(song.folder_id);
            setSelectedKey(song.key);
            setBpm(song.bpm);
            setHasUnsavedChanges(false);
        }
    }, [song]);

    useEffect(() => {
        if (song) {
            const hasChanges = 
                title !== (song.title || '') || 
                content !== (song.content || '') ||
                selectedFolderId !== song.folder_id ||
                selectedKey !== song.key ||
                bpm !== song.bpm;
            setHasUnsavedChanges(hasChanges);
        }
    }, [title, content, selectedFolderId, selectedKey, bpm, song]);

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

    useEffect(() => {
        if (!song) return;
        let isMounted = true;
        (async () => {
            const rows = await db.getAllAsync<{ clip_id: string }>(
                'SELECT clip_id FROM song_clip_rel WHERE song_id = ?',
                [song.id]
            );
            console.log('[relatedClips effect] song_clip_rel rows:', rows);
            if (rows && rows.length > 0) {
                const ids = rows.map(r => r.clip_id);
                console.log('[relatedClips effect] clip ids:', ids);
                // Fetch all clips with these ids
                const clips = await db.getAllAsync<Clip>(
                    `SELECT * FROM clips WHERE id IN (${ids.map(() => '?').join(',')})`,
                    ...ids
                );
                console.log('[relatedClips effect] fetched clips:', clips);
                if (isMounted) setRelatedClips(clips);
            } else {
                if (isMounted) setRelatedClips([]);
            }
        })();
        return () => { isMounted = false; };
    }, [song, db, showSaveClipModal]);

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
        if (song) {
            console.log('Save pressed', { title, content, selectedFolderId, selectedKey, bpm });
            await updateSong(song.id, {
                title,
                content,
                date_modified: new Date(),
                folder_id: selectedFolderId,
                key: selectedKey,
                bpm: bpm !== null && !isNaN(bpm) ? bpm : null,
            });
            setHasUnsavedChanges(false);
            // Wait for the songs to be refreshed, then navigate back
            setTimeout(() => {
                router.back();
            }, 200);
        }
    };

    const handleStopRecording = () => {
        stopRecording();
        // Don't hide the recorder UI immediately
        // setShowRecorder(false);
    };

    const handleSaveClip = async (title: string, selectedSongIds: string[]) => {
        console.log('[handleSaveClip] called with selectedSongIds:', selectedSongIds);
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title for the clip');
            return;
        }

        if (selectedSongIds.length === 0) {
            Alert.alert('Error', 'Please select at least one song to attach the clip to');
            return;
        }

        if (!audioUri) {
            Alert.alert('Error', 'No recording available to save');
            cleanupRecording();
            return;
        }

        try {
            // Save the recording with the correct audioUri
            const clip = await saveRecording(title, audioUri);
            if (!clip) {
                console.error('Failed to save clip');
                cleanupRecording();
                return;
            }
            console.log('[handleSaveClip] new clip id:', clip.id);

            // Create relationships for each selected song
            for (const songId of selectedSongIds) {
                console.log('[handleSaveClip] Inserting into song_clip_rel: song_id=' + songId + ', clip_id=' + clip.id);
                try {
                    await db.runAsync(
                        'INSERT INTO song_clip_rel (song_id, clip_id) VALUES (?, ?)',
                        [songId, clip.id]
                    );
                    console.log('[handleSaveClip] Successfully inserted into song_clip_rel: song_id=' + songId + ', clip_id=' + clip.id);
                } catch (e) {
                    console.error('[handleSaveClip] Failed to insert into song_clip_rel:', e);
                }
            }

            // Update clip count for the current song if it was selected
            if (song && selectedSongIds.includes(song.id)) {
                const result = await db.getFirstAsync<{ count: number }>(
                    'SELECT COUNT(*) as count FROM song_clip_rel WHERE song_id = ?',
                    [song.id]
                );
                if (result) setClipCount(result.count);
            }

            // Clean up recording state
            cleanupRecording();
            setShowSaveClipModal(false);
        } catch (error) {
            console.error('Error saving clip:', error);
            Alert.alert('Error', 'Failed to save clip');
        }
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

    const handleDeleteClip = async (clipId: string) => {
        if (!song?.id) {
            console.error('No song ID available');
            return;
        }

        try {
            // Delete the relationship
            await db.runAsync(
                'DELETE FROM song_clip_rel WHERE song_id = ? AND clip_id = ?',
                [song.id, clipId]
            );

            // Delete the clip
            await db.runAsync(
                'DELETE FROM clips WHERE id = ?',
                [clipId]
            );

            // Update the clips list
            setRelatedClips(prev => prev.filter(clip => clip.id !== clipId));
            setClipCount(prev => prev - 1);
        } catch (error) {
            console.error('Error deleting clip:', error);
            Alert.alert('Error', 'Failed to delete clip');
        }
    };

    // Robust cleanup logic for closing the recording controls
    const handleCloseRecordingControls = async () => {
        if (isRecording) {
            await stopRecording();
        }
        if (isPlaying) {
            stopPlayback();
        }
        setShowRecorder(false);
        hasStartedRecordingRef.current = false;
    };

    const openActionsModal = () => {
        if (kebabButtonRef.current) {
            const handle = findNodeHandle(kebabButtonRef.current);
            if (handle) {
                UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                    setKebabButtonLayout({ x: pageX, y: pageY, width, height });
                    setShowActions(true);
                });
            }
        }
    };

    if (!song) {
        return (
            <SafeAreaView className={`flex-1 items-center justify-center ${currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'}`}>
                <Text className={currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'}>Song not found</Text>
                <Text className={currentTheme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'} style={{ marginTop: 8 }}>ID: {id}</Text>
            </SafeAreaView>
        );
    }

    console.log('[Details] showSaveClipModal:', showSaveClipModal);

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
                            <ChevronLeftIcon width={28} height={28} fill={colorPalette.icon.primary} />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-2">
                            <FolderDropdown 
                                selectedFolderId={selectedFolderId}
                                onSelectFolder={setSelectedFolderId}
                            />
                            <TouchableOpacity ref={kebabButtonRef} onPress={openActionsModal}>
                                <KebabIcon width={28} height={28} fill={colorPalette.icon.secondary} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleSave}>
                            <Text className={`${currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'} text-[17px] font-semibold`}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center w-full pt-6 pl-6 pr-4 pb-2">
                        <TextInput
                            className={`flex-1 text-3xl font-semibold ${
                                currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'
                            }`}
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
                                <View className="flex-1 flex-row py-3 items-center justify-between">
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
                                <View className="w-[1px] h-full" style={{ backgroundColor: currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border }} />
                                <View className="flex-1 flex-row py-4 items-center justify-between">
                                    <Text className={currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'}>Tempo</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
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
                onMakeCopy={handleMakeCopy}
                onDelete={handleDelete}
                buttonLayout={kebabButtonLayout}
            />

            <SaveClipModal
                visible={showSaveClipModal}
                onClose={() => setShowSaveClipModal(false)}
                onSave={handleSaveClip}
                songs={songs}
                mode="songDetail"
                currentSongId={song.id}
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

export default Details;