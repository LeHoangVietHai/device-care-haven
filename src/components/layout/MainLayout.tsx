
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Settings, 
  Clipboard, 
  Tool, 
  Users, 
  FileText, 
  Package, 
  ShieldCheck,
  History,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
    { name: "Thiết Bị", path: "/devices", icon: <Package className="w-5 h-5 mr-2" /> },
    { name: "Bảo Trì", path: "/maintenance", icon: <Tool className="w-5 h-5 mr-2" /> },
    { name: "Kiểm Kê", path: "/inventory", icon: <Clipboard className="w-5 h-5 mr-2" /> },
    { name: "Nhân Viên", path: "/employees", icon: <Users className="w-5 h-5 mr-2" /> },
    { name: "Sửa Chữa", path: "/repairs", icon: <Settings className="w-5 h-5 mr-2" /> },
    { name: "Hóa Đơn", path: "/invoices", icon: <FileText className="w-5 h-5 mr-2" /> },
    { name: "Bảo Hành", path: "/warranty", icon: <ShieldCheck className="w-5 h-5 mr-2" /> },
    { name: "Lịch Sử Sửa", path: "/repair-history", icon: <History className="w-5 h-5 mr-2" /> },
  ];

  // Auto-close sidebar on mobile when navigating
  if (isMobile && isSidebarOpen) {
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white shadow-md transition-all duration-300 fixed md:relative z-10 h-screen",
          isSidebarOpen ? "w-64" : "w-0 md:w-16",
          isMobile && !isSidebarOpen && "hidden"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center">
            <h1 className={cn("font-bold text-primary text-lg", !isSidebarOpen && "md:hidden")}>
              Device Care Haven
            </h1>
          </div>
          <nav className="flex-grow p-2 overflow-y-auto">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center py-2 px-4 rounded-md transition-colors",
                      location.pathname === item.path
                        ? "nav-link active"
                        : "hover:bg-secondary"
                    )}
                  >
                    {item.icon}
                    <span className={cn("transition-opacity", !isSidebarOpen && "md:hidden")}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm py-3 px-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M3 12H21M3 6H21M3 18H21" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <h1 className="text-xl font-semibold">Hệ Thống Quản Lý Thiết Bị</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
