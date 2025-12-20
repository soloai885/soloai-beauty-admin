'use client';

import { useState, useEffect } from 'react';
import {
  getAllStaff,
  getScheduleForMonth,
  getScheduleForDate,
  getShopSettings,
} from './actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ScheduleCalendar from './components/ScheduleCalendar';
import DayDetailPanel from './components/DayDetailPanel';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@prisma/client';

export default function ScheduleManagementPage() {
  const { toast } = useToast();
  const [currentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [allStaff, setAllStaff] = useState<Array<{ id: string; name: string }>>([]);
  const [weeklySchedules, setWeeklySchedules] = useState<any[]>([]);
  const [scheduleOverrides, setScheduleOverrides] = useState<any[]>([]);
  const [dayStaffSchedules, setDayStaffSchedules] = useState<
    Array<{
      staff: {
        id: string;
        name: string;
        avatar: string | null;
        role: string;
      };
      isOff: boolean;
      startTime: string | null;
      endTime: string | null;
      note: string | null;
      isOverride: boolean;
    }>
  >([]);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [minDailyStaff, setMinDailyStaff] = useState(2);

  // 載入使用者資訊
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('載入使用者資訊失敗:', error);
      }
    }
    loadUser();
  }, []);

  // 載入員工列表
  useEffect(() => {
    async function loadStaff() {
      const staff = await getAllStaff();
      setAllStaff(staff.map((s) => ({ id: s.id, name: s.name })));
    }
    loadStaff();
  }, []);

  // 載入商店設定（人力標準）
  useEffect(() => {
    async function loadShopSettings() {
      try {
        const settings = await getShopSettings();
        setMinDailyStaff(settings.minDailyStaff);
      } catch (error) {
        console.error('載入商店設定失敗:', error);
      }
    }
    loadShopSettings();
  }, []);

  // 載入排班資料
  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      try {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth() + 1;
        const result = await getScheduleForMonth(year, month);

        // 轉換日期格式
        const overrides = result.scheduleOverrides.map((o: any) => ({
          ...o,
          date: new Date(o.date),
        }));

        setWeeklySchedules(result.weeklySchedules);
        setScheduleOverrides(overrides);
      } catch (error) {
        toast({
          title: '載入失敗',
          description: '無法載入排班資料',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, [viewDate, toast]);

  // 載入選中日期的詳情
  useEffect(() => {
    async function loadDayDetail() {
      if (!selectedDate) return;

      try {
        const schedules = await getScheduleForDate(selectedDate.toISOString());
        setDayStaffSchedules(schedules);
      } catch (error) {
        toast({
          title: '載入失敗',
          description: '無法載入當日排班詳情',
          variant: 'destructive',
        });
      }
    }
    loadDayDetail();
  }, [selectedDate, toast]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDetailOpen(true);
  };

  const handleUpdate = async () => {
    // 重新載入當月資料
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + 1;
    const result = await getScheduleForMonth(year, month);
    const overrides = result.scheduleOverrides.map((o: any) => ({
      ...o,
      date: new Date(o.date),
    }));
    setWeeklySchedules(result.weeklySchedules);
    setScheduleOverrides(overrides);

    // 重新載入當日詳情
    if (selectedDate) {
      const schedules = await getScheduleForDate(selectedDate.toISOString());
      setDayStaffSchedules(schedules);
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">排班管理</h1>
      </div>

      {/* 頂部控制列 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow border border-zinc-200">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <label className="text-sm font-medium text-zinc-700 whitespace-nowrap">
            人員篩選：
          </label>
          <Select
            value={selectedStaffId || 'all'}
            onValueChange={(value) =>
              setSelectedStaffId(value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="選擇人員" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全店人員</SelectItem>
              {allStaff.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            設定固定公休
          </Button>
        </div>
      </div>

      {/* 月曆主體 */}
      {loading ? (
        <div className="bg-white rounded-lg shadow border border-zinc-200 p-12 text-center">
          <p className="text-zinc-600">載入排班資料中...</p>
        </div>
      ) : (
        <ScheduleCalendar
          currentDate={currentDate}
          onDateChange={setViewDate}
          onDateClick={handleDateClick}
          selectedStaffId={selectedStaffId}
          weeklySchedules={weeklySchedules}
          scheduleOverrides={scheduleOverrides}
          allStaff={allStaff}
          minDailyStaff={minDailyStaff}
        />
      )}

      {/* 日期詳情面板 */}
      {selectedDate && currentUser && (
        <DayDetailPanel
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          date={selectedDate}
          staffSchedules={dayStaffSchedules}
          currentUserRole={currentUser.role as UserRole}
          currentUserId={currentUser.id}
          onUpdate={handleUpdate}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
