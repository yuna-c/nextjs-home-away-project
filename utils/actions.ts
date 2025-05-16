'use server'

import db from './db'
import { imageSchema, profileSchema, propertySchema, validateWithZodSchema } from './schemas'
import { uploadImage } from './supabase'
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * 현재 로그인된 Clerk 유저 정보를 가져오고,
 * 프로필이 없으면 프로필 생성 페이지로 리디렉션하는 인증 유틸 함수
 */
const getAuthUser = async () => {
  const user = await currentUser()

  if (!user) {
    if (!user) throw new Error('You must be logged in to access this route')
  }
  if (!user.privateMetadata.hasProfile) redirect('/profile/create')
  return user
}

/**
 * 에러 핸들링 유틸 – Error 객체를 메시지 문자열로 변환
 */
const renderError = (error: unknown): { message: string } => {
  // console.log(error)
  return { message: error instanceof Error ? error.message : 'An error occurred' }
}

/**
 * 프로필 생성 액션 – 로그인된 유저의 정보를 바탕으로 새 프로필 생성
 */
export const createProfileAction = async (prevState: any, formData: FormData) => {
  try {
    const user = await currentUser()
    // console.log(user)
    if (!user) throw new Error('Please login to create a profile')

    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(profileSchema, rawData)
    // console.log(validatedFields)

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

/**
 * 현재 로그인 유저의 프로필 이미지 경로만 가져오기
 */
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

/**
 * 현재 로그인 유저의 전체 프로필 정보 가져오기
 * - 없으면 프로필 생성 페이지로 리디렉션
 */
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

/**
 * 프로필 수정 액션 – 유효성 검증 후 DB 업데이트 및 캐시 재검증
 */
export const updateProfileAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getAuthUser()

  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(profileSchema, rawData)
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

/**
 * 프로필 이미지 수정 액션 – 이미지 업로드 후 DB에 경로 저장 및 캐시 재검증
 */
export const updateProfileImageAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getAuthUser()

  try {
    const image = formData.get('image') as File
    const validatedFiles = validateWithZodSchema(imageSchema, { image })
    // console.log(validatedFiles)
    const fullPath = await uploadImage(validatedFiles.image)

    await db.profile.update({
      where: {
        clerkId: user.id
      },
      data: {
        profileImage: fullPath
      }
    })

    revalidatePath('/profile')
    return { message: 'profile image updated successfully' }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * 숙소 등록 액션 – 유효성 검증, 이미지 업로드, DB 저장 후 메인 페이지 리디렉션
 */
export const createPropertyAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getAuthUser()

  try {
    const rawData = Object.fromEntries(formData)
    const file = formData.get('image') as File

    const validatedFields = validateWithZodSchema(propertySchema, rawData)
    const validateFile = validateWithZodSchema(imageSchema, { image: file })
    const fullPath = await uploadImage(validateFile.image)

    // 버킷 업로드
    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id
      }
    })
  } catch (error) {
    return renderError(error)
  }

  redirect('/')
}
