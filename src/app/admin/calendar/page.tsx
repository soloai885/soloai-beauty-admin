'use client';

import { useState } from "react";
import CalendarControls from "./components/CalendarControls";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";
import DayListView from "./components/DayListView";

type ViewType = "month" | "week" | "day";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");

  return (
    <div className="max-w-full">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
        行事曆 (Calendar)
      </h1>
      <CalendarControls
        currentDate={currentDate}
        viewType={viewType}
        onDateChange={setCurrentDate}
        onViewChange={setViewType}
      />
      {/* Desktop/Tablet: 顯示選定的視圖 */}
      <div className="hidden md:block">
        {viewType === "month" && <MonthView currentDate={currentDate} />}
        {viewType === "week" && <WeekView currentDate={currentDate} />}
        {viewType === "day" && <DayListView currentDate={currentDate} />}
      </div>
      {/* Mobile: 強制顯示每日清單模式 */}
      <div className="md:hidden">
        <DayListView currentDate={currentDate} />
      </div>
    </div>
  );
}
