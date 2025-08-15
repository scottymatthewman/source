# Audio Recording System - AI Implementation Requirements

## Project Overview

**Goal**: Implement a simple, reliable audio recording system for a music composition app using React Native + Expo.

**Key Constraint**: Audio must play through main speakers, NOT earpiece (this is the primary issue to solve).

**Tech Stack**: React Native, Expo SDK 53, expo-audio, expo-sqlite, NativeWind

## Current System Analysis

### Existing Audio Implementation

**Current Files to Remove/Replace**:
- `hooks/useAudioRecording.ts` - Complex 284-line hook with state management issues
- `hooks/useAudioPlayback.ts` - Separate playback hook (76 lines)
- `components/audio/RecordingControls.tsx` - Basic UI component (188 lines)
- `components/audio/SaveClipModal.tsx` - Save interface (177 lines)

**Current Integration Points**:
- `app/index.tsx` - Home screen with recording controls
- `app/newSong.tsx` - New song creation with recording
- `app/song/[id].tsx` - Song detail with recording
- `context/clipContext.tsx` - Database operations (KEEP - no changes needed)

**Current Issues**:
1. **Audio Routing**: Sound plays through earpiece instead of main speakers
2. **State Management**: Complex useEffect chains with race conditions
3. **Code Complexity**: Over-engineered with manual timers and state machines
4. **UI Issues**: Basic placeholder UI without proper feedback
5. **Error Handling**: Inconsistent error recovery mechanisms

### Database Schema (KEEP AS-IS)
```sql
-- clips table (no changes needed)
CREATE TABLE clips (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  title TEXT,
  uri TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  date_created TEXT,
  duration INTEGER,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  metadata TEXT
);

-- song_clip_rel table (no changes needed)
CREATE TABLE song_clip_rel (
  song_id INTEGER NOT NULL,
  clip_id INTEGER NOT NULL,
  PRIMARY KEY (song_id, clip_id),
  FOREIGN KEY (song_id) REFERENCES songs(id),
  FOREIGN KEY (clip_id) REFERENCES clips(id)
);
```

## Removal Plan

### Phase 1: Remove Current Audio Implementation

#### 1.1 Remove Audio Hooks
**Files to Delete**:
- `hooks/useAudioRecording.ts`
- `hooks/useAudioPlayback.ts`

**Impact**: These hooks are used in 3 screens and will need replacement.

#### 1.2 Remove Audio Components
**Files to Delete**:
- `components/audio/RecordingControls.tsx`
- `components/audio/SaveClipModal.tsx`

**Impact**: These components are imported and used in 3 screens.

#### 1.3 Clean Up Screen Imports and Usage

**app/index.tsx** - Remove:
```typescript
// Remove these imports
import { RecordingControls } from '../components/audio/RecordingControls';
import SaveClipModal from '../components/audio/SaveClipModal';
import { useAudioRecording } from '../hooks/useAudioRecording';

// Remove these state variables
const { 
  startRecording, 
  stopRecording, 
  isRecording,
  isPlaying,
  duration,
  saveRecording,
  stopPlayback,
  playRecording,
  pauseRecording,
  audioUri, 
  cleanupRecording,
  setIsRecording
} = useAudioRecording();
const [showSaveClipModal, setShowSaveClipModal] = useState(false);
const [showRecordingControls, setShowRecordingControls] = useState(false);

// Remove these functions
const handleStartRecording = () => { /* ... */ };
const handleCloseRecordingControls = () => { /* ... */ };
const handleSaveClip = async (title: string, selectedSongIds: string[]) => { /* ... */ };

// Remove these JSX elements
<RecordingControls ... />
<SaveClipModal ... />
```

**app/newSong.tsx** - Remove:
```typescript
// Remove these imports
import { RecordingControls } from '../components/audio/RecordingControls';
import SaveClipModal from '../components/audio/SaveClipModal';
import { useAudioRecording } from '../hooks/useAudioRecording';

// Remove these state variables
const {
  isRecording,
  isPlaying,
  duration,
  startRecording,
  stopRecording,
  saveRecording,
  stopPlayback,
  playRecording,
  pauseRecording,
  audioUri,
} = useAudioRecording();
const [showSaveClipModal, setShowSaveClipModal] = useState(false);
const [showRecorder, setShowRecorder] = useState(false);

// Remove these functions
const handleCloseRecordingControls = async () => { /* ... */ };
const handleSaveClip = async (title: string, selectedSongIds: string[]) => { /* ... */ };

// Remove these JSX elements
<RecordingControls ... />
<SaveClipModal ... />
```

**app/song/[id].tsx** - Remove:
```typescript
// Remove these imports
import { RecordingControls } from '../../components/audio/RecordingControls';
import SaveClipModal from '../../components/audio/SaveClipModal';
import { useAudioRecording } from '../../hooks/useAudioRecording';

// Remove these state variables
const {
  isRecording,
  isPlaying,
  duration,
  startRecording,
  stopRecording,
  saveRecording,
  stopPlayback,
  playRecording,
  pauseRecording,
  audioUri,
} = useAudioRecording();
const [showSaveClipModal, setShowSaveClipModal] = useState(false);
const [showRecorder, setShowRecorder] = useState(false);

// Remove these functions
const handleCloseRecordingControls = async () => { /* ... */ };
const handleSaveClip = async (title: string, selectedSongIds: string[]) => { /* ... */ };

// Remove these JSX elements
<RecordingControls ... />
<SaveClipModal ... />
```

#### 1.4 Remove Audio-Related State and Logic

**Remove from all screens**:
- Recording state management
- Audio URI state
- Duration tracking
- Playback state
- Error handling for audio
- Animation logic for recording panel
- Save modal state and logic

#### 1.5 Clean Up Styling

**Remove from all screens**:
- Recording panel height calculations
- Animation styles for recording controls
- Audio-related layout adjustments
- Recording-specific styling

### Phase 2: Verify Clean State

#### 2.1 Test App Functionality
- Verify app builds without errors
- Confirm all screens render properly
- Test navigation between screens
- Verify database operations still work
- Test song creation and editing
- Confirm folder management works

#### 2.2 Check for Orphaned Code
- Search for any remaining audio-related imports
- Remove unused state variables
- Clean up unused functions
- Remove unused styling
- Check for console.log statements related to audio

#### 2.3 Update Dependencies (if needed)
- Verify expo-audio is still needed for new implementation
- Check if any audio-related packages can be removed
- Update package.json if necessary

## Implementation Plan

### Phase 3: Implement New Audio System

**After complete removal of old system, implement new system following the requirements below.**

## Core Requirements

### 1. Audio Recording & Playback

**Primary Functionality**:
- Record high-quality audio (AAC, 44.1kHz, stereo)
- Play recorded audio through main speakers
- Save recordings as clips associated with songs
- Simple, reliable state management

**Critical Audio Configuration**:
```typescript
const AUDIO_CONFIG = {
  allowsRecording: true,
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'mixWithOthers',
  shouldRouteThroughEarpiece: false  // CRITICAL: Use main speakers
};
```

### 2. Simple State Management

**Recording States** (keep it simple):
```typescript
type RecordingState = 'idle' | 'recording' | 'playing' | 'error';

interface AudioState {
  state: RecordingState;
  duration: number;
  audioUri: string | null;
  error: string | null;
}
```

**No complex state machines** - use simple enums and let expo-audio handle the complexity.

### 3. Component Architecture

**File Structure**:
```
components/audio/
├── AudioRecorder.tsx          # Main recording component
├── RecordButton.tsx           # Simple record/stop button
├── PlaybackControls.tsx       # Play/pause controls
├── SaveClipModal.tsx          # Save interface
└── AudioRecorderProvider.tsx  # Context provider

hooks/
├── useAudioRecording.ts       # Simple recording logic
└── useAudioPlayback.ts        # Simple playback logic
```

### 4. Implementation Requirements

#### 4.1 Recording Hook (useAudioRecording.ts)
```typescript
export function useAudioRecording() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [state, setState] = useState<AudioState>({
    state: 'idle',
    duration: 0,
    audioUri: null,
    error: null
  });

  // Set audio mode once on mount
  useEffect(() => {
    Audio.setAudioModeAsync(AUDIO_CONFIG);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      setState(prev => ({ ...prev, state: 'recording' }));
    } catch (error) {
      setState(prev => ({ ...prev, state: 'error', error: error.message }));
    }
  }, [recorder]);

  const stopRecording = useCallback(async () => {
    try {
      await recorder.stop();
      const uri = recorder.uri;
      setState(prev => ({ 
        ...prev, 
        state: 'idle', 
        audioUri: uri 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, state: 'error', error: error.message }));
    }
  }, [recorder]);

  return {
    state,
    startRecording,
    stopRecording,
    duration: recorder.currentTime
  };
}
```

#### 4.2 Playback Hook (useAudioPlayback.ts)
```typescript
export function useAudioPlayback(audioUri: string | null) {
  const player = useAudioPlayer(audioUri);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(async () => {
    if (!audioUri) return;
    try {
      await player.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Playback error:', error);
    }
  }, [audioUri, player]);

  const pause = useCallback(async () => {
    try {
      await player.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error('Pause error:', error);
    }
  }, [player]);

  const stop = useCallback(async () => {
    try {
      await player.pause();
      await player.seekTo(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Stop error:', error);
    }
  }, [player]);

  return { isPlaying, play, pause, stop };
}
```

#### 4.3 Main Recording Component (AudioRecorder.tsx)
```typescript
export function AudioRecorder() {
  const { state, startRecording, stopRecording, duration } = useAudioRecording();
  const { isPlaying, play, pause, stop } = useAudioPlayback(state.audioUri);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleRecordPress = () => {
    if (state.state === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePlayPress = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <View>
      <RecordButton 
        isRecording={state.state === 'recording'}
        onPress={handleRecordPress}
        duration={duration}
      />
      
      {state.audioUri && (
        <PlaybackControls
          isPlaying={isPlaying}
          onPlay={handlePlayPress}
          onStop={stop}
          onSave={() => setShowSaveModal(true)}
        />
      )}
      
      <SaveClipModal
        visible={showSaveModal}
        audioUri={state.audioUri}
        onClose={() => setShowSaveModal(false)}
      />
    </View>
  );
}
```

### 5. Database Integration

**Use existing clipContext.tsx** - no changes needed to database schema or context.

**Save flow**:
```typescript
const saveRecording = async (title: string, songIds: string[]) => {
  if (!audioUri) return;
  
  // Use existing createClip function from clipContext
  const clip = await createClip(audioUri, title, duration);
  
  // Create song relationships
  for (const songId of songIds) {
    await db.runAsync(
      'INSERT INTO song_clip_rel (song_id, clip_id) VALUES (?, ?)',
      [songId, clip.id]
    );
  }
  
  return clip;
};
```

### 6. UI Components

#### 6.1 Record Button (RecordButton.tsx)
```typescript
interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  duration: number;
}

export function RecordButton({ isRecording, onPress, duration }: RecordButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.button,
        isRecording && styles.recording
      ]}
    >
      <Icon name={isRecording ? 'stop' : 'record'} />
      {isRecording && (
        <Text>{formatDuration(duration)}</Text>
      )}
    </TouchableOpacity>
  );
}
```

#### 6.2 Playback Controls (PlaybackControls.tsx)
```typescript
interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSave: () => void;
}

export function PlaybackControls({ isPlaying, onPlay, onStop, onSave }: PlaybackControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPlay}>
        <Icon name={isPlaying ? 'pause' : 'play'} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onStop}>
        <Icon name="stop" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onSave}>
        <Icon name="save" />
      </TouchableOpacity>
    </View>
  );
}
```

### 7. Integration Points

#### 7.1 Screen Integration
**Home Screen** (`app/index.tsx`):
```typescript
export default function Index() {
  const [showRecorder, setShowRecorder] = useState(false);
  
  return (
    <SafeAreaView>
      {/* Existing content */}
      
      {showRecorder && (
        <AudioRecorder />
      )}
      
      <FloatingActionButton onPress={() => setShowRecorder(true)} />
    </SafeAreaView>
  );
}
```

**Song Detail** (`app/song/[id].tsx`):
```typescript
export default function SongDetail() {
  const [showRecorder, setShowRecorder] = useState(false);
  
  return (
    <SafeAreaView>
      {/* Existing content */}
      
      {showRecorder && (
        <AudioRecorder />
      )}
      
      <TouchableOpacity onPress={() => setShowRecorder(true)}>
        <Text>Record Clip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

### 8. Error Handling

**Keep it simple**:
```typescript
// In hooks, catch errors and set error state
try {
  await recorder.record();
} catch (error) {
  setState(prev => ({ ...prev, state: 'error', error: error.message }));
}

// In components, show error messages
{state.error && (
  <Text style={styles.error}>{state.error}</Text>
)}
```

### 9. Testing Requirements

**Unit Tests**:
- Test recording start/stop
- Test playback play/pause
- Test save functionality
- Test error handling

**Integration Tests**:
- Test database operations
- Test file system operations
- Test audio routing (main speakers vs earpiece)

### 10. Success Criteria

**Functional**:
- ✅ Audio records properly
- ✅ Audio plays through main speakers (not earpiece)
- ✅ Recordings save to database
- ✅ Song-clip relationships work

**Technical**:
- ✅ Simple, maintainable code
- ✅ No complex state machines
- ✅ Proper error handling
- ✅ Clean component separation

**User Experience**:
- ✅ Intuitive recording workflow
- ✅ Responsive controls
- ✅ Clear visual feedback
- ✅ Reliable operation

### 11. Implementation Order

1. **Create simple recording hook** (useAudioRecording.ts)
2. **Create simple playback hook** (useAudioPlayback.ts)
3. **Build basic UI components** (RecordButton, PlaybackControls)
4. **Integrate with existing database** (use clipContext)
5. **Test audio routing** (ensure main speakers)
6. **Add error handling**
7. **Integrate into screens**
8. **Test and polish**

### 12. Key Principles

- **Keep it simple** - No over-engineering
- **Use library features** - Let expo-audio handle complexity
- **Single responsibility** - Each component does one thing
- **Testable code** - Pure functions, minimal side effects
- **Progressive enhancement** - Start simple, add features later

## Complete Implementation Strategy

### Step-by-Step Execution Plan

#### Step 1: Remove Old System (Day 1)
1. **Delete old files**:
   ```bash
   rm hooks/useAudioRecording.ts
   rm hooks/useAudioPlayback.ts
   rm components/audio/RecordingControls.tsx
   rm components/audio/SaveClipModal.tsx
   ```

2. **Clean up screen imports** - Remove all audio-related imports from:
   - `app/index.tsx`
   - `app/newSong.tsx`
   - `app/song/[id].tsx`

3. **Remove audio state and logic** - Strip out all audio-related code from screens

4. **Test clean state** - Verify app builds and runs without audio functionality

#### Step 2: Implement New System (Days 2-3)
1. **Create new hooks**:
   - `hooks/useAudioRecording.ts` (simple version)
   - `hooks/useAudioPlayback.ts` (simple version)

2. **Create new components**:
   - `components/audio/AudioRecorder.tsx`
   - `components/audio/RecordButton.tsx`
   - `components/audio/PlaybackControls.tsx`
   - `components/audio/SaveClipModal.tsx`

3. **Test audio routing** - Ensure audio plays through main speakers

#### Step 3: Integrate New System (Day 4)
1. **Add to screens**:
   - `app/index.tsx` - Add recording button
   - `app/newSong.tsx` - Add recording functionality
   - `app/song/[id].tsx` - Add recording functionality

2. **Test integration** - Verify recording and playback work in all contexts

#### Step 4: Polish and Test (Day 5)
1. **Error handling** - Add proper error states and recovery
2. **UI polish** - Improve styling and user experience
3. **Testing** - Test all scenarios and edge cases
4. **Documentation** - Update any relevant documentation

### Testing Strategy

#### Unit Tests
- Test recording hook functionality
- Test playback hook functionality
- Test component rendering
- Test error handling

#### Integration Tests
- Test recording → save → playback flow
- Test database operations
- Test file system operations
- Test audio routing (main speakers vs earpiece)

#### User Acceptance Tests
- Test recording workflow in all screens
- Test playback quality and routing
- Test save and association functionality
- Test error recovery scenarios

### Success Metrics

#### Functional Success
- ✅ Audio records properly
- ✅ Audio plays through main speakers (not earpiece)
- ✅ Recordings save to database correctly
- ✅ Song-clip relationships work properly
- ✅ No crashes or errors in normal usage

#### Technical Success
- ✅ Simple, maintainable code structure
- ✅ No complex state machines or race conditions
- ✅ Proper error handling and recovery
- ✅ Clean separation of concerns
- ✅ Performance meets requirements

#### User Experience Success
- ✅ Intuitive recording workflow
- ✅ Responsive controls with proper feedback
- ✅ Clear visual indicators for all states
- ✅ Reliable operation across all scenarios
- ✅ Consistent behavior across all screens

### Risk Mitigation

#### Technical Risks
- **Audio routing issues**: Test thoroughly on multiple devices
- **State management complexity**: Keep implementation simple
- **Database integration**: Use existing clipContext without changes
- **File system operations**: Implement proper error handling

#### User Experience Risks
- **Confusing workflow**: Follow established patterns
- **Poor performance**: Optimize for responsiveness
- **Inconsistent behavior**: Test across all integration points
- **Accessibility issues**: Ensure proper accessibility support

This document provides a comprehensive roadmap for safely removing the current problematic audio system and implementing a new, reliable system that solves the core audio routing issue while maintaining clean, maintainable code.
