'use client'

import { ReactNode } from 'react'
import { useSocket } from '@/hooks/useSocket'

interface Props {
  children: ReactNode
}

export const SocketProvider = ({ children }: Props) => {
  useSocket() 
  return children
}
