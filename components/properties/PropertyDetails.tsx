import { formatQuantity } from '@/utils/format'

type PropertyDetailsProps = {
  details: {
    bedrooms: number
    baths: number
    guests: number
    beds: number
  }
}

function PropertyDetails({ details: { bedrooms, baths, guests, beds } }: PropertyDetailsProps) {
  return (
    <p className='text-md font-light'>
      <span>{formatQuantity(bedrooms, 'bedrooms')} &middot; </span>
      <span>{formatQuantity(baths, 'baths')} &middot; </span>
      <span>{formatQuantity(guests, 'guests')} &middot; </span>
      <span>{formatQuantity(beds, 'beds')}</span>
    </p>
  )
}

export default PropertyDetails
