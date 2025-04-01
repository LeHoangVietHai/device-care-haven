
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { maintenances, getFullMaintenances, devices } from "@/data/mockData";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import type { FullMaintenance, Maintenance as MaintenanceType } from "@/types";

interface MaintenanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: MaintenanceType) => void;
  initialData?: MaintenanceType;
  isEdit?: boolean;
  isLoading?: boolean;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isEdit = false,
  isLoading = false
}) => {
  const [deviceId, setDeviceId] = useState(initialData?.deviceId || "");
  const [maintenanceDate, setMaintenanceDate] = useState(initialData?.maintenanceDate || "");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState(initialData?.nextMaintenanceDate || "");
  const [status, setStatus] = useState(initialData?.status || "scheduled");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const maintenanceData: MaintenanceType = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      deviceId,
      maintenanceDate,
      nextMaintenanceDate,
      status,
      notes,
    };
    
    onSubmit(maintenanceData);
  };

  return (
    <FormDialog
      title={isEdit ? "Cập Nhật Bảo Trì" : "Thêm Bảo Trì"}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="device" className="text-right">
            Thiết Bị
          </label>
          <div className="col-span-3">
            <Select onValueChange={setDeviceId} defaultValue={deviceId}>
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
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="maintenanceDate" className="text-right">
            Ngày Bảo Trì
          </label>
          <Input
            id="maintenanceDate"
            type="date"
            value={maintenanceDate}
            onChange={(e) => setMaintenanceDate(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="nextMaintenanceDate" className="text-right">
            Ngày Bảo Trì Tiếp Theo
          </label>
          <Input
            id="nextMaintenanceDate"
            type="date"
            value={nextMaintenanceDate}
            onChange={(e) => setNextMaintenanceDate(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="status" className="text-right">
            Trạng Thái
          </label>
          <div className="col-span-3">
            <Select onValueChange={setStatus} defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="notes" className="text-right">
            Ghi Chú
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="col-span-3"
            rows={4}
          />
        </div>
      </div>
    </FormDialog>
  );
};

const Maintenance = () => {
  const [data, setData] = useState<FullMaintenance[]>(getFullMaintenances());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = (maintenance: MaintenanceType) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Add to maintenances list
      const updatedMaintenances = [...maintenances, maintenance];
      
      // Get the device info and create a FullMaintenance object
      const device = devices.find(d => d.id === maintenance.deviceId);
      if (device) {
        const fullMaintenance: FullMaintenance = {
          ...maintenance,
          deviceName: device.name,
        };
        setData([...data, fullMaintenance]);
      }
      
      setAddDialogOpen(false);
      setIsLoading(false);
      toast.success("Bảo trì đã được thêm thành công!");
    }, 500);
  };

  const handleEdit = (maintenance: MaintenanceType) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Update maintenances
      const updatedData = data.map(item => {
        if (item.id === maintenance.id) {
          const device = devices.find(d => d.id === maintenance.deviceId);
          return {
            ...maintenance,
            deviceName: device ? device.name : "Unknown",
          };
        }
        return item;
      });
      
      setData(updatedData);
      setEditDialogOpen(false);
      setIsLoading(false);
      toast.success("Bảo trì đã được cập nhật thành công!");
    }, 500);
  };
  
  const handleDelete = () => {
    if (selectedMaintenance) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setData(data.filter(item => item.id !== selectedMaintenance.id));
        setDeleteDialogOpen(false);
        setIsLoading(false);
        toast.success("Bảo trì đã được xóa thành công!");
      }, 500);
    }
  };

  const columns = [
    {
      header: "Mã Bảo Trì",
      accessorKey: "id" as keyof FullMaintenance,
      enableSorting: true,
    },
    {
      header: "Thiết Bị",
      accessorKey: "deviceName" as keyof FullMaintenance,
      enableSorting: true,
    },
    {
      header: "Ngày Bảo Trì",
      accessorKey: "maintenanceDate" as keyof FullMaintenance,
      enableSorting: true,
    },
    {
      header: "Ngày Bảo Trì Tiếp Theo",
      accessorKey: "nextMaintenanceDate" as keyof FullMaintenance,
      enableSorting: true,
    },
    {
      header: "Trạng Thái",
      accessorKey: (row: FullMaintenance) => {
        const statusMap: Record<string, string> = {
          'scheduled': 'Đã lên lịch',
          'in-progress': 'Đang thực hiện',
          'completed': 'Hoàn thành',
          'cancelled': 'Đã hủy'
        };
        
        return <StatusBadge status={statusMap[row.status] || row.status} />;
      },
      enableSorting: false,
    },
    {
      header: "Ghi Chú",
      accessorKey: "notes" as keyof FullMaintenance,
      enableSorting: false,
    },
    {
      header: "Thao Tác",
      accessorKey: (row: FullMaintenance) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // Convert FullMaintenance to Maintenance for edit
              const maintenance: MaintenanceType = {
                id: row.id,
                deviceId: row.deviceId,
                maintenanceDate: row.maintenanceDate,
                nextMaintenanceDate: row.nextMaintenanceDate,
                status: row.status,
                notes: row.notes,
              };
              setSelectedMaintenance(maintenance);
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
              // Convert FullMaintenance to Maintenance for delete
              const maintenance: MaintenanceType = {
                id: row.id,
                deviceId: row.deviceId,
                maintenanceDate: row.maintenanceDate,
                nextMaintenanceDate: row.nextMaintenanceDate,
                status: row.status,
                notes: row.notes,
              };
              setSelectedMaintenance(maintenance);
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lịch Bảo Trì</h1>
        <Button onClick={() => setAddDialogOpen(true)}>Thêm Bảo Trì</Button>
      </div>
      
      <DataTable columns={columns} data={data} searchField="deviceName" />
      
      {/* Add Maintenance Dialog */}
      <MaintenanceForm 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onSubmit={handleCreate}
        isLoading={isLoading}
      />
      
      {/* Edit Maintenance Dialog */}
      {selectedMaintenance && (
        <MaintenanceForm 
          open={editDialogOpen} 
          onOpenChange={setEditDialogOpen} 
          onSubmit={handleEdit}
          initialData={selectedMaintenance}
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
              Bạn có chắc chắn muốn xóa lịch bảo trì này? Hành động này không thể hoàn tác.
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

export default Maintenance;
