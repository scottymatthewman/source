import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import theme from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: theme.colors.light.bg,
            borderTopWidth: 1,
            borderTopColor: theme.colors.light.border,
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <></>,
        }}
      />
      <Tabs.Screen
        name="newSong"
        options={{
          headerShown: false,
          title: 'New Song',
          tabBarIcon: ({ color }) => <></>,
        }}
      />
    </Tabs>
  );
}