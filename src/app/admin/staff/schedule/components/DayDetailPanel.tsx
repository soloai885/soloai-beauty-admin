'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import ScheduleEditDialog from './ScheduleEditDialog';
import { UserRole } from '@prisma/client';

export interface StaffSchedule {
  staff: {
    id: string;
    name: string;
    avatar: string | null;
    role: UserRole | string; // 允許 string 以兼容 API 返回
  };
  isOff: boolean;
  startTime: string | null;
  endTime: string | null;
  note: string | null;
  isOverride: boolean;
}

interface DayDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  staffSchedules: StaffSchedule[];
  currentUserRole: UserRole | string;
  currentUserId: string;
  onUpdate: () => void;
  isMobile?: boolean;
}

export default function DayDetailPanel({
  open,
  onOpenChange,
  date,
  staffSchedules,
  currentUserRole,
  currentUserId,
  onUpdate,
  isMobile = false,
}: DayDetailPanelProps) {
  const [editingStaff, setEditingStaff] = useState<StaffSchedule | null>(null);

  const dateStr = date.toLocaleDateString('zh-TW', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const canEdit = (staffId: string) => {
    return (
      (currentUserRole === 'ADMIN' || currentUserRole === UserRole.ADMIN) ||
      currentUserId === staffId
    );
  };

  const Content = () => (
    <>
      <div className="space-y-3">
        {staffSchedules.map((schedule) => (
          <div
            key={schedule.staff.id}
            className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-white"
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="w-10 h-10">
                <AvatarImage src={schedule.staff.avatar || undefined} />
                <AvatarFallback className="bg-rose-50 text-[#BE185D]">
                  {schedule.staff.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-zinc-900">{schedule.staff.name}</p>
                {schedule.isOff ? (
                  <p className="text-sm text-zinc-500">休假</p>
                ) : (
                  <p className="text-sm text-zinc-700">
                    {schedule.startTime} - {schedule.endTime}
                  </p>
                )}
                {schedule.note && (
                  <p className="text-xs text-zinc-500 mt-1">{schedule.note}</p>
                )}
              </div>
            </div>
            {canEdit(schedule.staff.id) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingStaff(schedule)}
                className="ml-2"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {editingStaff && (
        <ScheduleEditDialog
          open={!!editingStaff}
          onOpenChange={(open) => !open && setEditingStaff(null)}
          staffSchedule={editingStaff}
          date={date}
          onUpdate={() => {
            onUpdate();
            setEditingStaff(null);
          }}
          canEdit={canEdit(editingStaff.staff.id)}
        />
      )}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>{dateStr}</SheetTitle>
            <SheetDescription>當日排班詳情</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <Content />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dateStr}</DialogTitle>
          <DialogDescription>當日排班詳情</DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}

