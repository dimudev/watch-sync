import { create } from 'zustand';

interface IUserStore {
    name: string;
    setName: (name: string) => void;
  }
  
export const useUserStore = create<IUserStore>((set) => ({
  name: '',
  setName: (name: string) => set(() => ({ name })),
}));
