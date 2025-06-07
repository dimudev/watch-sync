'use client'
import AppHeader from '@/components/base/header/AppHeader'
import Chat from '@/components/global/chat/Chat'
import ModalName from '@/components/global/ModalName'
import Player from '@/components/global/Player'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUserStore } from '@/store/userStore'
import React from 'react'



const Home = () => {
  const userName = useUserStore((state) => state.userName)

  return (
    <div className=' h-dvh grid grid-rows-10 gap-2 bg-slate-800'>
      <div className='0 row-span-2 sm:row-span-1 sticky top-0'>
        <AppHeader />
      </div>
      <div className=' grid grid-rows-8 md:grid-cols-10 sm:grid-rows-9 row-span-8  sm:row-span-9 '  >
        <main className=' row-span-4 sm:row-span-5 md:col-span-7 md:row-span-8 p-4'>
          <Player />
        </main>
        <aside className='hidden row-span-2 sm:row-span-1 md:grid md:grid-rows-10 md:col-span-3 md:row-span-10 md:gap-4 md:p-4'>
          <section className='row-span-6 w-full'>
            <Chat />
          </section>
          <section className='bg-green-200 row-span-6 w-full'>
            {userName}
            <ModalName />
          </section>
        </aside>
        <footer className=' row-span-4 p-4 md:hidden'>
          <Tabs defaultValue="account" className="w-full bg-green-200">
            <TabsList className='w-full'>
              <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
              <TabsTrigger value="queue">Queue</TabsTrigger>
            </TabsList>
            <TabsContent value="live-chat">
            hola
            </TabsContent>
            <TabsContent value="queue">
            1
            </TabsContent>
          </Tabs>
        </footer>
      </div>
    </div>
  )
}

export default Home