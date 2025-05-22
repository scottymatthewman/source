import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HomeIcon, WriteIcon } from '../../components/icons';
import theme from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme: currentTheme } = useTheme();
  const colorPalette = currentTheme === 'dark' ? theme.colors.dark : theme.colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorPalette.text,
        tabBarInactiveTintColor: colorPalette.textPlaceholder,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: colorPalette.bg,
            borderTopWidth: 1,
            borderTopColor: colorPalette.border,
            paddingTop: 2,
          },
          default: {
            backgroundColor: colorPalette.bg,
            borderTopWidth: 1,
            borderTopColor: colorPalette.border,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ focused }) => (
            <HomeIcon 
              width={28} 
              height={28} 
              fill={focused ? colorPalette.icon.primary : colorPalette.icon.inactive} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="newSong"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ focused }) => (
            <WriteIcon 
              width={28} 
              height={28} 
              fill={focused ? colorPalette.icon.primary : colorPalette.icon.inactive} 
            />
          ),
        }}
      />
    </Tabs>
  );
}