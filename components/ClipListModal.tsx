import React from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import theme from '../constants/theme';
import { Clip } from '../context/clipContext';
import { useColorPalette } from '../context/colorContext';
import { useTheme } from '../context/ThemeContext';

interface ClipListModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    onClipPress?: (clipId: string) => void;
    clips: Clip[];
}

export function ClipListModal({ 
    visible, 
    onClose, 
    title = 'Clips',
    onClipPress,
    clips = []
}: ClipListModalProps) {
    const { colorPalette } = useColorPalette();
    const { theme: currentTheme } = useTheme();
    const borderColor = currentTheme === 'dark' ? theme.colors.dark.border : theme.colors.light.border;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
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
                    <View className="flex-1">
                        <FlatList
                            data={clips}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    onPress={() => onClipPress?.(item.id)}
                                    className="py-3 px-4 border-b"
                                    style={{ borderColor }}
                                >
                                    <View className="flex-row items-center justify-between">
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
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
} 