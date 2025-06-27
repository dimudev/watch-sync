import { create } from 'zustand';


export type IQueueData = {
  id: string;
  url: string;
}


interface IQueueStore {
  queue: Array<IQueueData>;
  setQueue: (videos: Array<IQueueData>) => void;
  addVideo: (video: IQueueData) => void

} 

export const useQueueStore = create<IQueueStore>((set) => ({
  queue: [],
  setQueue: (videos) => set({ queue: videos }),
  addVideo: (video) => set((state) => ({ queue: [...state.queue, video] }))
}))