import { create } from 'zustand'


interface IPlayerStore {
  videoUrl: string;
  isPlaying: boolean;
  setUrl: (url: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const usePlayerStore = create<IPlayerStore>((set) => ({
  videoUrl: '',
  isPlaying: false,
  setUrl: (videoUrl) => set({ videoUrl }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}))