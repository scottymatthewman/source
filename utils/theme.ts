import { useTheme } from '../context/ThemeContext';

export const useThemeClasses = () => {
  const { theme: currentTheme } = useTheme();
  
  return {
    text: {
      header: currentTheme === 'dark' ? 'text-dark-text-header' : 'text-light-text-header',
      body: currentTheme === 'dark' ? 'text-dark-text-body' : 'text-light-text-body',
      secondary: currentTheme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary',
      placeholder: currentTheme === 'dark' ? 'text-dark-text-placeholder' : 'text-light-text-placeholder',
      inverted: currentTheme === 'dark' ? 'text-dark-text-inverted' : 'text-light-text-inverted',
      destructive: currentTheme === 'dark' ? 'text-dark-text-destructive' : 'text-light-text-destructive',
    },
    textSize: (size: string, type: 'header' | 'body' | 'secondary' | 'placeholder' | 'inverted' | 'destructive' = 'body') => {
      return `${size} ${currentTheme === 'dark' ? `text-dark-text-${type}` : `text-light-text-${type}`}`;
    },
    bg: {
      main: currentTheme === 'dark' ? 'bg-dark-bg' : 'bg-light-bg',
      surface1: currentTheme === 'dark' ? 'bg-dark-surface-1' : 'bg-light-surface-1',
      surface2: currentTheme === 'dark' ? 'bg-dark-surface-2' : 'bg-light-surface-2',
      inverted: currentTheme === 'dark' ? 'bg-dark-surface-inverted' : 'bg-light-surface-inverted',
    },
    border: {
      border: currentTheme === 'dark' ? 'border-dark-border' : 'border-light-border',
      borderDestructive: currentTheme === 'dark' ? 'border-dark-border-destructive' : 'border-light-border-destructive',
    },
    icon: {
      primary: currentTheme === 'dark' ? 'text-dark-icon-primary' : 'text-light-icon-primary',
      secondary: currentTheme === 'dark' ? 'text-dark-icon-secondary' : 'text-light-icon-secondary',
      tertiary: currentTheme === 'dark' ? 'text-dark-icon-tertiary' : 'text-light-icon-tertiary',
      destructive: currentTheme === 'dark' ? 'text-dark-icon-destructive' : 'text-light-icon-destructive',
    },
    button: {
      bg: currentTheme === 'dark' ? 'bg-dark-button-bg' : 'bg-light-button-bg',
      bgDisabled: currentTheme === 'dark' ? 'bg-dark-button-bg-disabled' : 'bg-light-button-bg-disabled',
      bgInverted: currentTheme === 'dark' ? 'bg-dark-button-bg-inverted' : 'bg-light-button-bg-inverted',
      bgDestructive: currentTheme === 'dark' ? 'bg-dark-button-bg-destructive' : 'bg-light-button-bg-destructive',
      Border: currentTheme === 'dark' ? 'border-dark-button-border' : 'border-light-button-border',
      BorderDestructive: currentTheme === 'dark' ? 'border-dark-button-border-destructive' : 'border-light-button-border-destructive',
    },
  };
}; 