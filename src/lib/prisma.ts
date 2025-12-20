import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7.x 需要 adapter 或 accelerateUrl
// 在開發階段，如果沒有資料庫連接，可以使用 accelerateUrl 或 adapter
// 這裡先使用基本的 PrismaClient，實際部署時需要提供 adapter
// Lazy initialization to avoid build-time errors
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
    } catch (error) {
      // During build phase, if Prisma is not initialized, return a mock
      // This won't affect runtime usage since build doesn't execute actual DB operations
      console.warn("Prisma client initialization failed during build:", error);
      return {} as PrismaClient;
    }
  }
  return globalForPrisma.prisma;
}

// Use Proxy to delay initialization until first access
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

