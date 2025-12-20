"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CUSTOMERS_DATA } from "@/lib/mock-data";
import { Search, Mail, Phone, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomersPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [customers] = useState(CUSTOMERS_DATA);

  // 搜尋功能
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      customer.phone.includes(searchKeyword) ||
      customer.email.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 計算統計數據
  const totalCustomers = filteredCustomers.length;
  const totalRevenue = filteredCustomers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );
  const totalVisits = filteredCustomers.reduce(
    (sum, customer) => sum + customer.visits,
    0
  );

  const getTagVariant = (tag: string) => {
    if (tag === "VVIP" || tag === "VIP") return "default";
    if (tag === "儲值會員") return "secondary";
    if (tag === "熟客") return "outline";
    return "secondary";
  };

  const getTagClassName = (tag: string) => {
    if (tag === "VVIP") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (tag === "VIP") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (tag === "新客") return "bg-green-100 text-green-800 border-green-200";
    if (tag === "儲值會員") return "bg-blue-100 text-blue-800 border-blue-200";
    if (tag === "熟客") return "bg-gray-100 text-gray-800 border-gray-200";
    return "";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="max-w-full">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
        客戶管理 (Customers)
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 mb-1">總客戶數</p>
              <p className="text-2xl font-semibold text-zinc-900">
                {totalCustomers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 mb-1">累積消費</p>
              <p className="text-2xl font-semibold text-zinc-900">
                NT$ {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 mb-1">總來訪次數</p>
              <p className="text-2xl font-semibold text-zinc-900">
                {totalVisits}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top Toolbar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              placeholder="搜尋姓名或電話..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            新增客戶
          </Button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>客戶姓名</TableHead>
              <TableHead>聯絡方式</TableHead>
              <TableHead>來訪次數</TableHead>
              <TableHead>累積消費</TableHead>
              <TableHead>最後來訪</TableHead>
              <TableHead>標籤</TableHead>
              <TableHead>備註</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-zinc-500 py-8"
                >
                  找不到符合條件的客戶
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={undefined} alt={customer.name} />
                        <AvatarFallback className="bg-rose-100 text-[#BE185D] text-sm">
                          {customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{customer.visits} 次</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#BE185D]">
                      NT$ {customer.totalSpent.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {formatDate(customer.lastVisit)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={getTagClassName(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-zinc-600 truncate">
                      {customer.notes || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/customers/${customer.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="查看詳情">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
