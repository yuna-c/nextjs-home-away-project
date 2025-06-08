import ChartsContainer from '@/components/admin/ChartsContainer'
import { ChartsLoadingContainer, StatsLoadingContainer } from '@/components/admin/Loading'
import StatsContainer from '@/components/admin/StatsContainer'
import { Suspense } from 'react'

function AdminPage() {
  return (
    <>
      {/* Suspense 컴포넌트가 데이터를 다 받아오기 전까지 '로딩 UI'를 보여줌 */}
      <Suspense fallback={<StatsLoadingContainer />}>
        <StatsContainer />
      </Suspense>
      <Suspense fallback={<ChartsLoadingContainer />}>
        <ChartsContainer />
      </Suspense>
    </>
  )
}

export default AdminPage
