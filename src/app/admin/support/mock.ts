export interface SupportConversation {
  conversation_id: string;
  customer_name: string;
  customer_phone: string;
  last_message_preview: string;
  status: "進行中" | "已結束" | "待回覆";
  category?: string;
  created_at: string;
  updated_at: string;
}

export const mockConversations: SupportConversation[] = [
  {
    conversation_id: "CONV001",
    customer_name: "王小明",
    customer_phone: "0912-345-678",
    last_message_preview: "請問預約可以取消嗎？",
    status: "進行中",
    category: "預約相關",
    created_at: "2024-01-15 10:30:00",
    updated_at: "2024-01-15 14:20:00",
  },
  {
    conversation_id: "CONV002",
    customer_name: "李小華",
    customer_phone: "0923-456-789",
    last_message_preview: "謝謝您的協助！",
    status: "已結束",
    category: "預約相關",
    created_at: "2024-01-14 09:15:00",
    updated_at: "2024-01-14 11:45:00",
  },
  {
    conversation_id: "CONV003",
    customer_name: "張美麗",
    customer_phone: "0934-567-890",
    last_message_preview: "我想預約下週的服務",
    status: "待回覆",
    category: "預約相關",
    created_at: "2024-01-15 16:00:00",
    updated_at: "2024-01-15 16:00:00",
  },
  {
    conversation_id: "CONV004",
    customer_name: "陳小芳",
    customer_phone: "0945-678-901",
    last_message_preview: "服務時間可以調整嗎？",
    status: "進行中",
    category: "服務內容",
    created_at: "2024-01-13 14:20:00",
    updated_at: "2024-01-15 10:10:00",
  },
  {
    conversation_id: "CONV005",
    customer_name: "林小雅",
    customer_phone: "0956-789-012",
    last_message_preview: "請問有哪些服務項目？",
    status: "已結束",
    category: "服務內容",
    created_at: "2024-01-12 11:00:00",
    updated_at: "2024-01-12 15:30:00",
  },
  {
    conversation_id: "CONV006",
    customer_name: "黃小玲",
    customer_phone: "0967-890-123",
    last_message_preview: "我想取消預約",
    status: "待回覆",
    category: "預約相關",
    created_at: "2024-01-15 13:45:00",
    updated_at: "2024-01-15 13:45:00",
  },
  {
    conversation_id: "CONV007",
    customer_name: "吳小婷",
    customer_phone: "0978-901-234",
    last_message_preview: "謝謝，問題已解決",
    status: "已結束",
    created_at: "2024-01-11 09:00:00",
    updated_at: "2024-01-11 12:00:00",
  },
  {
    conversation_id: "CONV008",
    customer_name: "周小慧",
    customer_phone: "0989-012-345",
    last_message_preview: "請問價格是多少？",
    status: "進行中",
    created_at: "2024-01-15 08:30:00",
    updated_at: "2024-01-15 09:15:00",
  },
  {
    conversation_id: "CONV009",
    customer_name: "鄭小雯",
    customer_phone: "0900-123-456",
    last_message_preview: "我想預約明天",
    status: "待回覆",
    created_at: "2024-01-15 15:20:00",
    updated_at: "2024-01-15 15:20:00",
  },
  {
    conversation_id: "CONV010",
    customer_name: "許小如",
    customer_phone: "0911-234-567",
    last_message_preview: "服務很滿意，謝謝",
    status: "已結束",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 14:00:00",
  },
  {
    conversation_id: "CONV011",
    customer_name: "謝小萱",
    customer_phone: "0922-345-678",
    last_message_preview: "可以改時間嗎？",
    status: "進行中",
    created_at: "2024-01-14 13:00:00",
    updated_at: "2024-01-15 11:30:00",
  },
  {
    conversation_id: "CONV012",
    customer_name: "羅小晴",
    customer_phone: "0933-456-789",
    last_message_preview: "請問營業時間？",
    status: "待回覆",
    created_at: "2024-01-15 12:00:00",
    updated_at: "2024-01-15 12:00:00",
  },
  {
    conversation_id: "CONV013",
    customer_name: "蔡小欣",
    customer_phone: "0944-567-890",
    last_message_preview: "我想了解服務內容",
    status: "進行中",
    created_at: "2024-01-13 15:30:00",
    updated_at: "2024-01-15 09:45:00",
  },
  {
    conversation_id: "CONV014",
    customer_name: "劉小涵",
    customer_phone: "0955-678-901",
    last_message_preview: "謝謝您的回覆",
    status: "已結束",
    created_at: "2024-01-09 14:00:00",
    updated_at: "2024-01-09 16:30:00",
  },
  {
    conversation_id: "CONV015",
    customer_name: "楊小柔",
    customer_phone: "0966-789-012",
    last_message_preview: "我想預約下個月",
    status: "待回覆",
    created_at: "2024-01-15 17:00:00",
    updated_at: "2024-01-15 17:00:00",
  },
  {
    conversation_id: "CONV016",
    customer_name: "趙小琳",
    customer_phone: "0977-890-123",
    last_message_preview: "請問有優惠活動嗎？",
    status: "進行中",
    created_at: "2024-01-12 10:00:00",
    updated_at: "2024-01-15 08:20:00",
  },
  {
    conversation_id: "CONV017",
    customer_name: "錢小琪",
    customer_phone: "0988-901-234",
    last_message_preview: "服務很棒！",
    status: "已結束",
    created_at: "2024-01-08 11:00:00",
    updated_at: "2024-01-08 13:00:00",
  },
  {
    conversation_id: "CONV018",
    customer_name: "孫小瑤",
    customer_phone: "0999-012-345",
    last_message_preview: "我想取消預約",
    status: "待回覆",
    created_at: "2024-01-15 18:00:00",
    updated_at: "2024-01-15 18:00:00",
  },
  {
    conversation_id: "CONV019",
    customer_name: "李小明",
    customer_phone: "0901-123-456",
    last_message_preview: "請問可以刷卡嗎？",
    status: "進行中",
    created_at: "2024-01-11 09:30:00",
    updated_at: "2024-01-15 07:15:00",
  },
  {
    conversation_id: "CONV020",
    customer_name: "王小華",
    customer_phone: "0912-234-567",
    last_message_preview: "謝謝，問題解決了",
    status: "已結束",
    created_at: "2024-01-07 10:00:00",
    updated_at: "2024-01-07 12:00:00",
  },
];

export interface SupportMessage {
  message_id: string;
  sender: "USER" | "BOT";
  content: string;
  timestamp: string;
}

export interface ConversationDetail {
  conversation_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  status: "進行中" | "已結束" | "待回覆";
  category?: string;
  created_at: string;
  updated_at: string;
  source: string;
  messages: SupportMessage[];
}

export const mockConversationDetails: Record<string, ConversationDetail> = {
  CONV001: {
    conversation_id: "CONV001",
    customer_name: "王小明",
    customer_phone: "0912-345-678",
    customer_email: "wang@example.com",
    status: "進行中",
    category: "預約相關",
    created_at: "2024-01-15 10:30:00",
    updated_at: "2024-01-15 14:20:00",
    source: "官網聊天室",
    messages: [
      {
        message_id: "MSG001",
        sender: "USER",
        content: "您好，請問預約可以取消嗎？",
        timestamp: "2024-01-15 10:30:00",
      },
      {
        message_id: "MSG002",
        sender: "BOT",
        content: "您好！可以的，請告訴我您的預約編號，我來協助您處理。",
        timestamp: "2024-01-15 10:31:00",
      },
      {
        message_id: "MSG003",
        sender: "USER",
        content: "預約編號是 #001",
        timestamp: "2024-01-15 10:32:00",
      },
      {
        message_id: "MSG004",
        sender: "BOT",
        content: "好的，我已經為您取消預約了。取消確認信已發送到您的信箱。",
        timestamp: "2024-01-15 10:33:00",
      },
      {
        message_id: "MSG005",
        sender: "USER",
        content: "謝謝您的協助！",
        timestamp: "2024-01-15 14:20:00",
      },
    ],
  },
};

export interface FAQItem {
  faq_id: string;
  question: string;
  answer: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const mockFAQs: FAQItem[] = [
  {
    faq_id: "FAQ001",
    question: "如何預約服務？",
    answer: "您可以透過官網、電話或 LINE 官方帳號進行預約。",
    category: "預約相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ002",
    question: "可以取消預約嗎？",
    answer: "可以，請在服務前 24 小時通知我們即可免費取消。",
    category: "預約相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ003",
    question: "營業時間是？",
    answer: "週一至週日 10:00 - 22:00，全年無休。",
    category: "營業資訊",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ004",
    question: "有哪些付款方式？",
    answer: "我們接受現金、信用卡、LINE Pay、街口支付。",
    category: "付款相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ005",
    question: "服務時間需要多久？",
    answer: "依服務項目而定，一般美甲服務約 60-90 分鐘。",
    category: "服務相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ006",
    question: "有停車位嗎？",
    answer: "店內無停車位，附近有付費停車場可供使用。",
    category: "交通資訊",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ007",
    question: "可以指定服務人員嗎？",
    answer: "可以，請在預約時告知我們您想指定的服務人員。",
    category: "服務相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ008",
    question: "有會員優惠嗎？",
    answer: "有的，加入會員可享 9 折優惠，生日當月還有特別優惠。",
    category: "優惠活動",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ009",
    question: "如何聯絡客服？",
    answer: "您可以透過官網聊天室、電話或 LINE 官方帳號聯絡我們。",
    category: "聯絡資訊",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ010",
    question: "服務後有保固嗎？",
    answer: "美甲服務提供 7 天保固，如有問題請隨時聯絡我們。",
    category: "服務相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ011",
    question: "可以改時間嗎？",
    answer: "可以，請在服務前 24 小時通知我們即可免費改期。",
    category: "預約相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ012",
    question: "有提供哪些服務項目？",
    answer: "我們提供美甲、美睫、手部保養、足部保養等服務。",
    category: "服務相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ013",
    question: "價格是多少？",
    answer: "價格依服務項目而定，詳細價格請參考官網或來電詢問。",
    category: "價格相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ014",
    question: "可以刷卡嗎？",
    answer: "可以，我們接受信用卡付款。",
    category: "付款相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ015",
    question: "有提供飲料嗎？",
    answer: "有的，我們提供免費茶水和咖啡。",
    category: "服務相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ016",
    question: "可以帶朋友一起來嗎？",
    answer: "可以，但請先告知我們，以便安排座位。",
    category: "服務相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ017",
    question: "有提供 Wi-Fi 嗎？",
    answer: "有的，店內提供免費 Wi-Fi。",
    category: "服務相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ018",
    question: "可以預約多久之後的時間？",
    answer: "可以預約未來 3 個月內的時段。",
    category: "預約相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ019",
    question: "有提供禮券嗎？",
    answer: "有的，我們提供實體和電子禮券，可來店或線上購買。",
    category: "優惠活動",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
  {
    faq_id: "FAQ020",
    question: "服務後可以拍照嗎？",
    answer: "可以，歡迎拍照分享，但請尊重其他客人的隱私。",
    category: "服務相關",
    created_at: "2024-01-10 10:00:00",
    updated_at: "2024-01-10 10:00:00",
  },
];

