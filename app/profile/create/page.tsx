import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const createProfileAction = async (formData: FormData) => {
  'use server'
  const firstName = formData.get('firstName') as string
  console.log(firstName)
}

function CreateProfilePage() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold capitalize'>new user</h1>
      <form action={createProfileAction}>
        <div className='max-w-lg rounded-md border p-8'>
          <div className='mb-2'>
            <Label htmlFor='firstName'>First Name</Label>
            <Input
              id='firstName'
              name='firstName'
              type='text'
            />
          </div>
          <Button
            type='submit'
            size='lg'
          >
            Create Profile
          </Button>
        </div>
      </form>
    </section>
  )
}

export default CreateProfilePage
