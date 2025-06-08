'use server'

import { calculateTotals } from './calculateTotals'
import db from './db'
import { formatDate } from './format'
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
 * 관리자 전용 페이지 접근 제어용
 */
const getAdminUser = async () => {
  const user = await getAuthUser()
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/')
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

/**
 * 숙소 평점 및 리뷰 수 조회
 */
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

/**
 * 사용자의 기존 리뷰 존재 여부 확인
 */
export const findExistingReview = async (userId: string, propertyId: string) => {
  return db.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId
    }
  })
}

/**
 * 예약 생성 (Booking 생성)
 */
export const createBookingAction = async (prevState: { propertyId: string; checkIn: Date; checkOut: Date }) => {
  const user = await getAuthUser()
  const { propertyId, checkIn, checkOut } = prevState
  const property = await db.property.findUnique({
    where: {
      id: propertyId
    },
    select: {
      price: true
    }
  })

  if (!property) {
    return { message: 'Property not found' }
  }

  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: property.price
  })

  try {
    const booking = await db.booking.create({
      data: {
        checkIn,
        checkOut,
        orderTotal,
        totalNights,
        profileId: user.id,
        propertyId
      }
    })
  } catch (error) {
    return renderError(error)
  }

  redirect('/bookings')
}

/**
 * 로그인한 사용자의 예약 목록 조회
 */
export const fetchBookings = async () => {
  const user = await getAuthUser()
  const bookings = await db.booking.findMany({
    where: {
      profileId: user.id
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return bookings
}

/**
 * 예약 삭제 요청 처리
 */
export const deleteBookingAction = async (prevState: { bookingId: string }) => {
  const { bookingId } = prevState
  const user = await getAuthUser()

  try {
    const result = await db.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id
      }
    })

    revalidatePath('/bookings')
    return { message: 'Booking deleted successfully' }
  } catch (error) {
    return renderError(error)
  }
}

/**
 * 내가 등록한 숙소 목록 조회 + 각 숙소의 총 숙박일수 및 총 수익 합계 계산
 */
export const fetchRentals = async () => {
  const user = await getAuthUser()
  const rentals = await db.property.findMany({
    where: {
      profileId: user.id
    },
    select: {
      id: true,
      name: true,
      price: true
    }
  })

  const rentalsWithBookingsSums = await Promise.all(
    rentals.map(async (rental) => {
      // aggregate : prisma 집계 함수
      const totalNightsSum = await db.booking.aggregate({
        where: {
          profileId: rental.id
        },
        _sum: {
          totalNights: true
        }
      })
      const orderTotalSum = await db.booking.aggregate({
        where: {
          propertyId: rental.id
        },
        _sum: {
          orderTotal: true
        }
      })
      return {
        ...rental,
        totalNightsSum: totalNightsSum._sum.totalNights,
        orderTotalSum: orderTotalSum._sum.orderTotal
      }
    })
  )
  return rentalsWithBookingsSums
}

/**
 * 내가 등록한 숙소 중 하나 삭제 (예약 관리 페이지용)
 */
export const deleteRentalAction = async (prevState: { propertyId: string }) => {
  const { propertyId } = prevState
  const user = await getAuthUser()
  try {
    await db.property.delete({
      where: {
        id: propertyId,
        profileId: user.id
      }
    })

    revalidatePath('/rentals')
    return { message: 'Rental deleted successfully' }
  } catch (error) {
    return renderError(error)
  }
}

/*
 * 사용자 등록 숙소의 상세 정보 조회
 * - 로그인한 사용자 기준으로 propertyId에 해당하는 숙소 정보 반환
 */
export const fetchRentalDetails = async (propertyId: string) => {
  const user = await getAuthUser()
  return db.property.findUnique({
    where: {
      id: propertyId,
      profileId: user.id
    }
  })
}

/*
 * 사용자 등록 숙소 정보 수정 처리 (미구현)
 * - 추후 FormData 기반으로 업데이트 로직 추가 예정
 */
export const updatePropertyAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getAuthUser()
  const propertyId = formData.get('id') as string

  try {
    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(propertySchema, rawData)
    await db.property.update({
      where: {
        id: propertyId, // 수정할 숙소의 id
        profileId: user.id // 현재 로그인한 사용자의 id (숙소 주인인지 확인)
      },
      data: {
        ...validatedFields // 덮어 씌울 데이터
      }
    })

    revalidatePath(`/rental/${propertyId}/edit`)
    return { message: 'Update Successful' }
  } catch (error) {
    return renderError(error)
  }
}

/*
 * 사용자 등록 숙소 이미지 수정 처리 (미구현)
 * - 추후 FormData에서 이미지 파일 받아 Supabase 업로드 및 DB 반영 예정
 */
export const updatePropertyImageAction = async (prevState: any, formData: FormData): Promise<{ message: string }> => {
  const user = await getAuthUser()
  const propertyId = formData.get('id') as string

  try {
    const image = formData.get('image') as File
    const validatedFields = validateWithZodSchema(imageSchema, { image })
    const fullPath = await uploadImage(validatedFields.image)
    await db.property.update({
      where: {
        id: propertyId,
        profileId: user.id
      },
      data: {
        image: fullPath
      }
    })

    revalidatePath(`/rental/${propertyId}/edit`)
    return { message: 'Property Image Updated Successfully' }
  } catch (error) {
    return renderError(error)
  }
}

/*
 * 내가 등록한 숙소에 어떤 예약이 들어왔는지 확인
 */
export const fetchReservations = async () => {
  const user = await getAuthUser()
  const reservations = await db.booking.findMany({
    where: {
      property: {
        profileId: user.id
      }
    },
    orderBy: {
      createdAt: 'desc' // createdAt(생성일자)을 기준으로 내림차순(desc) 정렬
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          price: true,
          country: true
        }
        // 숙소의 ID, 이름, 가격, 국가만 선택적으로 가져옴
      }
    }
  })
  return reservations
}

/*
 * 관리자 대시보드용 통계 데이터 조회
 */
export const fetchStats = async () => {
  await getAdminUser()
  const usersCount = await db.profile.count()
  const propertiesCount = await db.property.count()
  const bookingsCount = await db.booking.count()

  return {
    usersCount,
    propertiesCount,
    bookingsCount
  }
}

/*
 * 관리자 대시보드용 차트 통계
 */
export const fetchChartsData = async () => {
  await getAdminUser()
  const date = new Date()

  // 6개월 예약
  date.setMonth(date.getMonth() - 6)
  const sixMonthsAgo = date

  // 6개월 이전 예약
  const bookings = await db.booking.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo
      }
    },
    orderBy: {
      createdAt: 'asc' // 오름차순
    }
  })

  // 달별 예약 카운트 배열 가공
  const bookingsPerMonth = bookings.reduce(
    (total, current) => {
      const date = formatDate(current.createdAt, true)
      const existingEntry = total.find((entry) => entry.date === date)

      if (existingEntry) {
        existingEntry.count += 1
      } else {
        total.push({ date, count: 1 })
      }

      return total
    },
    [] as Array<{ date: string; count: number }>
  )

  return bookingsPerMonth
}
