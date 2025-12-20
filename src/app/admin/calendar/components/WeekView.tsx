import { getReservationsForDate } from "@/lib/mock-data";
import EventCard from "./EventCard";

interface WeekViewProps {
  currentDate: Date;
}

export default function WeekView({ currentDate }: WeekViewProps) {
  // 計算週的開始日期（週日）
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  // 建立一週的日期陣列
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    weekDays.push(date);
  }

  const weekDayNames = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 border-b border-zinc-200">
        {weekDays.map((date, index) => (
          <div
            key={index}
            className="p-3 text-center border-r border-zinc-200 last:border-r-0 bg-zinc-50"
          >
            <div className="text-xs text-zinc-600 mb-1">
              {weekDayNames[date.getDay()]}
            </div>
            <div className="text-sm font-medium text-zinc-900">
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 min-h-[600px]">
        {weekDays.map((date, index) => {
          const events = getReservationsForDate(date);
          // Sort events by time
          const sortedEvents = [...events].sort((a, b) => {
            return new Date(a.start).getTime() - new Date(b.start).getTime();
          });
          return (
            <div
              key={index}
              className="border-r border-zinc-200 last:border-r-0 p-2 bg-white"
            >
              <div className="space-y-2">
                {sortedEvents.map((event) => {
                  const startTime = new Date(event.start);
                  const timeStr = `${startTime.getHours().toString().padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`;
                  return (
                    <EventCard
                      key={event.id}
                      reservationId={event.id}
                      time={timeStr}
                      customerName={event.customerName}
                      serviceItem={event.serviceName}
                      status={event.status}
                      staff={event.staffName || null}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
