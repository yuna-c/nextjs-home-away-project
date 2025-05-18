import { Button } from '../ui/button'
import { FaHeart } from 'react-icons/fa'

function FavoriteToggleButton({ propertyId }: { propertyId: String }) {
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
