
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getFullInvoices, getFullRepairs } from "@/data/mockData";
import { Invoice, Repair } from "@/types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const Invoices = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(getFullInvoices());
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const repairs = getFullRepairs();

  // Form state
  const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({
    id: "",
    date: "",
    content: "",
    total: 0,
    repairId: "",
  });

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceData.id || !invoiceData.date || !invoiceData.repairId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin hóa đơn",
        variant: "destructive",
      });
      return;
    }

    // Check if invoice ID already exists
    if (invoices.some(invoice => invoice.id === invoiceData.id)) {
      toast({
        title: "Lỗi",
        description: "Mã hóa đơn đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    // Find repair
    const repair = repairs.find(repair => repair.id === invoiceData.repairId);

    // If repair is found, use its cost as the total
    const total = repair ? repair.cost : (invoiceData.total || 0);

    const newInvoice: Invoice = {
      id: invoiceData.id as string,
      date: invoiceData.date as string,
      content: invoiceData.content as string,
      total: total,
      repairId: invoiceData.repairId as string,
      repair: repair,
    };

    setInvoices([...invoices, newInvoice]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Thêm hóa đơn mới thành công",
    });

    // Reset form
    setInvoiceData({
      id: "",
      date: "",
      content: "",
      total: 0,
      repairId: "",
    });
  };

  const handleEditInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInvoice || !invoiceData.date || !invoiceData.repairId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin hóa đơn",
        variant: "destructive",
      });
      return;
    }

    // Find repair
    const repair = repairs.find(repair => repair.id === invoiceData.repairId);

    const updatedInvoice: Invoice = {
      ...selectedInvoice,
      date: invoiceData.date as string,
      content: invoiceData.content as string,
      total: invoiceData.total as number,
      repairId: invoiceData.repairId as string,
      repair: repair,
    };

    setInvoices(invoices.map(invoice => 
      invoice.id === selectedInvoice.id ? updatedInvoice : invoice
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Cập nhật thông tin hóa đơn thành công",
    });
  };

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceData({
      id: invoice.id,
      date: invoice.date,
      content: invoice.content,
      total: invoice.total,
      repairId: invoice.repairId,
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
      header: "Ngày lập",
      accessorKey: "date",
      enableSorting: true,
    },
    {
      header: "Nội dung",
      accessorKey: "content",
      enableSorting: false,
    },
    {
      header: "Tổng tiền",
      accessorKey: (invoice: Invoice) => formatCurrency(invoice.total),
      enableSorting: false,
    },
    {
      header: "Mã sửa chữa",
      accessorKey: "repairId",
      enableSorting: true,
    },
    {
      header: "Thiết bị",
      accessorKey: (invoice: Invoice) => invoice.repair?.device?.name || "-",
      enableSorting: false,
    },
    {
      header: "Nhân viên",
      accessorKey: (invoice: Invoice) => invoice.repair?.employee?.name || "-",
      enableSorting: false,
    },
    {
      header: "Nhà cung cấp",
      accessorKey: (invoice: Invoice) => invoice.repair?.supplier?.name || "-",
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý hóa đơn</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Thêm hóa đơn</Button>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        onRowClick={handleRowClick}
        searchField="content"
      />

      {/* Add Invoice Dialog */}
      <FormDialog
        title="Thêm hóa đơn mới"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddInvoice}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Mã hóa đơn</Label>
            <Input
              id="id"
              value={invoiceData.id}
              onChange={(e) => setInvoiceData({ ...invoiceData, id: e.target.value })}
              placeholder="Ví dụ: IV006"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Ngày lập</Label>
            <Input
              id="date"
              type="date"
              value={invoiceData.date}
              onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              value={invoiceData.content}
              onChange={(e) => setInvoiceData({ ...invoiceData, content: e.target.value })}
              placeholder="Nhập nội dung hóa đơn"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="repairId">Sửa chữa</Label>
            <Select 
              value={invoiceData.repairId} 
              onValueChange={(value) => {
                const repair = repairs.find(r => r.id === value);
                setInvoiceData({ 
                  ...invoiceData, 
                  repairId: value,
                  total: repair ? repair.cost : 0
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn sửa chữa" />
              </SelectTrigger>
              <SelectContent>
                {repairs
                  .filter(repair => repair.status === "đã sửa chữa")
                  .map((repair) => (
                    <SelectItem key={repair.id} value={repair.id}>
                      {repair.id} - {repair.device?.name} - {formatCurrency(repair.cost)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="total">Tổng tiền</Label>
            <Input
              id="total"
              type="number"
              value={invoiceData.total}
              onChange={(e) => setInvoiceData({ ...invoiceData, total: parseFloat(e.target.value) })}
              placeholder="Nhập tổng tiền"
            />
          </div>
        </div>
      </FormDialog>

      {/* Edit Invoice Dialog */}
      <FormDialog
        title="Chỉnh sửa thông tin hóa đơn"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditInvoice}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-id">Mã hóa đơn</Label>
            <Input
              id="edit-id"
              value={invoiceData.id}
              disabled
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-date">Ngày lập</Label>
            <Input
              id="edit-date"
              type="date"
              value={invoiceData.date}
              onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-content">Nội dung</Label>
            <Textarea
              id="edit-content"
              value={invoiceData.content}
              onChange={(e) => setInvoiceData({ ...invoiceData, content: e.target.value })}
              placeholder="Nhập nội dung hóa đơn"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-repairId">Sửa chữa</Label>
            <Select 
              value={invoiceData.repairId} 
              onValueChange={(value) => {
                const repair = repairs.find(r => r.id === value);
                setInvoiceData({ 
                  ...invoiceData, 
                  repairId: value,
                  total: repair ? repair.cost : invoiceData.total
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn sửa chữa" />
              </SelectTrigger>
              <SelectContent>
                {repairs
                  .filter(repair => repair.status === "đã sửa chữa")
                  .map((repair) => (
                    <SelectItem key={repair.id} value={repair.id}>
                      {repair.id} - {repair.device?.name} - {formatCurrency(repair.cost)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-total">Tổng tiền</Label>
            <Input
              id="edit-total"
              type="number"
              value={invoiceData.total}
              onChange={(e) => setInvoiceData({ ...invoiceData, total: parseFloat(e.target.value) })}
              placeholder="Nhập tổng tiền"
            />
          </div>
        </div>
      </FormDialog>
    </div>
  );
};

export default Invoices;
