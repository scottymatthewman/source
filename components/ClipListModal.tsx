import { useAudioPlayer } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import theme from '../constants/theme';
import { Clip } from '../context/clipContext';
import { useColorPalette } from '../context/colorContext';
import { useTheme } from '../context/ThemeContext';
import { KebabIcon } from './icons';

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
    const { colorPalette } = useColorPalette();
    const { theme: currentTheme } = useTheme();
    const borderColor = currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border;
    const [playingClipId, setPlayingClipId] = useState<string | null>(null);
    const [currentClipUri, setCurrentClipUri] = useState<string | null>(null);
    const player = useAudioPlayer(currentClipUri);

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

    const handlePlayClip = async (clip: Clip) => {
        try {
            if (player) {
                await player.pause();
            }
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
            animationType="slide"
            transparent={true}
            onRequestClose={handleModalClose}
        >
            <View className="flex-1 justify-end">
                <View 
                    className="rounded-t-3xl px-4 pt-4 mx-4 mb-8"
                    style={{ backgroundColor: colorPalette.background, borderRadius: 24, borderWidth: 1 }}
                >
                    <View className="flex-row justify-between items-center mb-4">
                        <Text 
                            className="text-2xl font-bold"
                            style={{ color: colorPalette.text.primary }}
                        >
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text 
                                className="text-lg"
                                style={{ color: colorPalette.text.primary }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <FlatList
                            data={clips}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <View 
                                    className="py-3 px-4 border-b flex-row items-center justify-between"
                                    style={{ borderColor }}
                                >
                                    <View className="flex-1">
                                        <Text 
                                            className="text-lg"
                                            style={{ color: colorPalette.text.primary }}
                                        >
                                            {item.title || 'Untitled'}
                                        </Text>
                                        <Text 
                                            className="text-sm"
                                            style={{ color: colorPalette.text.secondary }}
                                        >
                                            {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center gap-4">
                                        <TouchableOpacity 
                                            onPress={() => playingClipId === item.id ? handleStopClip() : handlePlayClip(item)}
                                            className="px-3 py-2 rounded-lg"
                                            style={{ backgroundColor: colorPalette.surface1 }}
                                        >
                                            <Text style={{ color: colorPalette.text.primary }}>
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
                            ListEmptyComponent={<Text>No clips found.</Text>}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
} 