"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import { getConversationById } from "../data";

export default function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [messageInput, setMessageInput] = useState("");
  const conversation = getConversationById(id);

  if (!conversation) {
    return (
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin/support"
          className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          ← 返回對話列表
        </Link>
        <p className="text-zinc-900">找不到此對話記錄</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "待回覆":
        return "bg-red-100 text-red-800 border-red-200";
      case "進行中":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "已結束":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 時間相對化
  const formatRelativeTime = (dateStr: string): string => {
    const date = new Date(dateStr.replace(" ", "T"));
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} 分鐘前`;
    } else if (diffHours < 24) {
      return `${diffHours} 小時前`;
    } else if (diffDays === 1) {
      return "昨天";
    } else if (diffDays < 7) {
      return `${diffDays} 天前`;
    } else {
      return dateStr.slice(5, 16).replace(" ", " ");
    }
  };

  // 判斷是否需要顯示時間標記（跨天或超過1小時）
  const shouldShowTime = (
    currentMsg: { timestamp: string },
    prevMsg?: { timestamp: string }
  ): boolean => {
    if (!prevMsg) return true;
    const current = new Date(currentMsg.timestamp.replace(" ", "T"));
    const prev = new Date(prevMsg.timestamp.replace(" ", "T"));
    const diffHours = (current.getTime() - prev.getTime()) / 3600000;
    return diffHours >= 1 || current.toDateString() !== prev.toDateString();
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto">
      {/* 固定頂部 Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 shadow-sm">
        <div className="p-4">
          <Link
            href="/admin/support"
            className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            ← 返回對話列表
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-black mb-2">
                對話明細：{conversation.conversation_id}
              </h1>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-zinc-600">客戶：</span>
                  <span className="text-sm font-medium text-zinc-900 ml-1">
                    {conversation.customer_name}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-zinc-600">電話：</span>
                  <span className="text-sm font-medium text-zinc-900 ml-1">
                    {conversation.customer_phone}
                  </span>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                    conversation.status
                  )}`}
                >
                  {conversation.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主內容區（可滾動） */}
      <div className="flex flex-1 overflow-hidden">
        {/* 對話訊息區（左側，可滾動） */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4 max-w-3xl">
            {conversation.messages.map((message, index) => {
              const prevMessage =
                index > 0 ? conversation.messages[index - 1] : undefined;
              const showTime = shouldShowTime(message, prevMessage);

              return (
                <div key={message.message_id}>
                  {showTime && (
                    <div className="text-center my-4">
                      <span className="text-xs text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
                        {formatRelativeTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex ${
                      message.sender === "USER" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-4 ${
                        message.sender === "USER"
                          ? "bg-zinc-100 text-zinc-900"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      {showTime && (
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "USER"
                              ? "text-zinc-500"
                              : "text-blue-100"
                          }`}
                        >
                          {message.timestamp.slice(11, 16)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右側邊欄（系統資訊） */}
        <div className="w-64 border-l border-zinc-200 bg-zinc-50 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                系統資訊
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-zinc-600">來源：</span>
                  <span className="text-zinc-900 ml-1">
                    {conversation.source}
                  </span>
                </div>
                {conversation.category && (
                  <div>
                    <span className="text-zinc-600">分類：</span>
                    <span className="text-zinc-900 ml-1">
                      {conversation.category}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-zinc-600">建立時間：</span>
                  <span className="text-zinc-900 ml-1 text-xs">
                    {conversation.created_at}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600">最後更新：</span>
                  <span className="text-zinc-900 ml-1 text-xs">
                    {conversation.updated_at}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-200">
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm cursor-not-allowed"
              >
                結案（待實作）
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 固定底部輸入區 */}
      <div className="sticky bottom-0 bg-white border-t border-zinc-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="輸入回覆訊息..."
            className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            disabled
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            傳送（待實作）
          </button>
        </div>
      </div>
    </div>
  );
}
