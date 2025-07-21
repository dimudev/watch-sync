import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { useSocketStore } from '@/store/socketStore'
import { ReactPlayerProps } from 'react-player'
import { YouTubePlayerProps } from 'react-player/youtube'
import dynamic from 'next/dynamic'
import {  Users, VideoOff } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

const YouTubePlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})

const SEEK_THRESHOLD = 2 
const MAX_FALSE_SEEKS = 0


const Player = () => {

  const socket = useSocketStore((state) => state.socket)
  const clientsConnected = useSocketStore((state) => state.clientsConnected)
  const currentVideo = usePlayerStore((state) => state.currentVideo)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const setCurrentVideo = usePlayerStore((state) => state.setCurrentVideo)
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying)
  const playerRef = useRef<YouTubePlayerProps>(null)
  const lastPlayedRef = useRef(0)
  const lastSeekFromSocketRef = useRef(0)
  const falseSeekCounter = useRef(0)
  const [readyTime, setReadyTime] = useState(0)
  const videoChangeFromQueue = useRef(false)


  const handlePlayVideo = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      return
    }

    const current = playerRef?.current?.getCurrentTime() ?? 0
    socket?.emit('play-video', { isPlaying: true, currentTime: current })
  }, [socket])

  const handlePauseVideo = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      return
    }

    const current = playerRef?.current?.getCurrentTime() ?? 0;
    socket?.emit('pause-video', { isPlaying: false, currentTime: current })
  }, [socket])

  const handleReady = () => {
    playerRef?.current?.seekTo(readyTime, 'seconds')
  }

  const handleProgress: ReactPlayerProps['onProgress'] = (state) => {
    const currentTime = state.playedSeconds
    const lastTime = lastPlayedRef.current

    const diff = Math.abs(currentTime - lastTime)

    if (diff < SEEK_THRESHOLD) {
      lastPlayedRef.current = currentTime;
      falseSeekCounter.current = 0;
      return;
    }

    if (Math.abs(currentTime - lastSeekFromSocketRef.current) < SEEK_THRESHOLD) {
      lastPlayedRef.current = currentTime;
      return;
    }

    if (falseSeekCounter.current < MAX_FALSE_SEEKS) {
      falseSeekCounter.current++
      lastPlayedRef.current = currentTime
      return;
    }

    socket?.emit('seek-video', currentTime)
    falseSeekCounter.current = 0

    lastPlayedRef.current = currentTime
  }
  
  const handleEndVideo = () => { 
    socket?.emit('end-video')
  }


  useEffect(() => {

    if (!socket) return

    socket.emit('request-video-state')

    socket.on('update-current-video', ({ videoInfo, isPlaying }) => {
      videoChangeFromQueue.current = true
      setCurrentVideo(videoInfo)
      setIsPlaying(isPlaying)
    })

    socket.on('play-video', ({ isPlaying }) => {
      setIsPlaying(isPlaying)
    })

    socket.on('pause-video', ({ isPlaying }) => {
      setIsPlaying(isPlaying)
    })


    socket.on('seek-video', (time) => {
      lastSeekFromSocketRef.current = time
      playerRef.current?.seekTo(time, 'seconds')
    })

    socket.on('video-state', ({currentVideo, isPlaying, currentTime}) => {
      setCurrentVideo(currentVideo)
      setIsPlaying(isPlaying)
      setReadyTime(currentTime)
    })

    return () => {
      socket.off('update-current-video')
      socket.off('pause-video')
      socket.off('play-video')
      socket.off('seek-video')
      socket.off('initial_video_state')
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    if (!currentVideo) return

    if (videoChangeFromQueue.current) {
      setReadyTime(0)
      videoChangeFromQueue.current = false;
    }
  }, [currentVideo])


  return (
    <div className=' w-full h-full flex flex-col '>
      {
        currentVideo ? (
          <YouTubePlayer
            ref={playerRef} 
            url={currentVideo.url}
            playing={isPlaying}
            controls
            onPlay={handlePlayVideo}
            onPause={handlePauseVideo}
            onProgress={handleProgress}
            onReady={handleReady}
            onEnded={handleEndVideo}
            height={'100%'}
            width={'100%'}
          />
        ) : (
          <div className='border  rounded h-full w-full flex flex-col items-center justify-center gap-2 '>
            <VideoOff className='w-12 h-12 text-zinc-400/80 text-pretty' />
            <h1 className='text-2xl font-thin text-zinc-400'>There is no video playing</h1>
          </div>
        )
      }
      <div className=' hidden lg:flex  lg:justify-end lg:pt-2 lg:gap-2'>
        <Badge   variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 lg:h-[30px]" >
          <Users className='w-4 h-4  text-emerald-700' /> 
          <span className=''>{clientsConnected} watching</span>
        </Badge>
        <Button
          size='sm'
          variant='outline'
          className='text-end'
          hidden={!isPlaying}
          onClick={handleEndVideo}
        >
           Skip video
        </Button>
      </div>
    </div>
  )

}

export default Player