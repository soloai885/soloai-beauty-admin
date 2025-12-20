function getStatusStyle(status: string) {
  switch (status) {
    case "待確認":
      return "bg-yellow-100 text-yellow-800";
    case "已確認":
      return "bg-blue-100 text-blue-800";
    case "已完成":
      return "bg-green-100 text-green-800";
    case "已取消":
      return "bg-red-100 text-red-800";
    case "候補中":
      return "bg-blue-100 text-blue-800";
    case "未到場":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function StatusTag({ status }: { status: string }) {
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

