import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import { Song } from '../../context/songContext';
import { useTheme } from '../../context/ThemeContext';
import { useThemeClasses } from '../../utils/theme';
import { ChevronLeftIcon } from '../icons';

interface SaveClipModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, selectedSongIds: string[]) => void;
  songs: Song[];
}

const SaveClipModal: React.FC<SaveClipModalProps> = ({ visible, onClose, onSave, songs }) => {
  const router = useRouter();
  const [clipTitle, setClipTitle] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
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

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  const handleSave = () => {
    if (clipTitle.trim()) {
      onSave(clipTitle.trim(), selectedSongs);
    }
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
        style={{ paddingLeft: 22, paddingRight: 22, paddingBottom: 32 }}
        onPress={onClose}
      >
        <View 
          className={`${classes.bg.main} rounded-2xl overflow-hidden w-full`}
          style={{ 
            elevation: 5, 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 3.84,
            height: '75%'
          }}
        >
          <View className="p-4 flex-1">
            <View className="flex-row gap-0 items-center justify-between w-full">
              <TouchableOpacity onPress={onClose}>
                <ChevronLeftIcon width={24} height={24} fill={colorPalette.icon.primary} />
              </TouchableOpacity>
              <TextInput 
                className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-3xl px-2 pb-2 font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'}`}
                style={{ flex: 1 }}
                placeholder="Clip title"
                placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                value={clipTitle}
                onChangeText={setClipTitle}
                autoFocus
              />
              <TouchableOpacity
                onPress={handleSave}
                disabled={!clipTitle.trim()}
                className={`flex-row py-3 rounded-lg ${classes.button.bgInverted} items-center justify-end`}
              >
                <Text className={`${classes.text.body} font-medium`}>Save</Text>
              </TouchableOpacity>
            </View>
            {/* Song Selection */}
            <View className="flex-1 mt-4">
              <FlatList
                data={songs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleSongSelection(item.id)}
                    className={`px-4 py-3 flex-row items-center justify-between ${classes.bg.surface1} rounded-lg mb-2`}
                  >
                    <Text className={`${classes.text.body} text-lg`}>{item.title || 'Untitled'}</Text>
                    {selectedSongs.includes(item.id) && (
                      <View style={{ 
                        width: 20, 
                        height: 20, 
                        backgroundColor: colorPalette.button.bgInverted,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Text style={{ color: colorPalette.textInverted }}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default SaveClipModal;
