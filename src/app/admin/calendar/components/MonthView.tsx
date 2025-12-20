import { getReservationsForDate } from "@/lib/mock-data";
import EventCard from "./EventCard";

interface MonthViewProps {
  currentDate: Date;
}

export default function MonthView({ currentDate }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 取得當月第一天和最後一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
          const events = date ? getReservationsForDate(date) : [];
          return (
            <div
              key={index}
              className="min-h-[120px] border-r border-b border-zinc-200 p-2 bg-white"
            >
              {date ? (
                <>
                  <div className="text-sm font-medium text-zinc-900 mb-2">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {events.map((event) => {
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
                </>
              ) : (
                <div className="bg-zinc-50 h-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
