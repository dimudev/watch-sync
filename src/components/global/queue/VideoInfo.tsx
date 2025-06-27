import { Button } from '@/components/ui/button'
import { extractYouTubeID } from '@/lib/youtube'
import { useSocketStore } from '@/store/socketStore'
import { Grip, Play, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'


interface Props {
  videoUrl: string
  videoId: string
}

interface VideoData {
  title: string
  thumbnail: string
  channelTitle: string
}

const VideoInfo = ({ videoId, videoUrl }: Props	) => {
  const [videData, setVideoData] = useState<VideoData | null>(null)
  const socket = useSocketStore((state) => state.socket)

  const removeVideoFromQueue = () => { 
    socket?.emit('remove-video', { videoId })
  }

  const playVideoFromQueue = () => { 
    socket?.emit('play-video-from-queue', { videoId })
  }


  useEffect(() => {
    const fetchData = async() => {
      try {
        const videoId = extractYouTubeID(videoUrl)
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YT_API_KEY}`
        )
        const json = await res.json()
        const snippet = json.items?.[0]?.snippet
        if (snippet) {
          setVideoData({
            title: snippet.title,
            thumbnail: snippet.thumbnails.default.url,
            channelTitle: snippet.channelTitle,
          })
        }
      } catch (err) {
        console.error('Error fetching YouTube data:', err)

      }
    }
  
    fetchData()
  }, [videoUrl])
  
  
  return (
    <li  className='flex justify-around items-center  border border-gray-600'>
      <Grip size={16} className="text-zinc-600 cursor-move" />
      <img src={videData?.thumbnail} alt={videData?.title} height={100} width={100} />
      <p>{videData?.title}</p>
      <div className='flex gap-2'>
        <Button onClick={playVideoFromQueue} size={'icon'} >
          <Play />
        </Button>
        <Button onClick={removeVideoFromQueue} size={'icon'} variant={'destructive'}>
          <Trash />
        </Button>
      </div>
    </li>
  )
}

export default VideoInfo