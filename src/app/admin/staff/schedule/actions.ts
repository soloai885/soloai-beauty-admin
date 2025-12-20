'use server';

import { prisma } from '@/lib/prisma';
import { DayOfWeek } from '@prisma/client';

// 取得商店設定（用於排班燈號門檻）
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
    // 回傳預設值
    return { id: 1, minDailyStaff: 2, updatedAt: new Date() };
  }
}

// 取得所有員工
export async function getAllStaff() {
  try {
    const staff = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        skills: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return staff;
  } catch (error) {
    console.error('取得員工列表失敗:', error);
    return [];
  }
}

// 取得指定月份的排班資料
export async function getScheduleForMonth(year: number, month: number) {
  try {
    // 取得所有員工的常態排班
    const weeklySchedules = await prisma.weeklySchedule.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // 取得指定月份的所有例外排班
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const scheduleOverrides = await prisma.scheduleOverride.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return {
      weeklySchedules,
      scheduleOverrides,
    };
  } catch (error) {
    console.error('取得排班資料失敗:', error);
    return {
      weeklySchedules: [],
      scheduleOverrides: [],
    };
  }
}

// 取得指定日期的排班資料
export async function getScheduleForDate(date: Date | string) {
  try {
    // 確保日期是當天的開始時間（00:00:00）
    const targetDate = typeof date === 'string' ? new Date(date) : new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // 取得所有員工
    const allStaff = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
      },
    });

    // 取得當日的例外排班
    const overrides = await prisma.scheduleOverride.findMany({
      where: {
        date: targetDate,
      },
    });

    // 取得所有員工的常態排班
    const weeklySchedules = await prisma.weeklySchedule.findMany({
      where: {
        userId: {
          in: allStaff.map((s) => s.id),
        },
      },
    });

    // 計算當日是星期幾
    const dayOfWeekMap: Record<number, DayOfWeek> = {
      0: DayOfWeek.SUN,
      1: DayOfWeek.MON,
      2: DayOfWeek.TUE,
      3: DayOfWeek.WED,
      4: DayOfWeek.THU,
      5: DayOfWeek.FRI,
      6: DayOfWeek.SAT,
    };
    const dayOfWeek = dayOfWeekMap[targetDate.getDay()];

    // 合併資料
    const result = allStaff.map((staff) => {
      // 先檢查是否有例外
      const override = overrides.find((o) => o.userId === staff.id);
      if (override) {
        return {
          staff,
          isOff: override.isOff,
          startTime: override.startTime,
          endTime: override.endTime,
          note: override.note,
          isOverride: true,
        };
      }

      // 否則使用常態排班
      const weekly = weeklySchedules.find(
        (w) => w.userId === staff.id && w.dayOfWeek === dayOfWeek
      );
      if (weekly) {
        return {
          staff,
          isOff: weekly.isOff,
          startTime: weekly.startTime,
          endTime: weekly.endTime,
          note: null,
          isOverride: false,
        };
      }

      // 預設休假
      return {
        staff,
        isOff: true,
        startTime: null,
        endTime: null,
        note: null,
        isOverride: false,
      };
    });

    return result;
  } catch (error) {
    console.error('取得日期排班失敗:', error);
    return [];
  }
}

// 更新或建立排班例外
export async function updateScheduleOverride(
  userId: string,
  date: Date | string,
  data: {
    isOff: boolean;
    startTime?: string | null;
    endTime?: string | null;
    note?: string | null;
  }
) {
  try {
    const dateOnly = typeof date === 'string' ? new Date(date) : new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    const result = await prisma.scheduleOverride.upsert({
      where: {
        userId_date: {
          userId,
          date: dateOnly,
        },
      },
      update: {
        isOff: data.isOff,
        startTime: data.isOff ? null : (data.startTime || null),
        endTime: data.isOff ? null : (data.endTime || null),
        note: data.note || null,
      },
      create: {
        userId,
        date: dateOnly,
        isOff: data.isOff,
        startTime: data.isOff ? null : (data.startTime || null),
        endTime: data.isOff ? null : (data.endTime || null),
        note: data.note || null,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('更新排班例外失敗:', error);
    return { success: false, error: '更新失敗' };
  }
}

// 刪除排班例外（恢復常態排班）
export async function deleteScheduleOverride(userId: string, date: Date | string) {
  try {
    const dateOnly = typeof date === 'string' ? new Date(date) : new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    await prisma.scheduleOverride.delete({
      where: {
        userId_date: {
          userId,
          date: dateOnly,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('刪除排班例外失敗:', error);
    return { success: false, error: '刪除失敗' };
  }
}

