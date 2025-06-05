import { Card, CardHeader } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export function StatsLoadingContainer() {
  return (
    <div className='lg:grid-col-3 mt-8 grid gap-4 md:grid-cols-2'>
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  )
}

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-20 w-full rounded' />
      </CardHeader>
    </Card>
  )
}

export function ChartsLoadingContainer() {
  return <Skeleton className='mt-16 h-[300px] w-full rounded' />
}
