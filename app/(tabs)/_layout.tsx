import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HomeIcon, MicIcon, WriteIcon } from '../../components/icons';
import theme from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.light.text,
        tabBarInactiveTintColor: theme.colors.light.textPlaceholder,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: theme.colors.light.bg,
            borderTopWidth: 1,
            borderTopColor: theme.colors.light.border,
            paddingTop: 2,
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ focused }) => <HomeIcon width={28} height={28} fill={focused ? theme.colors.light.icon.primary : theme.colors.light.icon.inactive} />,
        }}
      />
      <Tabs.Screen
        name="newSong"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ focused }) => <WriteIcon width={28} height={28} fill={focused ? theme.colors.light.icon.primary : theme.colors.light.icon.inactive} />,
        }}
      />
      <Tabs.Screen
        name="newSongForm"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ focused }) => <MicIcon width={28} height={28} fill={focused ? theme.colors.light.icon.primary : theme.colors.light.icon.inactive} />,
        }}
      />
    </Tabs>
  );
}