
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getFullRepairHistories, getFullDevices, getFullEmployees, contractTypes } from "@/data/mockData";
import { RepairHistory, Device, Employee, ContractType } from "@/types";

const RepairHistory = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [repairHistories, setRepairHistories] = useState<RepairHistory[]>(getFullRepairHistories());
  const [selectedRepairHistory, setSelectedRepairHistory] = useState<RepairHistory | null>(null);
  const devices = getFullDevices();
  const employees = getFullEmployees();

  // Form state
  const [repairHistoryData, setRepairHistoryData] = useState<Partial<RepairHistory>>({
    id: "",
    notes: "",
    contractTypeId: "",
    employeeId: "",
    deviceId: "",
  });

  const handleAddRepairHistory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repairHistoryData.id || !repairHistoryData.notes || !repairHistoryData.deviceId || !repairHistoryData.employeeId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin lịch sử sửa chữa",
        variant: "destructive",
      });
      return;
    }

    // Check if repairHistory ID already exists
    if (repairHistories.some(history => history.id === repairHistoryData.id)) {
      toast({
        title: "Lỗi",
        description: "Mã lịch sử sửa chữa đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const device = devices.find(dev => dev.id === repairHistoryData.deviceId);
    const employee = employees.find(emp => emp.id === repairHistoryData.employeeId);
    const contractType = contractTypes.find(type => type.id === repairHistoryData.contractTypeId);

    const newRepairHistory: RepairHistory = {
      id: repairHistoryData.id as string,
      notes: repairHistoryData.notes as string,
      contractTypeId: repairHistoryData.contractTypeId as string,
      employeeId: repairHistoryData.employeeId as string,
      deviceId: repairHistoryData.deviceId as string,
      device: device as Device,
      employee: employee as Employee,
      contractType: contractType as ContractType,
    };

    setRepairHistories([...repairHistories, newRepairHistory]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Thêm lịch sử sửa chữa mới thành công",
    });

    // Reset form
    setRepairHistoryData({
      id: "",
      notes: "",
      contractTypeId: "",
      employeeId: "",
      deviceId: "",
    });
  };

  const handleEditRepairHistory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRepairHistory || !repairHistoryData.notes || !repairHistoryData.deviceId || !repairHistoryData.employeeId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin lịch sử sửa chữa",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const device = devices.find(dev => dev.id === repairHistoryData.deviceId);
    const employee = employees.find(emp => emp.id === repairHistoryData.employeeId);
    const contractType = contractTypes.find(type => type.id === repairHistoryData.contractTypeId);

    const updatedRepairHistory: RepairHistory = {
      ...selectedRepairHistory,
      notes: repairHistoryData.notes as string,
      contractTypeId: repairHistoryData.contractTypeId as string,
      employeeId: repairHistoryData.employeeId as string,
      deviceId: repairHistoryData.deviceId as string,
      device: device as Device,
      employee: employee as Employee,
      contractType: contractType as ContractType,
    };

    setRepairHistories(repairHistories.map(history => 
      history.id === selectedRepairHistory.id ? updatedRepairHistory : history
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Cập nhật thông tin lịch sử sửa chữa thành công",
    });
  };

  const handleRowClick = (repairHistory: RepairHistory) => {
    setSelectedRepairHistory(repairHistory);
    setRepairHistoryData({
      id: repairHistory.id,
      notes: repairHistory.notes,
      contractTypeId: repairHistory.contractTypeId,
      employeeId: repairHistory.employeeId,
      deviceId: repairHistory.deviceId,
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
      header: "Ghi chú",
      accessorKey: "notes",
      enableSorting: false,
    },
    {
      header: "Loại hợp đồng",
      accessorKey: (history: RepairHistory) => history.contractType?.name || "-",
      enableSorting: false,
    },
    {
      header: "Thiết bị",
      accessorKey: (history: RepairHistory) => history.device?.name || "-",
      enableSorting: false,
    },
    {
      header: "Nhân viên",
      accessorKey: (history: RepairHistory) => history.employee?.name || "-",
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lịch sử sửa chữa</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Thêm lịch sử</Button>
      </div>

      <DataTable
        data={repairHistories}
        columns={columns}
        onRowClick={handleRowClick}
        searchField="notes"
      />

      {/* Add RepairHistory Dialog */}
      <FormDialog
        title="Thêm lịch sử sửa chữa mới"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddRepairHistory}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Mã lịch sử</Label>
            <Input
              id="id"
              value={repairHistoryData.id}
              onChange={(e) => setRepairHistoryData({ ...repairHistoryData, id: e.target.value })}
              placeholder="Ví dụ: RH006"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={repairHistoryData.notes}
              onChange={(e) => setRepairHistoryData({ ...repairHistoryData, notes: e.target.value })}
              placeholder="Nhập ghi chú sửa chữa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="contractTypeId">Loại hợp đồng</Label>
            <Select 
              value={repairHistoryData.contractTypeId} 
              onValueChange={(value) => setRepairHistoryData({ ...repairHistoryData, contractTypeId: value })}
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
              value={repairHistoryData.deviceId} 
              onValueChange={(value) => setRepairHistoryData({ ...repairHistoryData, deviceId: value })}
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
              value={repairHistoryData.employeeId} 
              onValueChange={(value) => setRepairHistoryData({ ...repairHistoryData, employeeId: value })}
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
        </div>
      </FormDialog>

      {/* Edit RepairHistory Dialog */}
      <FormDialog
        title="Chỉnh sửa lịch sử sửa chữa"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditRepairHistory}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-id">Mã lịch sử</Label>
            <Input
              id="edit-id"
              value={repairHistoryData.id}
              disabled
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-notes">Ghi chú</Label>
            <Textarea
              id="edit-notes"
              value={repairHistoryData.notes}
              onChange={(e) => setRepairHistoryData({ ...repairHistoryData, notes: e.target.value })}
              placeholder="Nhập ghi chú sửa chữa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-contractTypeId">Loại hợp đồng</Label>
            <Select 
              value={repairHistoryData.contractTypeId} 
              onValueChange={(value) => setRepairHistoryData({ ...repairHistoryData, contractTypeId: value })}
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
              value={repairHistoryData.deviceId} 
              onValueChange={(value) => setRepairHistoryData({ ...repairHistoryData, deviceId: value })}
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
              value={repairHistoryData.employeeId} 
              onValueChange={(value) => setRepairHistoryData({ ...repairHistoryData, employeeId: value })}
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
        </div>
      </FormDialog>
    </div>
  );
};

export default RepairHistory;
