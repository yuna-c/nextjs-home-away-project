import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 로그인이 필요한 보호된 경로(*하위 경로 포함)
const isProtectedRoute = createRouteMatcher([
  '/bookings(.*)',
  '/checkout(.*)',
  '/favorites(.*)',
  '/profile(.*)',
  '/rentals(.*)',
  '/reviews(.*)'
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

// 정적 파일 요청 제외, 홈 경로 포함, API 및 tRPC 경로 포함
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
