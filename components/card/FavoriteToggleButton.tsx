import { CardSignInButton } from '../form/SubmitButton'
import { Button } from '../ui/button'
import { auth } from '@clerk/nextjs/server'
import { FaHeart } from 'react-icons/fa'

function FavoriteToggleButton({ propertyId }: { propertyId: String }) {
  const { userId } = auth()
  if (!userId) return <CardSignInButton />

  return (
    <Button
      size='icon'
      variant='outline'
      className='cursor-pointer p-2'
    >
      <FaHeart />
    </Button>
  )
}

export default FavoriteToggleButton
