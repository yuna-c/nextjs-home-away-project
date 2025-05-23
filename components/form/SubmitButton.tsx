'use client'

import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { FaRegHeart, FaHeart } from 'react-icons/fa'

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
