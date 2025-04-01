
// Common types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'inProgress';
export type MaintenanceStatus = 'đã bảo trì' | 'chưa bảo trì';
export type RepairStatus = 'đã sửa chữa' | 'chưa sửa chữa';
export type DeviceCondition = 'tốt' | 'hỏng' | 'bảo trì' | 'sửa chữa';

// Basic Models
export interface DeviceType {
  id: string;
  name: string;
}

export interface DeviceLocation {
  id: string;
  name: string;
}

export interface DeviceStatus {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
}

export interface ContractType {
  id: string;
  name: string;
}

// Core Models
export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  positionId: string;
  departmentId: string;
  position?: Position;
  department?: Department;
}

export interface Device {
  id: string;
  name: string;
  value: number;
  purchaseDate: string;
  deviceTypeId: string;
  deviceLocationId: string;
  deviceStatusId: string;
  employeeId: string;
  deviceType?: DeviceType;
  deviceLocation?: DeviceLocation;
  deviceStatus?: DeviceStatus;
  employee?: Employee;
}

export interface Maintenance {
  id: string;
  date: string;
  frequency: string;
  content: string;
  status: MaintenanceStatus;
  deviceId: string;
  device?: Device;
}

export interface Inventory {
  id: string;
  checkDate: string;
  condition: DeviceCondition;
  deviceId: string;
  device?: Device;
}

export interface Repair {
  id: string;
  repairDate: string;
  notes: string;
  status: RepairStatus;
  cost: number;
  contractTypeId: string;
  deviceId: string;
  employeeId: string;
  supplierId: string;
  contractType?: ContractType;
  device?: Device;
  employee?: Employee;
  supplier?: Supplier;
}

export interface InvoiceDetail {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
}

export interface Invoice {
  id: string;
  date: string;
  content: string;
  total: number;
  repairId: string;
  details?: InvoiceDetail[];
  repair?: Repair;
}

export interface Warranty {
  id: string;
  startDate: string;
  endDate: string;
  conditions: string;
  deviceId: string;
  supplierId: string;
  device?: Device;
  supplier?: Supplier;
}

export interface RepairHistory {
  id: string;
  notes: string;
  contractTypeId: string;
  employeeId: string;
  deviceId: string;
  contractType?: ContractType;
  employee?: Employee;
  device?: Device;
}
