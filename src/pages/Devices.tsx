
import React, { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { devices, deviceTypes, deviceLocations } from "@/data/mockData";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import type { ReactNode } from "react";
import type { Device, DeviceCondition } from "@/types";

interface DeviceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Device) => void;
  initialData?: Device;
  isEdit?: boolean;
  isLoading?: boolean;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isEdit = false,
  isLoading = false 
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [deviceTypeId, setDeviceTypeId] = useState(initialData?.deviceTypeId || "");
  const [deviceLocationId, setDeviceLocationId] = useState(initialData?.deviceLocationId || "");
  const [deviceStatusId, setDeviceStatusId] = useState(initialData?.deviceStatusId || "1"); // Default to "Đang sử dụng"
  const [value, setValue] = useState(initialData?.value.toString() || "");
  const [purchaseDate, setPurchaseDate] = useState(initialData?.purchaseDate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDevice: Device = {
      id: initialData?.id || Math.random().toString(36).substring(7),
      name,
      deviceTypeId,
      deviceLocationId,
      deviceStatusId,
      employeeId: initialData?.employeeId || "E001", // Default employee
      value: parseFloat(value),
      purchaseDate,
    };
    onSubmit(newDevice);
    onOpenChange(false);
    toast.success(isEdit ? "Thiết bị đã được cập nhật thành công!" : "Thiết bị đã được thêm thành công!");
  };

  return (
    <FormDialog
      title={isEdit ? "Cập Nhật Thiết Bị" : "Thêm Thiết Bị"}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="name" className="text-right">
            Tên Thiết Bị
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="deviceType" className="text-right">
            Loại Thiết Bị
          </label>
          <Select onValueChange={setDeviceTypeId} defaultValue={deviceTypeId}>
            <SelectTrigger className="col-span-3">
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
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="location" className="text-right">
            Vị Trí
          </label>
          <Select onValueChange={setDeviceLocationId} defaultValue={deviceLocationId}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn vị trí" />
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
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="deviceStatus" className="text-right">
            Trạng Thái
          </label>
          <Select onValueChange={setDeviceStatusId} defaultValue={deviceStatusId}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Đang sử dụng</SelectItem>
              <SelectItem value="2">Bảo trì</SelectItem>
              <SelectItem value="3">Sửa chữa</SelectItem>
              <SelectItem value="5">Hỏng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="value" className="text-right">
            Giá Trị
          </label>
          <Input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="purchaseDate" className="text-right">
            Ngày Mua
          </label>
          <Input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
    </FormDialog>
  );
};

const Devices = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [data, setData] = useState([...devices]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = (device: Device) => {
    setData([...data, device]);
  };

  const handleEdit = (device: Device) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(data.map(item => item.id === device.id ? device : item));
      setIsLoading(false);
    }, 500);
  };

  const handleDelete = () => {
    if (selectedDevice) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setData(data.filter(item => item.id !== selectedDevice.id));
        setDeleteDialogOpen(false);
        setIsLoading(false);
        toast.success("Thiết bị đã được xóa thành công!");
      }, 500);
    }
  };

  const columns = [
    {
      header: "Mã Thiết Bị",
      accessorKey: "id" as keyof Device,
      enableSorting: true,
    },
    {
      header: "Tên Thiết Bị",
      accessorKey: "name" as keyof Device,
      enableSorting: true,
    },
    {
      header: "Loại Thiết Bị",
      accessorKey: (row: Device) => {
        const deviceType = deviceTypes.find(dt => dt.id === row.deviceTypeId);
        return deviceType ? deviceType.name : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Vị Trí",
      accessorKey: (row: Device) => {
        const location = deviceLocations.find(l => l.id === row.deviceLocationId);
        return location ? location.name : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Trạng Thái",
      accessorKey: (row: Device) => {
        const condition: DeviceCondition = row.deviceStatusId === "2" ? "bảo trì" : 
                               row.deviceStatusId === "3" ? "sửa chữa" : 
                               row.deviceStatusId === "5" ? "hỏng" : "tốt";
        return <StatusBadge status={condition} />;
      },
      enableSorting: true,
    },
    {
      header: "Giá Trị",
      accessorKey: (row: Device) => `${row.value.toLocaleString()} VND`,
      enableSorting: true,
    },
    {
      header: "Ngày Mua",
      accessorKey: "purchaseDate" as keyof Device,
      enableSorting: true,
    },
    {
      header: "Thao Tác",
      accessorKey: (row: Device) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDevice(row);
              setEditDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDevice(row);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Danh Sách Thiết Bị</h1>
        <Button onClick={() => setAddDialogOpen(true)}>Thêm Thiết Bị</Button>
      </div>
      <DataTable columns={columns} data={data} />
      
      {/* Add Device Dialog */}
      <DeviceForm 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onSubmit={handleCreate} 
      />
      
      {/* Edit Device Dialog */}
      {selectedDevice && (
        <DeviceForm 
          open={editDialogOpen} 
          onOpenChange={setEditDialogOpen} 
          onSubmit={handleEdit}
          initialData={selectedDevice}
          isEdit
          isLoading={isLoading}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thiết bị này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Devices;
