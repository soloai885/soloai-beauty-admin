import { getReservationsForDate } from "@/lib/mock-data";
import EventCard from "./EventCard";

interface DayListViewProps {
  currentDate: Date;
}

export default function DayListView({ currentDate }: DayListViewProps) {
  const dayReservations = getReservationsForDate(currentDate);

  // 依時間排序
  const sortedReservations = [...dayReservations].sort((a, b) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedReservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-zinc-500">
          當日無預約
        </div>
      ) : (
        sortedReservations.map((event) => {
          const startTime = new Date(event.start);
          const endTime = new Date(event.end);
          const timeStr = `${startTime.getHours().toString().padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}-${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`;
          return (
            <EventCard
              key={event.id}
              reservationId={event.id}
              time={timeStr}
              customerName={event.customerName}
              serviceItem={event.serviceName}
              status={event.status}
              staff={event.staffName || null}
              isMobile={true}
            />
          );
        })
      )}
    </div>
  );
}
