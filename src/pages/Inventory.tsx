
import React, { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { Textarea } from "@/components/ui/textarea"; 
import { inventories, devices } from "@/data/mockData";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import type { ReactNode } from "react";
import type { Inventory, DeviceCondition } from "@/types";

interface InventoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Inventory) => void;
  initialData?: Inventory;
  isEdit?: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit = false 
}) => {
  const [deviceId, setDeviceId] = useState(initialData?.deviceId || "");
  const [checkDate, setCheckDate] = useState(initialData?.checkDate || "");
  const [condition, setCondition] = useState<DeviceCondition>(initialData?.condition || "tốt");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const inventoryData: Inventory = {
      id: initialData?.id || Math.random().toString(36).substring(7),
      deviceId: deviceId,
      checkDate: checkDate,
      condition: condition,
    };

    onSubmit(inventoryData);
    setIsLoading(false);
    onOpenChange(false);
    toast.success(isEdit ? "Cập nhật kiểm kê thành công!" : "Thêm kiểm kê thành công!");
  };

  return (
    <FormDialog
      title={isEdit ? "Cập Nhật Kiểm Kê" : "Thêm Kiểm Kê"}
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
      </div>
    </FormDialog>
  );
};

const Inventory = () => {
  const [data, setData] = useState([...inventories]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);

  const handleCreate = (inventory: Inventory) => {
    setData([...data, inventory]);
  };

  const handleEdit = (inventory: Inventory) => {
    setData(data.map(item => item.id === inventory.id ? inventory : item));
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa kiểm kê này không?")) {
      setData(data.filter(item => item.id !== id));
      toast.success("Đã xóa kiểm kê thành công!");
    }
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
      header: "Thao Tác",
      accessorKey: (row: Inventory) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedInventory(row);
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
              handleDelete(row.id);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kiểm Kê</h1>
        <Button onClick={() => setAddDialogOpen(true)}>Thêm Kiểm Kê</Button>
      </div>
      <div className="py-4">
        <DataTable columns={columns} data={data} searchField="id" />
      </div>
      <InventoryForm 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onSubmit={handleCreate} 
      />
      {selectedInventory && (
        <InventoryForm 
          open={editDialogOpen} 
          onOpenChange={setEditDialogOpen} 
          onSubmit={handleEdit} 
          initialData={selectedInventory}
          isEdit
        />
      )}
    </div>
  );
};

export default Inventory;
