import { create } from 'zustand'

type IVideo = {
  id: string;
  url: string;
}

interface IPlayerStore {
  currentVideo: IVideo | null;
  isPlaying: boolean;
  setCurrentVideo: (video: IVideo | null ) => void; 
  setIsPlaying: (isPlaying: boolean) => void;
}

export const usePlayerStore = create<IPlayerStore>((set) => ({
  currentVideo: null,
  isPlaying: false,
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}))