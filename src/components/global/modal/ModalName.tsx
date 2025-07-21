import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'
import React, { ChangeEvent, useState } from 'react'
import randomColor from 'randomcolor';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { useUserStore } from '@/store/userStore'

const ModalName = () => {
  const [name, setName] = useState('')
  const [open, setOpen] = useState(true)
  const setUserName = useUserStore((state) => state.setUserName)
  const setColorName = useUserStore((state) => state.setColorName)
  

  const createUserName = () => {
    const color = randomColor({luminosity: 'dark'})
    setUserName(name)
    setColorName(color)
    setOpen(false)
  }

  const captureNameHandler = (event: ChangeEvent<HTMLInputElement>) => { 
    setName(event.target.value)
    setOpen(true)
  }

  const createRandomName = () => { 
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 2,
    })
    const color = randomColor({luminosity: 'dark'})

    setUserName(randomName)
    setColorName(color)
    setOpen(false)
  }

  return (
    <Dialog defaultOpen  open={open}  >
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to the Watch Party!</DialogTitle>
          <DialogDescription>
            Please enter your name so others can see who you are in the chat.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="Name" className="sr-only">
              Name
            </Label>
            <Input
              id="Name"
              placeholder="Enter your name"
              value={name}
              onChange={captureNameHandler}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {
              name ? (
                <Button type="button" variant="secondary" onClick={createUserName}>
              Join the Party
                </Button>
              ) : (
                <Button type="button" variant="secondary" onClick={createRandomName}>
              Continue as Guest
                </Button>
              )
            }
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalName