import {
  mockConversations,
  mockConversationDetails,
  mockFAQs,
  type SupportConversation,
  type ConversationDetail,
  type FAQItem,
} from "./mock";

export type { FAQItem };

export function getConversations(): SupportConversation[] {
  // 預設排序：最新在上（依 updated_at）
  return [...mockConversations].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

export function getConversationById(
  id: string
): ConversationDetail | undefined {
  return mockConversationDetails[id];
}

export function getFAQs(): FAQItem[] {
  // 預設排序：最新在上（依 updated_at）
  return [...mockFAQs].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

