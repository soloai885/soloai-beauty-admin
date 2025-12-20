'use client';

import { useState, useMemo } from 'react';
import { DayOfWeek } from '@prisma/client';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  workingCount: number; // 上班人數
  staffSchedules: Array<{
    staffId: string;
    isOff: boolean;
    startTime: string | null;
    endTime: string | null;
  }>;
}

interface ScheduleCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDateClick: (date: Date) => void;
  selectedStaffId: string | null; // null 表示全店模式
  weeklySchedules: Array<{
    userId: string;
    dayOfWeek: DayOfWeek;
    isOff: boolean;
    startTime: string;
    endTime: string;
  }>;
  scheduleOverrides: Array<{
    userId: string;
    date: Date;
    isOff: boolean;
    startTime: string | null;
    endTime: string | null;
  }>;
  allStaff: Array<{ id: string; name: string }>;
  minDailyStaff?: number; // 每日最低人力標準（綠燈門檻），預設為 2
}

export default function ScheduleCalendar({
  currentDate,
  onDateChange,
  onDateClick,
  selectedStaffId,
  weeklySchedules,
  scheduleOverrides,
  allStaff,
  minDailyStaff = 2, // 預設值為 2
}: ScheduleCalendarProps) {
  const [viewDate, setViewDate] = useState(currentDate);

  // 計算月曆天數
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);

    // 生成 42 天（6 週）
    for (let i = 0; i < 42; i++) {
      const date = new Date(currentDate);
      const dateStr = date.toISOString().split('T')[0];

      // 計算當日的排班狀態
      const dayOfWeekMap: Record<number, DayOfWeek> = {
        0: DayOfWeek.SUN,
        1: DayOfWeek.MON,
        2: DayOfWeek.TUE,
        3: DayOfWeek.WED,
        4: DayOfWeek.THU,
        5: DayOfWeek.FRI,
        6: DayOfWeek.SAT,
      };
      const dayOfWeek = dayOfWeekMap[date.getDay()];

      const staffSchedules: CalendarDay['staffSchedules'] = [];

      if (selectedStaffId) {
        // 單人模式：顯示該員工的排班
        const override = scheduleOverrides.find((o) => {
          const overrideDateStr = o.date instanceof Date
            ? o.date.toISOString().split('T')[0]
            : new Date(o.date).toISOString().split('T')[0];
          return o.userId === selectedStaffId && overrideDateStr === dateStr;
        });
        if (override) {
          staffSchedules.push({
            staffId: selectedStaffId,
            isOff: override.isOff,
            startTime: override.startTime,
            endTime: override.endTime,
          });
        } else {
          const weekly = weeklySchedules.find(
            (w) => w.userId === selectedStaffId && w.dayOfWeek === dayOfWeek
          );
          if (weekly) {
            staffSchedules.push({
              staffId: selectedStaffId,
              isOff: weekly.isOff,
              startTime: weekly.startTime,
              endTime: weekly.endTime,
            });
          }
        }
      } else {
        // 全店模式：計算所有員工的排班
        allStaff.forEach((staff) => {
          const override = scheduleOverrides.find((o) => {
            const overrideDateStr = o.date instanceof Date
              ? o.date.toISOString().split('T')[0]
              : new Date(o.date).toISOString().split('T')[0];
            return o.userId === staff.id && overrideDateStr === dateStr;
          });
          if (override) {
            if (!override.isOff) {
              staffSchedules.push({
                staffId: staff.id,
                isOff: false,
                startTime: override.startTime,
                endTime: override.endTime,
              });
            }
          } else {
            const weekly = weeklySchedules.find(
              (w) => w.userId === staff.id && w.dayOfWeek === dayOfWeek
            );
            if (weekly && !weekly.isOff) {
              staffSchedules.push({
                staffId: staff.id,
                isOff: false,
                startTime: weekly.startTime,
                endTime: weekly.endTime,
              });
            }
          }
        });
      }

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday:
          date.toISOString().split('T')[0] ===
          new Date().toISOString().split('T')[0],
        workingCount: staffSchedules.filter((s) => !s.isOff).length,
        staffSchedules,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [viewDate, selectedStaffId, weeklySchedules, scheduleOverrides, allStaff]);

  const handlePreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const handleToday = () => {
    setViewDate(new Date());
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-white rounded-lg shadow border border-zinc-200 p-4">
      {/* 月曆標題 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold text-zinc-900 min-w-[120px] text-center">
            {viewDate.toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: 'long',
            })}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleToday}>
          今天
        </Button>
      </div>

      {/* 星期標題 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-zinc-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isPast = day.date < new Date() && !day.isToday;
          return (
            <button
              key={index}
              onClick={() => onDateClick(day.date)}
              className={cn(
                'aspect-square p-2 rounded-md border transition-all hover:bg-zinc-50',
                !day.isCurrentMonth && 'opacity-30',
                day.isToday && 'border-[#BE185D] border-2',
                isPast && 'opacity-50'
              )}
            >
              <div
                className={cn(
                  'text-sm font-medium mb-1',
                  day.isToday && 'text-[#BE185D]'
                )}
              >
                {day.date.getDate()}
              </div>
              {selectedStaffId ? (
                // 單人模式：顯示時間
                day.staffSchedules.length > 0 && !day.staffSchedules[0].isOff ? (
                  <div className="text-xs text-zinc-600">
                    {day.staffSchedules[0].startTime?.split(':')[0]}-
                    {day.staffSchedules[0].endTime?.split(':')[0]}
                  </div>
                ) : day.staffSchedules.length > 0 &&
                  day.staffSchedules[0].isOff ? (
                  <div className="text-xs text-zinc-500">休</div>
                ) : null
              ) : (
                // 全店模式：顯示人數與燈號
                (() => {
                  const count = day.workingCount;
                  const threshold = minDailyStaff;
                  
                  // 決定燈號顏色
                  let lightColor: string;
                  if (count === 0) {
                    lightColor = 'bg-red-500'; // 🔴 紅燈：0 人
                  } else if (count < threshold) {
                    lightColor = 'bg-yellow-500'; // 🟡 黃燈：低於門檻
                  } else {
                    lightColor = 'bg-green-500'; // 🟢 綠燈：達到或超過門檻
                  }

                  return (
                    <div className="flex items-center justify-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${lightColor}`}></div>
                      <span className="text-xs font-medium text-zinc-700">
                        {count}
                      </span>
                    </div>
                  );
                })()
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

