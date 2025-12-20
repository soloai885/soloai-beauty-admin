"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STORE_SETTINGS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { getShopSettings, updateShopSettings } from "./actions";

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(STORE_SETTINGS);
  const [minDailyStaff, setMinDailyStaff] = useState(2);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    emailOnNewBooking: true,
    dailyScheduleSummary: true,
    smsReminders: false,
  });

  // 載入商店設定
  useEffect(() => {
    async function loadSettings() {
      try {
        const shopSettings = await getShopSettings();
        setMinDailyStaff(shopSettings.minDailyStaff);
      } catch (error) {
        console.error("載入設定失敗:", error);
        toast({
          title: "載入失敗",
          description: "無法載入商店設定",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [toast]);

  const handleInputChange = (field: keyof typeof STORE_SETTINGS, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingIntervalChange = (value: string) => {
    setSettings((prev) => ({ ...prev, bookingInterval: parseInt(value) }));
  };

  const handleMinDailyStaffChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setMinDailyStaff(numValue);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 儲存商店設定（人力標準）
      await updateShopSettings({ minDailyStaff });

      toast({
        title: "設定已更新！",
        description: "您的設定已成功儲存，排班表的燈號將立即更新",
      });
    } catch (error) {
      console.error("儲存設定失敗:", error);
      toast({
        title: "儲存失敗",
        description: "無法儲存設定，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          系統設定 (Settings)
        </h1>
        <Button
          onClick={handleSave}
          disabled={loading || saving}
          className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "儲存中..." : "儲存設定"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">門店資訊</TabsTrigger>
          <TabsTrigger value="operations">營運設定</TabsTrigger>
          <TabsTrigger value="notifications">通知設定</TabsTrigger>
        </TabsList>

        {/* Tab 1: General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本資料</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName">
                  商店名稱 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="storeName"
                  value={settings.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-2"
                  placeholder="請輸入商店名稱"
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  聯絡電話 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-2"
                  placeholder="02-1234-5678"
                />
              </div>
              <div>
                <Label htmlFor="address">
                  門市地址 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="mt-2"
                  placeholder="請輸入完整地址"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Operations Settings */}
        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>營業與預約規則</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="openTime">
                    營業開始時間 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={settings.openTime}
                    onChange={(e) => handleInputChange("openTime", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="closeTime">
                    營業結束時間 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={settings.closeTime}
                    onChange={(e) => handleInputChange("closeTime", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bookingInterval">
                  預約時段間隔 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={settings.bookingInterval.toString()}
                  onValueChange={handleBookingIntervalChange}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="選擇時段間隔" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 分鐘</SelectItem>
                    <SelectItem value="30">30 分鐘</SelectItem>
                    <SelectItem value="60">60 分鐘</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 排班標準設定 */}
          <Card>
            <CardHeader>
              <CardTitle>排班標準設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="minDailyStaff">
                  每日最低人力標準 (綠燈門檻) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="minDailyStaff"
                  type="number"
                  min="0"
                  value={minDailyStaff}
                  onChange={(e) => handleMinDailyStaffChange(e.target.value)}
                  className="mt-2"
                  placeholder="例如：2"
                />
                <p className="text-sm text-zinc-600 mt-2">
                  當上班人數達到此數字時，排班表將顯示綠燈；低於此數字顯示黃燈；0 人顯示紅燈。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>訊息通知</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailOnNewBooking" className="text-base">
                    接收新預約 Email 通知
                  </Label>
                  <p className="text-sm text-zinc-600">
                    當有新預約時，系統會發送 Email 通知
                  </p>
                </div>
                <Switch
                  id="emailOnNewBooking"
                  checked={notifications.emailOnNewBooking}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      emailOnNewBooking: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dailyScheduleSummary" className="text-base">
                    每日早上發送行程摘要
                  </Label>
                  <p className="text-sm text-zinc-600">
                    每天早上 8:00 自動發送當日預約行程摘要
                  </p>
                </div>
                <Switch
                  id="dailyScheduleSummary"
                  checked={notifications.dailyScheduleSummary}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      dailyScheduleSummary: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsReminders" className="text-base">
                    開啟簡訊提醒 (SMS)
                  </Label>
                  <p className="text-sm text-zinc-600">
                    預約前 24 小時發送簡訊提醒客戶
                  </p>
                </div>
                <Switch
                  id="smsReminders"
                  checked={notifications.smsReminders}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      smsReminders: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
