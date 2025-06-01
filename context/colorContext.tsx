import React, { createContext, useContext } from 'react';

interface ColorPalette {
    background: string;
    surface1: string;
    surface2: string;
    text: {
        primary: string;
        secondary: string;
    };
    icon: {
        primary: string;
        secondary: string;
    };
}

const lightPalette: ColorPalette = {
    background: '#FFFFFF',
    surface1: '#F5F5F5',
    surface2: '#EEEEEE',
    text: {
        primary: '#000000',
        secondary: '#666666',
    },
    icon: {
        primary: '#000000',
        secondary: '#666666',
    },
};

const darkPalette: ColorPalette = {
    background: '#121212',
    surface1: '#1E1E1E',
    surface2: '#2D2D2D',
    text: {
        primary: '#FFFFFF',
        secondary: '#AAAAAA',
    },
    icon: {
        primary: '#FFFFFF',
        secondary: '#AAAAAA',
    },
};

interface ColorContextType {
    colorPalette: ColorPalette;
    isDark: boolean;
    toggleTheme: () => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = React.useState(false);
    const colorPalette = isDark ? darkPalette : lightPalette;

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <ColorContext.Provider value={{ colorPalette, isDark, toggleTheme }}>
            {children}
        </ColorContext.Provider>
    );
}

export function useColorPalette() {
    const context = useContext(ColorContext);
    if (context === undefined) {
        throw new Error('useColorPalette must be used within a ColorProvider');
    }
    return context;
} 