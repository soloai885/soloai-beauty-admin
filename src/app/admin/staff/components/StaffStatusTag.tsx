function getStatusStyle(status: string) {
  switch (status) {
    case "在職":
      return "bg-green-100 text-green-800";
    case "休息":
      return "bg-gray-100 text-gray-800";
    case "離職":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function StaffStatusTag({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}






