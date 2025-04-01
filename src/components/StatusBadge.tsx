
import { cn } from "@/lib/utils";

type StatusType = 
  | 'đã bảo trì' 
  | 'chưa bảo trì' 
  | 'đã sửa chữa' 
  | 'chưa sửa chữa'
  | 'tốt'
  | 'hỏng'
  | 'bảo trì'
  | 'sửa chữa'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusColor = (status: StatusType) => {
    switch (status.toLowerCase()) {
      case 'đã bảo trì':
      case 'đã sửa chữa':
      case 'tốt':
        return "bg-green-100 text-green-800 border-green-200";
      case 'chưa bảo trì':
      case 'chưa sửa chữa':
      case 'bảo trì':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'hỏng':
      case 'sửa chữa':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusColor(status),
        className
      )}
    >
      {status}
    </span>
  );
};
