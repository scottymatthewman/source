import React, { useRef, useState } from 'react';
import { findNodeHandle, LayoutRectangle, Modal, Pressable, Text, UIManager, View } from 'react-native';
import theme from '../constants/theme';
import { useFolders } from '../context/folderContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../utils/theme';
import { FolderIcon } from './icons';

interface FolderDropdownProps {
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export const FolderDropdown = ({ selectedFolderId, onSelectFolder }: FolderDropdownProps) => {
  const { folders } = useFolders();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
  const buttonRef = useRef<View>(null);
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

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
          className={`flex-row items-center gap-1 pt-1 pb-1 pl-3 pr-3 ${currentTheme === 'dark' ? 'bg-dark-surface2' : 'bg-light-surface2'} rounded-full`}
        >
          <FolderIcon width={20} height={20} fill={colorPalette.icon.primary} />
          <Text className={classes.text.body}>
            {selectedFolder?.title || 'No Folder'}
          </Text>
        </Pressable>
      </View>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            className="flex-1 bg-black/50"
            onPress={() => setIsOpen(false)}
            style={{ zIndex: 1 }}
          />
          {buttonLayout && (
            <View
              style={{
                position: 'absolute',
                top: buttonLayout.y + buttonLayout.height + 10,
                left: 48,
                zIndex: 2,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: colorPalette.bg,
                borderWidth: 1,
                borderColor: colorPalette.border,
                paddingHorizontal: 16,
                paddingVertical: 8,
                width: 260,
              }}
              onStartShouldSetResponder={() => true}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <Pressable
                onPress={() => {
                  onSelectFolder(null);
                  setIsOpen(false);
                }}
                className={`px-2 py-3 border-b ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}
              >
                <Text className={classes.text.body}>No Folder</Text>
              </Pressable>
              {folders.map((folder) => (
                <Pressable
                  key={folder.id}
                  onPress={() => {
                    onSelectFolder(folder.id);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-3 border-b ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'} last:border-b-0`}
                >
                  <Text className={classes.text.body}>{folder.title}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}; 