import React, { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { format } from "date-fns";
import { devices, deviceTypes, locations } from "@/data/mockData";
import { toast } from "sonner";
import type { ReactNode } from "react";
import type { Device } from "@/types";

interface DeviceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Device) => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const [name, setName] = useState("");
  const [deviceTypeId, setDeviceTypeId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [status, setStatus] = useState("");
  const [value, setValue] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDevice: Device = {
      id: Math.random().toString(36).substring(7),
      name,
      deviceTypeId,
      locationId,
      status,
      value: parseFloat(value),
      purchaseDate,
    };
    onSubmit(newDevice);
    onOpenChange(false);
    toast.success("Thiết bị đã được thêm thành công!");
  };

  return (
    <FormDialog
      title="Thêm Thiết Bị"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
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
          <Select onValueChange={setDeviceTypeId}>
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
          <Select onValueChange={setLocationId}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn vị trí" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="status" className="text-right">
            Trạng Thái
          </label>
          <Select onValueChange={setStatus}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tốt">Tốt</SelectItem>
              <SelectItem value="hỏng">Hỏng</SelectItem>
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
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([...devices]);

  const handleCreate = (device: Device) => {
    setData([...data, device]);
  };

  // Fix column definitions to use proper typing
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
        const location = locations.find(l => l.id === row.locationId);
        return location ? location.name : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Trạng Thái",
      accessorKey: (row: Device) => (
        <StatusBadge status={row.status} />
      ),
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
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Danh Sách Thiết Bị</h1>
        <Button onClick={() => setOpen(true)}>Thêm Thiết Bị</Button>
      </div>
      <DataTable columns={columns} data={data} />
      <DeviceForm open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </div>
  );
};

export default Devices;
