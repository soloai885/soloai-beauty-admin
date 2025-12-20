"use client";

import { useState, useEffect } from "react";

interface ServiceItem {
  id: string;
  branchId: string;
  title: string;
  description: string | null;
  price: number;
  durationMin: number;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const BRANCH_ID = "branch_dev_001";

export default function ServiceItemsPage() {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    durationMin: "",
    imageUrl: "",
    sortOrder: "0",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hasBlobToken, setHasBlobToken] = useState<boolean | null>(null);

  // 載入列表
  const loadServiceItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/service-items?branchId=${BRANCH_ID}`
      );
      if (!response.ok) {
        throw new Error("Failed to load service items");
      }
      const data = await response.json();
      setServiceItems(data);
    } catch (error) {
      console.error("Error loading service items:", error);
      alert("載入服務項目失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceItems();
    // 檢查是否有 Blob token（簡單檢查，實際使用時會在上傳時驗證）
    checkBlobToken();
  }, []);

  const checkBlobToken = async () => {
    // 簡單檢查：嘗試呼叫 API，如果返回 CONFIG_ERROR 則表示沒有 token
    // 使用 HEAD 請求或簡單的檢查方式
    try {
      const uploadData = new FormData();
      const emptyBlob = new Blob([], { type: "image/png" });
      uploadData.append("file", emptyBlob, "test.png");
      const response = await fetch("/api/admin/uploads/image", {
        method: "POST",
        body: uploadData,
      });
      const data = await response.json();
      // 如果是 CONFIG_ERROR，表示沒有 token；如果是 INVALID_INPUT，表示有 token 但檔案無效
      setHasBlobToken(data.error_code !== "CONFIG_ERROR");
    } catch {
      // 預設為 true，讓 UI 可以顯示，實際錯誤會在上傳時顯示
      setHasBlobToken(true);
    }
  };

  // 開啟新增 Drawer
  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      durationMin: "",
      imageUrl: "",
      sortOrder: "0",
      isActive: true,
    });
    setImagePreview(null);
    setShowDrawer(true);
  };

  // 開啟編輯 Drawer
  const handleEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      price: item.price.toString(),
      durationMin: item.durationMin.toString(),
      imageUrl: item.imageUrl || "",
      sortOrder: item.sortOrder.toString(),
      isActive: item.isActive,
    });
    setImagePreview(item.imageUrl || null);
    setShowDrawer(true);
  };

  // 圖片處理：壓縮和縮放
  const processImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // 計算縮放比例（最大邊長 1200px）
          const maxDimension = 1200;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("無法建立 canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // 轉換為 WebP（若不支援則使用 JPEG）
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                // Fallback 到 JPEG
                canvas.toBlob(
                  (jpegBlob) => {
                    if (jpegBlob) {
                      resolve(jpegBlob);
                    } else {
                      reject(new Error("圖片轉換失敗"));
                    }
                  },
                  "image/jpeg",
                  0.8
                );
              }
            },
            "image/webp",
            0.8
          );
        };
        img.onerror = () => reject(new Error("圖片載入失敗"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("檔案讀取失敗"));
      reader.readAsDataURL(file);
    });
  };

  // 處理圖片上傳
  const handleImageUpload = async (file: File) => {
    // 檢查檔案大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert("檔案大小不能超過 5MB");
      return;
    }

    try {
      setUploading(true);

      // 處理圖片（壓縮、縮放）
      const processedBlob = await processImage(file);

      // 上傳到伺服器
      const uploadData = new FormData();
      uploadData.append("file", processedBlob, file.name);

      const response = await fetch("/api/admin/uploads/image", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "上傳失敗");
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      setImagePreview(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error instanceof Error ? error.message : "圖片上傳失敗");
    } finally {
      setUploading(false);
    }
  };

  // 處理檔案選擇
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // 處理拖放
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        branchId: BRANCH_ID,
        title: formData.title,
        description: formData.description || null,
        price: parseInt(formData.price),
        durationMin: parseInt(formData.durationMin),
        imageUrl: formData.imageUrl || null,
        sortOrder: parseInt(formData.sortOrder),
        isActive: formData.isActive,
      };

      let response;
      if (editingItem) {
        // 更新
        response = await fetch(`/api/admin/service-items/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        // 新增
        response = await fetch("/api/admin/service-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "操作失敗");
      }

      setShowDrawer(false);
      loadServiceItems();
    } catch (error) {
      console.error("Error saving service item:", error);
      alert(error instanceof Error ? error.message : "儲存失敗");
    }
  };

  // Toggle Active
  const handleToggleActive = async (item: ServiceItem) => {
    try {
      if (item.isActive) {
        // 停用
        const response = await fetch(
          `/api/admin/service-items/${item.id}/deactivate`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("停用失敗");
        }
      } else {
        // 啟用（需要更新 API）
        const response = await fetch(`/api/admin/service-items/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            branchId: item.branchId,
            title: item.title,
            description: item.description,
            price: item.price,
            durationMin: item.durationMin,
            imageUrl: item.imageUrl,
            sortOrder: item.sortOrder,
            isActive: true,
          }),
        });
        if (!response.ok) {
          throw new Error("啟用失敗");
        }
      }
      loadServiceItems();
    } catch (error) {
      console.error("Error toggling active:", error);
      alert("操作失敗");
    }
  };

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          服務項目管理 (Service Items)
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 新增服務項目
        </button>
      </div>

      {/* ServiceItem List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-zinc-500">載入中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-zinc-100 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">
                    排序
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">
                    服務名稱
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">
                    價格
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">
                    時長（分鐘）
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-zinc-500"
                    >
                      尚無服務項目
                    </td>
                  </tr>
                ) : (
                  serviceItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-zinc-900">
                        {item.sortOrder}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900">
                        NT$ {item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900">
                        {item.durationMin}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.isActive ? "上架中" : "已下架"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleToggleActive(item)}
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                              item.isActive
                                ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                                : "text-green-600 hover:text-green-800 hover:bg-green-50"
                            }`}
                          >
                            {item.isActive ? "下架" : "上架"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-md shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">
                {editingItem ? "編輯服務項目" : "新增服務項目"}
              </h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-zinc-400 hover:text-zinc-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  服務名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  服務說明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  價格（元） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  時長（分鐘） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.durationMin}
                  onChange={(e) =>
                    setFormData({ ...formData, durationMin: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 圖片上傳 */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  服務圖片
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    uploading
                      ? "border-blue-300 bg-blue-50"
                      : "border-zinc-300 hover:border-blue-400"
                  } transition-colors`}
                >
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                      />
                      <div className="flex gap-2 justify-center">
                        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                          {uploading ? "上傳中..." : "更換圖片"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={uploading || hasBlobToken === false}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({ ...formData, imageUrl: "" });
                          }}
                          className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-zinc-400 text-4xl">📷</div>
                      <div>
                        <p className="text-sm text-zinc-600 mb-2">
                          點擊選擇圖片或拖放至此
                        </p>
                        <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                          {uploading
                            ? "上傳中..."
                            : hasBlobToken === false
                            ? "尚未設定 Blob token"
                            : "選擇圖片"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={uploading || hasBlobToken === false}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {hasBlobToken === false && (
                        <p className="text-xs text-red-500">
                          請設定 BLOB_READ_WRITE_TOKEN 環境變數
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {/* 隱藏的 imageUrl 欄位 */}
                <input
                  type="hidden"
                  value={formData.imageUrl}
                  onChange={() => {}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  排序
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, sortOrder: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-zinc-700">
                    上架中
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

