'use client'

import { Button } from '../ui/button'
import FormContainer from './FormContainer'
import ImageInput from './ImageInput'
import { SubmitButton } from './SubmitButton'
import { type actionFunction } from '@/utils/types'
import Image from 'next/image'
import { act, useState } from 'react'
import { LuUser } from 'react-icons/lu'

type ImageInputContainerProps = {
  image: string
  name: string
  action: actionFunction
  text: string
  children?: React.ReactNode
}

function ImageInputContainer(props: ImageInputContainerProps) {
  const { image, name, action, text } = props
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false)
  const userIcon = <LuUser className='mb-4 h-24 w-24 rounded bg-primary text-white' />
  return (
    <div>
      {image ? (
        <Image
          src={image}
          alt={name}
          width={100}
          height={100}
          className='mb-4 h-24 w-24 rounded object-cover'
        />
      ) : (
        userIcon
      )}
      <Button
        variant='outline'
        size='sm'
        onClick={() => setUpdateFormVisible((prev) => !prev)}
      >
        {text}
      </Button>
      {isUpdateFormVisible && (
        <div className='mt-4 max-w-lg'>
          <FormContainer action={action}>
            {props.children}
            <ImageInput />
            <SubmitButton size='sm' />
          </FormContainer>
        </div>
      )}
    </div>
  )
}

export default ImageInputContainer
