import { mockStaff, mockShifts } from "./mock";

export type Staff = typeof mockStaff[number];
export type Shift = typeof mockShifts[number];

export function getStaffList(): Staff[] {
  return mockStaff;
}

export function getStaffById(id: string): Staff | undefined {
  return mockStaff.find((s) => s.staff_id === Number(id));
}

export function getShiftsByStaffId(staffId: string): Shift[] {
  return mockShifts.filter((s) => s.staff_id === Number(staffId));
}

export function getShiftsByWeek(startDate: Date): Shift[] {
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() - startDate.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return mockShifts.filter((shift) => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });
}

export function getShiftById(id: string): Shift | undefined {
  return mockShifts.find((s) => s.shift_id === Number(id));
}






