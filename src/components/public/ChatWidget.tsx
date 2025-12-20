"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  type: "user" | "bot";
  text: string;
}

export default function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初始訊息
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "👋 您好！我是 SoloAI 的專屬美容顧問。請問想了解什麼服務呢？",
    },
  ]);

  const faqTags = ["營業時間", "價目表", "停車資訊", "更改預約", "店址在哪"];

  // 自動捲動到最新訊息
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleTagClick = (tag: string) => {
    // 1. 加入用戶訊息
    const userMsg: Message = { type: "user", text: tag };
    setMessages((prev) => [...prev, userMsg]);

    // 2. 模擬機器人思考與回覆
    setTimeout(() => {
      let reply = "好的，馬上為您查詢...";
      // 根據 Tag 給出更豐富的回應
      if (tag === "營業時間")
        reply =
          "我們營業時間為：\n週一至週日 10:00 - 21:00\n(週二固定公休)";
      if (tag === "價目表")
        reply =
          "我們提供多項服務：\n💅 單色凝膠 $1,200 起\n👁️ 3D美睫 $1,600 起\n詳細內容請點擊上方「我要預約」查看喔！";
      if (tag === "停車資訊")
        reply =
          "店門口可停機車。\n開車的貴賓，前方 100 公尺有「城市車旅」收費停車場 ($40/hr)。";
      if (tag === "店址在哪")
        reply =
          "我們位於：台北市大安區美麗大道一段123號 (近捷運忠孝復興站 3 號出口)。";
      if (tag === "更改預約")
        reply =
          "如需更改時間，請提前 24 小時聯繫我們，或直接撥打電話 02-2345-6789。";

      setMessages((prev) => [...prev, { type: "bot", text: reply }]);
    }, 500);
  };

  const handleSend = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { type: "user", text: message }]);
      setMessage("");

      // 模擬機器人回覆
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "感謝您的詢問！如需進一步協助，歡迎隨時告訴我。",
          },
        ]);
      }, 800);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {isOpen && (
        <Card className="w-[350px] shadow-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200 flex flex-col h-[550px] rounded-2xl">
          {/* Header */}
          <div className="bg-[#BE185D] p-4 text-white flex justify-between items-center shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={18} className="text-white" />
              </div>
              <span className="font-medium text-base tracking-wide">
                SoloAI 線上客服
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="h-7 text-xs bg-white text-[#BE185D] hover:bg-rose-50 border-0 font-bold px-3 shadow-sm"
                onClick={() => router.push("/booking")}
              >
                我要預約
              </Button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-rose-600/50 rounded-full p-1 transition-colors"
                aria-label="關閉客服視窗"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Body (Scrollable) */}
          <div
            ref={scrollRef}
            className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4 scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] p-3.5 leading-relaxed whitespace-pre-line shadow-sm text-sm ${
                    msg.type === "user"
                      ? "bg-[#BE185D] text-white rounded-2xl rounded-tr-sm"
                      : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Persistent FAQ Area (Fixed above input) */}
          <div className="bg-slate-50 border-t border-slate-100 p-2 shrink-0">
            <p className="text-xs text-slate-400 mb-2 px-1">常見問題：</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {faqTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer bg-white hover:bg-rose-50 text-slate-600 hover:text-[#BE185D] border-slate-200 hover:border-rose-200 py-1.5 px-3 shrink-0 transition-all active:scale-95 whitespace-nowrap"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0 pb-4">
            <Input
              placeholder="輸入問題..."
              className="text-sm focus-visible:ring-[#BE185D] bg-slate-50 border-slate-200"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              size="icon"
              className="bg-[#BE185D] hover:bg-[#BE185D]/90 shrink-0 shadow-sm transition-transform active:scale-90"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <Send size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* Launcher Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 px-6 rounded-full bg-[#BE185D] hover:bg-[#BE185D]/90 shadow-xl shadow-rose-900/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-white"
        aria-label={isOpen ? "關閉客服" : "開啟客服"}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            <span className="font-bold text-lg tracking-wide">客服</span>
          </>
        )}
      </Button>
    </div>
  );
}
