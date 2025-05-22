export const MUSICAL_KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const;

export type MusicalKey = typeof MUSICAL_KEYS[number];

// Helper function to check if a string is a valid musical key
export const isValidMusicalKey = (key: string): key is MusicalKey => {
  return MUSICAL_KEYS.includes(key as MusicalKey);
}; 