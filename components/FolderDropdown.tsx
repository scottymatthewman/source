import React, { useRef, useState } from 'react';
import { findNodeHandle, LayoutRectangle, Modal, Pressable, Text, TouchableWithoutFeedback, UIManager, View } from 'react-native';
import theme from '../constants/theme';
import { useFolders } from '../context/folderContext';
import { ChevronDownIcon } from './icons';

interface FolderDropdownProps {
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export const FolderDropdown = ({ selectedFolderId, onSelectFolder }: FolderDropdownProps) => {
  const { folders } = useFolders();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
  const buttonRef = useRef<View>(null);

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  const openDropdown = () => {
    if (buttonRef.current) {
      const handle = findNodeHandle(buttonRef.current);
      if (handle) {
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          setButtonLayout({ x: pageX, y: pageY, width, height });
          setIsOpen(true);
        });
      }
    }
  };

  return (
    <>
      <View
        ref={buttonRef}
        onLayout={() => {}}
        className="relative"
      >
        <Pressable
          onPress={openDropdown}
          className="flex-row items-center gap-1 pt-1 pb-1 pl-3 pr-2 bg-light-surface-2 rounded-full"
        >
          <Text className="text-light-text">
            {selectedFolder?.title || 'No Folder'}
          </Text>
          <ChevronDownIcon
            width={20}
            height={20}
            fill={theme.colors.light.icon.secondary}
          />
        </Pressable>
      </View>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={{ flex: 1 }}>
            {buttonLayout && (
              <View
                style={{
                  position: 'absolute',
                  top: buttonLayout.y + buttonLayout.height + 10,
                  left: 12,
                  right: 12,
                  zIndex: 9999,
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: theme.colors.light.border,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Pressable
                  onPress={() => {
                    onSelectFolder(null);
                    setIsOpen(false);
                  }}
                  className="px-2 py-4 border-b border-light-surface-2"
                >
                  <Text className="text-light-text-body">No Folder</Text>
                </Pressable>
                {folders.map((folder) => (
                  <Pressable
                    key={folder.id}
                    onPress={() => {
                      onSelectFolder(folder.id);
                      setIsOpen(false);
                    }}
                    className="px-2 py-4 border-b border-light-surface-2 last:border-b-0"
                  >
                    <Text className="text-light-text-body">{folder.title}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}; 