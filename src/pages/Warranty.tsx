import React, { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { format } from "date-fns";
import { warranties, devices, suppliers } from "@/data/mockData";
import { toast } from "sonner";
import type { ReactNode } from "react";
import type { Warranty } from "@/types";

interface WarrantyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Warranty) => void;
  isLoading: boolean;
}

const WarrantyForm: React.FC<WarrantyFormProps> = ({ open, onOpenChange, onSubmit, isLoading }) => {
  const [warrantyData, setWarrantyData] = useState<Omit<Warranty, 'id'>>({
    deviceId: "",
    supplierId: "",
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    terms: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWarrantyData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: Math.random().toString(), ...warrantyData } as Warranty);
  };

  return (
    <FormDialog
      title="Thêm Bảo Hành"
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
          <Select onValueChange={(value) => setWarrantyData(prev => ({ ...prev, deviceId: value }))}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn thiết bị" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>{device.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="supplierId" className="text-right">
            Nhà Cung Cấp
          </label>
          <Select onValueChange={(value) => setWarrantyData(prev => ({ ...prev, supplierId: value }))}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn nhà cung cấp" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="startDate" className="text-right">
            Ngày Bắt Đầu
          </label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            className="col-span-3"
            value={warrantyData.startDate}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="endDate" className="text-right">
            Ngày Kết Thúc
          </label>
          <Input
            type="date"
            id="endDate"
            name="endDate"
            className="col-span-3"
            value={warrantyData.endDate}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="terms" className="text-right">
            Điều Kiện
          </label>
          <Input
            type="text"
            id="terms"
            name="terms"
            className="col-span-3"
            value={warrantyData.terms}
            onChange={handleChange}
          />
        </div>
      </div>
    </FormDialog>
  );
};

const WarrantyPage = () => {
  const [data, setData] = useState([...warranties]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: WarrantyFormProps['onSubmit'] = async (warrantyData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setData(prev => [...prev, warrantyData]);
    setIsLoading(false);
    setOpen(false);
    toast.success("Thêm bảo hành thành công!");
  };

  const columns = [
  {
    header: "Mã Bảo Hành",
    accessorKey: "id" as keyof Warranty,
    enableSorting: true,
  },
  {
    header: "Thiết Bị",
    accessorKey: (row: Warranty) => {
      const device = devices.find(d => d.id === row.deviceId);
      return device ? device.name : "N/A";
    },
    enableSorting: true,
  },
  {
    header: "Nhà Cung Cấp",
    accessorKey: (row: Warranty) => {
      const supplier = suppliers.find(s => s.id === row.supplierId);
      return supplier ? supplier.name : "N/A";
    },
    enableSorting: true,
  },
  {
    header: "Ngày Bắt Đầu",
    accessorKey: "startDate" as keyof Warranty,
    enableSorting: true,
  },
  {
    header: "Ngày Kết Thúc",
    accessorKey: "endDate" as keyof Warranty,
    enableSorting: true,
  },
  {
    header: "Trạng Thái",
    accessorKey: (row: Warranty) => {
      const now = new Date();
      const endDate = new Date(row.endDate);
      const status = endDate < now ? "Hết hạn" : "Còn hạn";
      return <StatusBadge status={status} />;
    },
    enableSorting: false,
  },
  {
    header: "Điều Kiện",
    accessorKey: "terms" as keyof Warranty,
    enableSorting: false,
  },
];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý bảo hành</h1>
        <Button onClick={() => setOpen(true)}>Thêm bảo hành</Button>
      </div>
      <DataTable columns={columns} data={data} />
      <WarrantyForm open={open} onOpenChange={setOpen} onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default WarrantyPage;
