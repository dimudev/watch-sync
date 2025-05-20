'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePlayerStore } from '@/store/playerStore'
import { useSocketStore } from '@/store/socketStore'
import { Eye, TvMinimal } from 'lucide-react'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type FormValues = {
  url: string;
}


const AppHeader = () => {

  const setUrl = usePlayerStore((state) => state.setUrl)
  const clientsConnected = useSocketStore((state) => state.clientsConnected)
  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      url: ''
    }
  })

  const onSubmit: SubmitHandler<FormValues> = ({ url }) => { 
    setUrl(url)
    reset()
  }

  return (
    <header className='w-full h-[70px] flex items-center justify-between bg-slate-900 text-white'>
      <div className='w-[20%]  flex items-center justify-center md:gap-4'>
        <TvMinimal className='w-6 h-6 md:w-8 md:h-8 ' />
        <span className='hidden lg:inline lg:text-lg lg:font-bold'>Watch Sync</span>
      </div>
      <div className=' w-[80%] flex items-center gap-2'>
        <form className='w-full flex items-center gap-2' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='url'
            defaultValue=''
            control={control}
            rules={{
              required: true
            }}
            render={({ field: {value, onChange} }) => (
              <Input placeholder='Search' className='h-[30px] md:h-[40px]' size={22} value={value} onChange={onChange} />
            )}
          />
          <Button type='submit' variant='secondary' className='h-[30px] md:h-[40px]' >Add</Button>
        </form>
      </div>
      <div className='w-[20%] flex items-center justify-center gap-2'>
        <Eye className='w-4 h-4 md:w-7 md:h-7 text-emerald-700' /> 
        <span className='text-sm md:text-base'>{clientsConnected}</span>
      </div>
    </header>
  )
}

export default AppHeader