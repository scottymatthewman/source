import React from 'react';
import { LayoutRectangle, Modal, Pressable, Text, View } from 'react-native';
import theme from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../utils/theme';
import { CopyIcon, DeleteIcon } from './icons';

interface SongActionsModalProps {
  visible: boolean;
  onClose: () => void;
  mode?: 'full' | 'keyOnly';
  onMakeCopy?: () => void;
  onDelete?: () => void;
  buttonRef?: React.RefObject<View>;
  buttonLayout?: LayoutRectangle | null;
}

const SongActionsModal: React.FC<SongActionsModalProps> = ({
  visible,
  onClose,
  mode = 'full',
  onMakeCopy,
  onDelete,
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
      {onDelete && (
        <Pressable
          onPress={() => {
            onDelete();
            onClose();
          }}
          className="py-3"
        >
          <View className="flex-row items-center gap-2">
            <DeleteIcon width={24} height={24} fill={colorPalette.icon.destructive} />
            <Text className={`${currentTheme === 'dark' ? 'text-dark-text-destructive' : 'text-light-text-destructive'}`}>Delete Song</Text>
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
    >
      <View style={{ flex: 1 }}>
        <Pressable
          className="flex-1 bg-black/40"
          onPress={onClose}
          style={{ zIndex: 1 }}
        />
        {buttonLayout && (
          <View
            style={{
              position: 'absolute',
              top: buttonLayout.y + buttonLayout.height + 10,
              alignSelf: 'center',
              zIndex: 2,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: colorPalette.bg,
              borderWidth: 1,
              borderColor: colorPalette.border,
              paddingHorizontal: 16,
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

export default SongActionsModal;