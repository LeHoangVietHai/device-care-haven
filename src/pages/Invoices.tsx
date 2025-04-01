
import React, { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { format } from "date-fns";
import { invoices, repairs, repairHistories } from "@/data/mockData";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import type { Invoice, RepairHistory } from "@/types";

interface InvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ open, onOpenChange }) => {
  const [invoiceData, setInvoiceData] = useState({
    id: "",
    date: format(new Date(), "yyyy-MM-dd"),
    repairId: "",
    content: "",
    total: 0,
    paid: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Invoice Data:", invoiceData);
    toast.success("Hóa đơn đã được tạo thành công!");
    onOpenChange(false); // Close the dialog after submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <FormDialog
      title="Thêm Hóa Đơn"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="id" className="text-right font-medium">
            Mã Hóa Đơn
          </label>
          <Input
            type="text"
            id="id"
            name="id"
            value={invoiceData.id}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="date" className="text-right font-medium">
            Ngày Lập
          </label>
          <Input
            type="date"
            id="date"
            name="date"
            value={invoiceData.date}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="repairId" className="text-right font-medium">
            Mã Sửa Chữa
          </label>
          <Select 
            onValueChange={(value) => setInvoiceData(prev => ({ ...prev, repairId: value }))}
            value={invoiceData.repairId}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chọn mã sửa chữa" />
            </SelectTrigger>
            <SelectContent>
              {repairs.map((repair) => (
                <SelectItem key={repair.id} value={repair.id}>
                  SC-{repair.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="content" className="text-right font-medium">
            Nội Dung
          </label>
          <Input
            type="text"
            id="content"
            name="content"
            value={invoiceData.content}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="total" className="text-right font-medium">
            Thành Tiền
          </label>
          <Input
            type="number"
            id="total"
            name="total"
            value={invoiceData.total}
            onChange={(e) => setInvoiceData({ ...invoiceData, total: parseFloat(e.target.value) })}
            className="col-span-3"
          />
        </div>
      </div>
    </FormDialog>
  );
};

const Invoices = () => {
  const [invoicesList, setInvoicesList] = useState(invoices.map(invoice => ({
    ...invoice,
    paid: false
  })));
  const [repairHistoryList, setRepairHistoryList] = useState(repairHistories);
  const [open, setOpen] = useState(false);

  const handlePayInvoice = (invoice: Invoice & { paid: boolean }) => {
    // Mark invoice as paid
    const updatedInvoices = invoicesList.map(inv => 
      inv.id === invoice.id ? { ...inv, paid: true } : inv
    );
    setInvoicesList(updatedInvoices);

    // Get repair information and create repair history
    const repair = repairs.find(r => r.id === invoice.repairId);
    if (repair) {
      const newRepairHistory: RepairHistory = {
        id: `RH-${Math.random().toString(36).substring(2, 10)}`,
        deviceId: repair.deviceId,
        employeeId: repair.employeeId,
        contractTypeId: repair.contractTypeId,
        notes: `Thanh toán hóa đơn: ${invoice.id}. Nội dung: ${invoice.content}. Tổng tiền: ${invoice.total.toLocaleString()} VND`,
      };

      setRepairHistoryList([...repairHistoryList, newRepairHistory]);
      toast.success("Hóa đơn đã thanh toán và đẩy xuống lịch sử sửa chữa!");
    }
  };

  const columns = [
    {
      header: "Mã Hóa Đơn",
      accessorKey: "id" as keyof Invoice,
      enableSorting: true,
    },
    {
      header: "Ngày Lập",
      accessorKey: "date" as keyof Invoice,
      enableSorting: true,
    },
    {
      header: "Sửa Chữa",
      accessorKey: (row: Invoice) => {
        const repair = repairs.find(r => r.id === row.repairId);
        return repair ? `SC-${repair.id}` : "N/A";
      },
      enableSorting: true,
    },
    {
      header: "Nội Dung",
      accessorKey: "content" as keyof Invoice,
      enableSorting: false,
    },
    {
      header: "Thành Tiền",
      accessorKey: (row: Invoice) => `${row.total.toLocaleString()} VND`,
      enableSorting: true,
    },
    {
      header: "Trạng Thái",
      accessorKey: (row: Invoice & { paid: boolean }) => (
        <StatusBadge status={row.paid ? "completed" : "pending"} />
      ),
      enableSorting: false,
    },
    {
      header: "Thao Tác",
      accessorKey: (row: Invoice & { paid: boolean }) => (
        <Button
          onClick={() => handlePayInvoice(row)}
          disabled={row.paid}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <CheckCircle2 className="h-4 w-4" />
          {row.paid ? "Đã thanh toán" : "Thanh toán"}
        </Button>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hóa Đơn</h1>
        <Button onClick={() => setOpen(true)}>Thêm Hóa Đơn</Button>
      </div>
      <DataTable columns={columns} data={invoicesList} />
      <InvoiceForm open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Invoices;
