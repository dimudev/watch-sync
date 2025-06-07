import { create } from 'zustand';

interface IUserStore {
    userName: string;
    setUserName: (userName: string) => void;
  }
  
export const useUserStore = create<IUserStore>((set) => ({
  userName: '',
  setUserName: (userName: string) => set(() => ({ userName })),
}));
