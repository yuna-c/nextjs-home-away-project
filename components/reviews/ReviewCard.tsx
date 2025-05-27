import Comment from './Comment'
import Rating from './Rating'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

type ReviewCardProps = {
  reviewInfo: {
    comment: string
    rating: number
    name: string
    image: string
  }
  children?: React.ReactNode
}

function ReviewCard({ reviewInfo, children }: ReviewCardProps) {
  return (
    <Card className='relative'>
      <CardHeader>
        <div className='flex items-center'>
          <img
            src={reviewInfo.image}
            alt='profile'
            className='h-12 w-12 rounded-full object-cover'
          />
          <div className='ml-4'>
            <h3 className='mb-1 text-sm font-bold capitalize'>{reviewInfo.name}</h3>
            <Rating rating={reviewInfo.rating} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Comment comment={reviewInfo.comment} />
      </CardContent>
      {/* delete button later */}
      <div className='absolute right-3 top-3'>{children}</div>
    </Card>
  )
}

export default ReviewCard
