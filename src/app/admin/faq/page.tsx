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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FAQ_DATA } from "@/lib/mock-data";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState(FAQ_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    isActive: true,
  });

  const handleToggleActive = (id: string) => {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
      )
    );
  };

  const handleEdit = (faq: typeof FAQ_DATA[0]) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
    });
    setSelectedFaq(faq.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedFaq(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFaq) {
      setFaqs((prev) => prev.filter((faq) => faq.id !== selectedFaq));
      setIsDeleteDialogOpen(false);
      setSelectedFaq(null);
    }
  };

  const handleCreate = () => {
    setFormData({
      question: "",
      answer: "",
      category: "",
      isActive: true,
    });
    setSelectedFaq(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (selectedFaq) {
      // 編輯
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === selectedFaq
            ? {
                ...faq,
                question: formData.question,
                answer: formData.answer,
                category: formData.category,
                isActive: formData.isActive,
              }
            : faq
        )
      );
    } else {
      // 新增
      const newFaq = {
        id: `faq_${String(faqs.length + 1).padStart(3, "0")}`,
        ...formData,
      };
      setFaqs((prev) => [...prev, newFaq]);
    }
    setIsDialogOpen(false);
    setSelectedFaq(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          FAQ 知識庫管理 (Knowledge Base)
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleCreate}
              className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              新增問答
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedFaq ? "編輯問答" : "新增問答"}
              </DialogTitle>
              <DialogDescription>
                請填寫問題與回答內容，這些內容將顯示在客服視窗中。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="question">
                  問題 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="例如：營業時間"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="answer">
                  回答 <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  placeholder="請輸入回答內容（可使用 \n 換行）"
                  rows={6}
                  className="mt-2 flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <Label htmlFor="category">
                  分類 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="例如：基本資訊、服務相關"
                  className="mt-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  啟用此問答
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !formData.question || !formData.answer || !formData.category
                }
                className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-white"
              >
                儲存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>問題</TableHead>
              <TableHead>回答預覽</TableHead>
              <TableHead>分類</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                  尚無問答資料
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">{faq.question}</TableCell>
                  <TableCell className="text-zinc-600 max-w-md">
                    <div className="line-clamp-2">
                      {truncateText(faq.answer.replace(/\n/g, " "), 80)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {faq.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={faq.isActive}
                        onCheckedChange={() => handleToggleActive(faq.id)}
                      />
                      <span className="text-sm text-zinc-600">
                        {faq.isActive ? "啟用" : "停用"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(faq)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(faq.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              確認刪除
            </AlertDialogTitle>
            <AlertDialogDescription>
              您確定要刪除此問答嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              確認刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}





