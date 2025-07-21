'use client'
import ModalConfig from '@/components/global/modal/ModalConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSocketStore } from '@/store/socketStore'
import {  TvMinimalPlay } from 'lucide-react'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ModeToggle } from '../mode-toggle/ModeToggle'
import { isValidYouTubeUrl } from '@/lib/youtube'
import { toast } from 'sonner'

type FormValues = {
  url: string;
}


const AppHeader = () => {
  const socket = useSocketStore((state) => state.socket)
  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      url: ''
    }
  })

  const onSubmit: SubmitHandler<FormValues> = ({ url }) => {  
    if (!isValidYouTubeUrl(url)) {
      toast.error('Invalid URL', {
        position: 'bottom-right',
        richColors: true,
        closeButton: true
      })
      return
    }
    socket?.emit('add-new-video', { url })
    toast.success('Video added', {
      position: 'bottom-right',
      richColors: true,
      closeButton: true,
      icon: '🎉 '
    })
    reset()
  }

  return (
    <>
      <div className="flex items-center  gap-2 col-span-3 row-span-2 lg:col-span-2 lg:row-span-4">
        <TvMinimalPlay className="w-6 h-6" />
        <h1 className='text-xl font-bold' >Watch Sync</h1>
      </div>
      <div className="col-span-6 row-span-2 col-start-1 row-start-3 lg:col-span-2 lg:row-span-4 lg:col-start-3 ">
        <form className='w-full h-full flex items-center gap-2 ' onSubmit={handleSubmit(onSubmit)}>
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
                inputMode='url'
              />
            )}
          />
          <Button type='submit' variant='default' className='' >Add</Button>
        </form>
      </div>
      <div className="flex items-center justify-end  gap-2 col-span-3 row-span-2 col-start-4 row-start-1 lg:col-span-2 lg:row-span-4 lg:col-start-5">
        <ModeToggle />
        <ModalConfig />
      </div>
    </>
  )
}

export default AppHeader