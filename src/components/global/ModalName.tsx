import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'
import React, { ChangeEvent, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useUserStore } from '@/store/userStore'

const ModalName = () => {
  const [userName, setUserName] = useState('')
  const setName = useUserStore((state) => state.setName)

  const captureNameHandler = (event: ChangeEvent<HTMLInputElement>) => { 
    setUserName(event.target.value)
  }

  const createRandomName = () => { 
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 2,
    })

    setName(randomName)
  }

  return (
    <Dialog defaultOpen >
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
              value={userName}
              onChange={captureNameHandler}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {
              userName ? (
                <Button type="button" variant="secondary" onClick={() => setName(userName)}>
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