"use client";

import Link from "next/link";
import { useState } from "react";
import { getConversations } from "./data";

const CONVERSATION_CATEGORIES = [
  "預約相關",
  "服務內容",
  "價格與方案",
  "營業與地點",
  "其他／未歸類",
] as const;

export default function SupportConversationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [categoryFilter, setCategoryFilter] = useState<string>("全部");
  const itemsPerPage = 15;

  const allConversations = getConversations();

  // 計算狀態數量
  const statusCounts = {
    待回覆: allConversations.filter((c) => c.status === "待回覆").length,
    進行中: allConversations.filter((c) => c.status === "進行中").length,
    已結束: allConversations.filter((c) => c.status === "已結束").length,
  };

  // 篩選邏輯
  let filteredConversations = allConversations;
  if (searchKeyword) {
    filteredConversations = filteredConversations.filter(
      (conv) =>
        conv.customer_name.includes(searchKeyword) ||
        conv.customer_phone.includes(searchKeyword) ||
        conv.conversation_id.includes(searchKeyword) ||
        conv.last_message_preview.includes(searchKeyword)
    );
  }
  if (statusFilter !== "全部") {
    filteredConversations = filteredConversations.filter(
      (conv) => conv.status === statusFilter
    );
  }
  if (categoryFilter !== "全部") {
    filteredConversations = filteredConversations.filter(
      (conv) => conv.category === categoryFilter
    );
  }

  // 分頁邏輯
  const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedConversations = filteredConversations.slice(
    startIndex,
    endIndex
  );

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

  return (
    <div className="max-w-full">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
        客服對話列表 (Support Conversations)
      </h1>

      {/* 篩選與搜尋區 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              關鍵字搜尋
            </label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="搜尋對話 ID、客戶姓名、電話或訊息內容"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              狀態篩選
              {statusFilter === "待回覆" && statusCounts.待回覆 > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                  {statusCounts.待回覆}
                </span>
              )}
              {statusFilter === "進行中" && statusCounts.進行中 > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                  {statusCounts.進行中}
                </span>
              )}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="全部">全部</option>
              <option value="待回覆">
                待回覆 {statusCounts.待回覆 > 0 && `(${statusCounts.待回覆})`}
              </option>
              <option value="進行中">
                進行中 {statusCounts.進行中 > 0 && `(${statusCounts.進行中})`}
              </option>
              <option value="已結束">已結束</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              分類篩選
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="全部">全部</option>
              {CONVERSATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            日期區間
          </label>
          <input
            type="text"
            placeholder="日期區間選擇（待實作）"
            disabled
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-zinc-50 text-zinc-500 cursor-not-allowed"
          />
        </div>
      </div>

      {/* 核心表格區 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700 w-24">
                  狀態
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700 w-40">
                  客戶姓名 / 電話
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                  最後一句訊息摘要
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700 w-32">
                  分類
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700 w-36">
                  建立時間
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700 w-28">
                  對話 ID
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedConversations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-zinc-500"
                  >
                    無符合條件的對話記錄
                  </td>
                </tr>
              ) : (
                paginatedConversations.map((conv) => (
                  <tr
                    key={conv.conversation_id}
                    className="border-b hover:bg-zinc-50"
                  >
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          conv.status
                        )}`}
                      >
                        {conv.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="font-medium text-zinc-900">
                        {conv.customer_name}
                      </div>
                      <div className="text-zinc-500 text-xs">
                        {conv.customer_phone}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-600 max-w-md">
                      <div className="truncate">{conv.last_message_preview}</div>
                    </td>
                    <td className="px-4 py-4">
                      {conv.category && (
                        <span className="inline-block px-2 py-1 bg-zinc-50 text-zinc-700 rounded text-xs border border-zinc-200">
                          {conv.category}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-600">
                      <div>{formatRelativeTime(conv.created_at)}</div>
                      <div className="text-xs text-zinc-400">
                        {conv.created_at.slice(5, 16)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <Link
                        href={`/admin/support/${conv.conversation_id}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        {conv.conversation_id}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分頁元件 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-between">
            <div className="text-sm text-zinc-600">
              顯示第 {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredConversations.length)} 筆，共{" "}
              {filteredConversations.length} 筆
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-zinc-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50"
              >
                上一頁
              </button>
              <span className="px-3 py-1 text-sm text-zinc-700">
                第 {currentPage} / {totalPages} 頁
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-zinc-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50"
              >
                下一頁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
