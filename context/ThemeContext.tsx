import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isTablet: boolean;
  screenDimensions: { width: number; height: number };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  
  // Check if device is tablet
  const isTablet = Platform.OS === 'ios' && Math.min(screenDimensions.width, screenDimensions.height) >= 768;
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTablet, screenDimensions }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
