# Slant - Audio Recording App

A modern React Native application built with Expo for audio recording and management. Slant provides a seamless experience for recording, playing, and managing audio clips with a beautiful and intuitive user interface.

## Features

- 🎙️ High-quality audio recording
- 🎵 Audio playback with waveform visualization
- 💾 Local storage of audio clips
- 🎨 Modern UI with NativeWind (Tailwind CSS)
- 📱 Cross-platform support (iOS, Android, Web)
- 🔄 Real-time audio metering
- 🎯 Type-safe development with TypeScript

## Tech Stack

- **Framework**: React Native with Expo (SDK 53)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router
- **Database**: SQLite (via expo-sqlite)
- **Audio**: expo-audio
- **State Management**: React Context
- **Icons**: @expo/vector-icons

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio & Android SDK (for Android development)

## Getting Started

1. Clone the repository
   ```bash
   git clone [your-repo-url]
   cd Slant
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Run on your preferred platform
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
├── app/           # Main application code (Expo Router)
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── context/       # React Context providers
├── constants/     # Application constants
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── assets/        # Static assets (images, fonts)
```

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android
- `npm run ios` - Start the app on iOS
- `npm run web` - Start the app in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset the project to a clean state

### Audio Recording

The app uses `expo-audio` for high-quality audio recording with the following features:
- Configurable audio quality
- Real-time metering
- Background audio support
- File system integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Your chosen license]

## Contact

[Your contact information]