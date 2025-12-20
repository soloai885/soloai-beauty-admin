import Link from "next/link";
import { menuItems } from "./menuConfig";
import LogoutButton from "./LogoutButton";

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-zinc-200 min-h-screen flex flex-col">
      <div className="p-4 flex-1">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">後台管理</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-zinc-200">
        <LogoutButton />
      </div>
    </aside>
  );
}
