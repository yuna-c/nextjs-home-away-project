import * as z from 'zod'
import { ZodSchema } from 'zod'

/**
 * 유저 프로필 생성/수정 시 사용되는 Zod 유효성 검증 스키마
 */
export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string().min(2, {
    message: 'first name must be at least 2 characters'
  }),
  lastName: z.string().min(2, {
    message: 'last name must be at least 2 characters'
  }),
  username: z.string().min(2, {
    message: 'username must be at least 2 characters'
  })
})

/**
 * Zod 스키마를 사용해 데이터 유효성 검증
 * - 성공 시 검증된 데이터 반환
 * - 실패 시 에러 메시지를 배열로 합쳐서 throw
 */
export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data)
  // console.log(result)

  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message)
    throw new Error(errors.join(','))
  }
  return result.data
}

/**
 * 이미지 업로드용 스키마
 * - 파일 객체(File)인지 확인
 * - 1MB 이하 크기인지 확인
 * - MIME 타입이 이미지인지 확인
 */
export const imageSchema = z.object({
  image: validateFile()
})

/**
 * 이미지 파일 유효성 검증 함수
 * - 파일이 존재하지 않거나 1MB 이하여야 함
 * - 파일 MIME 타입이 image/* 이어야 함
 */
function validateFile() {
  const maxUploadSize = 1024 * 1024
  const acceptFilesTypes = ['image/']
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize
    }, 'File size must be less then 1 MB')
    .refine((file) => {
      return !file || acceptFilesTypes.some((type) => file.type.startsWith(type))
    }, 'File must be an image')
}

/**
 * 숙소 등록 폼 데이터 유효성 검증 스키마
 * - 텍스트 필드: 길이 조건, 필수 여부, 커스텀 조건 포함
 * - 숫자 필드: 양의 정수만 허용, 자동 형 변환(coerce)
 * - description: 단어 수 10 ~ 1000개 사이
 * - amenities: JSON.stringify된 문자열 형태로 받음
 */
export const propertySchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'name must be at least 2 characters.'
    })
    .max(100, {
      message: 'name must be less than 100 characters.'
    }),
  tagline: z
    .string()
    .min(2, {
      message: 'tagline must be at least 2 characters.'
    })
    .max(100, {
      message: 'tagline must be less than 100 characters.'
    }),
  price: z.coerce.number().int().min(0, {
    message: 'price must be a positive number.'
  }),
  category: z.string(),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(' ').length
      return wordCount >= 10 && wordCount <= 1000
    },
    {
      message: 'description must be between 10 and 1000 words.'
    }
  ),
  country: z.string(),
  guests: z.coerce.number().int().min(0, {
    message: 'guest amount must be a positive number.'
  }),
  bedrooms: z.coerce.number().int().min(0, {
    message: 'bedrooms amount must be a positive number.'
  }),
  beds: z.coerce.number().int().min(0, {
    message: 'beds amount must be a positive number.'
  }),
  baths: z.coerce.number().int().min(0, {
    message: 'bahts amount must be a positive number.'
  }),
  amenities: z.string()
})
