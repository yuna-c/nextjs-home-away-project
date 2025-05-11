import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import PriceInput from '@/components/form/PriceInput'
import { SubmitButton } from '@/components/form/SubmitButton'
import { createPropertyAction } from '@/utils/actions'

function CreatePropertyPage() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold capitalize'>create property</h1>
      <div className='rounded border p-8'>
        <h3 className='mb-4 text-lg font-medium'>General Info</h3>
        <FormContainer action={createPropertyAction}>
          <div className='mb-4 grid gap-8 md:grid-cols-2'>
            <FormInput
              name='name'
              type='text'
              label='Name (20 limit)'
              defaultValue='Cabin in Latvia'
            />
            <FormInput
              name='tagline'
              type='text'
              label='Tagline (30 limit)'
              defaultValue='Dream Getaway Awaits You Here'
            />
            <PriceInput />
            {/* categories */}
          </div>
          {/* text area / description */}
          <SubmitButton
            text='create rental'
            className='mt-12'
          />
        </FormContainer>
      </div>
    </section>
  )
}

export default CreatePropertyPage
