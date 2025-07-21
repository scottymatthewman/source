import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import MoonIcon from '../components/icons/MoonIcon';
import SunIcon from '../components/icons/SunIcon';
import theme from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const [isLeftHanded, setIsLeftHanded] = useState(false);
  const { theme: currentTheme, setTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  // Helper for toggle style
  const getToggleStyle = (selected: boolean) => {
    if (!selected) return {};
    if (currentTheme === 'dark') {
      return {
        backgroundColor: colorPalette.button.bgInverted,
        zIndex: 2,
      };
    } else {
      return {
        backgroundColor: colorPalette.bg,
        zIndex: 2,
      };
    }
  };
  // Helper for toggle text/icon color
  const getToggleTextColor = (selected: boolean) => {
    if (!selected) return colorPalette.text;
    if (currentTheme === 'dark') {
      return colorPalette.textInverted;
    } else {
      return colorPalette.text;
    }
  };
  const getToggleIconColor = (selected: boolean) => {
    if (!selected) return colorPalette.icon.primary;
    if (currentTheme === 'dark') {
      return colorPalette.icon.inverted;
    } else {
      return colorPalette.icon.primary;
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colorPalette.bg }}>
      <View className="flex-1 items-start justify-start px-6 pt-4 gap-y-4" style={{ backgroundColor: colorPalette.bg }}>
        <View className="flex-row items-center w-full gap-x-1 mb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeftIcon width={28} height={28} fill={colorPalette.icon.primary} />
          </TouchableOpacity>
          <Text className="text-[22px] font-semibold" style={{ color: colorPalette.textHeader }}>
            Settings
          </Text>
        </View>
        <View className="flex-row items-center justify-between w-full gap-x-1">
          <Text className="text-[17px] font-medium w-[100px]" style={{ color: colorPalette.text }}>
            Theme
          </Text>
          <View className="flex-row rounded-2xl p-1.5 min-w-[180px] items-center justify-center"
            style={{ backgroundColor: colorPalette.surface2 }}>
            <TouchableOpacity
              className={`flex-row items-center justify-center rounded-xl px-4 py-2 ${currentTheme === 'light' ? 'bg-white' : ''}`}
              style={getToggleStyle(currentTheme === 'light')}
              activeOpacity={1}
              onPress={() => setTheme('light')}
            >
              <SunIcon width={22} height={22} fill={getToggleIconColor(currentTheme === 'light')} />
              <Text className="text-[16px] font-medium ml-2" style={{ color: getToggleTextColor(currentTheme === 'light') }}>
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center justify-center rounded-xl px-4 py-2 ${currentTheme === 'dark' ? 'bg-white' : ''}`}
              style={getToggleStyle(currentTheme === 'dark')}
              activeOpacity={1}
              onPress={() => setTheme('dark')}
            >
              <MoonIcon width={22} height={22} fill={getToggleIconColor(currentTheme === 'dark')} />
              <Text className="text-[16px] font-medium ml-2" style={{ color: getToggleTextColor(currentTheme === 'dark') }}>
                Dark
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings; 