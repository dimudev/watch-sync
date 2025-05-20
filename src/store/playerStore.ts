import { create } from 'zustand'


interface IPlayerStore {
  url: string;
  setUrl: (url: string) => void
}

export const usePlayerStore = create<IPlayerStore>((set) => ({
  url: '',
  setUrl: (url) => set({ url })
}))