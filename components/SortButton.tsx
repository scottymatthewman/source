import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../utils/theme';
import SortIcon from './icons/SortIcon';
import AIcon from './icons/aIcon';
import LeastRecentIcon from './icons/leastRecentIcon';
import MostRecentIcon from './icons/mostRecentIcon';
import ZIcon from './icons/zIcon';

export type SortOption = 'A_TO_Z' | 'Z_TO_A' | 'MOST_RECENT' | 'LEAST_RECENT';

interface SortButtonProps {
  onSort: (option: SortOption) => void;
  currentSort: SortOption;
}

export const SortButton: React.FC<SortButtonProps> = ({ onSort, currentSort }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme: currentTheme } = useTheme();
  const classes = useThemeClasses();

  const sortOptions: { label: string; value: SortOption; icon: React.ReactNode }[] = [
    { 
      label: 'A to Z', 
      value: 'A_TO_Z',
      icon: <AIcon width={16} height={16} fill={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
    },
    { 
      label: 'Z to A', 
      value: 'Z_TO_A',
      icon: <ZIcon width={16} height={16} fill={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
    },
    { 
      label: 'Most Recent', 
      value: 'MOST_RECENT',
      icon: <MostRecentIcon width={16} height={16} fill={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
    },
    { 
      label: 'Least Recent', 
      value: 'LEAST_RECENT',
      icon: <LeastRecentIcon width={16} height={16} fill={currentTheme === 'dark' ? '#FFFFFF' : '#000000'} />
    },
  ];

  const handleSort = (option: SortOption) => {
    onSort(option);
    setIsModalVisible(false);
  };

  return (
    <View>
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className={`flex-row items-center gap-1 pt-1 pb-1 pl-3 pr-2 ${currentTheme === 'dark' ? 'bg-dark-surface-2' : 'bg-light-surface-2'} rounded-full`}
      >
        <Text className={classes.text.body}>Sort</Text>
        <SortIcon
          width={16}
          height={16}
          fill={currentTheme === 'dark' ? '#FFFFFF' : '#000000'}
        />
      </Pressable>

      {isModalVisible && (
        <View
          className={`absolute top-12 right-0 z-50 rounded-lg shadow-lg ${
            currentTheme === 'dark' ? 'bg-dark-surface-1' : 'bg-light-surface-1'
          }`}
          style={{
            minWidth: 200,
            borderWidth: 1,
            borderColor: currentTheme === 'dark' ? '#333333' : '#E5E5E5',
          }}
        >
          {sortOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleSort(option.value)}
              className={`px-4 py-3 border-b flex-row items-center gap-3 ${
                currentTheme === 'dark' ? 'border-dark-surface-2' : 'border-light-surface-2'
              } ${option.value === currentSort ? 'bg-opacity-10 bg-gray-500' : ''}`}
            >
              {option.icon}
              <Text className={classes.text.body}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}; 