'use client';

import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="h-10 w-10 md:w-auto min-w-[40px] min-h-[40px] flex items-center justify-center gap-2 px-2 md:px-3 w-full md:w-auto justify-start md:justify-center"
    >
      <LogOut className="w-5 h-5 flex-shrink-0" />
      <span className="hidden md:inline">登出</span>
    </Button>
  );
}

