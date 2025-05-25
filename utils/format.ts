// 숙소 가격 달러 표기
export const formatCurrency = (amount: number | null) => {
  const value = amount || 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency', // 통화 형식으로 표시
    currency: 'USD', // 미국 달러로
    minimumFractionDigits: 0, // 소수점 아래 최소 자릿수: 0자리 (소수점 없게)
    maximumFractionDigits: 0 // 소수점 아래 최대 자릿수도 0자리
  }).format(value)
}

// 침실, 욕실, 손님, 침대 수량 표기
export function formatQuantity(quantity: number, noun: string): string {
  return quantity === 1 ? `${quantity} ${noun}` : `${quantity} ${noun}s`
}
