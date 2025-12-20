"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { STAFF_DATA, getStaffById } from "@/lib/mock-data";
import { getServices, getServiceById } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  bufferTime: number;
  description: string | null;
}

interface BookingData {
  serviceId: string | null;
  staffId: string | null;
  date: Date | undefined;
  time: string | null;
  customerInfo: {
    name: string;
    phone: string;
    notes: string;
  };
}

const TIME_SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

export default function BookingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: null,
    staffId: null,
    date: undefined,
    time: null,
    customerInfo: {
      name: "",
      phone: "",
      notes: "",
    },
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // 載入服務資料
  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('載入服務失敗:', error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleServiceSelect = (serviceId: string) => {
    setBookingData({ ...bookingData, serviceId });
    setTimeout(() => setStep(2), 300);
  };

  const handleStaffSelect = (staffId: string | null) => {
    setBookingData({ ...bookingData, staffId });
    setTimeout(() => setStep(3), 300);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setBookingData({ ...bookingData, date, time: null });
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
    setTimeout(() => setStep(4), 300);
  };

  const handleInputChange = (field: keyof BookingData["customerInfo"], value: string) => {
    setBookingData({
      ...bookingData,
      customerInfo: {
        ...bookingData.customerInfo,
        [field]: value,
      },
    });
  };

  const handleSubmit = async () => {
    if (!bookingData.serviceId) return;
    
    const selectedService = await getServiceById(bookingData.serviceId);
    const selectedStaff = bookingData.staffId ? getStaffById(bookingData.staffId) : null;

    const finalBookingData = {
      ...bookingData,
      service: selectedService,
      staff: selectedStaff,
    };

    console.log("預約資料:", finalBookingData);

    toast({
      title: "🎉 預約成功！",
      description: "我們期待您的光臨",
    });

    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const selectedService = services.find((s) => s.id === bookingData.serviceId) || null;
  const selectedStaff = bookingData.staffId ? getStaffById(bookingData.staffId) : null;

  const handleNext = () => {
    if (step === 1 && bookingData.serviceId) {
      setStep(2);
    } else if (step === 2) {
      handleStaffSelect(bookingData.staffId);
    } else if (step === 3 && bookingData.date && bookingData.time) {
      handleTimeSelect(bookingData.time);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            上一步
          </Button>
          {step < 4 && (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !bookingData.serviceId) ||
                (step === 3 && (!bookingData.date || !bookingData.time))
              }
              className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white flex items-center gap-2"
            >
              下一步
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-600">
              步驟 {step} / {totalSteps}
            </span>
            <span className="text-sm font-medium text-zinc-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div
              className="bg-[#BE185D] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-zinc-200">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-zinc-900">
              {step === 1 && "選擇服務項目"}
              {step === 2 && "選擇設計師"}
              {step === 3 && "選擇日期與時間"}
              {step === 4 && "填寫聯絡資料"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Select Service */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-zinc-600">載入服務項目中...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={cn(
                          "text-left p-6 rounded-lg border-2 transition-all hover:shadow-lg bg-white relative",
                          bookingData.serviceId === service.id
                            ? "border-[#BE185D] bg-rose-50"
                            : "border-zinc-200 hover:border-rose-200"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-zinc-900">
                            {service.name}
                          </h3>
                          {bookingData.serviceId === service.id && (
                            <Badge className="bg-[#BE185D]">已選擇</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl font-bold text-[#BE185D]">
                            NT$ {service.price.toLocaleString()}
                          </span>
                          <Badge variant="secondary">{service.duration} 分鐘</Badge>
                        </div>
                        <p className="text-sm text-zinc-600 mb-4">
                          {service.description || "專業服務"}
                        </p>
                        {/* 立即預約按鈕 */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceSelect(service.id);
                          }}
                          className="w-full bg-[#BE185D] hover:bg-[#BE185D]/90 text-white"
                        >
                          立即預約
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Staff */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <RadioGroup
                  value={bookingData.staffId || "any"}
                  onValueChange={(value) => handleStaffSelect(value === "any" ? null : value)}
                >
                  {/* Any Staff Option */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-zinc-200 hover:border-rose-200 cursor-pointer">
                    <RadioGroupItem value="any" id="any" />
                    <Label
                      htmlFor="any"
                      className="flex-1 cursor-pointer flex items-center gap-4"
                    >
                      <Avatar className="w-16 h-16 border-2 border-zinc-200">
                        <AvatarFallback className="bg-zinc-100 text-zinc-600">
                          任意
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-zinc-900">不指定設計師</p>
                        <p className="text-sm text-zinc-600">由我們為您安排最適合的設計師</p>
                      </div>
                    </Label>
                  </div>

                  {/* Staff Options */}
                  {STAFF_DATA.map((staff) => (
                    <div
                      key={staff.id}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        bookingData.staffId === staff.id
                          ? "border-[#BE185D] bg-rose-50"
                          : "border-zinc-200 hover:border-rose-200"
                      )}
                    >
                      <RadioGroupItem value={staff.id} id={staff.id} />
                      <Label
                        htmlFor={staff.id}
                        className="flex-1 cursor-pointer flex items-center gap-4"
                      >
                        <Avatar className="w-16 h-16 border-2 border-zinc-200">
                          <AvatarImage src={staff.avatar} alt={staff.name} />
                          <AvatarFallback className="bg-rose-50 text-[#BE185D]">
                            {staff.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-zinc-900">{staff.name}</p>
                          <p className="text-sm text-zinc-600">{staff.role}</p>
                          <div className="flex gap-2 mt-1">
                            {staff.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs bg-rose-100 text-rose-800"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Select Date & Time */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Date Selection */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">選擇日期</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bookingData.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingData.date ? (
                          format(bookingData.date, "yyyy年MM月dd日")
                        ) : (
                          <span>選擇日期</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bookingData.date}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                {bookingData.date && (
                  <div>
                    <Label className="text-base font-semibold mb-4 block">選擇時段</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all font-medium",
                            bookingData.time === time
                              ? "border-[#BE185D] bg-rose-50 text-[#BE185D]"
                              : "border-zinc-200 hover:border-rose-200 bg-white text-zinc-900"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Contact Info */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Summary */}
                <div className="bg-zinc-50 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg text-zinc-900 mb-4">預約摘要</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">服務項目：</span>
                      <span className="font-medium text-zinc-900">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">設計師：</span>
                      <span className="font-medium text-zinc-900">
                        {selectedStaff ? selectedStaff.name : "不指定"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">日期：</span>
                      <span className="font-medium text-zinc-900">
                        {bookingData.date
                          ? format(bookingData.date, "yyyy年MM月dd日")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">時間：</span>
                      <span className="font-medium text-zinc-900">
                        {bookingData.time || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-200">
                      <span className="text-zinc-600">總金額：</span>
                      <span className="font-bold text-lg text-[#BE185D]">
                        NT$ {selectedService?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold">
                      姓名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={bookingData.customerInfo.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="請輸入您的姓名"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold">
                      電話 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.customerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="請輸入您的電話號碼"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-base font-semibold">
                      備註（選填）
                    </Label>
                    <textarea
                      id="notes"
                      value={bookingData.customerInfo.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="如有特殊需求或備註，請在此填寫"
                      className="mt-2 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                上一步
              </Button>
              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !bookingData.serviceId) ||
                    (step === 3 && (!bookingData.date || !bookingData.time))
                  }
                  className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white flex items-center gap-2"
                >
                  下一步
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !bookingData.customerInfo.name || !bookingData.customerInfo.phone
                  }
                  className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white px-8"
                >
                  確認預約
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
