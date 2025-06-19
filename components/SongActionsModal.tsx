import React from 'react';
import { LayoutRectangle, Modal, Pressable, Text, View } from 'react-native';
import theme from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../utils/theme';

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
          className={`px-2 py-4 border-b ${currentTheme === 'dark' ? 'border-dark-surface-2' : 'border-light-surface-2'}`}
        >
          <Text className={classes.text.body}>Make a Copy</Text>
        </Pressable>
      )}
      {onDelete && (
        <Pressable
          onPress={() => {
            onDelete();
            onClose();
          }}
          className="px-2 py-4"
        >
          <Text className={`${currentTheme === 'dark' ? 'text-dark-text-destructive' : 'text-light-text-destructive'}`}>Delete Song</Text>
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
          className="flex-1 bg-black/50"
          onPress={onClose}
          style={{ zIndex: 1 }}
        />
        {buttonLayout && (
          <View
            style={{
              position: 'absolute',
              top: buttonLayout.y + buttonLayout.height + 10,
              left: 12,
              right: 12,
              zIndex: 2,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: colorPalette.bg,
              borderWidth: 1,
              borderColor: colorPalette.border,
              paddingHorizontal: 16,
              paddingVertical: 8,
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