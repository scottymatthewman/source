import { AudioPlayer } from 'expo-audio';

export interface AudioPlayerStatus {
  isLoaded: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  rate: number;
  shouldCorrectPitch: boolean;
  volume: number;
  isBuffering: boolean;
  isMuted: boolean;
}

export interface RecordingStatus {
  isRecording: boolean;
  duration: number;
  uri: string | null;
  metering: number;
  isMuted: boolean;
}

export type RecorderState = 'idle' | 'recording' | 'stopped' | 'playing' | 'paused';

export interface AudioClip {
  id: string;
  title: string;
  uri: string;
  duration: number;
  dateCreated: string;
  dateModified: string;
}

export interface AudioPlayerControls {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
}

export interface AudioRecorderControls {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  pauseRecording: () => Promise<void>;
  resumeRecording: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
}

export interface AudioWaveform {
  data: number[];
  duration: number;
  sampleRate: number;
}

export interface AudioRecordingOptions {
  sampleRate?: number;
  channels?: number;
  bitDepth?: number;
  format?: string;
  meteringEnabled?: boolean;
  androidOutputFormat?: string;
  androidAudioEncoder?: string;
  iosOutputFormat?: string;
  iosAudioQuality?: string;
}

export interface AudioPlaybackOptions {
  shouldPlay?: boolean;
  rate?: number;
  shouldCorrectPitch?: boolean;
  volume?: number;
  isMuted?: boolean;
  isLooping?: boolean;
}

export interface AudioPlayerInstance extends AudioPlayer {
  setOnPlaybackStatusUpdate: (callback: (status: AudioPlayerStatus) => void) => void;
  getStatus: () => Promise<AudioPlayerStatus>;
}

export interface AudioRecorderInstance {
  setOnRecordingStatusUpdate: (callback: (status: RecordingStatus) => void) => void;
  getStatus: () => Promise<RecordingStatus>;
  prepareToRecordAsync: (options: AudioRecordingOptions) => Promise<void>;
  startAsync: () => Promise<void>;
  stopAndUnloadAsync: () => Promise<{ uri: string }>;
  pauseAsync: () => Promise<void>;
  resumeAsync: () => Promise<void>;
  getURI: () => string | null;
} 