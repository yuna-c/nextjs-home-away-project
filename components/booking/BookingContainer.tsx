'use client'

import BookingForm from './BookingForm'
import ConfirmBooking from './ConfirmBooking'
import { useProperty } from '@/utils/store'

function BookingContainer() {
  const state = useProperty((state) => state)
  console.log(state)

  return (
    <div className='w-full'>
      <BookingForm />
      <ConfirmBooking />
    </div>
  )
}

export default BookingContainer
