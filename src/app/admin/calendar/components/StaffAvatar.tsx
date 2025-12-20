interface StaffAvatarProps {
  name: string | null;
}

export default function StaffAvatar({ name }: StaffAvatarProps) {
  if (!name) {
    return (
      <span className="text-xs text-zinc-500">未指派</span>
    );
  }

  const initial = name.charAt(0);

  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-700">
        {initial}
      </div>
      <span className="text-xs text-zinc-700">{name}</span>
    </div>
  );
}






