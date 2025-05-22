import { Skeleton } from '../ui/skeleton'

function LoadingCards() {
  return (
    <div className='mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div>
      <Skeleton className='h-[300px] rounded-md' />
      <Skeleton className='mt-2 h-4 w-3/4' />
      <Skeleton className='mt-2 h-4 w-1/2' />
    </div>
  )
}

export default LoadingCards
