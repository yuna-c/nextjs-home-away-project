'use server'

import db from './db'
import { createReviewSchema, imageSchema, profileSchema, propertySchema, validateWithZodSchema } from './schemas'
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

/**
 * 카테고리 및 검색어 기준으로 숙소 목록 조회 (최신순 정렬)
 */
export const fetchProperties = async ({ search = '', category }: { search?: string; category?: string }) => {
  const properties = await db.property.findMany({
    where: {
      category,
      OR: [{ name: { contains: search, mode: 'insensitive' } }, { tagline: { contains: search, mode: 'insensitive' } }]
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      price: true,
      image: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return properties
}

/**
 * 유저가 해당 숙소를 좋아요했는지 확인하고 favorite ID 반환 (없으면 null)
 */
export const fetchFavoriteId = async ({ propertyId }: { propertyId: string }) => {
  const user = await getAuthUser()
  const favorite = await db.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id
    },
    select: {
      id: true
    }
  })
  return favorite?.id || null
}

/**
 * 좋아요 토글 액션 favoriteId 존재 시 삭제 / 없을 경우 생성 이후 해당 pathname 경로 캐시 재검증 (revalidatePath)
 */
export const toggleFavoriteAction = async (prevState: {
  propertyId: string
  favoriteId: string | null
  pathname: string
}) => {
  const user = await getAuthUser()
  const { propertyId, favoriteId, pathname } = prevState
  // console.log(propertyId, favoriteId, pathname)

  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId
        }
      })
    } else {
      await db.favorite.create({
        data: {
          propertyId,
          profileId: user.id
        }
      })
    }
    revalidatePath(pathname)
    return { message: favoriteId ? 'Remove from Faves' : 'Add To Faves' }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * 로그인된 사용자의 즐겨찾기 목록을 조회
 */
export const fetchFavorites = async () => {
  const user = await getAuthUser()
  const favorites = await db.favorite.findMany({
    where: {
      profileId: user.id
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          country: true,
          price: true,
          image: true
        }
      }
    }
  })
  return favorites.map((favorite) => favorite.property)
}

/**
 * 특정 숙소(property)의 상세 정보를 가져오는 내용(상세 페이지)
 */
export const fetchPropertyDetails = async (id: string) => {
  return db.property.findUnique({
    where: {
      id
    },
    include: {
      profile: true,
      bookings: {
        select: {
          checkIn: true,
          checkOut: true
        }
      }
    }
  })
}

/**
 * 리뷰 생성(Create)
 */
export const createReviewAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser()

  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(createReviewSchema, rawData)
    await db.review.create({
      data: {
        ...validatedFields,
        profileId: user.id
      }
    })
    revalidatePath(`/properties/${validatedFields.propertyId}`)
    return { message: 'Review submitted successfully' }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * 모든 리뷰 조회(Read)
 */
export const fetchPropertyReviews = async (propertyId: string) => {
  const reviews = await db.review.findMany({
    where: {
      propertyId
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true
        }
      }
    }
  })
  return reviews
}

/**
 * 특정 유저의 리뷰 조회 (by user)
 */
export const fetchPropertyReviewsByUser = async () => {
  const user = await getAuthUser()
  const reviews = await db.review.findMany({
    where: {
      profileId: user.id
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      property: {
        select: {
          name: true,
          image: true
        }
      }
    }
  })
  return reviews
}

/**
 * 리뷰 삭제(Delete)
 */
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState
  const user = await getAuthUser()

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        profileId: user.id
      }
    })
    revalidatePath('/reviews')
    return { message: 'delete reviews' }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * 리뷰 수정(Update)
 */
export const updateReviewAction = async () => {
  return { message: 'update review' }
}

export async function fetchPropertyRating(propertyId: string) {
  const result = await db.review.groupBy({
    by: ['propertyId'],
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    },
    where: {
      propertyId
    }
  })
  return { rating: result[0]?._avg.rating?.toFixed() ?? 0, count: result[0]?._count.rating ?? 0 }
}

export const findExistingReview = async (userId: string, propertyId: string) => {
  return db.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId
    }
  })
}
