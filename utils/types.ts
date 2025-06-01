// 폼 제출 시 사용되는 액션 함수의 타입 정의 (ex. 리뷰 작성, 프로필 수정 등)
export type actionFunction = (prevState: any, formData: FormData) => Promise<{ message: string }>

// 숙소 카드 컴포넌트에 전달되는 속성 타입 (이미지, 이름, 가격 등)
export type PropertyCardProps = {
  image: string
  id: string
  name: string
  tagline: string
  country: string
  price: number
}

// 날짜 선택에 사용되는 범위 타입 (달력 등에서 사용)
export type DateRangeSelect = {
  startDate: Date
  endDate: Date
  key: string
}

// 예약 정보 타입 (체크인/체크아웃 날짜 포함)
export type Booking = {
  checkIn: Date
  checkOut: Date
}
