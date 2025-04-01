
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { 
  getFullDevices, 
  deviceTypes, 
  deviceLocations, 
  deviceStatuses, 
  employees as allEmployees 
} from "@/data/mockData";
import { Device, DeviceStatus, DeviceLocation, DeviceType, Employee } from "@/types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const Devices = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>(getFullDevices());
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Form state
  const [deviceData, setDeviceData] = useState<Partial<Device>>({
    id: "",
    name: "",
    value: 0,
    purchaseDate: "",
    deviceTypeId: "",
    deviceLocationId: "",
    deviceStatusId: "",
    employeeId: "",
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceData.id || !deviceData.name || !deviceData.purchaseDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin thiết bị",
        variant: "destructive",
      });
      return;
    }

    // Check if device ID already exists
    if (devices.some(device => device.id === deviceData.id)) {
      toast({
        title: "Lỗi",
        description: "Mã thiết bị đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const deviceType = deviceTypes.find(type => type.id === deviceData.deviceTypeId);
    const deviceLocation = deviceLocations.find(location => location.id === deviceData.deviceLocationId);
    const deviceStatus = deviceStatuses.find(status => status.id === deviceData.deviceStatusId);
    const employee = allEmployees.find(emp => emp.id === deviceData.employeeId);

    const newDevice: Device = {
      id: deviceData.id as string,
      name: deviceData.name as string,
      value: deviceData.value as number,
      purchaseDate: deviceData.purchaseDate as string,
      deviceTypeId: deviceData.deviceTypeId as string,
      deviceLocationId: deviceData.deviceLocationId as string,
      deviceStatusId: deviceData.deviceStatusId as string,
      employeeId: deviceData.employeeId as string,
      deviceType: deviceType as DeviceType,
      deviceLocation: deviceLocation as DeviceLocation,
      deviceStatus: deviceStatus as DeviceStatus,
      employee: employee as Employee,
    };

    setDevices([...devices, newDevice]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Thêm thiết bị mới thành công",
    });

    // Reset form
    setDeviceData({
      id: "",
      name: "",
      value: 0,
      purchaseDate: "",
      deviceTypeId: "",
      deviceLocationId: "",
      deviceStatusId: "",
      employeeId: "",
    });
  };

  const handleEditDevice = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDevice || !deviceData.name || !deviceData.purchaseDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin thiết bị",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const deviceType = deviceTypes.find(type => type.id === deviceData.deviceTypeId);
    const deviceLocation = deviceLocations.find(location => location.id === deviceData.deviceLocationId);
    const deviceStatus = deviceStatuses.find(status => status.id === deviceData.deviceStatusId);
    const employee = allEmployees.find(emp => emp.id === deviceData.employeeId);

    const updatedDevice: Device = {
      ...selectedDevice,
      name: deviceData.name as string,
      value: deviceData.value as number,
      purchaseDate: deviceData.purchaseDate as string,
      deviceTypeId: deviceData.deviceTypeId as string,
      deviceLocationId: deviceData.deviceLocationId as string,
      deviceStatusId: deviceData.deviceStatusId as string,
      employeeId: deviceData.employeeId as string,
      deviceType: deviceType as DeviceType,
      deviceLocation: deviceLocation as DeviceLocation,
      deviceStatus: deviceStatus as DeviceStatus,
      employee: employee as Employee,
    };

    setDevices(devices.map(device => 
      device.id === selectedDevice.id ? updatedDevice : device
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Cập nhật thiết bị thành công",
    });
  };

  const handleRowClick = (device: Device) => {
    setSelectedDevice(device);
    setDeviceData({
      id: device.id,
      name: device.name,
      value: device.value,
      purchaseDate: device.purchaseDate,
      deviceTypeId: device.deviceTypeId,
      deviceLocationId: device.deviceLocationId,
      deviceStatusId: device.deviceStatusId,
      employeeId: device.employeeId,
    });
    setIsEditDialogOpen(true);
  };

  const columns = [
    {
      header: "Mã",
      accessorKey: "id",
      enableSorting: true,
    },
    {
      header: "Tên thiết bị",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      header: "Giá trị",
      accessorKey: (device: Device) => formatCurrency(device.value),
      enableSorting: false,
    },
    {
      header: "Ngày mua",
      accessorKey: "purchaseDate",
      enableSorting: true,
    },
    {
      header: "Loại thiết bị",
      accessorKey: (device: Device) => device.deviceType?.name || "-",
      enableSorting: false,
    },
    {
      header: "Vị trí",
      accessorKey: (device: Device) => device.deviceLocation?.name || "-",
      enableSorting: false,
    },
    {
      header: "Trạng thái",
      accessorKey: (device: Device) => (
        <StatusBadge status={device.deviceStatus?.name || ""} />
      ),
      enableSorting: false,
    },
    {
      header: "Người quản lý",
      accessorKey: (device: Device) => device.employee?.name || "-",
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý thiết bị</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Thêm thiết bị</Button>
      </div>

      <DataTable
        data={devices}
        columns={columns}
        onRowClick={handleRowClick}
        searchField="name"
      />

      {/* Add Device Dialog */}
      <FormDialog
        title="Thêm thiết bị mới"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddDevice}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Mã thiết bị</Label>
            <Input
              id="id"
              value={deviceData.id}
              onChange={(e) => setDeviceData({ ...deviceData, id: e.target.value })}
              placeholder="Ví dụ: D006"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Tên thiết bị</Label>
            <Input
              id="name"
              value={deviceData.name}
              onChange={(e) => setDeviceData({ ...deviceData, name: e.target.value })}
              placeholder="Nhập tên thiết bị"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="value">Giá trị</Label>
            <Input
              id="value"
              type="number"
              value={deviceData.value}
              onChange={(e) => setDeviceData({ ...deviceData, value: parseFloat(e.target.value) })}
              placeholder="Nhập giá trị thiết bị"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="purchaseDate">Ngày mua</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={deviceData.purchaseDate}
              onChange={(e) => setDeviceData({ ...deviceData, purchaseDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deviceType">Loại thiết bị</Label>
            <Select 
              value={deviceData.deviceTypeId} 
              onValueChange={(value) => setDeviceData({ ...deviceData, deviceTypeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại thiết bị" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deviceLocation">Vị trí thiết bị</Label>
            <Select 
              value={deviceData.deviceLocationId} 
              onValueChange={(value) => setDeviceData({ ...deviceData, deviceLocationId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vị trí thiết bị" />
              </SelectTrigger>
              <SelectContent>
                {deviceLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deviceStatus">Trạng thái thiết bị</Label>
            <Select 
              value={deviceData.deviceStatusId} 
              onValueChange={(value) => setDeviceData({ ...deviceData, deviceStatusId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái thiết bị" />
              </SelectTrigger>
              <SelectContent>
                {deviceStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="employee">Nhân viên quản lý</Label>
            <Select 
              value={deviceData.employeeId} 
              onValueChange={(value) => setDeviceData({ ...deviceData, employeeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên quản lý" />
              </SelectTrigger>
              <SelectContent>
                {allEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      {/* Edit Device Dialog */}
      <FormDialog
        title="Chỉnh sửa thiết bị"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditDevice}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-id">Mã thiết bị</Label>
            <Input
              id="edit-id"
              value={deviceData.id}
              disabled
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Tên thiết bị</Label>
            <Input
              id="edit-name"
              value={deviceData.name}
              onChange={(e) => setDeviceData({ ...deviceData, name: e.target.value })}
              placeholder="Nhập tên thiết bị"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-value">Giá trị</Label>
            <Input
              id="edit-value"
              type="number"
              value={deviceData.value}
              onChange={(e) => setDeviceData({ ...deviceData, value: parseFloat(e.target.value) })}
              placeholder="Nhập giá trị thiết bị"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-purchaseDate">Ngày mua</Label>
            <Input
              id="edit-purchaseDate"
              type="date"
              value={deviceData.purchaseDate}
              onChange={(e) => setDeviceData({ ...deviceData, purchaseDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-deviceType">Loại thiết bị</Label>
            <Select 
              value={deviceData.deviceTypeId} 
              onValueChange={(value) => setDeviceData({ ...deviceData, deviceTypeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại thiết bị" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-deviceLocation">Vị trí thiết bị</Label>
            <Select 
              value={deviceData.deviceLocationId} 
              onValueChange={(value) => setDeviceData({ ...deviceData, deviceLocationId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vị trí thiết bị" />
              </SelectTrigger>
              <SelectContent>
                {deviceLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-deviceStatus">Trạng thái thiết bị</Label>
            <Select 
              value={deviceData.deviceStatusId} 
              onValueChange={(value) => setDeviceData({ ...deviceData, deviceStatusId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái thiết bị" />
              </SelectTrigger>
              <SelectContent>
                {deviceStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-employee">Nhân viên quản lý</Label>
            <Select 
              value={deviceData.employeeId} 
              onValueChange={(value) => setDeviceData({ ...deviceData, employeeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên quản lý" />
              </SelectTrigger>
              <SelectContent>
                {allEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>
    </div>
  );
};

export default Devices;
