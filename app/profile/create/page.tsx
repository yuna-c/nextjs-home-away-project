import FormContainer from '@/components/form/FormContainer'
import { SubmitButton } from '@/components/form/SubmitButton'
import FormInput from '@/components/form/formInput'
import { createProfileAction } from '@/utils/actions'

function CreateProfilePage() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold capitalize'>new user</h1>

      <div className='rounded-md border p-8'>
        <FormContainer action={createProfileAction}>
          <div className='mt-4 grid gap-4 md:grid-cols-2'>
            <FormInput
              type='text'
              name='firstName'
              label='First Name'
            />

            <FormInput
              type='text'
              name='lastName'
              label='Last Name'
            />
            <FormInput
              type='text'
              name='userName'
              label='User Name'
            />
          </div>
          <SubmitButton
            text='Create Profile'
            className='mt-8'
          />
        </FormContainer>
      </div>
    </section>
  )
}

export default CreateProfilePage
