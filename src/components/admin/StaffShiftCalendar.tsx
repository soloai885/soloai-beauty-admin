"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import type { DaySchedule, ScheduleException } from "@/lib/mock-data";

interface ShiftEvent {
  id: string;
  title: string;
  date: Date;
  start: string;
  end: string;
  color: string;
  staffId: string;
  staffName: string;
  isException?: boolean; // 標記是否為例外規則
  note?: string; // 例外備註
}

interface StaffShiftCalendarProps {
  staffData: Array<{
    id: string;
    name: string;
    skills: string[];
    weeklySchedule: DaySchedule[];
    scheduleExceptions?: ScheduleException[];
  }>;
}

// Helper: 將週規則展開為月份事件（優先檢查例外設定）
function expandWeeklyScheduleToMonth(
  staffId: string,
  staffName: string,
  weeklySchedule: DaySchedule[],
  scheduleExceptions: ScheduleException[] = [],
  year: number,
  month: number,
  color: string
): ShiftEvent[] {
  const events: ShiftEvent[] = [];
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // 建立 day 到 dayIndex 的映射 (0=Sunday, 1=Monday, ..., 6=Saturday)
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  // 遍歷當月的每一天
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateStr = currentDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const dayOfWeek = currentDate.getDay(); // 0-6 (0=Sunday)

    // 優先檢查是否有例外設定
    const exception = scheduleExceptions.find((ex) => ex.date === dateStr);

    if (exception) {
      // 有例外設定：使用例外規則
      if (!exception.isOff && exception.workHours) {
        // 例外：調整工時
        events.push({
          id: `${staffId}-${year}-${month}-${day}-exception`,
          title: `${staffName} ${exception.workHours.start}-${exception.workHours.end}`,
          date: currentDate,
          start: exception.workHours.start,
          end: exception.workHours.end,
          color,
          staffId,
          staffName,
          isException: true,
          note: exception.note,
        });
      }
      // 如果 exception.isOff === true，則不產生事件（休假）
    } else {
      // 無例外設定：使用週規則
      const schedule = weeklySchedule.find(
        (s) => dayMap[s.day] === dayOfWeek
      );

      if (schedule && !schedule.isOff) {
        // 如果當天不是休假，建立事件
        events.push({
          id: `${staffId}-${year}-${month}-${day}`,
          title: `${staffName} ${schedule.start}-${schedule.end}`,
          date: currentDate,
          start: schedule.start,
          end: schedule.end,
          color,
          staffId,
          staffName,
          isException: false,
        });
      }
    }
  }

  return events;
}

// 根據技能取得代表色（使用 Rose-700 主色調）
function getStaffColor(skills: string[]): string {
  if (skills.includes("美甲")) {
    return "bg-rose-100 border-rose-300 text-rose-700";
  }
  if (skills.includes("美睫")) {
    return "bg-purple-100 border-purple-300 text-purple-700";
  }
  if (skills.includes("美容")) {
    return "bg-orange-100 border-orange-300 text-orange-700";
  }
  return "bg-gray-100 border-gray-300 text-gray-700";
}

export default function StaffShiftCalendar({
  staffData,
}: StaffShiftCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 取得當月第一天和最後一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // 展開所有員工的排班為月份事件
  const allEvents: ShiftEvent[] = [];
  staffData.forEach((staff) => {
    const color = getStaffColor(staff.skills);
    const events = expandWeeklyScheduleToMonth(
      staff.id,
      staff.name,
      staff.weeklySchedule,
      staff.scheduleExceptions || [],
      year,
      month,
      color
    );
    allEvents.push(...events);
  });

  // 建立日曆網格
  const days: (Date | null)[] = [];
  // 填入空白（上個月的日期）
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  // 填入當月日期
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  // 取得特定日期的事件
  const getEventsForDate = (date: Date): ShiftEvent[] => {
    const dateStr = date.toISOString().split("T")[0];
    return allEvents.filter((event) => {
      const eventDateStr = event.date.toISOString().split("T")[0];
      return eventDateStr === dateStr;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info size={16} />
        <span>提示：此處顯示所有人員的排班狀況，空白代表當日無人上班。</span>
      </div>

      {/* 月曆控制 */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            今天
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold text-rose-700">
          {year}年 {month + 1}月
        </h2>
      </div>

      {/* 月曆網格 - 響應式設計 */}
      <div className="overflow-x-auto">
        <Card className="overflow-hidden min-w-[700px] md:min-w-0">
          <div className="grid grid-cols-7 border-b border-zinc-200">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-zinc-700 bg-zinc-50"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              const events = date ? getEventsForDate(date) : [];
              const isToday =
                date &&
                date.toDateString() === new Date().toDateString();
              const isEmpty = events.length === 0 && date !== null;

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b p-2 ${
                    isToday
                      ? "border-4 border-rose-500 bg-rose-50"
                      : isEmpty
                      ? "border-zinc-200 bg-red-50 border-red-200"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  {date ? (
                    <>
                      <div
                        className={`text-sm font-medium mb-2 ${
                          isToday
                            ? "text-rose-700 font-bold"
                            : "text-zinc-900"
                        }`}
                      >
                        {isToday ? "今天" : date.getDate()}
                      </div>
                    <div className="space-y-1">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded border ${
                            event.isException
                              ? `${event.color} border-rose-500 border-2`
                              : event.color
                          }`}
                          title={
                            event.isException && event.note
                              ? `${event.staffName}: ${event.start} - ${event.end} (${event.note})`
                              : `${event.staffName}: ${event.start} - ${event.end}`
                          }
                        >
                          <div className="font-medium truncate flex items-center gap-1">
                            {event.staffName}
                            {event.isException && (
                              <span className="text-rose-600 font-bold" title={event.note}>
                                *
                              </span>
                            )}
                          </div>
                          <div className="text-xs opacity-75">
                            {event.start}-{event.end}
                            {event.isException && event.note && (
                              <span className="ml-1 text-rose-600">({event.note})</span>
                            )}
                          </div>
                        </div>
                      ))}
                        {isEmpty && (
                          <div className="text-xs text-red-600 font-medium font-semibold">
                            無人上班
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="bg-zinc-50 h-full" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

