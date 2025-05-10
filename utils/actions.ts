'use server'

import db from './db'
import { profileSchema } from './schemas'
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 인증된 유저 확인 로직 준비
const getAuthUser = async () => {
  const user = await currentUser()
  if (!user) {
    if (!user) throw new Error('You must be logged in to access this route')
  }
  if (!user.privateMetadata.hasProfile) redirect('/profile/create')
  return user
}

const renderError = (error: unknown): { message: string } => {
  console.log(error)
  return { message: error instanceof Error ? error.message : 'An error occurred' }
}

export const createProfileAction = async (prevState: any, formData: FormData) => {
  try {
    const user = await currentUser()
    // console.log(user)
    if (!user) throw new Error('Please login to create a profile')

    const rawData = Object.fromEntries(formData)
    const validatedFields = profileSchema.parse(rawData)
    console.log(validatedFields)
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields
      }
    })
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true
      }
    })
  } catch (error) {
    return renderError(error)
  }
  redirect('/')
}

export const fetchProfileImage = async () => {
  const user = await currentUser()
  if (!user) return null

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id
    },
    select: {
      profileImage: true
    }
  })
  return profile?.profileImage
}

// DB에서 현재 유저 프로필을 정확히 찾아오는 함수
export const fetchProfile = async () => {
  const user = await getAuthUser()
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id
    }
  })
  if (!profile) redirect('profile/create')
  return profile
}

// 프로필 수정 액션을 실행 정의
export const updateProfileAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getAuthUser()

  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = profileSchema.parse(rawData)

    await db.profile.update({
      where: {
        clerkId: user.id
      },
      data: validatedFields
    })

    revalidatePath('/profile')
    return { message: 'update profile action' }
  } catch (error) {
    return renderError(error)
  }
}
