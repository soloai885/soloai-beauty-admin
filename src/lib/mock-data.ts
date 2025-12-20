// src/lib/mock-data.ts

// 定義排班型別
export type DaySchedule = {
  day: string; // "Mon", "Tue", ...
  dayLabel: string; // "週一", "週二", ...
  isOff: boolean; // 是否休假
  start: string; // "10:00"
  end: string; // "21:00"
};

// 定義單日排班例外型別
export type ScheduleException = {
  date: string; // 格式 "YYYY-MM-DD"
  isOff: boolean; // 是否休假
  workHours?: { start: string; end: string }; // 若非休假，可覆寫當日工時
  note?: string; // 備註 (例如: 事假, 調班)
};

export const SERVICES_DATA = [
  {
    id: "service_001",
    name: "單色凝膠指甲 (手部)",
    category: "Nail",
    price: 1200,
    duration: 60,
    bufferTime: 10,
    description: "包含修型、甘皮處理與單色凝膠上色，含加厚。",
  },
  {
    id: "service_002",
    name: "法式/漸層造型凝膠",
    category: "Nail",
    price: 1500,
    duration: 90,
    bufferTime: 10,
    description: "經典法式微笑線或漸層暈染設計，氣質首選。",
  },
  {
    id: "service_003",
    name: "足部深層去繭護理",
    category: "Nail",
    price: 1800,
    duration: 90,
    bufferTime: 15,
    description: "針對足底硬皮與厚繭進行軟化與磨除，含去角質與乳液按摩。",
  },
  {
    id: "service_004",
    name: "3D 自然款睫毛嫁接 (150根)",
    category: "Lash",
    price: 1600,
    duration: 60,
    bufferTime: 10,
    description: "一接一技法，打造像刷了睫毛膏般的自然有神眼妝。",
  },
  {
    id: "service_005",
    name: "6D 輕柔濃密睫毛嫁接 (400根)",
    category: "Lash",
    price: 2200,
    duration: 90,
    bufferTime: 10,
    description: "多層次開花技法，眼線感明顯，適合喜歡妝感強烈的顧客。",
  },
  {
    id: "service_006",
    name: "角蛋白美睫",
    category: "Lash",
    price: 1200,
    duration: 60,
    bufferTime: 5,
    description: "使用自身睫毛進行捲翹定型，含睫毛滋養修護。",
  },
  {
    id: "service_007",
    name: "水飛梭深層毛孔清潔",
    category: "Facial",
    price: 2500,
    duration: 60,
    bufferTime: 15,
    description: "非侵入式真空負壓清潔，去除粉刺與老廢角質，提升肌膚透亮度。",
  },
  {
    id: "service_008",
    name: "極致保濕導入護理",
    category: "Facial",
    price: 2000,
    duration: 90,
    bufferTime: 15,
    description: "針對乾燥缺水肌膚，透過超聲波導入高濃度玻尿酸精華。",
  },
];

export const STAFF_DATA = [
  {
    id: "staff_001",
    name: "Jessica",
    role: "店長",
    skills: ["美甲", "美睫", "美容"],
    avatar: "/placeholder-user.jpg",
    // 預設排班表 (週一至週日)
    weeklySchedule: [
      { day: "Mon", dayLabel: "週一", isOff: false, start: "10:00", end: "21:00" },
      { day: "Tue", dayLabel: "週二", isOff: true, start: "10:00", end: "21:00" }, // 週二公休
      { day: "Wed", dayLabel: "週三", isOff: false, start: "10:00", end: "21:00" },
      { day: "Thu", dayLabel: "週四", isOff: false, start: "10:00", end: "21:00" },
      { day: "Fri", dayLabel: "週五", isOff: false, start: "10:00", end: "21:00" },
      { day: "Sat", dayLabel: "週六", isOff: false, start: "10:00", end: "18:00" },
      { day: "Sun", dayLabel: "週日", isOff: true, start: "10:00", end: "18:00" },
    ],
    // 單日排班例外
    scheduleExceptions: [
      {
        date: "2025-12-24", // 下週三（原本上班）改為特休
        isOff: true,
        note: "特休",
      },
      {
        date: "2025-12-27", // 下週六（原本 10:00 上班）改為 13:00 上班
        isOff: false,
        workHours: { start: "13:00", end: "18:00" },
        note: "半天假",
      },
    ],
  },
  {
    id: "staff_002",
    name: "Mina",
    role: "資深美甲師",
    skills: ["美甲"],
    avatar: "/placeholder-user.jpg",
    weeklySchedule: [
      { day: "Mon", dayLabel: "週一", isOff: false, start: "10:00", end: "21:00" },
      { day: "Tue", dayLabel: "週二", isOff: true, start: "10:00", end: "21:00" },
      { day: "Wed", dayLabel: "週三", isOff: false, start: "10:00", end: "21:00" },
      { day: "Thu", dayLabel: "週四", isOff: false, start: "10:00", end: "21:00" },
      { day: "Fri", dayLabel: "週五", isOff: false, start: "10:00", end: "21:00" },
      { day: "Sat", dayLabel: "週六", isOff: false, start: "10:00", end: "18:00" },
      { day: "Sun", dayLabel: "週日", isOff: false, start: "10:00", end: "18:00" },
    ],
    scheduleExceptions: [],
  },
  {
    id: "staff_003",
    name: "Sophie",
    role: "美睫/紋繡師",
    skills: ["美睫", "美容"],
    avatar: "/placeholder-user.jpg",
    weeklySchedule: [
      { day: "Mon", dayLabel: "週一", isOff: false, start: "10:00", end: "21:00" },
      { day: "Tue", dayLabel: "週二", isOff: false, start: "10:00", end: "21:00" },
      { day: "Wed", dayLabel: "週三", isOff: true, start: "10:00", end: "21:00" },
      { day: "Thu", dayLabel: "週四", isOff: false, start: "10:00", end: "21:00" },
      { day: "Fri", dayLabel: "週五", isOff: false, start: "10:00", end: "21:00" },
      { day: "Sat", dayLabel: "週六", isOff: false, start: "10:00", end: "18:00" },
      { day: "Sun", dayLabel: "週日", isOff: true, start: "10:00", end: "18:00" },
    ],
    scheduleExceptions: [],
  },
  {
    id: "staff_004",
    name: "Anna",
    role: "美甲助理",
    skills: ["美甲"],
    avatar: "/placeholder-user.jpg",
    weeklySchedule: [
      { day: "Mon", dayLabel: "週一", isOff: false, start: "10:00", end: "21:00" },
      { day: "Tue", dayLabel: "週二", isOff: true, start: "10:00", end: "21:00" },
      { day: "Wed", dayLabel: "週三", isOff: false, start: "10:00", end: "21:00" },
      { day: "Thu", dayLabel: "週四", isOff: false, start: "10:00", end: "21:00" },
      { day: "Fri", dayLabel: "週五", isOff: false, start: "10:00", end: "21:00" },
      { day: "Sat", dayLabel: "週六", isOff: false, start: "10:00", end: "18:00" },
      { day: "Sun", dayLabel: "週日", isOff: false, start: "10:00", end: "18:00" },
    ],
    scheduleExceptions: [],
  },
];

export const RESERVATIONS_DATA = [
  {
    id: "res_001",
    customerName: "王小美",
    customerPhone: "0912-345-678",
    serviceId: "service_001", // 對應：單色凝膠指甲
    staffId: "staff_002",    // 對應：Mina
    date: "2025-12-20",
    time: "10:00",
    status: "CONFIRMED", // PENDING, CONFIRMED, CANCELLED, COMPLETED
    price: 1200,
  },
  {
    id: "res_002",
    customerName: "陳雅婷",
    customerPhone: "0922-888-999",
    serviceId: "service_004", // 對應：3D 自然款睫毛
    staffId: "staff_003",    // 對應：Sophie
    date: "2025-12-20",
    time: "13:00",
    status: "PENDING",
    price: 1600,
  },
  {
    id: "res_003",
    customerName: "林怡君",
    customerPhone: "0933-777-666",
    serviceId: "service_007", // 對應：水飛梭
    staffId: "staff_001",    // 對應：Jessica
    date: "2025-12-21",
    time: "14:30",
    status: "COMPLETED",
    price: 2500,
  },
  {
    id: "res_004",
    customerName: "張淑芬",
    customerPhone: "0944-111-222",
    serviceId: "service_002", // 對應：法式/漸層造型凝膠
    staffId: "staff_002",    // 對應：Mina
    date: "2025-12-21",
    time: "15:00",
    status: "CONFIRMED",
    price: 1500,
  },
  {
    id: "res_005",
    customerName: "黃美玲",
    customerPhone: "0955-333-444",
    serviceId: "service_005", // 對應：6D 輕柔濃密睫毛嫁接
    staffId: "staff_003",    // 對應：Sophie
    date: "2025-12-22",
    time: "11:00",
    status: "PENDING",
    price: 2200,
  },
  {
    id: "res_006",
    customerName: "劉佳蓉",
    customerPhone: "0966-555-666",
    serviceId: "service_003", // 對應：足部深層去繭護理
    staffId: "staff_004",    // 對應：Anna
    date: "2025-12-22",
    time: "16:00",
    status: "CONFIRMED",
    price: 1800,
  },
  {
    id: "res_007",
    customerName: "吳佩璇",
    customerPhone: "0977-777-888",
    serviceId: "service_008", // 對應：極致保濕導入護理
    staffId: "staff_001",    // 對應：Jessica
    date: "2025-12-23",
    time: "10:30",
    status: "CONFIRMED",
    price: 2000,
  },
  {
    id: "res_008",
    customerName: "鄭雅文",
    customerPhone: "0988-999-000",
    serviceId: "service_006", // 對應：角蛋白美睫
    staffId: "staff_003",    // 對應：Sophie
    date: "2025-12-23",
    time: "14:00",
    status: "CANCELLED",
    price: 1200,
  },
  {
    id: "res_009",
    customerName: "周曉雯",
    customerPhone: "0999-111-222",
    serviceId: "service_001", // 對應：單色凝膠指甲
    staffId: "staff_004",    // 對應：Anna
    date: "2025-12-24",
    time: "13:30",
    status: "PENDING",
    price: 1200,
  },
  {
    id: "res_010",
    customerName: "許詩涵",
    customerPhone: "0910-333-444",
    serviceId: "service_004", // 對應：3D 自然款睫毛嫁接
    staffId: "staff_003",    // 對應：Sophie
    date: "2025-12-24",
    time: "15:30",
    status: "CONFIRMED",
    price: 1600,
  },
  {
    id: "res_011",
    customerName: "蔡佳穎",
    customerPhone: "0921-555-666",
    serviceId: "service_007", // 對應：水飛梭深層毛孔清潔
    staffId: "staff_001",    // 對應：Jessica
    date: "2025-12-25",
    time: "11:00",
    status: "CONFIRMED",
    price: 2500,
  },
  {
    id: "res_012",
    customerName: "謝宜庭",
    customerPhone: "0932-777-888",
    serviceId: "service_002", // 對應：法式/漸層造型凝膠
    staffId: "staff_002",    // 對應：Mina
    date: "2025-12-25",
    time: "14:00",
    status: "COMPLETED",
    price: 1500,
  },
  {
    id: "res_013",
    customerName: "楊雅筑",
    customerPhone: "0943-999-000",
    serviceId: "service_005", // 對應：6D 輕柔濃密睫毛嫁接
    staffId: "staff_003",    // 對應：Sophie
    date: "2025-12-26",
    time: "10:00",
    status: "PENDING",
    price: 2200,
  },
  {
    id: "res_014",
    customerName: "羅心怡",
    customerPhone: "0954-111-222",
    serviceId: "service_003", // 對應：足部深層去繭護理
    staffId: "staff_004",    // 對應：Anna
    date: "2025-12-26",
    time: "16:00",
    status: "CONFIRMED",
    price: 1800,
  },
  {
    id: "res_015",
    customerName: "徐若瑄",
    customerPhone: "0965-333-444",
    serviceId: "service_008", // 對應：極致保濕導入護理
    staffId: "staff_001",    // 對應：Jessica
    date: "2025-12-27",
    time: "13:00",
    status: "CONFIRMED",
    price: 2000,
  },
];

// Helper function to get details
export const getServiceById = (id: string) => SERVICES_DATA.find(s => s.id === id);
export const getStaffById = (id: string) => STAFF_DATA.find(s => s.id === id);

// Calendar Event type
export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  customerName: string;
  serviceName: string;
  status: string;
  staffId: string;
  staffName: string | undefined;
  price: number;
}

// Convert RESERVATIONS_DATA to CalendarEvent format
export const getCalendarEvents = (): CalendarEvent[] => {
  return RESERVATIONS_DATA.map((reservation) => {
    const service = getServiceById(reservation.serviceId);
    const staff = getStaffById(reservation.staffId);
    
    // Calculate end time based on service duration
    const startDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
    const durationMinutes = service?.duration || 60;
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
    
    return {
      id: reservation.id,
      title: `${reservation.customerName} - ${service?.name || reservation.serviceId}`,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      customerName: reservation.customerName,
      serviceName: service?.name || reservation.serviceId,
      status: reservation.status,
      staffId: reservation.staffId,
      staffName: staff?.name,
      price: reservation.price,
    };
  });
};

// Get reservations for a specific date
export const getReservationsForDate = (date: Date): CalendarEvent[] => {
  const dateStr = date.toISOString().split("T")[0];
  return getCalendarEvents().filter((event) => {
    const eventDate = new Date(event.start).toISOString().split("T")[0];
    return eventDate === dateStr;
  });
};

// FAQ Data
export const FAQ_DATA = [
  {
    id: "faq_001",
    question: "營業時間",
    answer:
      "我們營業時間為：\n週一至週日 10:00 - 21:00\n(週二固定公休)",
    category: "基本資訊",
    isActive: true,
  },
  {
    id: "faq_002",
    question: "價目表",
    answer:
      "我們提供多項服務：\n💅 單色凝膠 $1,200 起\n👁️ 3D美睫 $1,600 起\n詳細內容請點擊上方「我要預約」查看喔！",
    category: "服務相關",
    isActive: true,
  },
  {
    id: "faq_003",
    question: "停車資訊",
    answer:
      "店門口可停機車。\n開車的貴賓，前方 100 公尺有「城市車旅」收費停車場 ($40/hr)。",
    category: "交通",
    isActive: true,
  },
  {
    id: "faq_004",
    question: "更改預約",
    answer:
      "如需更改時間，請提前 24 小時聯繫我們，或直接撥打電話 02-2345-6789。",
    category: "預約規則",
    isActive: true,
  },
];

// Customer Data
export const CUSTOMERS_DATA = [
  {
    id: "cust_001",
    name: "王小美",
    phone: "0912-345-678",
    email: "may.wang@example.com",
    visits: 12, // 來訪次數
    totalSpent: 15600, // 累積消費
    lastVisit: "2025-12-15",
    tags: ["VIP", "熟客"],
    notes: "喜歡安靜，習慣指定 Mina",
  },
  {
    id: "cust_002",
    name: "陳雅婷",
    phone: "0922-888-999",
    email: "yating.chen@example.com",
    visits: 3,
    totalSpent: 4200,
    lastVisit: "2025-11-20",
    tags: ["新客"],
    notes: "對膠水過敏，需使用抗敏膠",
  },
  {
    id: "cust_003",
    name: "林怡君",
    phone: "0933-777-666",
    email: "ichun.lin@example.com",
    visits: 25,
    totalSpent: 38000,
    lastVisit: "2025-12-18",
    tags: ["VVIP", "儲值會員"],
    notes: "老闆娘的朋友，招待指緣油",
  },
  {
    id: "cust_004",
    name: "張淑芬",
    phone: "0944-111-222",
    email: "shufen.zhang@example.com",
    visits: 8,
    totalSpent: 11200,
    lastVisit: "2025-12-10",
    tags: ["熟客"],
    notes: "偏好法式造型，固定週三下午",
  },
  {
    id: "cust_005",
    name: "黃美玲",
    phone: "0955-333-444",
    email: "meiling.huang@example.com",
    visits: 5,
    totalSpent: 6800,
    lastVisit: "2025-12-05",
    tags: ["新客"],
    notes: "首次體驗後很滿意，已加入會員",
  },
  {
    id: "cust_006",
    name: "劉佳蓉",
    phone: "0966-555-666",
    email: "jiarong.liu@example.com",
    visits: 18,
    totalSpent: 23400,
    lastVisit: "2025-12-12",
    tags: ["VIP", "儲值會員"],
    notes: "定期保養，每月固定來兩次",
  },
  {
    id: "cust_007",
    name: "吳佩璇",
    phone: "0977-777-888",
    email: "peixuan.wu@example.com",
    visits: 2,
    totalSpent: 3000,
    lastVisit: "2025-11-15",
    tags: ["新客"],
    notes: "第一次來，還在觀察服務品質",
  },
  {
    id: "cust_008",
    name: "鄭雅文",
    phone: "0988-999-000",
    email: "yawen.zheng@example.com",
    visits: 15,
    totalSpent: 19800,
    lastVisit: "2025-12-20",
    tags: ["VIP", "熟客"],
    notes: "喜歡嘗試新款式，常指定 Sophie",
  },
  {
    id: "cust_009",
    name: "周曉雯",
    phone: "0999-111-222",
    email: "xiaowen.zhou@example.com",
    visits: 7,
    totalSpent: 9200,
    lastVisit: "2025-12-08",
    tags: ["熟客"],
    notes: "偏好自然風格，不喜歡太花俏",
  },
  {
    id: "cust_010",
    name: "許詩涵",
    phone: "0910-333-444",
    email: "shihan.xu@example.com",
    visits: 20,
    totalSpent: 31200,
    lastVisit: "2025-12-19",
    tags: ["VVIP", "儲值會員", "熟客"],
    notes: "長期客戶，已儲值 50000 元，享受 VIP 折扣",
  },
];

// Store Settings
export const STORE_SETTINGS = {
  name: "SoloAI Beauty 旗艦店",
  phone: "02-2345-6789",
  address: "台北市大安區美麗大道一段123號",
  openTime: "10:00",
  closeTime: "21:00",
  bookingInterval: 30, // 分鐘
  currency: "TWD",
};

