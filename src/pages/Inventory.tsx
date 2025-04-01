
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { getFullInventories, getFullDevices } from "@/data/mockData";
import { Inventory, Device, DeviceCondition } from "@/types";

const Inventory = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [inventories, setInventories] = useState<Inventory[]>(getFullInventories());
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const devices = getFullDevices();

  // Form state
  const [inventoryData, setInventoryData] = useState<Partial<Inventory>>({
    id: "",
    checkDate: "",
    condition: "tốt",
    deviceId: "",
  });

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inventoryData.id || !inventoryData.checkDate || !inventoryData.deviceId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin kiểm kê",
        variant: "destructive",
      });
      return;
    }

    // Check if inventory ID already exists
    if (inventories.some(inventory => inventory.id === inventoryData.id)) {
      toast({
        title: "Lỗi",
        description: "Mã kiểm kê đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    // Find device
    const device = devices.find(device => device.id === inventoryData.deviceId);

    const newInventory: Inventory = {
      id: inventoryData.id as string,
      checkDate: inventoryData.checkDate as string,
      condition: inventoryData.condition as DeviceCondition,
      deviceId: inventoryData.deviceId as string,
      device: device,
    };

    setInventories([...inventories, newInventory]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Thêm kiểm kê mới thành công",
    });

    // Reset form
    setInventoryData({
      id: "",
      checkDate: "",
      condition: "tốt",
      deviceId: "",
    });
  };

  const handleEditInventory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInventory || !inventoryData.checkDate || !inventoryData.deviceId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin kiểm kê",
        variant: "destructive",
      });
      return;
    }

    // Find device
    const device = devices.find(device => device.id === inventoryData.deviceId);

    const updatedInventory: Inventory = {
      ...selectedInventory,
      checkDate: inventoryData.checkDate as string,
      condition: inventoryData.condition as DeviceCondition,
      deviceId: inventoryData.deviceId as string,
      device: device,
    };

    setInventories(inventories.map(inventory => 
      inventory.id === selectedInventory.id ? updatedInventory : inventory
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Cập nhật kiểm kê thành công",
    });
  };

  const handleRowClick = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setInventoryData({
      id: inventory.id,
      checkDate: inventory.checkDate,
      condition: inventory.condition,
      deviceId: inventory.deviceId,
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
      header: "Ngày kiểm",
      accessorKey: "checkDate",
      enableSorting: true,
    },
    {
      header: "Tình trạng",
      accessorKey: (inventory: Inventory) => (
        <StatusBadge status={inventory.condition} />
      ),
      enableSorting: false,
    },
    {
      header: "Thiết bị",
      accessorKey: (inventory: Inventory) => inventory.device?.name || "-",
      enableSorting: false,
    },
    {
      header: "Loại thiết bị",
      accessorKey: (inventory: Inventory) => inventory.device?.deviceType?.name || "-",
      enableSorting: false,
    },
    {
      header: "Vị trí",
      accessorKey: (inventory: Inventory) => inventory.device?.deviceLocation?.name || "-",
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý kiểm kê</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Thêm kiểm kê</Button>
      </div>

      <DataTable
        data={inventories}
        columns={columns}
        onRowClick={handleRowClick}
        searchField="id"
      />

      {/* Add Inventory Dialog */}
      <FormDialog
        title="Thêm kiểm kê mới"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddInventory}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Mã kiểm kê</Label>
            <Input
              id="id"
              value={inventoryData.id}
              onChange={(e) => setInventoryData({ ...inventoryData, id: e.target.value })}
              placeholder="Ví dụ: I006"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="checkDate">Ngày kiểm</Label>
            <Input
              id="checkDate"
              type="date"
              value={inventoryData.checkDate}
              onChange={(e) => setInventoryData({ ...inventoryData, checkDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="condition">Tình trạng</Label>
            <Select 
              value={inventoryData.condition} 
              onValueChange={(value: DeviceCondition) => setInventoryData({ ...inventoryData, condition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tốt">Tốt</SelectItem>
                <SelectItem value="hỏng">Hỏng</SelectItem>
                <SelectItem value="bảo trì">Cần bảo trì</SelectItem>
                <SelectItem value="sửa chữa">Cần sửa chữa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deviceId">Thiết bị</Label>
            <Select 
              value={inventoryData.deviceId} 
              onValueChange={(value) => setInventoryData({ ...inventoryData, deviceId: value })}
            >
              <SelectTrigger>
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
        </div>
      </FormDialog>

      {/* Edit Inventory Dialog */}
      <FormDialog
        title="Chỉnh sửa kiểm kê"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditInventory}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-id">Mã kiểm kê</Label>
            <Input
              id="edit-id"
              value={inventoryData.id}
              disabled
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-checkDate">Ngày kiểm</Label>
            <Input
              id="edit-checkDate"
              type="date"
              value={inventoryData.checkDate}
              onChange={(e) => setInventoryData({ ...inventoryData, checkDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-condition">Tình trạng</Label>
            <Select 
              value={inventoryData.condition} 
              onValueChange={(value: DeviceCondition) => setInventoryData({ ...inventoryData, condition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tốt">Tốt</SelectItem>
                <SelectItem value="hỏng">Hỏng</SelectItem>
                <SelectItem value="bảo trì">Cần bảo trì</SelectItem>
                <SelectItem value="sửa chữa">Cần sửa chữa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-deviceId">Thiết bị</Label>
            <Select 
              value={inventoryData.deviceId} 
              onValueChange={(value) => setInventoryData({ ...inventoryData, deviceId: value })}
            >
              <SelectTrigger>
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
        </div>
      </FormDialog>
    </div>
  );
};

export default Inventory;
