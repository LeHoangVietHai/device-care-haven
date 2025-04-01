
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
import { getFullMaintenances, getFullDevices } from "@/data/mockData";
import { Maintenance, Device, MaintenanceStatus } from "@/types";

const Maintenance = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [maintenances, setMaintenances] = useState<Maintenance[]>(getFullMaintenances());
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const devices = getFullDevices();

  // Form state
  const [maintenanceData, setMaintenanceData] = useState<Partial<Maintenance>>({
    id: "",
    date: "",
    frequency: "",
    content: "",
    status: "chưa bảo trì",
    deviceId: "",
  });

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!maintenanceData.id || !maintenanceData.date || !maintenanceData.deviceId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bảo trì",
        variant: "destructive",
      });
      return;
    }

    // Check if maintenance ID already exists
    if (maintenances.some(maintenance => maintenance.id === maintenanceData.id)) {
      toast({
        title: "Lỗi",
        description: "Mã bảo trì đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    // Find device
    const device = devices.find(device => device.id === maintenanceData.deviceId);

    const newMaintenance: Maintenance = {
      id: maintenanceData.id as string,
      date: maintenanceData.date as string,
      frequency: maintenanceData.frequency as string,
      content: maintenanceData.content as string,
      status: maintenanceData.status as MaintenanceStatus,
      deviceId: maintenanceData.deviceId as string,
      device: device,
    };

    setMaintenances([...maintenances, newMaintenance]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Thêm lịch bảo trì mới thành công",
    });

    // Reset form
    setMaintenanceData({
      id: "",
      date: "",
      frequency: "",
      content: "",
      status: "chưa bảo trì",
      deviceId: "",
    });
  };

  const handleEditMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMaintenance || !maintenanceData.date || !maintenanceData.deviceId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bảo trì",
        variant: "destructive",
      });
      return;
    }

    // Find device
    const device = devices.find(device => device.id === maintenanceData.deviceId);

    const updatedMaintenance: Maintenance = {
      ...selectedMaintenance,
      date: maintenanceData.date as string,
      frequency: maintenanceData.frequency as string,
      content: maintenanceData.content as string,
      status: maintenanceData.status as MaintenanceStatus,
      deviceId: maintenanceData.deviceId as string,
      device: device,
    };

    setMaintenances(maintenances.map(maintenance => 
      maintenance.id === selectedMaintenance.id ? updatedMaintenance : maintenance
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Cập nhật lịch bảo trì thành công",
    });
  };

  const handleRowClick = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setMaintenanceData({
      id: maintenance.id,
      date: maintenance.date,
      frequency: maintenance.frequency,
      content: maintenance.content,
      status: maintenance.status,
      deviceId: maintenance.deviceId,
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
      header: "Ngày bảo trì",
      accessorKey: "date",
      enableSorting: true,
    },
    {
      header: "Tần suất",
      accessorKey: "frequency",
      enableSorting: false,
    },
    {
      header: "Nội dung",
      accessorKey: "content",
      enableSorting: false,
    },
    {
      header: "Trạng thái",
      accessorKey: (maintenance: Maintenance) => (
        <StatusBadge status={maintenance.status} />
      ),
      enableSorting: false,
    },
    {
      header: "Thiết bị",
      accessorKey: (maintenance: Maintenance) => maintenance.device?.name || "-",
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý bảo trì</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Thêm lịch bảo trì</Button>
      </div>

      <DataTable
        data={maintenances}
        columns={columns}
        onRowClick={handleRowClick}
        searchField="content"
      />

      {/* Add Maintenance Dialog */}
      <FormDialog
        title="Thêm lịch bảo trì mới"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddMaintenance}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Mã bảo trì</Label>
            <Input
              id="id"
              value={maintenanceData.id}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, id: e.target.value })}
              placeholder="Ví dụ: M006"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Ngày bảo trì</Label>
            <Input
              id="date"
              type="date"
              value={maintenanceData.date}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, date: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="frequency">Tần suất</Label>
            <Input
              id="frequency"
              value={maintenanceData.frequency}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, frequency: e.target.value })}
              placeholder="Ví dụ: 3 tháng"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              value={maintenanceData.content}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, content: e.target.value })}
              placeholder="Nhập nội dung bảo trì"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select 
              value={maintenanceData.status} 
              onValueChange={(value: MaintenanceStatus) => setMaintenanceData({ ...maintenanceData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="đã bảo trì">Đã bảo trì</SelectItem>
                <SelectItem value="chưa bảo trì">Chưa bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="deviceId">Thiết bị</Label>
            <Select 
              value={maintenanceData.deviceId} 
              onValueChange={(value) => setMaintenanceData({ ...maintenanceData, deviceId: value })}
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

      {/* Edit Maintenance Dialog */}
      <FormDialog
        title="Chỉnh sửa lịch bảo trì"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditMaintenance}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-id">Mã bảo trì</Label>
            <Input
              id="edit-id"
              value={maintenanceData.id}
              disabled
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-date">Ngày bảo trì</Label>
            <Input
              id="edit-date"
              type="date"
              value={maintenanceData.date}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, date: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-frequency">Tần suất</Label>
            <Input
              id="edit-frequency"
              value={maintenanceData.frequency}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, frequency: e.target.value })}
              placeholder="Ví dụ: 3 tháng"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-content">Nội dung</Label>
            <Textarea
              id="edit-content"
              value={maintenanceData.content}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, content: e.target.value })}
              placeholder="Nhập nội dung bảo trì"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-status">Trạng thái</Label>
            <Select 
              value={maintenanceData.status} 
              onValueChange={(value: MaintenanceStatus) => setMaintenanceData({ ...maintenanceData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="đã bảo trì">Đã bảo trì</SelectItem>
                <SelectItem value="chưa bảo trì">Chưa bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-deviceId">Thiết bị</Label>
            <Select 
              value={maintenanceData.deviceId} 
              onValueChange={(value) => setMaintenanceData({ ...maintenanceData, deviceId: value })}
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

export default Maintenance;
