'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * 取得商店設定
 */
export async function getShopSettings() {
  try {
    let settings = await prisma.shopSettings.findUnique({
      where: { id: 1 },
    });

    // 如果不存在，建立預設設定
    if (!settings) {
      settings = await prisma.shopSettings.create({
        data: {
          id: 1,
          minDailyStaff: 2,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error('取得商店設定失敗:', error);
    throw new Error('無法取得商店設定');
  }
}

/**
 * 更新商店設定
 */
export async function updateShopSettings(data: { minDailyStaff: number }) {
  try {
    const settings = await prisma.shopSettings.upsert({
      where: { id: 1 },
      update: {
        minDailyStaff: data.minDailyStaff,
      },
      create: {
        id: 1,
        minDailyStaff: data.minDailyStaff,
      },
    });

    // 重新驗證排班頁面，讓燈號立即更新
    revalidatePath('/admin/staff/schedule');
    revalidatePath('/admin/settings');

    return settings;
  } catch (error) {
    console.error('更新商店設定失敗:', error);
    throw new Error('無法更新商店設定');
  }
}



