'use client'

import { Calendar } from '@/components/ui/calendar'
import { useToast } from '@/components/ui/use-toast'
import { generateDisabledDates, generateDateRange, defaultSelected, generateBlockedPeriods } from '@/utils/calendar'
import { useProperty } from '@/utils/store'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

function BookingCalendar() {
  const currentDate = new Date()
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected)
  const bookings = useProperty((state) => state.bookings)
  console.log(bookings)

  const blockedPeriods = generateBlockedPeriods({ bookings, today: currentDate })

  useEffect(() => {
    // setState: Zustand 전역 상태 업데이트 함수 (부분 업데이트)
    useProperty.setState({ range })
  }, [range])

  return (
    <Calendar
      mode='range'
      defaultMonth={currentDate}
      selected={range}
      onSelect={setRange}
      className='mb-4'
      disabled={blockedPeriods}
    />
  )
}

export default BookingCalendar
