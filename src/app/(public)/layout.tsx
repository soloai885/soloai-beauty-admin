"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import ChatWidget from "@/components/public/ChatWidget";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "首頁" },
    { href: "/services", label: "服務項目" },
    { href: "/staff", label: "設計師團隊" },
    { href: "/contact", label: "聯絡我們" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl font-bold text-[#BE185D] tracking-tight">
                SoloAI Beauty
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-zinc-700 hover:text-[#BE185D] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/booking">
                <Button className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white">
                  立即預約
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">開啟選單</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-zinc-900 hover:text-[#BE185D] transition-colors py-2"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link href="/booking" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-[#BE185D] hover:bg-[#BE185D]/90 text-white mt-4">
                        立即預約
                      </Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Toaster */}
      <Toaster />

      {/* Chat Widget */}
      <ChatWidget />

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Info */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">SoloAI Beauty</h3>
              <p className="text-sm text-zinc-400 mb-4 max-w-md">
                專業美甲、美睫與護膚服務，致力於為每位顧客打造專屬的美麗體驗。
                我們相信，每一個細節都值得用心呵護。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">快速連結</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/services"
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    服務項目
                  </Link>
                </li>
                <li>
                  <Link
                    href="/booking"
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    線上預約
                  </Link>
                </li>
                <li>
                  <Link
                    href="/staff"
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    設計師團隊
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    常見問題
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">聯絡資訊</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>台北市信義區信義路五段7號</li>
                <li>電話：02-2345-6789</li>
                <li>營業時間：週一至週日 10:00 - 21:00</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-zinc-800 mt-8 pt-8">
            <p className="text-center text-sm text-zinc-400">
              © 2025{' '}
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white transition-colors hover:underline"
              >
                SoloAI Beauty
              </Link>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
