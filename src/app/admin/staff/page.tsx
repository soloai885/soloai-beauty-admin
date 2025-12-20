"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STAFF_DATA } from "@/lib/mock-data";
import { ShiftConfigDialog } from "@/components/ShiftConfigDialog";
import StaffShiftCalendar from "@/components/admin/StaffShiftCalendar";
import type { DaySchedule } from "@/lib/mock-data";
import { Calendar } from "lucide-react";

export default function StaffListPage() {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [staffData, setStaffData] = useState(STAFF_DATA);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // 根據技能設定 Badge 顏色
  const getSkillBadgeVariant = (skill: string) => {
    switch (skill) {
      case "美甲":
        return "default"; // Rose 色系（使用 default 並透過 className 自訂）
      case "美睫":
        return "secondary"; // Purple 色系
      case "美容":
        return "outline"; // Orange 色系
      default:
        return "secondary";
    }
  };

  const getSkillBadgeClassName = (skill: string) => {
    switch (skill) {
      case "美甲":
        return "bg-rose-100 text-rose-700 hover:bg-rose-200";
      case "美睫":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "美容":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      default:
        return "";
    }
  };

  const selectedStaff = selectedStaffId
    ? staffData.find((s) => s.id === selectedStaffId)
    : null;

  const handleSaveSchedule = (staffId: string, schedule: DaySchedule[]) => {
    setStaffData((prev) =>
      prev.map((staff) =>
        staff.id === staffId ? { ...staff, weeklySchedule: schedule } : staff
      )
    );
  };

  const StaffCard = ({ staff }: { staff: (typeof STAFF_DATA)[0] }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={staff.avatar} alt={staff.name} />
            <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{staff.name}</CardTitle>
            <CardDescription>{staff.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {staff.skills.map((skill) => (
            <Badge
              key={skill}
              variant={getSkillBadgeVariant(skill)}
              className={getSkillBadgeClassName(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setSelectedStaffId(staff.id)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          排班設定
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-full space-y-6">
      <div className="flex items-center justify-between relative z-10">
        <h1 className="text-2xl font-semibold text-zinc-900">
          人員與排班管理
        </h1>
        <Button className="relative z-10">
          <span>新增設計師</span>
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="list">人員列表</TabsTrigger>
          <TabsTrigger value="overview">排班總覽</TabsTrigger>
        </TabsList>

        {/* 分頁 A: 人員列表 */}
        <TabsContent value="list" className="mt-6">
          {/* Desktop/Tablet: 卡片網格 */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffData.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>

          {/* Mobile: 垂直堆疊卡片列表 */}
          <div className="md:hidden space-y-3">
            {staffData.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        </TabsContent>

        {/* 分頁 B: 排班總覽 */}
        <TabsContent value="overview" className="mt-6">
          <Card className="p-6">
            <StaffShiftCalendar staffData={staffData} />
          </Card>
        </TabsContent>
      </Tabs>

      {/* 排班設定對話框 */}
      {selectedStaff && (
        <ShiftConfigDialog
          open={selectedStaffId !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedStaffId(null);
          }}
          staffName={selectedStaff.name}
          weeklySchedule={selectedStaff.weeklySchedule}
          onSave={(schedule) => handleSaveSchedule(selectedStaff.id, schedule)}
        />
      )}
    </div>
  );
}
