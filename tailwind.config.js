/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./app/(tabs)/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'dark': {
          'bg': '#131211',
          'border': '#1D1C1C',
          'surface1': '#1D1C1C',
          'surface2': '#262524',
          'surface-inverted': '#FAFAFA',
          'highlight-caption': '#3B3B3B',
          'highlight-annotation': '#2A2A2A',
          'text-header': '#FAFAFA',
          'text-body': '#F2F1EF',
          'text-inverted': '#1A1A1A',
          'text-placeholder': '#5B5B5B',
          'text-destructive': '#FF8080',
          'custom-yellow': '#FFE78F',
          'button': {
            'bg': '#222222',
            'bg-destructive': '#4B000D',
            'border': '#666666',
            'border-destructive': '#FF8080',
          },
          'icon': {
            'primary': '#FAFAFA',
            'secondary': '#8C8C8C',
            'tertiary': '#484848',
            'inactive': '#EEEEEE',
            'destructive': '#FF8080',
          },
        },
        'light': {
          'bg': '#FAFAFA',
          'border': '#E8E6E4',
          'surface1': '#EFEFEE',
          'surface2': '#E8E6E4',
          'surface-inverted': '#242424',
          'highlight-caption': '#E3E3E3',
          'highlight-annotation': '#E3E3E3',
          'text-header': '#1A1A1A',
          'text-body': '#242424',
          'text-inverted': '#FAFAFA',
          'text-placeholder': '#A0A0A0',
          'text-destructive': '#FD364A',
          'custom-yellow': '#CCA537',
          'button': {
            'bg': '#FDFDFD',
            'bg-destructive': '#FD364A',
            'border': '#CACACA',
            'border-destructive': '#FFA3A3',
          },
          'icon': {
            'primary': '#1A1A1A',
            'secondary': '#333333',
            'tertiary': '#E4E4E4',
            'inactive': '#B0B0B0',
            'destructive': '#FD364A',
          },
        },
      },
    },
  },
  plugins: [],
}