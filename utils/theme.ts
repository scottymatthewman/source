import { useTheme } from '../context/ThemeContext';

export const useThemeClasses = () => {
  const { theme: currentTheme } = useTheme();
  
  return {
    text: {
      header: currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header',
      body: currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body',
      secondary: currentTheme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary',
      placeholder: currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder',
    },
    bg: {
      main: currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg',
      surface: currentTheme === 'dark' ? 'bg-dark-surface-2' : 'bg-light-surface-2',
    },
    border: {
      surface: currentTheme === 'dark' ? 'border-dark-surface-2' : 'border-light-surface-2',
    },
  };
}; 