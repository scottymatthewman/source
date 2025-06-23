import React from 'react';
import { LayoutRectangle, Modal, Pressable, Text, View } from 'react-native';
import theme from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../utils/theme';
import { CopyIcon, DeleteIcon, EmptyIcon } from './icons';

interface FolderActionsModalProps {
  visible: boolean;
  onClose: () => void;
  mode?: 'full' | 'keyOnly';
  onMakeCopy?: () => void;
  onDelete?: () => void;
  onEmptyAndDelete?: () => void;
  buttonRef?: React.RefObject<View>;
  buttonLayout?: LayoutRectangle | null;
}

const FolderActionsModal: React.FC<FolderActionsModalProps> = ({
  visible,
  onClose,
  mode = 'full',
  onMakeCopy,
  onDelete,
  onEmptyAndDelete,
  buttonRef,
  buttonLayout,
}) => {
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  const renderActions = () => (
    <>
      {onMakeCopy && (
        <Pressable
          onPress={() => {
            onMakeCopy();
            onClose();
          }}
          className={`py-3 border-b ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}
        >
          <View className="flex-row items-center gap-2">
            <CopyIcon width={24} height={24} fill={colorPalette.icon.primary} />
            <Text className={classes.text.body}>Make a Copy</Text>
          </View>
        </Pressable>
      )}
      {onEmptyAndDelete && (
        <Pressable
          onPress={() => {
            onEmptyAndDelete();
            onClose();
          }}
          className={`py-3 border-b ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}
        >
          <View className="flex-row items-center gap-2">
            <EmptyIcon width={24} height={24} fill={colorPalette.icon.secondary} />
            <Text className={classes.text.body}>Empty and Delete</Text>
          </View>
        </Pressable>
      )}
      {onDelete && (
        <Pressable
          onPress={() => {
            onDelete();
            onClose();
          }}
          className={`py-3 ${currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border'}`}
        >
          <View className="flex-row items-center gap-2">
            <DeleteIcon width={24} height={24} fill={colorPalette.icon.destructive} />
            <Text className={`${currentTheme === 'dark' ? 'text-dark-text-destructive' : 'text-light-text-destructive'}`}>Delete Folder</Text>
          </View>
        </Pressable>
      )}
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      style={{ zIndex: 1000 }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          className="flex-1 bg-black/50"
          onPress={onClose}
          style={{ zIndex: 1 }}
        />
        {buttonLayout && (
          <View
            style={{
              position: 'absolute',
              top: buttonLayout.y + buttonLayout.height + 8,
              right: 12,
              zIndex: 2,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: colorPalette.bg,
              borderWidth: 1,
              borderColor: colorPalette.border,
              paddingHorizontal: 12,
              paddingVertical: 8,
              width: 200,
            }}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {renderActions()}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default FolderActionsModal;