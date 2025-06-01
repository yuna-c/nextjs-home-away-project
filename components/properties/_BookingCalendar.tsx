'use client'

import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

function BookingCalendar() {
  const currentDate = new Date()
  // 날짜 선택 상태 만드는 라이브러리 첫 날짜 초기화(선택전)
  const defaultSelected: DateRange = {
    from: undefined,
    to: undefined
  }
  // 범위 지정할 상태
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected)

  return (
    <Calendar
      mode='range' // 범위 선택 모드
      defaultMonth={currentDate} // 현재 월이 보이게
      selected={range} // 선택된 날짜 범위 보여주기
      onSelect={setRange} // 사용자가 선택하면 range 상태 바뀜
    />
  )
}

export default BookingCalendar
