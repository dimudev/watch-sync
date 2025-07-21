'use client'

import { ReactNode } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useQueueSocketListener } from '@/hooks/useQueueSocketListener'
import { useSocketChatListener } from '@/hooks/useChatSocketListener'

interface Props {
  children: ReactNode
}

export const SocketProvider = ({ children }: Props) => {
  useSocket() 
  useQueueSocketListener()
  useSocketChatListener()
  return children
}
