'use client'

import { ReactNode } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useQueueSocketListener } from '@/hooks/useQueueSocketListener'

interface Props {
  children: ReactNode
}

export const SocketProvider = ({ children }: Props) => {
  useSocket() 
  useQueueSocketListener()
  return children
}
