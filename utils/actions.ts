'use server'

import { profileSchema } from './schemas'

export const createProfileAction = async (prevState: any, formData: FormData) => {
  // const firstName = formData.get('firstName') as string
  // console.log(firstName)
  // if (firstName !== 'shakeAndBake') return { message: 'There was an error...' }
  // return { message: 'Profile Created' }

  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = profileSchema.parse(rawData)
    console.log(validatedFields)
    return { message: 'profile created' }
  } catch (error) {
    console.log(error)
    return { message: 'there was an error' }
  }
}
