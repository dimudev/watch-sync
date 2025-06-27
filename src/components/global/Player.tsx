import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { useSocketStore } from '@/store/socketStore'
import { ReactPlayerProps } from 'react-player'
import { YouTubePlayerProps } from 'react-player/youtube'
import dynamic from 'next/dynamic'

const YouTubePlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})



const Player = () => {

  const socket = useSocketStore((state) => state.socket)

  const currentVideo = usePlayerStore((state) => state.currentVideo)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const setCurrentVideo = usePlayerStore((state) => state.setCurrentVideo)
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying)

  const playerRef = useRef<YouTubePlayerProps>(null)
  const SEEK_THRESHOLD = 2; // segundos
  const MAX_FALSE_SEEKS = 0; // tolerancia de falsos positivos

  const lastPlayedRef = useRef(0);
  const lastSeekFromSocketRef = useRef(0);
  const falseSeekCounter = useRef(0);

  const [readyTime, setReadyTime] = useState(0)

  const [isDocumentHidden, setIsDocumentHidden] = useState(false)
  const videoChangeFromQueue = useRef(false);

  const wasTabJustFocused = useRef(false)

  const handlePlayVideo = useCallback(() => {
    const current = playerRef?.current?.getCurrentTime() ?? 0
    socket?.emit('play-video', { isPlaying: true, currentTime: current  });
  }, [socket]);

  const handlePauseVideo = useCallback(() => {
    const current = playerRef?.current?.getCurrentTime() ?? 0
    socket?.emit('pause-video', { isPlaying: false, currentTime: current });
  }, [socket]);

  const handleReady = () => {
    playerRef?.current?.seekTo(readyTime, 'seconds');
  };

  const handleProgress: ReactPlayerProps['onProgress'] = (state) => {
    const currentTime = state.playedSeconds;
    const lastTime = lastPlayedRef.current;

    const diff = Math.abs(currentTime - lastTime);

    // 1. Si la diferencia es menor al umbral, solo actualiza y sal
    if (diff < SEEK_THRESHOLD) {
      lastPlayedRef.current = currentTime;
      falseSeekCounter.current = 0;
      return;
    }

    // 2. Si este seek fue causado por socket, lo ignoramos
    if (Math.abs(currentTime - lastSeekFromSocketRef.current) < SEEK_THRESHOLD) {
      console.log('⏭ Ignorando seek provocado por socket');
      lastPlayedRef.current = currentTime;
      return;
    }

    // 3. Filtrar falsos positivos: si ocurre varias veces seguidas, lo ignoramos
    if (falseSeekCounter.current < MAX_FALSE_SEEKS) {
      falseSeekCounter.current++;
      lastPlayedRef.current = currentTime;
      console.log('⚠️ Posible falso positivo de seek, ignorado');
      return;
    }

    // 4. Si llegó aquí, es un seek manual legítimo
    console.log('✅ Seek manual detectado en:', currentTime);
    socket?.emit('seek-video', currentTime);
    falseSeekCounter.current = 0;

    lastPlayedRef.current = currentTime;
  };


  
  const handleEndVideo = () => { 
    socket?.emit('end-video')
  }


  useEffect(() => {

    if (!socket) return

    socket.emit('request-video-state');


    socket.on('update-current-video', ({ videoInfo, isPlaying }) => {
      videoChangeFromQueue.current = true; // 🔥 Marcamos que el cambio vino desde la cola
      setCurrentVideo(videoInfo);
      setIsPlaying(isPlaying);
    });

    socket.on('play-video', ({ isPlaying }) => {
      setIsPlaying(isPlaying);
    });

    socket.on('pause-video', ({ isPlaying }) => {
      setIsPlaying(isPlaying);
    });


    socket.on('seek-video', (time) => {
      console.log('📥 Recibido seek desde otro usuario:', time);
      lastSeekFromSocketRef.current = time; 
      playerRef.current?.seekTo(time, 'seconds');
    })

    socket.on('video-state', ({currentVideo, isPlaying, currentTime}) => {
      setCurrentVideo(currentVideo)
      setIsPlaying(isPlaying)
      setReadyTime(currentTime)
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
      socket.off('update-current-video')
      socket.off('pause-video')
      socket.off('play-video')
      socket.off('seek-video')
      socket.off('initial_video_state')

      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    if (!currentVideo) return;

    if (videoChangeFromQueue.current) {
      setReadyTime(0); // 🔁 Si viene desde la cola, empieza desde 0
      videoChangeFromQueue.current = false;
    }

  // Si viene del request-video-state, el readyTime ya viene bien desde el socket
  }, [currentVideo]);


  return (
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
      />
    ) : (
      <div className='bg-black h-full w-full flex items-center justify-center text-white'>No hay video</div>
    )
  )
}

export default Player