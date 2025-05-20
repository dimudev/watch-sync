// hooks/useSocket.ts
import { useSocketStore } from '@/store/socketStore'
import { useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'

export const useSocket = (url = 'http://localhost:8080') => {
  const socketRef = useRef<Socket | null>(null)
  const setSocket = useSocketStore((state) => state.setSocket)
  const setOnline = useSocketStore((state) => state.setOnline)
  const setClientsConnected = useSocketStore((state) => state.setClientsConnected)


  useEffect(() => {
    const socket = io(url)
    socketRef.current = socket

    setSocket(socket)
    setOnline(socket.connected)

    const handleConnect = () => setOnline(true)
    const handleDisconnect = () => setOnline(false)

    socket.on('clients-count', (clientsConnected) => {
      setClientsConnected(clientsConnected)
    })

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.disconnect()
    }
  }, [url, setSocket, setOnline, setClientsConnected])
}
