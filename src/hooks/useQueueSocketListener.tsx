import { useEffect } from 'react'
import { useSocketStore } from '@/store/socketStore'
import { useQueueStore } from '@/store/queueStore'

export const useQueueSocketListener = () => {
  const socket = useSocketStore((state) => state.socket)
  const setQueue = useQueueStore((state) => state.setQueue)
  const addToQueue = useQueueStore((state) => state.addToQueue)

  useEffect(() => {
    if (!socket) return
    socket.on('initial-queue', (videos) => {
      setQueue(videos);
    });

    socket.on('queue-update', (newQueue) => {
      setQueue(newQueue); // reemplaza la lista completa
    });

    return () => {
      socket.off('initial-queue');
      socket.off('queue-update');
    };

  }, [addToQueue, setQueue, socket]);
}
