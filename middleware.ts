import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// 공개 접근 허용 경로 (로그인 없이 접근 가능)
const isPublicRoute = createRouteMatcher(['/', '/properties(.*)'])
// 관리자 전용 경로 (admin 하위 모든 경로 포함)
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware((auth, req) => {
  // console.log(auth().userId)
  // 현재 유저가 관리자 계정인지 확인 (환경 변수 기반)
  const isAdminUser = auth().userId == process.env.ADMIN_USER_ID
  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  // 공개 경로가 아닌 경우, 로그인 요구
  if (!isPublicRoute(req)) auth().protect()
})

// 정적 파일 요청 제외, 홈 경로 포함, API 및 tRPC 경로 포함
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
