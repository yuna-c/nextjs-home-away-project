'use client'

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import React, { useCallback } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

function CheckoutPage() {
  // URL 쿼리에서 bookingId를 추출
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  // Stripe Checkout 세션을 생성하기 위한 백엔드 API 요청
  const fetchClientSecret = useCallback(async () => {
    const response = await axios.post('/api/payment', {
      bookingId: bookingId
    })
    return response.data.clientSecret
  }, [])

  // EmbeddedCheckoutProvider에 넘길 옵션
  const options = { fetchClientSecret }

  return (
    <div id='checkout'>
      {/* 실제 Stripe 결제 창 임베디드(내장) */}
      <EmbeddedCheckoutProvider
        stripe={stripePromise} // 세션 인증
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
export default CheckoutPage
