import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import { Song } from '../../context/songContext';
import { useTheme } from '../../context/ThemeContext';
import { useThemeClasses } from '../../utils/theme';

interface SaveClipModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, selectedSongIds: string[]) => void;
  songs: Song[];
  mode?: 'default' | 'songContext' | 'newSong';
  currentSongId?: string;
}

const SaveClipModal = ({ visible, onClose, onSave, songs, mode = 'default', currentSongId }: SaveClipModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  useEffect(() => {
    if (!visible) return;

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setTitle('');
      if (mode === 'songContext' && currentSongId) {
        setSelectedSongIds([currentSongId]);
      } else {
        setSelectedSongIds([]);
      }
    }
  }, [visible, mode, currentSongId]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), selectedSongIds);
    }
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongIds(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/70 justify-end items-start"
        style={{ 
          paddingLeft: 22, 
          paddingRight: 22, 
          paddingBottom: Platform.OS === 'ios' ? keyboardHeight + 16 : 16 
        }}
        onPress={onClose}
      >
        <View 
          className={`${classes.bg.main} rounded-2xl overflow-hidden w-full`}
          style={{ 
            elevation: 5, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 3.84 
          }}
        >
          <View className={`px-4 pt-5 pb-3 ${currentTheme === 'dark' ? theme.colors.dark.surface2 : theme.colors.light.surface1} rounded-lg`}>
            <View className="flex-row gap-0 items-left">
              <TextInput 
                className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-3xl px-2 pb-2 font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'}`}
                placeholder="Clip title"
                placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>
            <View className="flex-row justify-between w-full items-center h-10">
              <TouchableOpacity 
                onPress={onClose}
                className={`px-2 py-2 ${classes.button.bg} items-start justify-center rounded-lg w-1/2 h-10`}
              >
                <Text className={`${classes.text.body} font-medium`} style={{ fontSize: 14 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSave}
                className={`px-2 py-2 ${classes.button.bgInverted} items-end justify-center font-medium rounded-lg w-1/2 h-10`}
                disabled={!title.trim()}
              >
                <Text className={`${classes.text.body} font-medium`} style={{ fontSize: 14 }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default SaveClipModal;
