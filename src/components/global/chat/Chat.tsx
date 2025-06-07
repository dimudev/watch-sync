import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea'
import { useSocketStore } from '@/store/socketStore';
import { useUserStore } from '@/store/userStore';
import React, { useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type FormValues = {
  message: string;
}

interface Message {
  userName: string;
  message: string;
  time: string;
}

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const socket = useSocketStore((state) => state.socket)
  const userName = useUserStore((state) => state.userName)
  const {control, reset, handleSubmit} = useForm({
    defaultValues: {
      message: ''
    }
  })

  const onSubmit: SubmitHandler<FormValues> = ({message}) => {   
    socket?.emit('send-message', { userName, message })
    reset()
  }

  useEffect(() => {

    socket?.on('new-message', ({timestamp, ...data}) => {
      const localTime = new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
      setChatMessages([...chatMessages, {...data, time: localTime}])})

    return () => {
      socket?.off('new-message')
    }
  }, [chatMessages, socket])
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  return (
    <Card  className='w-full h-full flex flex-col  gap-0 p-0 bg-slate-900 text-white '>
      <CardHeader className='h-[10%] flex items-center  '>
        <CardTitle>Live Chat</CardTitle>
      </CardHeader>
      <Separator  className='' />
      <CardContent className='h-[70%]  pr-0'>
        <ScrollArea className="h-full w-full rounded-md ">
          <ul className='flex flex-col gap-1 pr-10'>
            {chatMessages.map((message, index) => (
              <li key={index}>
                <p className='text-emerald-700 font-medium text-lg'>{message.userName} <span className='text-gray-600 font-extralight text-xs' >{message.time}</span></p>
                <p className='text-base'> {message.message}</p>
              </li>
            ))}
          </ul>
          <div ref={bottomRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className='h-[20%] '>
        <form className='w-full h-full flex items-center justify-center ' onSubmit={handleSubmit(onSubmit)} >
          <Controller
            name="message"
            defaultValue=""
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Textarea
                placeholder="Type a message..."
                className="resize-none"
                value={value}
                onChange={onChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // evita salto de línea
                    handleSubmit(onSubmit)(); // ejecuta el submit
                  }
                }}
              />
            )}
          />
        </form>
      </CardFooter>
    </Card>
  )
}

export default Chat