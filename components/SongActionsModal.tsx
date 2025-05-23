import React from 'react';
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MUSICAL_KEYS, MusicalKey } from '../constants/musicalKeys';
import theme from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface SongActionsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedKey: MusicalKey | null;
  onSelectKey: (key: MusicalKey | null) => void;
  mode?: 'full' | 'keyOnly';
  onMakeCopy?: () => void;
  onDelete?: () => void;
}

const SongActionsModal: React.FC<SongActionsModalProps> = ({
  visible,
  onClose,
  selectedKey,
  onSelectKey,
  mode = 'full',
  onMakeCopy,
  onDelete,
}) => {
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  const renderKeySelector = () => (
    <View className="pt-6 pl-6 pr-6 pb-16">
      <Text className={`text-lg font-medium pb-1 ${currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header'}`}>Set Key</Text>
      <FlatList
        data={MUSICAL_KEYS}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-1"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectKey(selectedKey === item ? null : item)}
            className={`mr-2 px-4 py-2 rounded-lg ${
              selectedKey === item
                ? currentTheme === 'dark' ? 'bg-dark-surface-inverted' : 'bg-light-surface-inverted'
                : currentTheme === 'dark' ? 'bg-dark-surface-2' : 'bg-light-surface-2'
            }`}
          >
            <Text
              className={`text-lg font-medium ${
                selectedKey === item
                  ? currentTheme === 'dark' ? 'text-dark-text-inverted' : 'text-light-text-inverted'
                  : currentTheme === 'dark' ? 'text-light-text-inverted' : 'text-dark-text-inverted'
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );

  const renderFullActions = () => (
    <View className="pt-6 pl-6 pr-6 pb-16">
      <TouchableOpacity
        onPress={() => {
          onSelectKey(null);
          onClose();
        }}
        className={`py-3 ${currentTheme === 'dark' ? 'border-dark-surface-2' : 'border-light-surface-2'}`}
      >
        <Text className={`${currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'} text-lg font-medium pb-1`}>Set Key</Text>
        <FlatList
          data={MUSICAL_KEYS}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-1"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectKey(selectedKey === item ? null : item)}
              className={`mr-2 px-4 py-2 rounded-lg ${
                selectedKey === item
                  ? currentTheme === 'dark' ? 'bg-dark-surface-inverted' : 'bg-light-surface-inverted'
                  : currentTheme === 'dark' ? 'bg-dark-surface-2' : 'bg-light-surface-2'
              }`}
            >
              <Text
                className={`text-lg ${
                  selectedKey === item
                    ? currentTheme === 'dark' ? 'text-dark-text-inverted' : 'text-light-text-inverted'
                    : currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </TouchableOpacity>
      {onMakeCopy && (
        <TouchableOpacity
          onPress={() => {
            onMakeCopy();
            onClose();
          }}
          className={`py-4 ${currentTheme === 'dark' ? 'border-dark-surface-2' : 'border-light-surface-2'}`}
        >
          <Text className={`${currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body'} text-lg font-medium`}>Make a Copy</Text>
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity
          onPress={() => {
            onDelete();
            onClose();
          }}
          className="py-4"
        >
          <Text className={`${currentTheme === 'dark' ? 'text-dark-text-destructive' : 'text-light-text-destructive'} text-lg font-medium`}>Delete Song</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className={`absolute bottom-0 w-full ${currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg'} rounded-t-3xl`}
          onPress={(e) => e.stopPropagation()}
        >
          <SafeAreaView edges={['bottom']}>
            {mode === 'keyOnly' ? renderKeySelector() : renderFullActions()}
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SongActionsModal;