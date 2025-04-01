
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getFullWarranties, getFullDevices, suppliers } from "@/data/mockData";
import { Warranty, Device, Supplier } from "@/types";

const Warranty = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [warranties, setWarranties] = useState<Warranty[]>(getFullWarranties());
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const devices = getFullDevices();

  // Form state
  const [warrantyData, setWarrantyData] = useState<Partial<Warranty>>({
    id: "",
    startDate: "",
    endDate: "",
    conditions: "",
    deviceId: "",
    supplierId: "",
  });

  const handleAddWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!warrantyData.id || !warrantyData.startDate || !warrantyData.endDate || !warrantyData.deviceId || !warrantyData.supplierId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bảo hành",
        variant: "destructive",
      });
      return;
    }

    // Check if warranty ID already exists
    if (warranties.some(warranty => warranty.id === warrantyData.id)) {
      toast({
        title: "Lỗi",
        description: "Mã bảo hành đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const device = devices.find(dev => dev.id === warrantyData.deviceId);
    const supplier = suppliers.find(sup => sup.id === warrantyData.supplierId);

    const newWarranty: Warranty = {
      id: warrantyData.id as string,
      startDate: warrantyData.startDate as string,
      endDate: warrantyData.endDate as string,
      conditions: warrantyData.conditions as string,
      deviceId: warrantyData.deviceId as string,
      supplierId: warrantyData.supplierId as string,
      device: device as Device,
      supplier: supplier as Supplier,
    };

    setWarranties([...warranties, newWarranty]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Thêm bảo hành mới thành công",
    });

    // Reset form
    setWarrantyData({
      id: "",
      startDate: "",
      endDate: "",
      conditions: "",
      deviceId: "",
      supplierId: "",
    });
  };

  const handleEditWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWarranty || !warrantyData.startDate || !warrantyData.endDate || !warrantyData.deviceId || !warrantyData.supplierId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bảo hành",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const device = devices.find(dev => dev.id === warrantyData.deviceId);
    const supplier = suppliers.find(sup => sup.id === warrantyData.supplierId);

    const updatedWarranty: Warranty = {
      ...selectedWarranty,
      startDate: warrantyData.startDate as string,
      endDate: warrantyData.endDate as string,
      conditions: warrantyData.conditions as string,
      deviceId: warrantyData.deviceId as string,
      supplierId: warrantyData.supplierId as string,
      device: device as Device,
      supplier: supplier as Supplier,
    };

    setWarranties(warranties.map(warranty => 
      warranty.id === selectedWarranty.id ? updatedWarranty : warranty
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Cập nhật thông tin bảo hành thành công",
    });
  };

  const handleRowClick = (warranty: Warranty) => {
    setSelectedWarranty(warranty);
    setWarrantyData({
      id: warranty.id,
      startDate: warranty.startDate,
      endDate: warranty.endDate,
      conditions: warranty.conditions,
      deviceId: warranty.deviceId,
      supplierId: warranty.supplierId,
    });
    setIsEditDialogOpen(true);
  };

  const isWarrantyExpired = (endDate: string) => {
    const today = new Date();
    const warrantyEndDate = new Date(endDate);
    return warrantyEndDate < today;
  };

  const columns = [
    {
      header: "Mã",
      accessorKey: "id",
      enableSorting: true,
    },
    {
      header: "Ngày bắt đầu",
      accessorKey: "startDate",
      enableSorting: true,
    },
    {
      header: "Ngày kết thúc",
      accessorKey: "endDate",
      enableSorting: true,
    },
    {
      header: "Trạng thái",
      accessorKey: (warranty: Warranty) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          isWarrantyExpired(warranty.endDate) 
            ? "bg-red-100 text-red-800 border-red-200" 
            : "bg-green-100 text-green-800 border-green-200"
        }`}>
          {isWarrantyExpired(warranty.endDate) ? "Hết hạn" : "Còn hiệu lực"}
        </span>
      ),
      enableSorting: false,
    },
    {
      header: "Điều kiện",
      accessorKey: "conditions",
      enableSorting: false,
    },
    {
      header: "Thiết bị",
      accessorKey: (warranty: Warranty) => warranty.device?.name || "-",
      enableSorting: false,
    },
    {
      header: "Nhà cung cấp",
      accessorKey: (warranty: Warranty) => warranty.supplier?.name || "-",
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý bảo hành</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Thêm bảo hành</Button>
      </div>

      <DataTable
        data={warranties}
        columns={columns}
        onRowClick={handleRowClick}
        searchField="conditions"
      />

      {/* Add Warranty Dialog */}
      <FormDialog
        title="Thêm bảo hành mới"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddWarranty}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Mã bảo hành</Label>
            <Input
              id="id"
              value={warrantyData.id}
              onChange={(e) => setWarrantyData({ ...warrantyData, id: e.target.value })}
              placeholder="Ví dụ: W006"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="startDate">Ngày bắt đầu</Label>
            <Input
              id="startDate"
              type="date"
              value={warrantyData.startDate}
              onChange={(e) => setWarrantyData({ ...warrantyData, startDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="endDate">Ngày kết thúc</Label>
            <Input
              id="endDate"
              type="date"
              value={warrantyData.endDate}
              onChange={(e) => setWarrantyData({ ...warrantyData, endDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="conditions">Điều kiện</Label>
            <Textarea
              id="conditions"
              value={warrantyData.conditions}
              onChange={(e) => setWarrantyData({ ...warrantyData, conditions: e.target.value })}
              placeholder="Nhập điều kiện bảo hành"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deviceId">Thiết bị</Label>
            <Select 
              value={warrantyData.deviceId} 
              onValueChange={(value) => setWarrantyData({ ...warrantyData, deviceId: value })}
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
          
          <div className="grid gap-2">
            <Label htmlFor="supplierId">Nhà cung cấp</Label>
            <Select 
              value={warrantyData.supplierId} 
              onValueChange={(value) => setWarrantyData({ ...warrantyData, supplierId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhà cung cấp" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      {/* Edit Warranty Dialog */}
      <FormDialog
        title="Chỉnh sửa thông tin bảo hành"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditWarranty}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-id">Mã bảo hành</Label>
            <Input
              id="edit-id"
              value={warrantyData.id}
              disabled
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-startDate">Ngày bắt đầu</Label>
            <Input
              id="edit-startDate"
              type="date"
              value={warrantyData.startDate}
              onChange={(e) => setWarrantyData({ ...warrantyData, startDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-endDate">Ngày kết thúc</Label>
            <Input
              id="edit-endDate"
              type="date"
              value={warrantyData.endDate}
              onChange={(e) => setWarrantyData({ ...warrantyData, endDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-conditions">Điều kiện</Label>
            <Textarea
              id="edit-conditions"
              value={warrantyData.conditions}
              onChange={(e) => setWarrantyData({ ...warrantyData, conditions: e.target.value })}
              placeholder="Nhập điều kiện bảo hành"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-deviceId">Thiết bị</Label>
            <Select 
              value={warrantyData.deviceId} 
              onValueChange={(value) => setWarrantyData({ ...warrantyData, deviceId: value })}
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
          
          <div className="grid gap-2">
            <Label htmlFor="edit-supplierId">Nhà cung cấp</Label>
            <Select 
              value={warrantyData.supplierId} 
              onValueChange={(value) => setWarrantyData({ ...warrantyData, supplierId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhà cung cấp" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
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

export default Warranty;
