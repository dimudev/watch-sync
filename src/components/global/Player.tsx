import { usePlayerStore } from '@/store/playerStore'
import { useSocketStore } from '@/store/socketStore'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ReactPlayerProps } from 'react-player'
import { YouTubePlayerProps } from 'react-player/youtube'

const YouTubePlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})

const Player = () => {
  const socket = useSocketStore((state) => state.socket)
  const videoUrl = usePlayerStore((state) => state.videoUrl)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const playerRef = useRef<YouTubePlayerProps>(null)
  const lastTimeRef = useRef(0)
  const isSeekingRef = useRef(false)
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying)
  const setVideoUrl = usePlayerStore((state) => state.setUrl)
  const [readyTime, setReadyTime] = useState(0)

  const [isDocumentHidden, setIsDocumentHidden] = useState(false)
  const wasTabJustFocused = useRef(false)


  const handleProgress: ReactPlayerProps['onProgress'] = (state) => {
    const currentTime = state.playedSeconds
    const lastTime = lastTimeRef.current

    if (Math.abs(currentTime - lastTime) > 1.5 && !isSeekingRef.current) {
      console.log('🔁 Usuario adelantó/retrocedió a', currentTime.toFixed(2))
      socket?.emit('seek-video', { time: currentTime })
    }

    lastTimeRef.current = currentTime
  }

  const handlePauseVideo = useCallback(() => {
    if (isDocumentHidden) return
    socket?.emit('pause-video')
    setIsPlaying(false)
  }, [isDocumentHidden, setIsPlaying, socket])

  const handlePlayVideo = useCallback(() => {
    if (wasTabJustFocused.current) return
    socket?.emit('play-video')
    setIsPlaying(true)
  }, [setIsPlaying, socket])


  const handleReady = () => {
    // Busca a los 14.8759 segundos
    playerRef?.current?.seekTo(readyTime, 'seconds');
    // playerRef?.current?.seekTo(readyTime, 'seconds');
    // playerRef?.current.seekTo(14.875947158309936, 'seconds');
  };


  useEffect(() => {
    if (!socket) return

    socket.on('new-video', ({ url }) => {
      setVideoUrl(url)
    })
    socket.on('play-video', (data) => {
      setIsPlaying(data)
    })
    socket.on('pause-video', (data) => {
      setIsPlaying(data)
    })

    socket.on('seek-video', ({ time }: { time: number }) => {
      isSeekingRef.current = true
      playerRef.current?.seekTo(time, 'seconds')
      setTimeout(() => {
        isSeekingRef.current = false
      }, 1000) // evitar loops de sincronización
    })

    socket.on('request-video-state', (newClientId) => {
      if (videoUrl) {
        socket.emit('send-video-state', {
          to: newClientId,
          state: {
            url: videoUrl,
            time: playerRef.current?.getCurrentTime(),
            isPlaying
          }
        });
      }
    });

    socket.on('video-state', ({ url, time, isPlaying }) => {
      setVideoUrl(url)
      setReadyTime(time)
      setIsPlaying(isPlaying)

    })

    const handleVisibilityChange = () => {
      const isHidden = document.visibilityState === 'hidden'
      setIsDocumentHidden(isHidden)

      if (!isHidden) {
        // Acabas de volver a la pestaña
        wasTabJustFocused.current = true

        // Después de un tiempo breve, ya no estás "recién vuelto"
        setTimeout(() => {
          wasTabJustFocused.current = false
        }, 300)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      socket.off('pause-video')
      socket.off('play-video')
      socket.off('new-video')
      socket.off('request-video-state')
      socket.off('send-video-state')
      socket.off('video-state')
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isPlaying, setIsPlaying, setVideoUrl, socket, videoUrl])
  
  return (
    <div className='bg-red-500 w-full h-[400px]'>
      <h1>isPlaying: {isPlaying ? 'true' : 'false'}</h1>
      <YouTubePlayer
        ref={playerRef}
        url={videoUrl}
        playing={isPlaying}
        controls
        onPause={handlePauseVideo}
        onPlay={handlePlayVideo}
        onProgress={handleProgress}
        onReady={handleReady}
      />
    </div>
  )
}

export default Player
