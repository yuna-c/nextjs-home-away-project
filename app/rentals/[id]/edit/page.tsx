import AmenitiesInput from '@/components/form/AmenitiesInput'
import { SubmitButton } from '@/components/form/Buttons'
import CategoriesInput from '@/components/form/CategoriesInput'
import CounterInput from '@/components/form/CounterInput'
import CountriesInput from '@/components/form/CountriesInput'
import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import ImageInputContainer from '@/components/form/ImageInputContainer'
import PriceInput from '@/components/form/PriceInput'
import TextAreaInput from '@/components/form/TextAreaInput'
import { fetchRentalDetails, updatePropertyImageAction, updatePropertyAction } from '@/utils/actions'
import { type Amenity } from '@/utils/amenities'
import { redirect } from 'next/navigation'

async function EditRentalPage({ params }: { params: { id: string } }) {
  const property = await fetchRentalDetails(params.id)
  if (!property) return redirect('/')
  const defaultAmenities: Amenity[] = JSON.parse(property.amenities)

  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold capitalize'>Edit Property</h1>
      <div className='rounded-md border p-8'>
        <ImageInputContainer
          image={property.image}
          name={property.name}
          text='Update Image'
          action={updatePropertyImageAction}
        >
          <input
            type='hidden'
            name='id'
            value={property.id}
          />
        </ImageInputContainer>

        <FormContainer action={updatePropertyAction}>
          <input
            type='hidden'
            name='id'
            value={property.id}
          />
          <div className='mb-4 mt-8 grid gap-8 md:grid-cols-2'>
            <FormInput
              name='name'
              type='text'
              label='Name (20 limit)'
              defaultValue={property.name}
            />
            <FormInput
              name='tagline'
              type='text'
              label='Tagline (30 limit)'
              defaultValue={property.tagline}
            />
            <PriceInput defaultValue={property.price} />
            <CategoriesInput defaultValue={property.category} />
            <CountriesInput defaultValue={property.country} />
          </div>

          <TextAreaInput
            name='description'
            labelText='Description (10 - 100 words)'
            defaultValue={property.description}
          />

          <h3 className='mb-4 mt-8 text-lg font-medium'>Accommodation Details</h3>
          <CounterInput
            detail='guests'
            defaultValue={property.guests}
          />
          <CounterInput
            detail='bedrooms'
            defaultValue={property.bedrooms}
          />
          <CounterInput
            detail='beds'
            defaultValue={property.beds}
          />
          <CounterInput
            detail='baths'
            defaultValue={property.baths}
          />
          <h3 className='mb-6 mt-10 text-lg font-medium'>Amenities </h3>
          <AmenitiesInput defaultValue={defaultAmenities} />
          <SubmitButton
            text='edit property'
            className='mt-12'
          />
        </FormContainer>
      </div>
    </section>
  )
}

export default EditRentalPage
