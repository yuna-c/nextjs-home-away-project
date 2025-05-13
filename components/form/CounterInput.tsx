'use client'

import { Button } from '../ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { useState } from 'react'
import { LuMinus, LuPlus } from 'react-icons/lu'

function CounterInput({ detail, defaultValue }: { detail: string; defaultValue?: number }) {
  const [count, setCount] = useState(defaultValue || 0)

  const increaseCount = () => {
    setCount((prevCount) => prevCount + 1)
  }

  const decreaseCount = () => {
    setCount((prevCount) => {
      if (prevCount > 0) {
        return prevCount - 1
      }
      return prevCount
    })
  }

  return (
    <Card className='mb-4'>
      {/* input : 폼 전송 시 count 값을 함께 서버로 보내기 위한 input 처리 */}
      <input
        type='hidden'
        name={detail}
        value={count}
      />

      <CardHeader className='flex flex-col gap-y-5'>
        <div className='flex flex-wrap items-center justify-between'>
          <div className='flex flex-col'>
            <h2 className='font-medium capitalize'>{detail}</h2>
            <p className='text-sm text-muted-foreground'>Specify the number of {detail}</p>
          </div>

          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              size='icon'
              type='button'
              onClick={decreaseCount}
            >
              <LuMinus className='h-5 w-5 text-primary' />
            </Button>

            <span className='w-5 text-center text-xl font-bold'>{count}</span>

            <Button
              variant='outline'
              size='icon'
              type='button'
              onClick={increaseCount}
            >
              <LuPlus className='h-5 w-5 text-primary' />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default CounterInput
