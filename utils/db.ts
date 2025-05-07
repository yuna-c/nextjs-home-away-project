import { PrismaClient } from '@prisma/client'

// 새로운 PrismaClient 인스턴스를 생성
const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

/**
 * globalThis를 활용한 전역 객체 활용
 * globalThis는 전역 스코프 객체 (Node.js에서는 global,
 * 브라우저에서는 window 역할)
 * prisma 인스턴스를 저장해서 중복 생성 막기
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// 싱글톤 인스턴스 생성
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

// 개발 환경에서만 전역에 저장
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
