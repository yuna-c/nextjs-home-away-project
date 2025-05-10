import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import ImageInputContainer from '@/components/form/ImageInputContainer'
import { SubmitButton } from '@/components/form/SubmitButton'
import { updateProfileAction, fetchProfile, updateProfileImageAction } from '@/utils/actions'

async function ProfilePage() {
  const profile = await fetchProfile()

  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold capitalize'>user profile</h1>

      <div className='rounded-md border p-8'>
        <ImageInputContainer
          image={profile.profileImage}
          name={profile.username}
          action={updateProfileImageAction}
          text='Update Profile Image'
        />

        <FormContainer action={updateProfileAction}>
          <div className='mt-4 grid gap-4 md:grid-cols-2'>
            <FormInput
              type='text'
              name='firstName'
              label='First Name'
              defaultValue={profile.firstName}
            />

            <FormInput
              type='text'
              name='lastName'
              label='Last Name'
              defaultValue={profile.lastName}
            />
            <FormInput
              type='text'
              name='username'
              label='User Name'
              defaultValue={profile.username}
            />
          </div>
          <SubmitButton
            text='Update Profile'
            className='mt-8'
          />
        </FormContainer>
      </div>
    </section>
  )
}
export default ProfilePage
