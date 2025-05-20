'use client'
import { useSocketStore } from '@/store/socketStore'
import React from 'react'


const Home = () => {
  const online = useSocketStore((state) => state.online)
  const clientsConnected = useSocketStore((state) => state.clientsConnected)
  return (
    <div>
      <h1>Online: {online ? 'Yes' : 'No'}</h1>
      <h1>Online: {clientsConnected}</h1>
    </div>
  )
}

export default Home