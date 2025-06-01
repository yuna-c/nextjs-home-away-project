import { Booking } from './types'
import { DateRange } from 'react-day-picker'
import { create } from 'zustand'

// 타입 정의
type PropertyState = {
  propertyId: string
  price: number
  bookings: Booking[]
  range: DateRange | undefined
}

// 스토어
export const useProperty = create<PropertyState>(() => {
  return {
    propertyId: '',
    price: 0,
    bookings: [],
    range: undefined
  }
})
