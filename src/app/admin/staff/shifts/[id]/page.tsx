import Link from "next/link";
import { getShiftById } from "../../data";

export default async function ShiftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shift = getShiftById(id);

  if (!shift) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/staff/schedule"
          className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          ← 返回排班總覽
        </Link>
        <p className="text-zinc-900">找不到此班表資料</p>
      </div>
    );
  }

  const weekDayNames: Record<string, string> = {
    Mon: "星期一",
    Tue: "星期二",
    Wed: "星期三",
    Thu: "星期四",
    Fri: "星期五",
    Sat: "星期六",
    Sun: "星期日",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/staff/schedule"
        className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        ← 返回排班總覽
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-black">班表詳情</h1>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm font-medium text-zinc-700">人員姓名:</span>
            <p className="mt-1 text-sm text-zinc-900">{shift.staff_name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">日期:</span>
            <p className="mt-1 text-sm text-zinc-900">
              {shift.date} ({weekDayNames[shift.day_of_week]})
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">開始時間:</span>
            <p className="mt-1 text-sm text-zinc-900">{shift.start_time}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">結束時間:</span>
            <p className="mt-1 text-sm text-zinc-900">{shift.end_time}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">班別類型:</span>
            <p className="mt-1 text-sm text-zinc-900">{shift.shift_type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}






