
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Tool,
  Clipboard,
  Users,
  Settings,
  FileText,
  ShieldCheck,
  History,
  AlertTriangle
} from "lucide-react";
import {
  devices,
  maintenances,
  inventories,
  employees,
  repairs,
  invoices,
  warranties,
  repairHistories
} from "@/data/mockData";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Get devices that need maintenance
  const devicesNeedingMaintenance = maintenances.filter(
    (maintenance) => maintenance.status === "chưa bảo trì"
  ).length;

  // Get devices that need repair
  const devicesNeedingRepair = repairs.filter(
    (repair) => repair.status === "chưa sửa chữa"
  ).length;

  // Devices with expired warranty
  const currentDate = new Date();
  const expiredWarranties = warranties.filter(
    (warranty) => new Date(warranty.endDate) < currentDate
  ).length;

  const stats = [
    {
      title: "Thiết bị",
      value: devices.length,
      icon: <Package className="h-5 w-5" />,
      path: "/devices",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Bảo trì",
      value: maintenances.length,
      icon: <Tool className="h-5 w-5" />,
      path: "/maintenance",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      title: "Cần bảo trì",
      value: devicesNeedingMaintenance,
      icon: <AlertTriangle className="h-5 w-5" />,
      path: "/maintenance",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Kiểm kê",
      value: inventories.length,
      icon: <Clipboard className="h-5 w-5" />,
      path: "/inventory",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Nhân viên",
      value: employees.length,
      icon: <Users className="h-5 w-5" />,
      path: "/employees",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Sửa chữa",
      value: repairs.length,
      icon: <Settings className="h-5 w-5" />,
      path: "/repairs",
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Cần sửa chữa",
      value: devicesNeedingRepair,
      icon: <AlertTriangle className="h-5 w-5" />,
      path: "/repairs",
      color: "bg-orange-100 text-orange-800",
    },
    {
      title: "Hóa đơn",
      value: invoices.length,
      icon: <FileText className="h-5 w-5" />,
      path: "/invoices",
      color: "bg-cyan-100 text-cyan-800",
    },
    {
      title: "Bảo hành",
      value: warranties.length,
      icon: <ShieldCheck className="h-5 w-5" />,
      path: "/warranty",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Bảo hành hết hạn",
      value: expiredWarranties,
      icon: <AlertTriangle className="h-5 w-5" />,
      path: "/warranty",
      color: "bg-rose-100 text-rose-800",
    },
    {
      title: "Lịch sử sửa",
      value: repairHistories.length,
      icon: <History className="h-5 w-5" />,
      path: "/repair-history",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link to={stat.path} key={index}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thiết bị cần bảo trì gấp</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {maintenances
                .filter((maintenance) => maintenance.status === "chưa bảo trì")
                .slice(0, 5)
                .map((maintenance) => {
                  const device = devices.find(
                    (device) => device.id === maintenance.deviceId
                  );
                  return (
                    <li
                      key={maintenance.id}
                      className="p-2 bg-yellow-50 rounded-md flex justify-between"
                    >
                      <span>{device?.name}</span>
                      <span>{maintenance.date}</span>
                    </li>
                  );
                })}
              {devicesNeedingMaintenance === 0 && (
                <li className="p-2 bg-green-50 text-green-800 rounded-md">
                  Không có thiết bị nào cần bảo trì gấp
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thiết bị cần sửa chữa</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {repairs
                .filter((repair) => repair.status === "chưa sửa chữa")
                .slice(0, 5)
                .map((repair) => {
                  const device = devices.find(
                    (device) => device.id === repair.deviceId
                  );
                  return (
                    <li
                      key={repair.id}
                      className="p-2 bg-red-50 rounded-md flex justify-between"
                    >
                      <span>{device?.name}</span>
                      <span>{repair.repairDate}</span>
                    </li>
                  );
                })}
              {devicesNeedingRepair === 0 && (
                <li className="p-2 bg-green-50 text-green-800 rounded-md">
                  Không có thiết bị nào cần sửa chữa
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
