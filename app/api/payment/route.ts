import db from '@/utils/db'
import { formatDate } from '@/utils/format'
import { type NextRequest, type NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const POST = async (req: NextRequest, res: NextResponse) => {
  // 응답 헤더에서 origin 값을 가져옴
  const requestHeaders = new Headers(req.headers)
  // 결제 완료 후 돌아올 return_url을 만들기 위해 사용
  const origin = requestHeaders.get('origin')
  // 요청 본문에서 bookingId를 추출(예약 ID 받음)
  const { bookingId } = await req.json()

  // 해당 예약 정보를 DB에서 조회(숙소 이름이랑 이미지 포함)
  const booking = await db.booking.findUnique({
    where: {
      id: bookingId
    },
    include: {
      property: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })

  // 해당 예약이 없으면 404 오류 반환
  if (!booking) {
    return Response.json(null, {
      status: 404,
      statusText: 'Not Found'
    })
  }

  // 필요한 예약 정보와 숙소 정보 구조 분해
  const {
    totalNights,
    orderTotal,
    checkIn,
    checkOut,
    property: { image, name }
  } = booking

  // Stripe Checkout 세션 생성 시도(실제 결제창 준비)
  try {
    const session = await stripe.checkout.sessions.create({
      // // Stripe Embedded Checkout 모드 사용
      ui_mode: 'embedded',
      // 세션에 예약 ID 메타데이터로 저장 (Webhook 처리 등에 사용)
      metadata: { bookingId: booking.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',

            product_data: {
              name: `${name}`,
              images: [image],
              description: `Stay in this wonderful place for ${totalNights} night, from ${formatDate(checkIn)} to ${formatDate(checkOut)}. Enjoy your stay!`
            },
            // // Stripe는 센트 단위 → 달러 * 100
            unit_amount: orderTotal * 100
          }
        }
      ],
      // 일회성 결제 모드
      mode: 'payment',
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`
    })
    // 클라이언트에서 Embedded Checkout에 넘길 client_secret 응답(프론트에서 결제창 띄움)
    return Response.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.log(error)
    // 에러 발생 시 콘솔에 출력하고 500 오류 반환
    return Response.json(null, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
