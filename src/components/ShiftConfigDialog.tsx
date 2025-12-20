"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { DaySchedule } from "@/lib/mock-data";

interface ShiftConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffName: string;
  weeklySchedule: DaySchedule[];
  onSave?: (schedule: DaySchedule[]) => void;
}

export function ShiftConfigDialog({
  open,
  onOpenChange,
  staffName,
  weeklySchedule,
  onSave,
}: ShiftConfigDialogProps) {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<DaySchedule[]>(weeklySchedule);

  // 當 weeklySchedule prop 改變時，更新本地狀態
  useEffect(() => {
    setSchedule(weeklySchedule);
  }, [weeklySchedule]);

  const handleToggleDay = (dayIndex: number) => {
    setSchedule((prev) => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        isOff: !updated[dayIndex].isOff,
      };
      return updated;
    });
  };

  const handleTimeChange = (
    dayIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const handleSave = () => {
    // Mock save logic
    if (onSave) {
      onSave(schedule);
    }
    toast({
      title: "排班已更新",
      description: `${staffName} 的排班設定已成功儲存`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{staffName} 的週班表設定</DialogTitle>
          <DialogDescription>
            設定每週的上班時間與休假日期（此設定會應用到未來的所有週）
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {schedule.map((day, index) => (
            <div
              key={day.day}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <div className="w-20 flex-shrink-0">
                <Label className="font-medium">{day.dayLabel}</Label>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch
                  checked={!day.isOff}
                  onCheckedChange={() => handleToggleDay(index)}
                />
                <span className="text-sm text-muted-foreground min-w-[60px]">
                  {day.isOff ? "休假" : "上班"}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`start-${day.day}`} className="text-sm">
                    上班
                  </Label>
                  <Input
                    id={`start-${day.day}`}
                    type="time"
                    value={day.start}
                    onChange={(e) =>
                      handleTimeChange(index, "start", e.target.value)
                    }
                    disabled={day.isOff}
                    className="w-32"
                    step="1800"
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`end-${day.day}`} className="text-sm">
                    下班
                  </Label>
                  <Input
                    id={`end-${day.day}`}
                    type="time"
                    value={day.end}
                    onChange={(e) =>
                      handleTimeChange(index, "end", e.target.value)
                    }
                    disabled={day.isOff}
                    className="w-32"
                    step="1800"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>儲存排班</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

