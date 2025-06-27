import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useQueueStore } from '@/store/queueStore'
import VideoInfo from './VideoInfo'

const VideoQueue = () => {

  const queue = useQueueStore((state) => state.queue)

  return (
    <Card  className='w-full h-full flex flex-col  gap-0 p-0 bg-slate-900 text-white '>
      <CardHeader className='h-[15%] flex items-center'>
        <CardTitle className=' '>Video Queue</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className='h-[80%] p-0'>
        <ScrollArea className='w-full h-full overflow-y-auto'>
          <ul className='w-full h-full flex flex-col'>
            {
              queue.map((video) => (
                <VideoInfo key={video.id} videoId={video.id} videoUrl={video.url} />
              ))
            }
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default VideoQueue