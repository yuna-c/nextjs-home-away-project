'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from '@/components/ui/toaster'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ThemeProvider
        attribute='class' //dark, light
        defaultTheme='system' //기본 테마
        enableSystem //사용자의 시스템 다크/라이트 모드 감지해서 반영
        disableTransitionOnChange //테마 전환 시 깜빡임 방지, transition 효과 제거
      >
        {children}
      </ThemeProvider>
    </>
  )
}

export default Providers
