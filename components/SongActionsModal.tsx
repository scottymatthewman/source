import React from 'react';
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

const MUSICAL_KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B'
];

interface SongActionsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedKey: string | null;
  onSelectKey: (key: string | null) => void;
  mode?: 'full' | 'keyOnly';
  onMakeCopy?: () => void;
  onDelete?: () => void;
}

const SongActionsModal = ({
  visible,
  onClose,
  selectedKey,
  onSelectKey,
  mode = 'full',
  onMakeCopy,
  onDelete,
}: SongActionsModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
        onPress={onClose}
      >
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
            paddingBottom: 36,
          }}
        >
          <Text style={{ fontSize: 18, color: '#222', marginBottom: 12 }}>Set Key</Text>
          <FlatList
            data={MUSICAL_KEYS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            contentContainerStyle={{ marginBottom: 16 }}
            renderItem={({ item }) => {
              const isSelected = selectedKey === item;
              return (
                <TouchableOpacity
                  onPress={() => onSelectKey(isSelected ? null : item)}
                  style={{
                    backgroundColor: isSelected ? '#222' : '#f0f0f0',
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: isSelected ? '#fff' : '#222', fontWeight: 'bold' }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {mode === 'full' && (
            <>
              <TouchableOpacity onPress={onMakeCopy} style={{ paddingVertical: 16 }}>
                <Text style={{ fontSize: 18, color: '#222' }}>Duplicate</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={{ paddingVertical: 16 }}>
                <Text style={{ fontSize: 18, color: 'red' }}>Delete Song</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

export default SongActionsModal;