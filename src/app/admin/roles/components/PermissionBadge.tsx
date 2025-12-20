interface PermissionBadgeProps {
  accessLevel: "view" | "full" | "no_access";
}

export default function PermissionBadge({
  accessLevel,
}: PermissionBadgeProps) {
  const getBadgeStyle = () => {
    switch (accessLevel) {
      case "view":
        return "bg-blue-100 text-blue-800";
      case "full":
        return "bg-green-100 text-green-800";
      case "no_access":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLabel = () => {
    switch (accessLevel) {
      case "view":
        return "✅ View";
      case "full":
        return "🟢 Full";
      case "no_access":
        return "❌ No Access";
      default:
        return "Unknown";
    }
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyle()}`}
    >
      {getLabel()}
    </span>
  );
}



