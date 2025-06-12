'use client'

import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { LuTrash2, LuSquarePen } from 'react-icons/lu'

type btnSize = 'default' | 'lg' | 'sm'

type SubmitButtonProps = {
  className?: string
  text?: string
  size?: btnSize
}

export function SubmitButton({ className = '', text = 'submit', size = 'lg' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      disabled={pending}
      className={`capitalize ${className}`}
      size={size}
    >
      {pending ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          please wait...
        </>
      ) : (
        text
      )}
    </Button>
  )
}

export const CardSignInButton = () => {
  return (
    <SignInButton mode='modal'>
      <Button
        type='button'
        size='icon'
        variant='outline'
        className='curser-pointer p-2'
        asChild
      >
        <FaRegHeart />
      </Button>
    </SignInButton>
  )
}

export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      size='icon'
      variant='outline'
      className='cursor-pointer p-2'
    >
      {pending ? <Loader2 className='animate-spin' /> : isFavorite ? <FaHeart /> : <FaRegHeart />}
    </Button>
  )
}

type actionType = 'edit' | 'delete'

export const IconButton = ({ actionType }: { actionType: actionType }) => {
  const { pending } = useFormStatus()

  const renderIcon = () => {
    switch (actionType) {
      case 'edit':
        return <LuSquarePen />
      case 'delete':
        return <LuTrash2 />
      default: {
        const never: never = actionType
        throw new Error(`Invalid action type: ${never}`)
      }
    }
  }
  return (
    <Button
      type='submit'
      size='icon'
      variant='link'
      className='cursor-pointer p-2'
    >
      {pending ? <Loader2 className='animate-spin' /> : renderIcon()}
    </Button>
  )
}
