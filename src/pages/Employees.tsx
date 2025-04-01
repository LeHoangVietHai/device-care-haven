
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getFullEmployees, positions, departments } from "@/data/mockData";
import { Employee, Position, Department } from "@/types";

const Employees = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>(getFullEmployees());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form state
  const [employeeData, setEmployeeData] = useState<Partial<Employee>>({
    id: "",
    name: "",
    phone: "",
    email: "",
    positionId: "",
    departmentId: "",
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeData.id || !employeeData.name || !employeeData.phone || !employeeData.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin nhân viên",
        variant: "destructive",
      });
      return;
    }

    // Check if employee ID already exists
    if (employees.some(employee => employee.id === employeeData.id)) {
      toast({
        title: "Lỗi",
        description: "Mã nhân viên đã tồn tại",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const position = positions.find(pos => pos.id === employeeData.positionId);
    const department = departments.find(dept => dept.id === employeeData.departmentId);

    const newEmployee: Employee = {
      id: employeeData.id as string,
      name: employeeData.name as string,
      phone: employeeData.phone as string,
      email: employeeData.email as string,
      positionId: employeeData.positionId as string,
      departmentId: employeeData.departmentId as string,
      position: position as Position,
      department: department as Department,
    };

    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Thêm nhân viên mới thành công",
    });

    // Reset form
    setEmployeeData({
      id: "",
      name: "",
      phone: "",
      email: "",
      positionId: "",
      departmentId: "",
    });
  };

  const handleEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !employeeData.name || !employeeData.phone || !employeeData.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin nhân viên",
        variant: "destructive",
      });
      return;
    }

    // Find references
    const position = positions.find(pos => pos.id === employeeData.positionId);
    const department = departments.find(dept => dept.id === employeeData.departmentId);

    const updatedEmployee: Employee = {
      ...selectedEmployee,
      name: employeeData.name as string,
      phone: employeeData.phone as string,
      email: employeeData.email as string,
      positionId: employeeData.positionId as string,
      departmentId: employeeData.departmentId as string,
      position: position as Position,
      department: department as Department,
    };

    setEmployees(employees.map(employee => 
      employee.id === selectedEmployee.id ? updatedEmployee : employee
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Thành công",
      description: "Cập nhật thông tin nhân viên thành công",
    });
  };

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeData({
      id: employee.id,
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      positionId: employee.positionId,
      departmentId: employee.departmentId,
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
      header: "Tên nhân viên",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      header: "Số điện thoại",
      accessorKey: "phone",
      enableSorting: false,
    },
    {
      header: "Email",
      accessorKey: "email",
      enableSorting: false,
    },
    {
      header: "Chức vụ",
      accessorKey: (employee: Employee) => employee.position?.name || "-",
      enableSorting: false,
    },
    {
      header: "Phòng ban",
      accessorKey: (employee: Employee) => employee.department?.name || "-",
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Thêm nhân viên</Button>
      </div>

      <DataTable
        data={employees}
        columns={columns}
        onRowClick={handleRowClick}
        searchField="name"
      />

      {/* Add Employee Dialog */}
      <FormDialog
        title="Thêm nhân viên mới"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddEmployee}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Mã nhân viên</Label>
            <Input
              id="id"
              value={employeeData.id}
              onChange={(e) => setEmployeeData({ ...employeeData, id: e.target.value })}
              placeholder="Ví dụ: E006"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Tên nhân viên</Label>
            <Input
              id="name"
              value={employeeData.name}
              onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
              placeholder="Nhập tên nhân viên"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={employeeData.phone}
              onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={employeeData.email}
              onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
              placeholder="Nhập email"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="positionId">Chức vụ</Label>
            <Select 
              value={employeeData.positionId} 
              onValueChange={(value) => setEmployeeData({ ...employeeData, positionId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="departmentId">Phòng ban</Label>
            <Select 
              value={employeeData.departmentId} 
              onValueChange={(value) => setEmployeeData({ ...employeeData, departmentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      {/* Edit Employee Dialog */}
      <FormDialog
        title="Chỉnh sửa thông tin nhân viên"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditEmployee}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-id">Mã nhân viên</Label>
            <Input
              id="edit-id"
              value={employeeData.id}
              disabled
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Tên nhân viên</Label>
            <Input
              id="edit-name"
              value={employeeData.name}
              onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
              placeholder="Nhập tên nhân viên"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-phone">Số điện thoại</Label>
            <Input
              id="edit-phone"
              value={employeeData.phone}
              onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={employeeData.email}
              onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
              placeholder="Nhập email"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-positionId">Chức vụ</Label>
            <Select 
              value={employeeData.positionId} 
              onValueChange={(value) => setEmployeeData({ ...employeeData, positionId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-departmentId">Phòng ban</Label>
            <Select 
              value={employeeData.departmentId} 
              onValueChange={(value) => setEmployeeData({ ...employeeData, departmentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
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

export default Employees;
