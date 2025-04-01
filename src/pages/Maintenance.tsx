
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { getFullMaintenance, getFullDevices } from "@/data/mockData";
import { Pencil, Trash } from "lucide-react";
import { Maintenance, MaintenanceStatus, Device } from "@/types";

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState(getFullMaintenance());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const { toast } = useToast();
  const devices = getFullDevices();

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

    // Validation
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

    const device = devices.find(dev => dev.id === maintenanceData.deviceId);

    const newMaintenance: Maintenance = {
      id: maintenanceData.id as string,
      date: maintenanceData.date as string,
      frequency: maintenanceData.frequency as string,
      content: maintenanceData.content as string,
      status: maintenanceData.status as MaintenanceStatus,
      deviceId: maintenanceData.deviceId as string,
      device: device as Device,
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

    const device = devices.find(dev => dev.id === maintenanceData.deviceId);

    const updatedMaintenance: Maintenance = {
      ...selectedMaintenance,
      date: maintenanceData.date as string,
      frequency: maintenanceData.frequency as string,
      content: maintenanceData.content as string,
      status: maintenanceData.status as MaintenanceStatus,
      deviceId: maintenanceData.deviceId as string,
      device: device as Device,
    };

    setMaintenances(maintenances.map(maintenance =>
      maintenance.id === selectedMaintenance.id ? updatedMaintenance : maintenance
    ));

    setIsEditDialogOpen(false);

    toast({
      title: "Thành công",
      description: "Cập nhật thông tin bảo trì thành công",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch bảo trì này không?")) {
      setMaintenances(maintenances.filter(item => item.id !== id));
      toast({
        title: "Thành công",
        description: "Xóa lịch bảo trì thành công",
      });
    }
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
      header: "Mã Bảo Trì",
      accessorKey: "id" as keyof Maintenance,
      enableSorting: true,
    },
    {
      header: "Thiết Bị",
      accessorKey: (row: Maintenance) => {
        const device = devices.find(d => d.id === row.deviceId);
        return device ? device.name : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Ngày Bảo Trì",
      accessorKey: "date" as keyof Maintenance,
      enableSorting: true,
    },
    {
      header: "Tần Suất",
      accessorKey: "frequency" as keyof Maintenance,
      enableSorting: true,
    },
    {
      header: "Nội Dung",
      accessorKey: "content" as keyof Maintenance,
      enableSorting: false,
    },
    {
      header: "Trạng Thái",
      accessorKey: (row: Maintenance) => (
        <StatusBadge status={row.status} />
      ),
      enableSorting: true,
    },
    {
      header: "Thao Tác",
      accessorKey: (row: Maintenance) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
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
              placeholder="Ví dụ: 3 tháng/lần"
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
        </div>
      </FormDialog>

      <FormDialog
        title="Chỉnh sửa thông tin bảo trì"
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
              placeholder="Ví dụ: 3 tháng/lần"
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
        </div>
      </FormDialog>
    </div>
  );
};

export default Maintenance;
