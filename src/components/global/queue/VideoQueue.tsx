import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQueueStore } from '@/store/queueStore'
import VideoInfo from './VideoInfo'

const VideoQueue = () => {
  const queue = useQueueStore((state) => state.queue)

  return (
    <Card className="w-full h-full flex flex-col p-2">

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full w-full">
          <ul className="flex flex-col gap-2 w-full">
            {queue.map((video) => (
              <VideoInfo key={video.id} videoId={video.id}  />
            ))}
          </ul>
          
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default VideoQueue