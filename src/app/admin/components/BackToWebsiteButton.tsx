'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function BackToWebsiteButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-10 w-10 md:w-auto min-w-[40px] min-h-[40px] flex items-center justify-center gap-2 px-2 md:px-3"
      aria-label="回前台"
      title="回前台"
      asChild
    >
      <Link href="/" className="flex items-center justify-center gap-2">
        <Home className="w-5 h-5 flex-shrink-0" />
        <span className="hidden md:inline text-sm">回前台</span>
      </Link>
    </Button>
  );
}

