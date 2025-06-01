import { Booking } from '@/utils/types'
import { DateRange } from 'react-day-picker'

// 기본 선택된 날짜 범위 (아무 날짜도 선택되지 않은 상태)
export const defaultSelected: DateRange = {
  from: undefined,
  to: undefined
}

// 예약 정보와 오늘 날짜를 기반으로 비활성화된 날짜 범위들을 생성
export const generateBlockedPeriods = ({ bookings, today }: { bookings: Booking[]; today: Date }) => {
  today.setHours(0, 0, 0, 0) // 시간을 00:00:00.000으로 설정 (시간 비교 제거 목적)

  const disabledDays: DateRange[] = [
    // 예약된 모든 기간을 비활성화 목록에 추가
    ...bookings.map((booking) => ({
      from: booking.checkIn,
      to: booking.checkOut
    })),
    {
      from: new Date(0), // 1970년 1월 1일 00:00:00 UTC
      to: new Date(today.getTime() - 24 * 60 * 60 * 1000) // 어제 날짜까지
    }
  ]
  return disabledDays
}

// 주어진 날짜 범위로부터 날짜 문자열 배열 생성 (YYYY-MM-DD 형식)
export const generateDateRange = (range: DateRange | undefined): string[] => {
  if (!range || !range.from || !range.to) return []

  let currentDate = new Date(range.from)
  const endDate = new Date(range.to)
  const dateRange: string[] = []

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0]
    dateRange.push(dateString)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dateRange
}

// 비활성화된 날짜들을 키-값 객체로 변환 (key: 'YYYY-MM-DD', value: true)
export const generateDisabledDates = (disabledDays: DateRange[]): { [key: string]: boolean } => {
  if (disabledDays.length === 0) return {}

  const disabledDates: { [key: string]: boolean } = {}
  const today = new Date()
  today.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정하여 날짜만 비교

  disabledDays.forEach((range) => {
    if (!range.from || !range.to) return

    let currentDate = new Date(range.from)
    const endDate = new Date(range.to)

    while (currentDate <= endDate) {
      if (currentDate < today) {
        // 과거 날짜는 제외
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }
      const dateString = currentDate.toISOString().split('T')[0]
      disabledDates[dateString] = true
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return disabledDates
}

// 체크인과 체크아웃 사이의 날짜 수 계산
export function calculateDaysBetween({ checkIn, checkOut }: { checkIn: Date; checkOut: Date }) {
  // 두 날짜의 차이를 밀리초(ms)로 계산
  const diffInMs = Math.abs(checkOut.getTime() - checkIn.getTime())

  // 밀리초를 일(day) 단위로 변환
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  return diffInDays
}
