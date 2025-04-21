import { Button } from '@/components/ui/button'

function HomePage() {
  return (
    <>
      <h1 className='text-3xl'>HomePage</h1>

      <div>
        <Button
          variant='outline'
          size='lg'
          className='m-8 capitalize'
        >
          Click me
        </Button>
      </div>
    </>
  )
}

export default HomePage
