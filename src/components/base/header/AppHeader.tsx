'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSocketStore } from '@/store/socketStore'
import {  TvMinimal, Users } from 'lucide-react'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type FormValues = {
  url: string;
}


const AppHeader = () => {
  const socket = useSocketStore((state) => state.socket)
  const clientsConnected = useSocketStore((state) => state.clientsConnected)

  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      url: ''
    }
  })

  const onSubmit: SubmitHandler<FormValues> = ({ url }) => { 
    socket?.emit('add-new-video', { url })
    reset()
  }

  return (
    <header className='w-full h-full text-sm sm:text-base md:text-lg flex flex-col sm:flex-row items-center justify-evenly sm:justify-between sm:px-4 bg-slate-900  text-white'>
      <div className='flex items-center gap-2'>
        <TvMinimal className='w-6 h-6 md:w-8 md:h-8 ' />
        <span className=' text-xl md:text-xl font-bold '>Watch Sync</span>
      </div>
      <div className='w-[60%]'>
        <form className='flex  gap-2' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='url'
            defaultValue=''
            control={control}
            rules={{
              required: true
            }}
            render={({ field: {value, onChange} }) => (
              <Input 
                placeholder='Paste video URL here...' 
                size={22} 
                value={value} 
                onChange={onChange}
              />
            )}
          />
          <Button type='submit' variant='secondary' className='' >Add</Button>
        </form>
      </div>
      <div className='flex gap-2 items-center'>
        <Users className='w-4 h-4 md:w-7 md:h-7 text-emerald-700' /> 
        <span className=''>{clientsConnected} watching</span>
      </div>
    </header>
  )
}

export default AppHeader