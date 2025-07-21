// store/chatStore.ts
import { create } from 'zustand'

type Message = {
  userName: string
  message: string
  time: string
  colorName: string
}

interface ChatState {
  messages: Message[]
  addMessage: (message: Message) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({ messages: [] })
}))
