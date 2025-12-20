"use client";

import Link from "next/link";
import { useState } from "react";
import { menuItems } from "./menuConfig";
import LogoutButton from "./LogoutButton";
import BackToWebsiteButton from "./BackToWebsiteButton";
import CustomerBookingButton from "./CustomerBookingButton";

export default function Topbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
        <div className="flex items-center">
          {/* Mobile 漢堡按鈕 */}
          <button
            className="block md:hidden mr-4 p-2 text-zinc-700 hover:bg-zinc-100 rounded-md"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-label="開啟選單"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop 標題 */}
          <h1 className="text-lg font-semibold text-zinc-900 hidden md:block">
            後台管理系統
          </h1>

          {/* Mobile 標題 */}
          <h1 className="text-lg font-semibold text-zinc-900 block md:hidden">
            後台管理
          </h1>
        </div>

        {/* 右側功能區 */}
        <div className="flex items-center gap-2">
          {/* 客人預約按鈕 */}
          <CustomerBookingButton />
          {/* 回前台按鈕 */}
          <BackToWebsiteButton />
          {/* 登出按鈕 */}
          <LogoutButton />
        </div>
      </header>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 block md:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-zinc-200 z-50 block md:hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-900">後台管理</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-md"
                  aria-label="關閉選單"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-zinc-200">
                <LogoutButton />
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
