import { useEffect } from 'react'
import { useSocketStore } from '@/store/socketStore'
import { IQueueData, useQueueStore } from '@/store/queueStore'

export const useQueueSocketListener = () => {
  const socket = useSocketStore((state) => state.socket)
  const setQueue = useQueueStore((state) => state.setQueue)

  useEffect(() => {
    if (!socket) return

    const handleQueueUpdate = (updatedQueue: Array<IQueueData>) => {
      setQueue(updatedQueue)
    }

    socket.on('queue-update', handleQueueUpdate)

    return () => {
      socket.off('queue-update', handleQueueUpdate)
    }
  }, [socket, setQueue])
}
