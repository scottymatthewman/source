// Theme constants extracted from tailwind.config.js
// This provides a central location for all theme values

interface ColorScheme {
  bg: string;
  border: string;
  surface1: string;
  surface2: string;
  highlightCaption: string;
  highlightAnnotation: string;
  textHeader: string;
  text: string;
  textInverted: string;
  textPlaceholder: string;
  textDestructive: string;
  customYellow: string;
  button: {
    bg: string;
    bgDestructive: string;
    border: string;
    borderDestructive: string;
  };
  icon: {
    primary: string;
    secondary: string;
    tertiary: string;
    inactive: string;
    destructive: string;
    inverted: string;
  };
}

interface ThemeColors {
  light: ColorScheme;
  dark: ColorScheme;
}

interface Theme {
  colors: ThemeColors;
  // Add more theme properties as needed
}

const colors: ThemeColors = {
  light: {
    bg: '#FAFAFA',
    border: '#EEEEEE',
    surface1: '#D7D0CB',
    surface2: '#ECECEC',
    highlightCaption: '#E3E3E3',
    highlightAnnotation: '#E3E3E3',
    textHeader: '#1A1A1A',
    text: '#242424',
    textInverted: '#FAFAFA',
    textPlaceholder: '#A0A0A0',
    textDestructive: '#FF4747',
    customYellow: '#CCA537',
    button: {
      bg: '#FDFDFD',
      bgDestructive: '#FFEDED',
      border: '#CACACA',
      borderDestructive: '#FFA3A3',
    },
    icon: {
      primary: '#1A1A1A',
      secondary: '#333333',
      tertiary: '#CCCCCC',
      inactive: '#8C8C8C',
      destructive: '#FF4747',
      inverted: "#FAFAFA"
    },
  },
  dark: {
    bg: '#1A1A1A',
    border: '#333333',
    surface1: '#0B0B0B',
    surface2: '#2A2A2A',
    highlightCaption: '#3B3B3B',
    highlightAnnotation: '#2A2A2A',
    textHeader: '#FFFFFF',
    text: '#FAFAFA',
    textInverted: '#1A1A1A',
    textPlaceholder: '#999999',
    textDestructive: '#FF8080',
    customYellow: '#FFE78F',
    button: {
      bg: '#222222',
      bgDestructive: '#4B000D',
      border: '#666666',
      borderDestructive: '#FF8080',
    },
    icon: {
      primary: '#FFFFFF',
      secondary: '#EEEEEE',
      tertiary: '#484848',
      inactive: '#8C8C8C',
      destructive: '#FF8080',
      inverted: '#1A1A1A'
    },
  },
};

// You can add more theme properties here (spacing, typography, etc.)

const theme: Theme = {
  colors,
  // Add more theme properties as needed
};

export default theme;
