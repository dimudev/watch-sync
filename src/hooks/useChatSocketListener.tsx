// hooks/useSocketChatListener.ts
import { useEffect } from 'react'
import { useSocketStore } from '@/store/socketStore'
import { useChatStore } from '@/store/chatStore'

export const useSocketChatListener = () => {
  const socket = useSocketStore((state) => state.socket)
  const addMessage = useChatStore((state) => state.addMessage)

  useEffect(() => {
    socket?.on('new-message', (message) => {
      addMessage(message)
    })

    return () => {
      socket?.off('new-message', addMessage)
    }
  }, [addMessage, socket])
}
