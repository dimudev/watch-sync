'use client'
import AppHeader from '@/components/base/header/AppHeader'
import Chat from '@/components/global/chat/Chat'
import ModalName from '@/components/global/modal/ModalName'
import Player from '@/components/global/Player'
import VideoQueue from '@/components/global/queue/VideoQueue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const Home = () => {

  return (
    <div className='h-dvh w-dvw grid grid-rows-12 gap-2  dark:bg-zinc-800/70 lg:grid-cols-12 lg:px-6'>
      <header className='grid grid-cols-6 grid-rows-4 gap-2 row-span-2 px-2 sticky top-0 lg:col-span-12 lg:row-span-1  '>
        <AppHeader />
      </header>

      <main className=' row-span-5  px-2  lg:col-span-8 lg:row-span-11 lg:pb-6 '>
        <Player />
      </main>
      <aside className='row-span-5 pb-2 px-2 w-dvw h-full lg:col-span-4 lg:w-full lg:row-span-11 lg:pb-6  '>
        <Tabs defaultValue="live-chat" className='h-full'>
          <TabsList className='w-full'>
            <TabsTrigger className='cursor-pointer' value="live-chat">Chat</TabsTrigger>
            <TabsTrigger className='cursor-pointer' value="queue">Queue</TabsTrigger>
          </TabsList>
          <TabsContent value="live-chat" className='h-[calc(100%-40px)] w-full'>
            <Chat />
          </TabsContent>
          <TabsContent value="queue" className='h-[calc(100%-40px)] w-full'>
            <VideoQueue />
          </TabsContent>
        </Tabs>
      </aside>
      <ModalName />
    </div>
  )
}

export default Home