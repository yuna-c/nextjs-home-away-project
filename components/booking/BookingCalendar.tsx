'use client'

import { Calendar } from '@/components/ui/calendar'
import { useToast } from '@/hooks/use-toast'
import { generateDisabledDates, generateDateRange, defaultSelected, generateBlockedPeriods } from '@/utils/calendar'
import { useProperty } from '@/utils/store'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

function BookingCalendar() {
  const currentDate = new Date()
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected)
  const bookings = useProperty((state) => state.bookings)
  // console.log(bookings)
  const { toast } = useToast()
  // 오늘 이전 날짜는 선택 못 하게
  const blockedPeriods = generateBlockedPeriods({ bookings, today: currentDate })
  // 예약 불가 날짜 단위 선택 못하게
  const unavailableDates = generateDisabledDates(blockedPeriods)
  console.log(unavailableDates)

  useEffect(() => {
    const selectedRange = generateDateRange(range) // 날짜 범위를 배열로 변환

    selectedRange.some((date) => {
      if (unavailableDates[date]) {
        setRange(defaultSelected) // 다시 선택하게 초기화
        toast({
          description: 'Some dates are booked. Please select again'
        })
        return true
      }
      return false
    })

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
