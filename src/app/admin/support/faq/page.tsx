"use client";

import { useState, useEffect } from "react";
import { getFAQs, type FAQItem } from "../data";

// 分類 Enum（系統固定值）
const FAQ_CATEGORIES = [
  "預約相關",
  "服務內容",
  "價格與方案",
  "營業與地點",
  "其他／未歸類",
] as const;

export default function FAQManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
  });
  const [showCSVModal, setShowCSVModal] = useState(false);
  const itemsPerPage = 15;

  // 初始化 FAQ 列表
  useEffect(() => {
    setFaqs(getFAQs());
  }, []);

  const allFAQs = faqs;

  // 篩選邏輯
  let filteredFAQs = allFAQs;
  if (searchKeyword) {
    filteredFAQs = allFAQs.filter(
      (faq) =>
        faq.question.includes(searchKeyword) ||
        faq.answer.includes(searchKeyword) ||
        faq.category.includes(searchKeyword) ||
        faq.faq_id.includes(searchKeyword)
    );
  }

  // 分頁邏輯
  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFAQs = filteredFAQs.slice(startIndex, endIndex);

  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.question.trim() ||
      !formData.answer.trim() ||
      !formData.category
    ) {
      return;
    }

    // 生成新的 FAQ ID
    const newId = `FAQ${String(faqs.length + 1).padStart(3, "0")}`;
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const newFAQ: FAQItem = {
      faq_id: newId,
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      category: formData.category,
      created_at: now,
      updated_at: now,
    };

    // 新增到列表最前面（最新）
    setFaqs([newFAQ, ...faqs]);
    
    // 重置表單
    setFormData({
      question: "",
      answer: "",
      category: "",
    });
    
    // 重置到第一頁
    setCurrentPage(1);
  };

  // 回答摘要（前 30-50 字）
  const getAnswerSnippet = (answer: string): string => {
    if (answer.length <= 50) return answer;
    return answer.slice(0, 50) + "...";
  };

  return (
    <div className="max-w-full">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
        FAQ / 知識庫管理 (FAQ Management)
      </h1>

      {/* 單筆新增表單 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            單筆新增 FAQ
          </h2>
          <button
            onClick={() => setShowCSVModal(true)}
            className="px-4 py-2 text-sm text-zinc-600 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            批次匯入（CSV）
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              問題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              required
              placeholder="請輸入問題內容"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              回答 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              required
              rows={4}
              placeholder="請輸入回答內容"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              分類 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">請選擇分類</option>
              {FAQ_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              新增 FAQ
            </button>
          </div>
        </form>
      </div>

      {/* CSV Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                CSV 批次匯入
              </h2>
              <button
                onClick={() => setShowCSVModal(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>
            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center mb-6">
              <p className="text-sm text-zinc-600 mb-4">
                拖曳 CSV 檔案至此處，或點擊選擇檔案
              </p>
              <button
                disabled
                className="px-4 py-2 bg-zinc-100 text-zinc-500 rounded-lg text-sm cursor-not-allowed"
              >
                選擇檔案（待實作）
              </button>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                欄位格式說明
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>question</strong>: 問題內容（必填）</p>
                <p>• <strong>answer</strong>: 回答內容（必填）</p>
                <p>• <strong>category</strong>: 分類名稱（必填），值必須為以下之一：</p>
                <div className="ml-4 mt-1 space-y-0.5">
                  {FAQ_CATEGORIES.map((category) => (
                    <p key={category}>- {category}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCSVModal(false)}
                className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg text-sm hover:bg-zinc-300 transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 搜尋列 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              搜尋 FAQ
            </label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="搜尋問題、回答、分類或 FAQ ID"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* FAQ 列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-100 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700 w-32">
                  分類
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">
                  問題
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">
                  回答摘要
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700 w-24">
                  操作
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700 w-32">
                  建立日期
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedFAQs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-zinc-500"
                  >
                    無符合條件的 FAQ 記錄
                  </td>
                </tr>
              ) : (
                paginatedFAQs.map((faq) => (
                  <tr
                    key={faq.faq_id}
                    className="border-b hover:bg-zinc-50"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900 font-medium">
                      {faq.question}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {getAnswerSnippet(faq.answer)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          disabled
                          className="text-zinc-400 hover:text-zinc-600 disabled:cursor-not-allowed"
                          title="編輯（待實作）"
                        >
                          ✏️
                        </button>
                        <button
                          disabled
                          className="text-zinc-400 hover:text-red-600 disabled:cursor-not-allowed"
                          title="刪除（待實作）"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 text-xs">
                      {faq.created_at.slice(0, 10)}
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
              顯示第 {startIndex + 1} - {Math.min(endIndex, filteredFAQs.length)}{" "}
              筆，共 {filteredFAQs.length} 筆
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
