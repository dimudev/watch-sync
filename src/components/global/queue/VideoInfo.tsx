import { Button } from '@/components/ui/button'
import { useQueueStore } from '@/store/queueStore'
import { useSocketStore } from '@/store/socketStore'
import { Play, Trash } from 'lucide-react'
import { toast } from 'sonner'


interface Props {
  videoId: string
}


const VideoInfo = ({ videoId }: Props	) => {
  const socket = useSocketStore((state) => state.socket)
  const video = useQueueStore((state) =>
    state.queue.find((v) => v.id === videoId)
  )


  
  const removeVideoFromQueue = () => { 
    socket?.emit('remove-video', { videoId })
    toast.success('Video removed', { position: 'top-center', richColors: true, closeButton: true })
  }

  const playVideoFromQueue = () => { 
    socket?.emit('play-video-from-queue', { videoId })
  }

  if (!video) return null

  return (
    <li className="w-full max-w-full flex items-center gap-2 rounded  overflow-hidden  p-2 dark:hover:bg-zinc-800">
      <img
        src={video?.thumbnail}
        alt={video?.title}
        width={65}
        height={65}
        className="shrink-0 rounded"
      />
      <div className="flex flex-col flex-1 gap-1 w-20 ">
        <p className="flex-1 truncate text-sm">
          {video?.title ?? 'Título del video'}
        </p>
        <p className='text-sm font-medium'>
          {video?.channelTitle ?? 'Canal'}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button onClick={playVideoFromQueue} size="icon" className="shrink-0">
          <Play />
        </Button>
        <Button onClick={removeVideoFromQueue} size="icon" variant="destructive" className="shrink-0">
          <Trash />
        </Button>
      </div>
    </li>
  )
}

export default VideoInfo



