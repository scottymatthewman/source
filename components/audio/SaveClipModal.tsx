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
  mode?: 'index' | 'songDetail';
  currentSongId?: string;
}

const SaveClipModal = ({ visible, onClose, onSave, songs, mode = 'index', currentSongId }: SaveClipModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  const resetState = () => {
    setTitle('');
    // In song detail mode, pre-select the current song
    setSelectedSongIds(mode === 'songDetail' && currentSongId ? [currentSongId] : []);
  };

  useEffect(() => {
    if (!visible) {
      resetState();
      return;
    }

    // Reset state when modal becomes visible
    resetState();

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
  }, [visible, mode, currentSongId]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSave = () => {
    if (title.trim()) {
      if (mode === 'songDetail' && currentSongId) {
        onSave(title.trim(), [currentSongId]);
      } else {
        onSave(title.trim(), selectedSongIds);
      }
      resetState();
    }
  };

  const toggleSongSelection = (songId: string) => {
    // In song detail mode, don't allow deselecting the current song
    if (mode === 'songDetail' && songId === currentSongId) {
      return;
    }

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
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/70 justify-end items-start"
        style={{
          paddingLeft: 22,
          paddingRight: 22,
          paddingBottom: mode === 'songDetail' ? (keyboardHeight > 0 ? keyboardHeight + 16 : 32) : 32,
        }}
        onPress={handleClose}
      >
        <Pressable
          onPress={() => {}}
          style={{ width: '100%' }}
        >
          <View
            className={`${classes.bg.main} rounded-2xl overflow-hidden w-full`}
            style={{
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              height: mode === 'songDetail' ? 'auto' : '75%',
              minHeight: mode === 'songDetail' ? undefined : 200,
              maxHeight: mode === 'songDetail' ? undefined : undefined,
            }}
          >
            <View className={`p-4${mode !== 'songDetail' ? ' flex-1' : ''}`}>
              <View className="flex-row gap-0 items-center justify-between w-full">
                <TouchableOpacity onPress={handleClose}>
                  <ChevronLeftIcon width={24} height={24} fill={colorPalette.icon.primary} />
                </TouchableOpacity>
                <TextInput 
                  className={`placeholder:${currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder'} text-3xl px-2 pb-2 font-semibold ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'}`}
                  style={{ flex: 1 }}
                  placeholder="Clip title"
                  placeholderTextColor={currentTheme === 'dark' ? theme.colors.dark.textPlaceholder : theme.colors.light.textPlaceholder}
                  value={title}
                  onChangeText={setTitle}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={!title.trim()}
                  className={`flex-row py-3 rounded-lg ${classes.button.bgInverted} items-center justify-end`}
                >
                  <Text className={`${classes.text.body} font-medium`}>Save</Text>
                </TouchableOpacity>
              </View>
              
              {/* Song Selection (only show if not in songDetail mode) */}
              {mode !== 'songDetail' && (
                <View className="flex-1 mt-4">
                  <FlatList
                    data={songs}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => toggleSongSelection(item.id)}
                        className={`px-4 py-3 flex-row items-center justify-between ${classes.bg.surface1} rounded-lg mb-2`}
                        disabled={false}
                      >
                        <Text className={`${classes.text.body} text-lg`}>{item.title || 'Untitled'}</Text>
                        {selectedSongIds.includes(item.id) && (
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
              )}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SaveClipModal;
