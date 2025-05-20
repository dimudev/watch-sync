import { create } from 'zustand'
import { Socket } from 'socket.io-client'

interface ISocketStore {
  socket: Socket | null
  online: boolean,
  clientsConnected: number,
  setClientsConnected: (clientsConnected: number) => void
  setSocket: (socket: Socket) => void
  setOnline: (online: boolean) => void
}

export const useSocketStore = create<ISocketStore>((set) => ({
  socket: null,
  online: false,
  clientsConnected: 0,
  setClientsConnected: (clientsConnected) => set({ clientsConnected }),
  setSocket: (socket) => set({ socket }),
  setOnline: (online) => set({ online }),
}))
