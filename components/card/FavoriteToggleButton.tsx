import { CardSignInButton } from '../form/Buttons'
import { Button } from '../ui/button'
import FavoriteToggleForm from './FavoriteToggleForm'
import { fetchFavoriteId } from '@/utils/actions'
import { auth } from '@clerk/nextjs/server'
import { FaHeart } from 'react-icons/fa'

async function FavoriteToggleButton({ propertyId }: { propertyId: string }) {
  const { userId } = auth()
  if (!userId) return <CardSignInButton />
  const favoriteId = await fetchFavoriteId({ propertyId })

  return (
    <FavoriteToggleForm
      favoriteId={favoriteId}
      propertyId={propertyId}
    />
  )
}

export default FavoriteToggleButton
