import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/store/chatStore';
import { useSocketStore } from '@/store/socketStore';
import { useUserStore } from '@/store/userStore';
import React, { useEffect, useRef } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type FormValues = {
  message: string;
}

const Chat = () => {

  const chatMessages = useChatStore((state) => state.messages)
  const bottomRef = useRef<HTMLDivElement>(null)
  const socket = useSocketStore((state) => state.socket)
  const userName = useUserStore((state) => state.userName)
  const colorName = useUserStore((state) => state.colorName)
  const {control, reset, handleSubmit} = useForm({
    defaultValues: {
      message: ''
    }
  })


  const onSubmit: SubmitHandler<FormValues> = ({message}) => {   
    socket?.emit('send-message', { userName, message, colorName })
    reset()
  }
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  return (
    <Card className='h-full w-full flex flex-col p-2 gap-2'>
      <CardContent className='flex-1 overflow-hidden p-0'>
        <ScrollArea className="h-full">
          <ul className='flex flex-col gap-2'>
            {chatMessages.map((message, index) => (
              <li key={index} className=''>
                <p style={{color: message.colorName}} className='font-medium text-lg'>
                  {message.userName}
                  <span className='text-gray-400/95 font-light text-xs'> {message.time}</span>
                </p>
                <p className='text-base break-all'>{message.message}</p>
              </li>
            ))}
          </ul>
          <div ref={bottomRef} /> 
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="h-auto w-full p-0  "> 
        <form className='w-full h-full flex flex-col justify-center gap-3 ' onSubmit={handleSubmit(onSubmit)} >
          <Label htmlFor="message-chat">Your Message</Label>
          <Controller
            name="message"
            defaultValue=""
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Textarea
                id="message-chat"
                placeholder="Type a message..."
                className=" resize-none min-h-11 max-h-11"
                value={value}
                onChange={onChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
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