
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  getFullRepairs, 
  getFullDevices, 
  contractTypes, 
  getFullEmployees, 
  suppliers 
} from "@/data/mockData";
import { Repair, RepairStatus, Device, Employee, Supplier, ContractType } from "@/types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const Repairs = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [repairs, setRepairs] = useState<Repair[]>(getFullRepairs());
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const devices = getFullDevices();
  const employees = getFullEmployees();

  // Form state
  const [repairData, setRepairData] = useState<Partial<Repair>>({
    id: "",
    repairDate: "",
    notes: "",
    status: "chưa sửa chữa",
    cost: 0,
    contractTypeId: "",
    deviceId: "",
    employeeId: "",
    supplierId: "",
  });

  const handleAddRepair = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repairData.id || !repairData.repairDate || !repairData.deviceId || !repairData.employeeId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin sửa chữa",
        variant: "destructive",
      });
      return;
    }

    // Check if repair ID already exists
    if (repairs.some(repair => repair.id === repairData.id)) {
      toast({
        title: "Lỗi",
        description: "Mã sửa chữa đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const device = devices.find(dev => dev.id === repairData.deviceId);
    const employee = employees.find(emp => emp.id === repairData.employeeId);
    const supplier = suppliers.find(sup => sup.id === repairData.supplierId);
    const contractType = contractTypes.find(type => type.id === repairData.contractTypeId);

    const newRepair: Repair = {
      id: repairData.id as string,
      repairDate: repairData.repairDate as string,
      notes: repairData.notes as string,
      status: repairData.status as RepairStatus,
      cost: repairData.cost as number,
      contractTypeId: repairData.contractTypeId as string,
      deviceId: repairData.deviceId as string,
      employeeId: repairData.employeeId as string,
      supplierId: repairData.supplierId as string,
      device: device as Device,
      employee: employee as Employee,
      supplier: supplier as Supplier,
      contractType: contractType as ContractType,
    };

    setRepairs([...repairs, newRepair]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Thêm hợp đồng sửa chữa mới thành công",
    });

    // Reset form
    setRepairData({
      id: "",
      repairDate: "",
      notes: "",
      status: "chưa sửa chữa",
      cost: 0,
      contractTypeId: "",
      deviceId: "",
      employeeId: "",
      supplierId: "",
    });
  };

  const handleEditRepair = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRepair || !repairData.repairDate || !repairData.deviceId || !repairData.employeeId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin sửa chữa",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const device = devices.find(dev => dev.id === repairData.deviceId);
    const employee = employees.find(emp => emp.id === repairData.employeeId);
    const supplier = suppliers.find(sup => sup.id === repairData.supplierId);
    const contractType = contractTypes.find(type => type.id === repairData.contractTypeId);

    const updatedRepair: Repair = {
      ...selectedRepair,
      repairDate: repairData.repairDate as string,
      notes: repairData.notes as string,
      status: repairData.status as RepairStatus,
      cost: repairData.cost as number,
      contractTypeId: repairData.contractTypeId as string,
      deviceId: repairData.deviceId as string,
      employeeId: repairData.employeeId as string,
      supplierId: repairData.supplierId as string,
      device: device as Device,
      employee: employee as Employee,
      supplier: supplier as Supplier,
      contractType: contractType as ContractType,
    };

    setRepairs(repairs.map(repair => 
      repair.id === selectedRepair.id ? updatedRepair : repair
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Cập nhật thông tin sửa chữa thành công",
    });
  };

  const handleRowClick = (repair: Repair) => {
    setSelectedRepair(repair);
    setRepairData({
      id: repair.id,
      repairDate: repair.repairDate,
      notes: repair.notes,
      status: repair.status,
      cost: repair.cost,
      contractTypeId: repair.contractTypeId,
      deviceId: repair.deviceId,
      employeeId: repair.employeeId,
      supplierId: repair.supplierId,
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
      header: "Ngày sửa chữa",
      accessorKey: "repairDate",
      enableSorting: true,
    },
    {
      header: "Ghi chú",
      accessorKey: "notes",
      enableSorting: false,
    },
    {
      header: "Trạng thái",
      accessorKey: (repair: Repair) => (
        <StatusBadge status={repair.status} />
      ),
      enableSorting: false,
    },
    {
      header: "Chi phí",
      accessorKey: (repair: Repair) => formatCurrency(repair.cost),
      enableSorting: false,
    },
    {
      header: "Loại hợp đồng",
      accessorKey: (repair: Repair) => repair.contractType?.name || "-",
      enableSorting: false,
    },
    {
      header: "Thiết bị",
      accessorKey: (repair: Repair) => repair.device?.name || "-",
      enableSorting: false,
    },
    {
      header: "Nhân viên",
      accessorKey: (repair: Repair) => repair.employee?.name || "-",
      enableSorting: false,
    },
    {
      header: "Nhà cung cấp",
      accessorKey: (repair: Repair) => repair.supplier?.name || "-",
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý sửa chữa</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Thêm hợp đồng sửa chữa</Button>
      </div>

      <DataTable
        data={repairs}
        columns={columns}
        onRowClick={handleRowClick}
        searchField="notes"
      />

      {/* Add Repair Dialog */}
      <FormDialog
        title="Thêm hợp đồng sửa chữa mới"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddRepair}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Mã sửa chữa</Label>
            <Input
              id="id"
              value={repairData.id}
              onChange={(e) => setRepairData({ ...repairData, id: e.target.value })}
              placeholder="Ví dụ: R006"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="repairDate">Ngày sửa chữa</Label>
            <Input
              id="repairDate"
              type="date"
              value={repairData.repairDate}
              onChange={(e) => setRepairData({ ...repairData, repairDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={repairData.notes}
              onChange={(e) => setRepairData({ ...repairData, notes: e.target.value })}
              placeholder="Nhập ghi chú sửa chữa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select 
              value={repairData.status} 
              onValueChange={(value: RepairStatus) => setRepairData({ ...repairData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="đã sửa chữa">Đã sửa chữa</SelectItem>
                <SelectItem value="chưa sửa chữa">Chưa sửa chữa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="cost">Chi phí</Label>
            <Input
              id="cost"
              type="number"
              value={repairData.cost}
              onChange={(e) => setRepairData({ ...repairData, cost: parseFloat(e.target.value) })}
              placeholder="Nhập chi phí sửa chữa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contractTypeId">Loại hợp đồng</Label>
            <Select 
              value={repairData.contractTypeId} 
              onValueChange={(value) => setRepairData({ ...repairData, contractTypeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại hợp đồng" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deviceId">Thiết bị</Label>
            <Select 
              value={repairData.deviceId} 
              onValueChange={(value) => setRepairData({ ...repairData, deviceId: value })}
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
            <Label htmlFor="employeeId">Nhân viên</Label>
            <Select 
              value={repairData.employeeId} 
              onValueChange={(value) => setRepairData({ ...repairData, employeeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="supplierId">Nhà cung cấp</Label>
            <Select 
              value={repairData.supplierId} 
              onValueChange={(value) => setRepairData({ ...repairData, supplierId: value })}
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

      {/* Edit Repair Dialog */}
      <FormDialog
        title="Chỉnh sửa thông tin sửa chữa"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditRepair}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-id">Mã sửa chữa</Label>
            <Input
              id="edit-id"
              value={repairData.id}
              disabled
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-repairDate">Ngày sửa chữa</Label>
            <Input
              id="edit-repairDate"
              type="date"
              value={repairData.repairDate}
              onChange={(e) => setRepairData({ ...repairData, repairDate: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-notes">Ghi chú</Label>
            <Textarea
              id="edit-notes"
              value={repairData.notes}
              onChange={(e) => setRepairData({ ...repairData, notes: e.target.value })}
              placeholder="Nhập ghi chú sửa chữa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-status">Trạng thái</Label>
            <Select 
              value={repairData.status} 
              onValueChange={(value: RepairStatus) => setRepairData({ ...repairData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="đã sửa chữa">Đã sửa chữa</SelectItem>
                <SelectItem value="chưa sửa chữa">Chưa sửa chữa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-cost">Chi phí</Label>
            <Input
              id="edit-cost"
              type="number"
              value={repairData.cost}
              onChange={(e) => setRepairData({ ...repairData, cost: parseFloat(e.target.value) })}
              placeholder="Nhập chi phí sửa chữa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-contractTypeId">Loại hợp đồng</Label>
            <Select 
              value={repairData.contractTypeId} 
              onValueChange={(value) => setRepairData({ ...repairData, contractTypeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại hợp đồng" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-deviceId">Thiết bị</Label>
            <Select 
              value={repairData.deviceId} 
              onValueChange={(value) => setRepairData({ ...repairData, deviceId: value })}
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
            <Label htmlFor="edit-employeeId">Nhân viên</Label>
            <Select 
              value={repairData.employeeId} 
              onValueChange={(value) => setRepairData({ ...repairData, employeeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-supplierId">Nhà cung cấp</Label>
            <Select 
              value={repairData.supplierId} 
              onValueChange={(value) => setRepairData({ ...repairData, supplierId: value })}
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

export default Repairs;
