import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/store/userStore'
import { Settings } from 'lucide-react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'


type FormValues = {
  name: string;
  color: string;
}




const ModalConfig = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const userName = useUserStore((state) => state.userName)
  const colorName = useUserStore((state) => state.colorName)
  const setUserName = useUserStore((state) => state.setUserName)
  const setColorName = useUserStore((state) => state.setColorName)

  const {control, reset, handleSubmit} = useForm({
    defaultValues: {
      name: userName,
      color: colorName 
    }
  })



  const onSubmit: SubmitHandler<FormValues>  = ({name, color}) => { 
    if (name) {
      setUserName(name)
    }
    if (color) { 
      setColorName(color)
    }
    reset()
    setIsConfigOpen(false)
  }


  useEffect(() => {
    reset({
      name: userName,
      color: colorName
    })
  }, [userName, colorName, reset])

  
  return (
    <Dialog  open={isConfigOpen} onOpenChange={setIsConfigOpen}  >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <Settings className="w-4 h-4" />
                  
        </Button>
      </DialogTrigger>
      <DialogContent aria-description='chat configuration' aria-describedby='chat configuration' >
        <DialogHeader>
          <DialogTitle>Chat configuration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className='flex flex-col gap-2'>
              <Controller
                name='name'
                control={control}
                defaultValue={userName}
                render={({ field: {value, onChange} }) => (
                  <>
                    <Label htmlFor="name">Change name</Label>
                    <Input id="name" value={value} onChange={onChange} autoComplete='off' />
                  </>
                )}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Controller
                name='color'
                control={control}
                defaultValue={colorName}
                render={({ field: {value, onChange} }) => (
                  <>
                    <Label htmlFor="color">Change color</Label>
                    <Input id="color" type='color' value={value} onChange={onChange} autoComplete='off' />
                  </>
                )}
              />
            </div>
            <Button type='submit'>Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModalConfig