'use client'

import BookingForm from './BookingForm'
import ConfirmBooking from './ConfirmBooking'
import { useProperty } from '@/utils/store'

function BookingContainer() {
  const { range } = useProperty((state) => state)
  console.log(range)

  // from to 미설정 시 null을 반환하여 두 컴포넌트 뜨지 않게 고정
  if (!range || !range.from || !range.to) return null
  if (range.to.getTime() === range.from.getTime()) return null

  return (
    <div className='w-full'>
      <BookingForm />
      <ConfirmBooking />
    </div>
  )
}

export default BookingContainer
