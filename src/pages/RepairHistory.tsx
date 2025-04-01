import React, { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { format } from "date-fns";
import { repairHistories, devices, employees, contractTypes } from "@/data/mockData";
import { toast } from "sonner";
import type { ReactNode } from "react";
import type { RepairHistory } from "@/types";

interface RepairHistoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RepairHistory) => void;
  isLoading: boolean;
}

const RepairHistoryForm: React.FC<RepairHistoryFormProps> = ({ open, onOpenChange, onSubmit, isLoading }) => {
  const [id, setId] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [contractTypeId, setContractTypeId] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: RepairHistory = {
      id,
      deviceId,
      employeeId,
      contractTypeId,
      notes,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <FormDialog
      title="Thêm Lịch Sử Sửa Chữa"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="id" className="text-right font-medium">
            Mã Lịch Sử
          </label>
          <Input id="id" value={id} onChange={(e) => setId(e.target.value)} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="deviceId" className="text-right font-medium">
            Thiết Bị
          </label>
          <Select onValueChange={setDeviceId}>
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
          <label htmlFor="employeeId" className="text-right font-medium">
            Nhân Viên
          </label>
          <Select onValueChange={setEmployeeId}>
            <SelectTrigger className="col-span-3">
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
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="contractTypeId" className="text-right font-medium">
            Loại Hợp Đồng
          </label>
          <Select onValueChange={setContractTypeId}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn loại hợp đồng" />
            </SelectTrigger>
            <SelectContent>
              {contractTypes.map((contractType) => (
                <SelectItem key={contractType.id} value={contractType.id}>
                  {contractType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="notes" className="text-right font-medium">
            Ghi Chú
          </label>
          <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
        </div>
      </div>
    </FormDialog>
  );
};

const RepairHistoryPage = () => {
  const [data, setData] = useState([...repairHistories]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: (data: RepairHistory) => void = async (inputData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setData([...data, inputData]);
    toast.success("Thêm lịch sử sửa chữa thành công!");
    setIsLoading(false);
  };

  const columns = [
    {
      header: "Mã Lịch Sử",
      accessorKey: "id" as keyof RepairHistory,
      enableSorting: true,
    },
    {
      header: "Thiết Bị",
      accessorKey: (row: RepairHistory) => {
        const device = devices.find(d => d.id === row.deviceId);
        return device ? device.name : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Nhân Viên",
      accessorKey: (row: RepairHistory) => {
        const employee = employees.find(e => e.id === row.employeeId);
        return employee ? employee.name : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Loại Hợp Đồng",
      accessorKey: (row: RepairHistory) => {
        const contractType = contractTypes.find(ct => ct.id === row.contractTypeId);
        return contractType ? contractType.name : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Ghi Chú",
      accessorKey: "notes" as keyof RepairHistory,
      enableSorting: false,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lịch Sử Sửa Chữa</h1>
        <Button onClick={() => setOpen(true)}>Thêm Lịch Sử</Button>
      </div>
      <DataTable columns={columns} data={data} />
      <RepairHistoryForm open={open} onOpenChange={setOpen} onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default RepairHistoryPage;
