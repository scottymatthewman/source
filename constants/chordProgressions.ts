import { MusicalKey } from './musicalKeys';

type ChordType = 'major' | 'minor' | 'diminished';

interface Chord {
  root: string;
  type: ChordType;
  symbol: string;
}

interface KeyChords {
  [key: string]: {
    [numeral: string]: Chord;
  };
}

// Helper function to create a chord
const chord = (root: string, type: ChordType): Chord => ({
  root,
  type,
  symbol: type === 'major' ? root : type === 'minor' ? `${root}m` : `${root}dim`
});

// Define chord progressions for each key
export const KEY_CHORDS: KeyChords = {
  'C': {
    'I': chord('C', 'major'),
    'ii': chord('D', 'minor'),
    'iii': chord('E', 'minor'),
    'IV': chord('F', 'major'),
    'V': chord('G', 'major'),
    'vi': chord('A', 'minor'),
    'vii°': chord('B', 'diminished')
  },
  'C#': {
    'I': chord('C#', 'major'),
    'ii': chord('D#', 'minor'),
    'iii': chord('F', 'minor'),
    'IV': chord('F#', 'major'),
    'V': chord('G#', 'major'),
    'vi': chord('A#', 'minor'),
    'vii°': chord('C', 'diminished')
  },
  'D': {
    'I': chord('D', 'major'),
    'ii': chord('E', 'minor'),
    'iii': chord('F#', 'minor'),
    'IV': chord('G', 'major'),
    'V': chord('A', 'major'),
    'vi': chord('B', 'minor'),
    'vii°': chord('C#', 'diminished')
  },
  'D#': {
    'I': chord('D#', 'major'),
    'ii': chord('F', 'minor'),
    'iii': chord('G', 'minor'),
    'IV': chord('G#', 'major'),
    'V': chord('A#', 'major'),
    'vi': chord('C', 'minor'),
    'vii°': chord('D', 'diminished')
  },
  'E': {
    'I': chord('E', 'major'),
    'ii': chord('F#', 'minor'),
    'iii': chord('G#', 'minor'),
    'IV': chord('A', 'major'),
    'V': chord('B', 'major'),
    'vi': chord('C#', 'minor'),
    'vii°': chord('D#', 'diminished')
  },
  'F': {
    'I': chord('F', 'major'),
    'ii': chord('G', 'minor'),
    'iii': chord('A', 'minor'),
    'IV': chord('Bb', 'major'),
    'V': chord('C', 'major'),
    'vi': chord('D', 'minor'),
    'vii°': chord('E', 'diminished')
  },
  'F#': {
    'I': chord('F#', 'major'),
    'ii': chord('G#', 'minor'),
    'iii': chord('A#', 'minor'),
    'IV': chord('B', 'major'),
    'V': chord('C#', 'major'),
    'vi': chord('D#', 'minor'),
    'vii°': chord('F', 'diminished')
  },
  'G': {
    'I': chord('G', 'major'),
    'ii': chord('A', 'minor'),
    'iii': chord('B', 'minor'),
    'IV': chord('C', 'major'),
    'V': chord('D', 'major'),
    'vi': chord('E', 'minor'),
    'vii°': chord('F#', 'diminished')
  },
  'G#': {
    'I': chord('G#', 'major'),
    'ii': chord('A#', 'minor'),
    'iii': chord('C', 'minor'),
    'IV': chord('C#', 'major'),
    'V': chord('D#', 'major'),
    'vi': chord('F', 'minor'),
    'vii°': chord('G', 'diminished')
  },
  'A': {
    'I': chord('A', 'major'),
    'ii': chord('B', 'minor'),
    'iii': chord('C#', 'minor'),
    'IV': chord('D', 'major'),
    'V': chord('E', 'major'),
    'vi': chord('F#', 'minor'),
    'vii°': chord('G#', 'diminished')
  },
  'A#': {
    'I': chord('A#', 'major'),
    'ii': chord('C', 'minor'),
    'iii': chord('D', 'minor'),
    'IV': chord('D#', 'major'),
    'V': chord('F', 'major'),
    'vi': chord('G', 'minor'),
    'vii°': chord('A', 'diminished')
  },
  'B': {
    'I': chord('B', 'major'),
    'ii': chord('C#', 'minor'),
    'iii': chord('D#', 'minor'),
    'IV': chord('E', 'major'),
    'V': chord('F#', 'major'),
    'vi': chord('G#', 'minor'),
    'vii°': chord('A#', 'diminished')
  }
};

// Helper function to get chords for a specific key
export const getChordsForKey = (key: MusicalKey) => {
  return KEY_CHORDS[key];
};

// Common chord progressions
export const COMMON_PROGRESSIONS = {
  'I-IV-V': ['I', 'IV', 'V'],
  'I-V-vi-IV': ['I', 'V', 'vi', 'IV'],
  'ii-V-I': ['ii', 'V', 'I'],
  'I-vi-IV-V': ['I', 'vi', 'IV', 'V'],
  'vi-IV-I-V': ['vi', 'IV', 'I', 'V']
} as const;

// Helper function to get a specific progression in a key
export const getProgressionInKey = (key: MusicalKey, progression: keyof typeof COMMON_PROGRESSIONS) => {
  const chords = getChordsForKey(key);
  return COMMON_PROGRESSIONS[progression].map(numeral => ({
    numeral,
    chord: chords[numeral]
  }));
}; 