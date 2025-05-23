import { CardSignInButton } from '../form/SubmitButton'
import { Button } from '../ui/button'
import FavoriteToggleForm from './FavoriteToggleForm'
import { fetchFavoriteId } from '@/utils/actions'
import { auth } from '@clerk/nextjs/server'
import { FaHeart } from 'react-icons/fa'

async function FavoriteToggleButton({ propertyId }: { propertyId: String }) {
  const { userId } = auth()
  if (!userId) return <CardSignInButton />
  const favoriteId = await fetchFavoriteId({ propertyId })

  return (
    <FavoriteToggleForm
      favoriteId={favoriteId}
      propertyId={propertyId}
    />
    // <Button
    //   size='icon'
    //   variant='outline'
    //   className='cursor-pointer p-2'
    // >
    //   <FaHeart />
    // </Button>
  )
}

export default FavoriteToggleButton
