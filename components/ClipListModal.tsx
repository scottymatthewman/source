import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import theme from '../constants/theme';
import { Clip } from '../context/clipContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../utils/theme';
import { KebabIcon } from './icons';

// Audio configuration for main speaker routing
const PLAYBACK_AUDIO_CONFIG = {
    allowsRecording: false,
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: 'mixWithOthers' as const,
    shouldRouteThroughEarpiece: false, // CRITICAL: Use main speakers
};

interface ClipListModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    onClipPress?: (clipId: string) => void;
    clips: Clip[];
    onDeleteClip?: (clipId: string) => void;
}

export function ClipListModal({ 
    visible, 
    onClose, 
    title = 'Clips',
    onClipPress,
    clips = [],
    onDeleteClip
}: ClipListModalProps) {
    const { theme: currentTheme } = useTheme();
    const classes = useThemeClasses();
    const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
    const [playingClipId, setPlayingClipId] = useState<string | null>(null);
    const [currentClipUri, setCurrentClipUri] = useState<string | null>(null);
    const player = useAudioPlayer(currentClipUri);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current;

    // Debug logging
    console.log('ClipListModal theme debug:', {
        currentTheme,
        textHeaderClass: classes.text.header,
        textBodyClass: classes.text.body,
        bgMainClass: classes.bg.main,
        bgSurface1Class: classes.bg.surface1,
        colorPaletteBg: colorPalette.bg,
        colorPaletteText: colorPalette.text
    });

    // Cleanup effect: stop playback when modal closes or unmounts
    useEffect(() => {
        if (!visible && player) {
            (async () => {
                try {
                    await player.pause();
                } catch (e) {
                    console.warn('Player already destroyed or not found:', e);
                }
                setPlayingClipId(null);
                setCurrentClipUri(null);
            })();
        }
        // Also cleanup on unmount
        return () => {
            if (player) {
                try {
                    player.pause();
                } catch (e) {
                    // ignore
                }
            }
        };
    }, [visible, player]);

    // Animate when modal visibility changes
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 300,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, fadeAnim, slideAnim]);

    const handlePlayClip = async (clip: Clip) => {
        try {
            if (player) {
                await player.pause();
            }
            
            // Set audio mode to use main speakers
            await setAudioModeAsync(PLAYBACK_AUDIO_CONFIG);
            
            setCurrentClipUri(clip.file_path);
            setPlayingClipId(clip.id);
        } catch (error) {
            console.error('Error playing clip:', error);
            Alert.alert('Error', 'Failed to play clip');
        }
    };

    const handleStopClip = async () => {
        if (player) {
            try {
                await player.pause();
            } catch (e) {
                console.warn('Player already destroyed or not found:', e);
            }
            setCurrentClipUri(null);
            setPlayingClipId(null);
        }
    };

    // Start playing when the URI changes
    useEffect(() => {
        if (currentClipUri && player) {
            player.play();
        }
    }, [currentClipUri, player]);

    const handleDeleteClip = (clipId: string) => {
        handleStopClip(); // Always stop playback before deleting
        Alert.alert(
            'Delete Clip',
            'Are you sure you want to delete this clip?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (playingClipId === clipId) {
                            handleStopClip();
                        }
                        onDeleteClip?.(clipId);
                    }
                }
            ]
        );
    };

    // Update the onClose handler to always stop playback first
    const handleModalClose = async () => {
        await handleStopClip();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            onRequestClose={handleModalClose}
        >
            <Animated.View
                className="flex-1 bg-black/40"
                style={{ 
                    zIndex: 1,
                    opacity: fadeAnim,
                }}
            >
                <Pressable
                    className="flex-1"
                    onPress={onClose}
                />
                <Animated.View 
                    className="flex-1 justify-end"
                    style={{ 
                        zIndex: 2,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <View 
                        className={`rounded-t-3xl px-6 pt-6 pb-8`}
                        style={{ 
                            borderRadius: 24, 
                            overflow: 'hidden',
                            minHeight: '88%',
                            backgroundColor: colorPalette.surface1,
                        }}
                        onStartShouldSetResponder={() => true}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <Text 
                                className={`text-2xl font-bold ${classes.text.header}`}
                                style={{ color: colorPalette.textHeader }}
                            >
                                {title}
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Text 
                                    className={`text-lg ${classes.text.body}`}
                                    style={{ color: colorPalette.text }}
                                >
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={clips}
                                keyExtractor={item => item.id.toString()}
                                style={{ overflow: 'hidden' }}
                                contentContainerStyle={{ overflow: 'hidden' }}
                                showsVerticalScrollIndicator={true}
                                renderItem={({ item, index }) => (
                                    <View 
                                        className={`py-3 px-4 border-b flex-row items-center justify-between ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}
                                        style={{ 
                                            borderBottomWidth: index === clips.length - 1 ? 0 : 1
                                        }}
                                    >
                                        <View className="flex-1">
                                            <Text 
                                                className={`text-lg ${classes.text.body}`}
                                                style={{ color: colorPalette.text }}
                                            >
                                                {item.title || 'Untitled'}
                                            </Text>
                                            <Text 
                                                className={`text-sm ${classes.text.placeholder}`}
                                                style={{ color: colorPalette.textPlaceholder }}
                                            >
                                                {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center gap-4">
                                            <TouchableOpacity 
                                                onPress={() => playingClipId === item.id ? handleStopClip() : handlePlayClip(item)}
                                                className={`px-3 py-2 rounded-lg ${classes.bg.surface1}`}
                                                style={{ backgroundColor: colorPalette.surface1 }}
                                            >
                                                <Text 
                                                    className={classes.text.body}
                                                    style={{ color: colorPalette.text }}
                                                >
                                                    {playingClipId === item.id ? 'Stop' : 'Play'}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={() => handleDeleteClip(item.id)}
                                                className="p-2"
                                            >
                                                <KebabIcon width={20} height={20} fill={colorPalette.icon.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                ListEmptyComponent={
                                    <Text 
                                        className={classes.text.placeholder}
                                        style={{ color: colorPalette.textPlaceholder }}
                                    >
                                        No clips found.
                                    </Text>
                                }
                            />
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
} 