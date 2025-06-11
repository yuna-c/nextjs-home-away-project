import db from '@/utils/db'
import { redirect } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'

// https://docs.stripe.com/testing (스트라이프 테스트 결제 정보)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const GET = async (req: NextRequest) => {
  // URL에서 세션 ID (session_id) 추출
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get('session_id') as string

  try {
    // Stripe에서 해당 세션 정보를 가져옴
    const session = await stripe.checkout.sessions.retrieve(session_id)
    // 세션 메타데이터에서 bookingId 추출 (우리가 저장해뒀던 예약 ID)
    const bookingId = session.metadata?.bookingId

    // 세션 상태가 'complete'가 아니거나 bookingId가 없으면 에러 발생
    if (session.status !== 'complete' || !bookingId) {
      throw new Error('Something went wrong')
    }

    // 결제 성공 → 해당 예약의 결제 상태(paymentStatus)를 true로 업데이트
    await db.booking.update({
      where: {
        id: bookingId
      },
      data: {
        paymentStatus: true
      }
    })
  } catch (error) {
    // 예외 발생 시 서버 에러 응답 반환
    console.log(error)
    return NextResponse.json(null, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }

  // 모든 처리 후 /bookings 페이지로 리디렉션 (예약 내역 확인용)
  redirect('/bookings')
}
