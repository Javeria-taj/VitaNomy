import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  })

// Helpful hint for Neon DB connectivity issues (server-side only)
if (typeof window === 'undefined') {
  prisma.$connect().catch((err) => {
    if (err.message.includes('Can\'t reach database')) {
      console.warn('⚠️ [DB] Unable to reach Neon database. Please check your .env DATABASE_URL and ensure your Neon project is active.');
    }
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
