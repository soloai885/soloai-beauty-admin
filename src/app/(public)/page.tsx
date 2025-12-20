"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SERVICES_DATA, STAFF_DATA } from "@/lib/mock-data";
import { Star, ShieldCheck, Clock } from "lucide-react";

export default function HomePage() {
  // 取得前 4 筆熱門服務
  const featuredServices = SERVICES_DATA.slice(0, 4);

  return (
    <div className="w-full">
      {/* Section A: Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center py-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 mb-6 leading-tight">
            煥發自信，定義妳的專屬美學
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            SoloAI Beauty 提供頂級美甲、美睫與護膚體驗，讓每一個細節都完美無瑕。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white text-lg px-10 py-7 w-full sm:w-auto"
              >
                立即預約體驗
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-900 text-slate-900 hover:bg-slate-50 text-lg px-10 py-7 w-full sm:w-auto"
              >
                探索服務
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section B: Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4">
              為什麼選擇 SoloAI Beauty？
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              我們致力於提供最優質的服務體驗
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 頂級用料 */}
            <Card className="border-zinc-200 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-[#BE185D]" />
                </div>
                <CardTitle className="text-xl font-semibold text-zinc-900">
                  頂級用料
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-zinc-600">
                  嚴選進口無毒凝膠與保養品，確保每一位顧客都能享受到最安全、最優質的產品。
                </CardDescription>
              </CardContent>
            </Card>

            {/* 專業技術 */}
            <Card className="border-zinc-200 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-[#BE185D]" />
                </div>
                <CardTitle className="text-xl font-semibold text-zinc-900">
                  專業技術
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-zinc-600">
                  資深技師團隊，定期進修最新潮流技術，為您呈現最時尚、最精緻的美容作品。
                </CardDescription>
              </CardContent>
            </Card>

            {/* 安心保固 */}
            <Card className="border-zinc-200 hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-[#BE185D]" />
                </div>
                <CardTitle className="text-xl font-semibold text-zinc-900">
                  安心保固
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-zinc-600">
                  完善的售後服務，讓您變美無負擔。我們承諾為每一位顧客提供最貼心的服務保障。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section C: Featured Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4">
              熱門服務項目
            </h2>
            <p className="text-lg text-zinc-600">
              精選最受歡迎的美容服務項目
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-zinc-200 bg-white"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-zinc-900 mb-3 line-clamp-2">
                    {service.name}
                  </CardTitle>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-[#BE185D]">
                      NT$ {service.price.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {service.duration} 分鐘
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm text-zinc-600 mb-4 line-clamp-2">
                    {service.description}
                  </CardDescription>
                  <Link href="/booking">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-[#BE185D] text-[#BE185D] hover:bg-rose-50"
                    >
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section D: Meet Our Experts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4">
              專業設計師團隊
            </h2>
            <p className="text-lg text-zinc-600">
              遇見我們的專業職人，為您打造專屬美麗
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STAFF_DATA.map((staff) => (
              <Card
                key={staff.id}
                className="text-center hover:shadow-xl transition-shadow border-zinc-200"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24 border-4 border-rose-100">
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                      <AvatarFallback className="text-2xl font-bold text-[#BE185D] bg-rose-50">
                        {staff.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl font-semibold text-zinc-900">
                    {staff.name}
                  </CardTitle>
                  <CardDescription className="text-base text-zinc-600">
                    {staff.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {staff.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-rose-50 text-rose-800 border-rose-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Link href="/booking">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full border-[#BE185D] text-[#BE185D] hover:bg-rose-50"
                    >
                      指定預約
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section E: Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-6">
            準備好遇見更美的自己了嗎？
          </h2>
          <p className="text-xl text-zinc-600 mb-8">
            立即預約，開啟您的專屬美麗之旅
          </p>
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white text-lg px-12 py-7"
            >
              24小時線上預約
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
