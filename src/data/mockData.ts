
import { 
  Device, DeviceLocation, DeviceStatus, DeviceType, 
  Employee, Department, Position, Maintenance, Inventory,
  Repair, Invoice, Warranty, RepairHistory, Supplier, ContractType,
  InvoiceDetail
} from '@/types';

// Basic data
export const deviceTypes: DeviceType[] = [
  { id: '1', name: 'Máy tính' },
  { id: '2', name: 'Máy in' },
  { id: '3', name: 'Máy scan' },
  { id: '4', name: 'Máy photocopy' },
  { id: '5', name: 'Điều hòa' }
];

export const deviceLocations: DeviceLocation[] = [
  { id: '1', name: 'Phòng IT' },
  { id: '2', name: 'Phòng kế toán' },
  { id: '3', name: 'Phòng nhân sự' },
  { id: '4', name: 'Phòng giám đốc' },
  { id: '5', name: 'Phòng họp' }
];

export const deviceStatuses: DeviceStatus[] = [
  { id: '1', name: 'Đang sử dụng' },
  { id: '2', name: 'Bảo trì' },
  { id: '3', name: 'Sửa chữa' },
  { id: '4', name: 'Không sử dụng' },
  { id: '5', name: 'Thanh lý' }
];

export const departments: Department[] = [
  { id: '1', name: 'IT' },
  { id: '2', name: 'Kế toán' },
  { id: '3', name: 'Nhân sự' },
  { id: '4', name: 'Kinh doanh' },
  { id: '5', name: 'Ban giám đốc' }
];

export const positions: Position[] = [
  { id: '1', name: 'Trưởng phòng' },
  { id: '2', name: 'Phó phòng' },
  { id: '3', name: 'Nhân viên' },
  { id: '4', name: 'Giám đốc' },
  { id: '5', name: 'Phó giám đốc' }
];

export const suppliers: Supplier[] = [
  { id: '1', name: 'Công ty TNHH ABC', address: 'Hà Nội', phone: '0987654321', email: 'abc@example.com', contactPerson: 'Nguyễn Văn A' },
  { id: '2', name: 'Công ty CP XYZ', address: 'Hồ Chí Minh', phone: '0123456789', email: 'xyz@example.com', contactPerson: 'Trần Thị B' },
  { id: '3', name: 'Công ty TNHH DEF', address: 'Đà Nẵng', phone: '0369852147', email: 'def@example.com', contactPerson: 'Lê Văn C' }
];

export const contractTypes: ContractType[] = [
  { id: '1', name: 'Bảo hành' },
  { id: '2', name: 'Bảo trì' },
  { id: '3', name: 'Sửa chữa' },
  { id: '4', name: 'Thay thế' }
];

// Core data
export const employees: Employee[] = [
  { id: 'E001', name: 'Nguyễn Văn A', phone: '0987654321', email: 'nguyenvana@example.com', positionId: '3', departmentId: '1' },
  { id: 'E002', name: 'Trần Thị B', phone: '0123456789', email: 'tranthib@example.com', positionId: '3', departmentId: '2' },
  { id: 'E003', name: 'Lê Văn C', phone: '0369852147', email: 'levanc@example.com', positionId: '1', departmentId: '3' },
  { id: 'E004', name: 'Phạm Thị D', phone: '0258741369', email: 'phamthid@example.com', positionId: '4', departmentId: '5' },
  { id: 'E005', name: 'Hoàng Văn E', phone: '0741852963', email: 'hoangvane@example.com', positionId: '2', departmentId: '4' }
];

export const devices: Device[] = [
  { id: 'D001', name: 'Máy tính văn phòng 01', value: 15000000, purchaseDate: '2023-01-15', deviceTypeId: '1', deviceLocationId: '1', deviceStatusId: '1', employeeId: 'E001' },
  { id: 'D002', name: 'Máy in HP L1234', value: 5000000, purchaseDate: '2023-02-20', deviceTypeId: '2', deviceLocationId: '2', deviceStatusId: '1', employeeId: 'E002' },
  { id: 'D003', name: 'Máy scan Canon S5678', value: 3000000, purchaseDate: '2023-03-10', deviceTypeId: '3', deviceLocationId: '3', deviceStatusId: '2', employeeId: 'E003' },
  { id: 'D004', name: 'Máy điều hòa Panasonic', value: 12000000, purchaseDate: '2023-04-05', deviceTypeId: '5', deviceLocationId: '4', deviceStatusId: '1', employeeId: 'E004' },
  { id: 'D005', name: 'Máy photocopy Ricoh', value: 35000000, purchaseDate: '2023-05-12', deviceTypeId: '4', deviceLocationId: '5', deviceStatusId: '3', employeeId: 'E005' }
];

export const maintenances: Maintenance[] = [
  { id: 'M001', date: '2023-06-15', frequency: '3 tháng', content: 'Bảo trì định kỳ máy tính', status: 'đã bảo trì', deviceId: 'D001' },
  { id: 'M002', date: '2023-07-20', frequency: '6 tháng', content: 'Bảo trì định kỳ máy in', status: 'đã bảo trì', deviceId: 'D002' },
  { id: 'M003', date: '2023-08-10', frequency: '12 tháng', content: 'Bảo trì hệ thống scan', status: 'chưa bảo trì', deviceId: 'D003' },
  { id: 'M004', date: '2023-09-05', frequency: '6 tháng', content: 'Vệ sinh điều hòa', status: 'đã bảo trì', deviceId: 'D004' },
  { id: 'M005', date: '2023-10-12', frequency: '3 tháng', content: 'Bảo trì máy photocopy', status: 'chưa bảo trì', deviceId: 'D005' }
];

export const inventories: Inventory[] = [
  { id: 'I001', checkDate: '2023-06-30', condition: 'tốt', deviceId: 'D001' },
  { id: 'I002', checkDate: '2023-07-31', condition: 'tốt', deviceId: 'D002' },
  { id: 'I003', checkDate: '2023-08-31', condition: 'bảo trì', deviceId: 'D003' },
  { id: 'I004', checkDate: '2023-09-30', condition: 'tốt', deviceId: 'D004' },
  { id: 'I005', checkDate: '2023-10-31', condition: 'sửa chữa', deviceId: 'D005' }
];

export const repairs: Repair[] = [
  { id: 'R001', repairDate: '2023-07-10', notes: 'Thay bàn phím máy tính', status: 'đã sửa chữa', cost: 500000, contractTypeId: '3', deviceId: 'D001', employeeId: 'E001', supplierId: '1' },
  { id: 'R002', repairDate: '2023-08-15', notes: 'Sửa lỗi kẹt giấy máy in', status: 'đã sửa chữa', cost: 300000, contractTypeId: '3', deviceId: 'D002', employeeId: 'E002', supplierId: '2' },
  { id: 'R003', repairDate: '2023-09-20', notes: 'Thay nguồn máy scan', status: 'chưa sửa chữa', cost: 800000, contractTypeId: '3', deviceId: 'D003', employeeId: 'E003', supplierId: '3' },
  { id: 'R004', repairDate: '2023-10-25', notes: 'Nạp gas điều hòa', status: 'đã sửa chữa', cost: 1000000, contractTypeId: '4', deviceId: 'D004', employeeId: 'E004', supplierId: '1' },
  { id: 'R005', repairDate: '2023-11-30', notes: 'Thay trống máy photocopy', status: 'chưa sửa chữa', cost: 2500000, contractTypeId: '4', deviceId: 'D005', employeeId: 'E005', supplierId: '2' }
];

export const invoiceDetails: InvoiceDetail[] = [
  { id: 'ID001', name: 'Bàn phím Logitech', quantity: 1, unitPrice: 500000, total: 500000, invoiceId: 'IV001' },
  { id: 'ID002', name: 'Công nạp gas điều hòa', quantity: 1, unitPrice: 500000, total: 500000, invoiceId: 'IV004' },
  { id: 'ID003', name: 'Gas điều hòa R32', quantity: 1, unitPrice: 500000, total: 500000, invoiceId: 'IV004' },
  { id: 'ID004', name: 'Công sửa chữa', quantity: 1, unitPrice: 300000, total: 300000, invoiceId: 'IV002' }
];

export const invoices: Invoice[] = [
  { id: 'IV001', date: '2023-07-11', content: 'Thanh toán sửa chữa máy tính', total: 500000, repairId: 'R001' },
  { id: 'IV002', date: '2023-08-16', content: 'Thanh toán sửa chữa máy in', total: 300000, repairId: 'R002' },
  { id: 'IV004', date: '2023-10-26', content: 'Thanh toán nạp gas điều hòa', total: 1000000, repairId: 'R004' }
];

export const warranties: Warranty[] = [
  { id: 'W001', startDate: '2023-01-15', endDate: '2024-01-15', conditions: 'Bảo hành 12 tháng từ ngày mua', deviceId: 'D001', supplierId: '1' },
  { id: 'W002', startDate: '2023-02-20', endDate: '2025-02-20', conditions: 'Bảo hành 24 tháng từ ngày mua', deviceId: 'D002', supplierId: '2' },
  { id: 'W003', startDate: '2023-03-10', endDate: '2025-03-10', conditions: 'Bảo hành 24 tháng từ ngày mua', deviceId: 'D003', supplierId: '3' },
  { id: 'W004', startDate: '2023-04-05', endDate: '2026-04-05', conditions: 'Bảo hành 36 tháng từ ngày mua', deviceId: 'D004', supplierId: '1' },
  { id: 'W005', startDate: '2023-05-12', endDate: '2025-05-12', conditions: 'Bảo hành 24 tháng từ ngày mua', deviceId: 'D005', supplierId: '2' }
];

export const repairHistories: RepairHistory[] = [
  { id: 'RH001', notes: 'Thay bàn phím máy tính', contractTypeId: '3', employeeId: 'E001', deviceId: 'D001' },
  { id: 'RH002', notes: 'Sửa lỗi kẹt giấy máy in', contractTypeId: '3', employeeId: 'E002', deviceId: 'D002' },
  { id: 'RH004', notes: 'Nạp gas điều hòa', contractTypeId: '4', employeeId: 'E004', deviceId: 'D004' }
];

// Combine data with references
export const getFullDevices = (): Device[] => {
  return devices.map(device => ({
    ...device,
    deviceType: deviceTypes.find(type => type.id === device.deviceTypeId),
    deviceLocation: deviceLocations.find(location => location.id === device.deviceLocationId),
    deviceStatus: deviceStatuses.find(status => status.id === device.deviceStatusId),
    employee: employees.find(employee => employee.id === device.employeeId)
  }));
};

export const getFullEmployees = (): Employee[] => {
  return employees.map(employee => ({
    ...employee,
    position: positions.find(position => position.id === employee.positionId),
    department: departments.find(department => department.id === employee.departmentId)
  }));
};

export const getFullMaintenances = (): Maintenance[] => {
  return maintenances.map(maintenance => ({
    ...maintenance,
    device: getFullDevices().find(device => device.id === maintenance.deviceId)
  }));
};

export const getFullInventories = (): Inventory[] => {
  return inventories.map(inventory => ({
    ...inventory,
    device: getFullDevices().find(device => device.id === inventory.deviceId)
  }));
};

export const getFullRepairs = (): Repair[] => {
  return repairs.map(repair => ({
    ...repair,
    contractType: contractTypes.find(type => type.id === repair.contractTypeId),
    device: getFullDevices().find(device => device.id === repair.deviceId),
    employee: getFullEmployees().find(employee => employee.id === repair.employeeId),
    supplier: suppliers.find(supplier => supplier.id === repair.supplierId)
  }));
};

export const getFullInvoices = (): Invoice[] => {
  return invoices.map(invoice => ({
    ...invoice,
    repair: getFullRepairs().find(repair => repair.id === invoice.repairId),
    details: invoiceDetails.filter(detail => detail.invoiceId === invoice.id)
  }));
};

export const getFullWarranties = (): Warranty[] => {
  return warranties.map(warranty => ({
    ...warranty,
    device: getFullDevices().find(device => device.id === warranty.deviceId),
    supplier: suppliers.find(supplier => supplier.id === warranty.supplierId)
  }));
};

export const getFullRepairHistories = (): RepairHistory[] => {
  return repairHistories.map(history => ({
    ...history,
    contractType: contractTypes.find(type => type.id === history.contractTypeId),
    employee: getFullEmployees().find(employee => employee.id === history.employeeId),
    device: getFullDevices().find(device => device.id === history.deviceId)
  }));
};
