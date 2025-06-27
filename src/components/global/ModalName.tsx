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
  // DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useUserStore } from '@/store/userStore'

const ModalName = () => {
  const [name, setName] = useState('')
  const setUserName = useUserStore((state) => state.setUserName)

  const captureNameHandler = (event: ChangeEvent<HTMLInputElement>) => { 
    setName(event.target.value)
  }

  const createRandomName = () => { 
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 2,
    })

    setUserName(randomName)
  }

  return (
    <Dialog defaultOpen >
      {/* <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger> */}
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
              value={name}
              onChange={captureNameHandler}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {
              name ? (
                <Button type="button" variant="secondary" onClick={() => setUserName(name)}>
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