'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

export default function CustomerBookingButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-10 w-10 md:w-auto min-w-[40px] min-h-[40px] flex items-center justify-center gap-2 px-2 md:px-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
      aria-label="客人預約畫面"
      title="客人預約畫面"
      asChild
    >
      <Link href="/booking" target="_blank" className="flex items-center justify-center gap-2">
        <Store className="w-5 h-5 flex-shrink-0" />
        <span className="hidden md:inline text-sm">客人預約畫面</span>
      </Link>
    </Button>
  );
}



