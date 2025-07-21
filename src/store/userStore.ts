import { create } from 'zustand';

interface IUserStore {
    userName: string;
    colorName: string
    setUserName: (userName: string) => void;
    setColorName: (colorName: string) => void

  }
  
export const useUserStore = create<IUserStore>((set) => ({
  userName: '',
  colorName: '#ffffff',
  setUserName: (userName: string) => set(() => ({ userName })),
  setColorName: (colorName: string) => set(() => ({ colorName }))
}));
