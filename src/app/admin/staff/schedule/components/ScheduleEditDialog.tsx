'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateScheduleOverride } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { StaffSchedule } from './DayDetailPanel';

interface ScheduleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffSchedule: StaffSchedule;
  date: Date;
  onUpdate: () => void;
  canEdit: boolean; // 權限控制：Admin 可編輯所有人，Staff 只能編輯自己
}

export default function ScheduleEditDialog({
  open,
  onOpenChange,
  staffSchedule,
  date,
  onUpdate,
  canEdit,
}: ScheduleEditDialogProps) {
  const { toast } = useToast();
  const [isOff, setIsOff] = useState(staffSchedule.isOff);
  const [startTime, setStartTime] = useState(staffSchedule.startTime || '10:00');
  const [endTime, setEndTime] = useState(staffSchedule.endTime || '21:00');
  const [note, setNote] = useState(staffSchedule.note || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!canEdit) {
      toast({
        title: '權限不足',
        description: '您只能編輯自己的排班',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateScheduleOverride(
        staffSchedule.staff.id,
        date.toISOString(),
        {
          isOff,
          startTime: isOff ? null : startTime,
          endTime: isOff ? null : endTime,
          note: note || null,
        }
      );

      if (result.success) {
        toast({
          title: '更新成功',
          description: '排班已更新',
        });
        onUpdate();
        onOpenChange(false);
      } else {
        toast({
          title: '更新失敗',
          description: result.error || '請稍後再試',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '更新失敗',
        description: '請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>編輯排班 - {staffSchedule.staff.name}</DialogTitle>
          <DialogDescription>
            調整 {date.toLocaleDateString('zh-TW', {
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })} 的排班設定
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 休假開關 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isOff" className="text-base font-semibold">
              休假
            </Label>
            <Switch
              id="isOff"
              checked={isOff}
              onCheckedChange={setIsOff}
              disabled={!canEdit || isLoading}
            />
          </div>

          {/* 時間選擇 */}
          {!isOff && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-sm font-medium">
                    上班時間
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={!canEdit || isLoading}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-sm font-medium">
                    下班時間
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={!canEdit || isLoading}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 備註 */}
          <div>
            <Label htmlFor="note" className="text-sm font-medium">
              備註（選填）
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例如：事假、調班、特休"
              disabled={!canEdit || isLoading}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canEdit || isLoading}
            className="bg-[#BE185D] hover:bg-[#BE185D]/90"
          >
            {isLoading ? '儲存中...' : '儲存'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

