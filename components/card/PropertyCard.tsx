import CountryFlagAndName from './CountryFlagAndName'
import FavoriteToggleButton from './FavoriteToggleButton'
import PropertyRating from './PropertyRating'
import { formatCurrency } from '@/utils/format'
import { PropertyCardProps } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'

function PropertyCard({ property }: { property: PropertyCardProps }) {
  const { name, image, price } = property
  const { country, id: propertyId, tagline } = property

  return (
    <article className='group relative'>
      <Link href={`/properties/${propertyId}`}>
        <div className='relative mb-2 h-[300px] overflow-hidden rounded-md'>
          <Image
            src={image}
            fill
            sizes='(max-width:768px) 100vw, 50vw'
            alt={name}
            className='transform rounded-md object-cover transition-transform duration-500 group-hover:scale-110'
          />
        </div>

        <div className='flex items-center justify-between'>
          <h3 className='mt-1 text-sm font-semibold'>{name.substring(0, 30)}</h3>

          {/* property rating */}
          <PropertyRating
            inPage={false}
            propertyId={propertyId}
          />
        </div>

        <p className='mt-1 text-sm text-muted-foreground'>{tagline.substring(0, 40)}</p>

        <div className='mt-1 flex items-center justify-between'>
          <p className='mt-1 text-sm'>
            <span className='font-semibold'>{formatCurrency(price)} </span>
            night
          </p>
          {/* country and flag */}
        </div>
      </Link>

      <div className='z-5 absolute right-5 top-5'>{/* favorite toggle button */}</div>
    </article>
  )
}

export default PropertyCard
