'use server';

import { prisma } from '@/lib/prisma';

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      bufferTime: service.bufferTime,
      description: service.description,
    }));
  } catch (error) {
    console.error('取得服務列表失敗:', error);
    return [];
  }
}

export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) return null;

    return {
      id: service.id,
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      bufferTime: service.bufferTime,
      description: service.description,
    };
  } catch (error) {
    console.error('取得服務失敗:', error);
    return null;
  }
}



