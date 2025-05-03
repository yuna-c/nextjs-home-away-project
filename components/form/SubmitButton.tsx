'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

type SubmitButtonProps = {
  className?: string
  text?: string
}

export function SubmitButton({ className = '', text = 'submit' }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      disabled={pending}
      className={`capitalize ${className}`}
      size='lg'
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
