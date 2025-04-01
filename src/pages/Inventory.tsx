
import React, { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { inventories, devices } from "@/data/mockData";
import { toast } from "sonner";
import type { ReactNode } from "react";
import type { Inventory, DeviceCondition } from "@/types";

interface InventoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Inventory) => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const [deviceId, setDeviceId] = useState("");
  const [checkDate, setCheckDate] = useState("");
  const [condition, setCondition] = useState<DeviceCondition>("tốt");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newInventory: Inventory = {
      id: Math.random().toString(36).substring(7),
      deviceId: deviceId,
      checkDate: checkDate,
      condition: condition,
      notes: notes,
    };

    onSubmit(newInventory);
    setIsLoading(false);
    onOpenChange(false);
    toast.success("Thêm kiểm kê thành công!");
  };

  return (
    <FormDialog
      title="Thêm Kiểm Kê"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="deviceId" className="text-right">
            Thiết Bị
          </label>
          <Select onValueChange={setDeviceId} defaultValue={deviceId} >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn thiết bị" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="date" className="text-right">
            Ngày Kiểm
          </label>
          <Input
            type="date"
            id="date"
            className="col-span-3"
            value={checkDate}
            onChange={(e) => setCheckDate(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="condition" className="text-right">
            Tình Trạng
          </label>
          <Select 
            onValueChange={(value: DeviceCondition) => setCondition(value)} 
            defaultValue={condition}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tốt">Tốt</SelectItem>
              <SelectItem value="hỏng">Hỏng</SelectItem>
              <SelectItem value="bảo trì">Bảo trì</SelectItem>
              <SelectItem value="sửa chữa">Sửa chữa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="notes" className="text-right">
            Ghi Chú
          </label>
          <Input
            type="text"
            id="notes"
            className="col-span-3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </FormDialog>
  );
};

const Inventory = () => {
  const [data, setData] = useState([...inventories]);
  const [open, setOpen] = useState(false);

  const handleCreate = (inventory: Inventory) => {
    setData([...data, inventory]);
  };

  // Update column definitions to use proper typing
  const columns = [
    {
      header: "Mã Kiểm Kê",
      accessorKey: "id" as keyof Inventory,
      enableSorting: true,
    },
    {
      header: "Thiết Bị",
      accessorKey: (row: Inventory) => {
        const device = devices.find(d => d.id === row.deviceId);
        return device ? device.name : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Ngày Kiểm",
      accessorKey: "checkDate" as keyof Inventory,
      enableSorting: true,
    },
    {
      header: "Tình Trạng",
      accessorKey: (row: Inventory) => (
        <StatusBadge status={row.condition} />
      ),
      enableSorting: true,
    },
    {
      header: "Ghi Chú",
      accessorKey: "notes" as keyof Inventory,
      enableSorting: false,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kiểm Kê</h1>
        <Button onClick={() => setOpen(true)}>Thêm Kiểm Kê</Button>
      </div>
      <div className="py-4">
        <DataTable columns={columns} data={data} />
      </div>
      <InventoryForm open={open} onOpenChange={setOpen} onSubmit={handleCreate} />
    </div>
  );
};

export default Inventory;
