// store/queueStore.ts
import { create } from 'zustand';

interface Video {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface QueueState {
  queue: Video[];
  setQueue: (videos: Video[]) => void;
  addToQueue: (video: Video) => void;
  removeFromQueue: (videoId: string) => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  queue: [],
  setQueue: (videos) => set({ queue: videos }),
  addToQueue: (video) => set((state) => ({ queue: [...state.queue, video] })),
  removeFromQueue: (videoId) =>
    set((state) => ({
      queue: state.queue.filter((video) => video.id !== videoId),
    })),
}));
