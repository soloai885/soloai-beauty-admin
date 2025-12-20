'use client';

import { useState } from "react";

type ViewType = "month" | "week" | "day";

interface CalendarControlsProps {
  currentDate: Date;
  viewType: ViewType;
  onDateChange: (date: Date) => void;
  onViewChange: (view: ViewType) => void;
}

export default function CalendarControls({
  currentDate,
  viewType,
  onDateChange,
  onViewChange,
}: CalendarControlsProps) {
  const formatDateRange = (date: Date, view: ViewType): string => {
    if (view === "month") {
      return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
    } else if (view === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.getMonth() + 1}/${weekStart.getDate()} - ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    } else {
      return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="mb-6">
      {/* Desktop/Tablet 佈局 */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToday}
            className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 text-sm"
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded hover:bg-zinc-100"
              aria-label="Previous"
            >
              ←
            </button>
            <span className="text-sm font-medium text-zinc-900 min-w-[200px] text-center">
              {formatDateRange(currentDate, viewType)}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded hover:bg-zinc-100"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          <button
            onClick={() => onViewChange("month")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewType === "month"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            月
          </button>
          <button
            onClick={() => onViewChange("week")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewType === "week"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            週
          </button>
          <button
            onClick={() => onViewChange("day")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewType === "day"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            日
          </button>
        </div>
      </div>

      {/* Mobile 佈局 */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 rounded hover:bg-zinc-100"
            aria-label="Previous"
          >
            ←
          </button>
          <span className="text-sm font-medium text-zinc-900 min-w-[180px] text-center">
            {formatDateRange(currentDate, viewType)}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded hover:bg-zinc-100"
            aria-label="Next"
          >
            →
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleToday}
            className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 text-sm"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}






