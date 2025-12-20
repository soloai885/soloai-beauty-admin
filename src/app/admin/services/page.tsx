"use client";

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
import { SERVICES_DATA } from "@/lib/mock-data";

export default function ServicesPage() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Nail":
        return "default";
      case "Lash":
        return "secondary";
      case "Facial":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="max-w-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">
          服務項目（Services）
        </h1>
        <Button>新增服務</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服務名稱</TableHead>
              <TableHead>類別</TableHead>
              <TableHead>價格</TableHead>
              <TableHead>時長</TableHead>
              <TableHead>描述</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SERVICES_DATA.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500">
                  尚無服務項目
                </TableCell>
              </TableRow>
            ) : (
              SERVICES_DATA.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <Badge variant={getCategoryColor(service.category) as any}>
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell>NT$ {service.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{service.duration} 分鐘</span>
                      {service.bufferTime > 0 && (
                        <span className="text-sm text-rose-700">
                          (+{service.bufferTime} 分鐘緩衝)
                        </span>
                      )}
                    </div>
                    {service.bufferTime > 0 && (
                      <div className="text-xs text-zinc-500 mt-1">
                        總佔用時間：{service.duration + service.bufferTime} 分鐘
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {service.description}
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
