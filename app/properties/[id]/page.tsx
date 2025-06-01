import BookingWrapper from '@/components/booking/BookingWrapper'
import FavoriteToggleButton from '@/components/card/FavoriteToggleButton'
import PropertyRating from '@/components/card/PropertyRating'
import Amenities from '@/components/properties/Amenities'
// import BookingCalendar from '@/components/properties/_BookingCalendar'
import BreadCrumbs from '@/components/properties/BreadCrumbs'
import Description from '@/components/properties/Description'
import ImageContainer from '@/components/properties/ImageContainer'
import PropertyDetails from '@/components/properties/PropertyDetails'
import ShareButton from '@/components/properties/ShareButton'
import UserInfo from '@/components/properties/UserInfo'
import PropertyReviews from '@/components/reviews/PropertyReviews'
import SubmitReview from '@/components/reviews/SubmitReview'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPropertyDetails, findExistingReview } from '@/utils/actions'
import { auth } from '@clerk/nextjs/server'
import { Separator } from '@radix-ui/react-dropdown-menu'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

// react-leaflet이 브라우저 전용 API를 사용하기 때문에 클라이언트에서만 import하게 만듦 CSR만 하게 (SSR 방지)
const DynamicMap = dynamic(() => import('@/components/properties/PropertyMap'), {
  ssr: false,
  loading: () => <Skeleton className='h-[400px] w-full' />
})

const DynamicBookingWrapper = dynamic(() => import('@/components/booking/BookingWrapper'), {
  ssr: false,
  loading: () => <Skeleton className='h-[200px] w-full' />
})

async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await fetchPropertyDetails(params.id)
  if (!property) redirect('/')
  const { baths, bedrooms, beds, guests } = property
  const details = { baths, bedrooms, beds, guests }
  // console.log(property)
  const firstName = property.profile.firstName
  const profileImage = property.profile.profileImage

  const { userId } = auth()
  const isNotOwner = property.profile.clerkId !== userId
  const reviewDoesNotExist = userId && isNotOwner && !(await findExistingReview(userId, property.id))

  // console.log(property.bookings)

  return (
    <section>
      {/* 이동 경로 표시줄 */}
      <BreadCrumbs name={property.name} />
      <header className='mt-4 flex items-center justify-between'>
        <h1 className='text-4xl font-bold capitalize'>{property.tagline}</h1>

        <div className='flex items-center gap-x-4'>
          {/* share button */}
          <ShareButton
            name={property.name}
            propertyId={property.id}
          />
          {/* 좋아요 버튼 */}
          <FavoriteToggleButton propertyId={property.id} />
        </div>
      </header>

      {/* 배경 사진 */}
      <ImageContainer
        mainImage={property.image}
        name={property.name}
      />
      <section className='mt-12 gap-x-12 lg:grid lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <div className='flex items-center gap-x-4'>
            <h1 className='text-xl font-bold'>{property.name}</h1>
            {/* 별점, 리뷰 */}
            <PropertyRating
              inPage
              propertyId={property.id}
            />
          </div>
          {/* 방 세부 정보 */}
          <PropertyDetails details={details} />
          {/* 사용자 정보 */}
          <UserInfo profile={{ firstName, profileImage }} />
          <Separator className='mt-4' />
          {/* 주석 글 */}
          <Description description={property.description} />
          {/* 편의 사항 */}
          <Amenities amenities={property.amenities} />
          {/* 지도 */}
          <DynamicMap countryCode={property.country} />
        </div>

        <div className='flex flex-col items-center lg:col-span-4'>
          {/* calender */}
          <DynamicBookingWrapper
            propertyId={property.id}
            price={property.price}
            bookings={property.bookings}
          />
        </div>
      </section>
      {reviewDoesNotExist && <SubmitReview propertyId={property.id} />}
      <PropertyReviews propertyId={property.id} />
    </section>
  )
}

export default PropertyDetailsPage
