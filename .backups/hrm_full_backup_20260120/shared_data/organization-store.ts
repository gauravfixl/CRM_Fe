import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
    location: string;
    joiningDate: string;
    reportingTo: string;
    status: 'Active' | 'Inactive' | 'On Leave';
    employmentType: 'Full-time' | 'Part-time' | 'Contract';
}

export interface Department {
    id: string;
    name: string;
    headOfDepartment: string;
    employeeCount: number;
    description: string;
}

export interface Designation {
    id: string;
    title: string;
    level: string;
    department: string;
    count: number;
}

export interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    employeeCount: number;
}

interface OrganizationState {
    employees: Employee[];
    departments: Department[];
    designations: Designation[];
    locations: Location[];

    addEmployee: (employee: Omit<Employee, 'id'>) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;

    addDepartment: (department: Omit<Department, 'id' | 'employeeCount'>) => void;
    updateDepartment: (id: string, updates: Partial<Department>) => void;
    deleteDepartment: (id: string) => void;

    addDesignation: (designation: Omit<Designation, 'id' | 'count'>) => void;
    updateDesignation: (id: string, updates: Partial<Designation>) => void;
    deleteDesignation: (id: string) => void;

    addLocation: (location: Omit<Location, 'id' | 'employeeCount'>) => void;
    updateLocation: (id: string, updates: Partial<Location>) => void;
    deleteLocation: (id: string) => void;
}

const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 'EMP001',
        name: 'Drashi Garg',
        avatar: 'DG',
        email: 'drashi.garg@company.com',
        phone: '+91 98765 00000',
        designation: 'Engineering Manager',
        department: 'Engineering',
        location: 'Bangalore',
        joiningDate: '2021-03-15',
        reportingTo: 'CEO',
        status: 'Active',
        employmentType: 'Full-time'
    },
    {
        id: 'EMP002',
        name: 'Aditya Singh',
        avatar: 'AS',
        email: 'aditya.singh@company.com',
        phone: '+91 98765 43210',
        designation: 'Senior Developer',
        department: 'Engineering',
        location: 'Bangalore',
        joiningDate: '2023-06-15',
        reportingTo: 'Drashi Garg',
        status: 'Active',
        employmentType: 'Full-time'
    },
    {
        id: 'EMP003',
        name: 'Rohan Gupta',
        avatar: 'RG',
        email: 'rohan.gupta@company.com',
        phone: '+91 98765 43211',
        designation: 'Sales Executive',
        department: 'Sales',
        location: 'Mumbai',
        joiningDate: '2024-01-10',
        reportingTo: 'Sales Head',
        status: 'Active',
        employmentType: 'Full-time'
    },
    {
        id: 'EMP004',
        name: 'Sneha Kapoor',
        avatar: 'SK',
        email: 'sneha.kapoor@company.com',
        phone: '+91 98765 43212',
        designation: 'HR Executive',
        department: 'HR',
        location: 'Delhi',
        joiningDate: '2023-11-20',
        reportingTo: 'HR Head',
        status: 'On Leave',
        employmentType: 'Full-time'
    },
    {
        id: 'EMP005',
        name: 'Vikram M',
        avatar: 'VM',
        email: 'vikram.m@company.com',
        phone: '+91 98765 43213',
        designation: 'Product Manager',
        department: 'Product',
        location: 'Bangalore',
        joiningDate: '2022-08-05',
        reportingTo: 'Product Head',
        status: 'Active',
        employmentType: 'Full-time'
    }
];

const MOCK_DEPARTMENTS: Department[] = [
    { id: 'dept-1', name: 'Engineering', headOfDepartment: 'Drashi Garg', employeeCount: 25, description: 'Software development and technology' },
    { id: 'dept-2', name: 'Sales', headOfDepartment: 'Rajesh Kumar', employeeCount: 15, description: 'Revenue generation and client acquisition' },
    { id: 'dept-3', name: 'HR', headOfDepartment: 'Priya Sharma', employeeCount: 8, description: 'Human resources and talent management' },
    { id: 'dept-4', name: 'Product', headOfDepartment: 'Amit Verma', employeeCount: 12, description: 'Product strategy and roadmap' },
    { id: 'dept-5', name: 'Marketing', headOfDepartment: 'Neha Patel', employeeCount: 10, description: 'Brand and digital marketing' }
];

const MOCK_DESIGNATIONS: Designation[] = [
    { id: 'des-1', title: 'Engineering Manager', level: 'L6', department: 'Engineering', count: 3 },
    { id: 'des-2', title: 'Senior Developer', level: 'L5', department: 'Engineering', count: 8 },
    { id: 'des-3', title: 'Developer', level: 'L4', department: 'Engineering', count: 14 },
    { id: 'des-4', title: 'Sales Executive', level: 'L3', department: 'Sales', count: 12 },
    { id: 'des-5', title: 'HR Executive', level: 'L3', department: 'HR', count: 5 }
];

const MOCK_LOCATIONS: Location[] = [
    { id: 'loc-1', name: 'Bangalore HQ', address: 'Koramangala, Bangalore', city: 'Bangalore', country: 'India', employeeCount: 40 },
    { id: 'loc-2', name: 'Mumbai Office', address: 'Andheri, Mumbai', city: 'Mumbai', country: 'India', employeeCount: 18 },
    { id: 'loc-3', name: 'Delhi Office', address: 'Connaught Place, Delhi', city: 'Delhi', country: 'India', employeeCount: 12 }
];

export const useOrganizationStore = create<OrganizationState>()(
    persist(
        (set) => ({
            employees: MOCK_EMPLOYEES,
            departments: MOCK_DEPARTMENTS,
            designations: MOCK_DESIGNATIONS,
            locations: MOCK_LOCATIONS,

            addEmployee: (employeeData) => set((state) => ({
                employees: [...state.employees, { ...employeeData, id: `EMP${Date.now()}` }]
            })),

            updateEmployee: (id, updates) => set((state) => ({
                employees: state.employees.map(e => e.id === id ? { ...e, ...updates } : e)
            })),

            deleteEmployee: (id) => set((state) => ({
                employees: state.employees.filter(e => e.id !== id)
            })),

            addDepartment: (dept) => set((state) => ({
                departments: [...state.departments, { ...dept, id: `dept-${Date.now()}`, employeeCount: 0 }]
            })),

            updateDepartment: (id, updates) => set((state) => ({
                departments: state.departments.map(d => d.id === id ? { ...d, ...updates } : d)
            })),

            deleteDepartment: (id) => set((state) => ({
                departments: state.departments.filter(d => d.id !== id)
            })),

            addDesignation: (des) => set((state) => ({
                designations: [...state.designations, { ...des, id: `des-${Date.now()}`, count: 0 }]
            })),

            updateDesignation: (id, updates) => set((state) => ({
                designations: state.designations.map(d => d.id === id ? { ...d, ...updates } : d)
            })),

            deleteDesignation: (id) => set((state) => ({
                designations: state.designations.filter(d => d.id !== id)
            })),

            addLocation: (loc) => set((state) => ({
                locations: [...state.locations, { ...loc, id: `loc-${Date.now()}`, employeeCount: 0 }]
            })),

            updateLocation: (id, updates) => set((state) => ({
                locations: state.locations.map(l => l.id === id ? { ...l, ...updates } : l)
            })),

            deleteLocation: (id) => set((state) => ({
                locations: state.locations.filter(l => l.id !== id)
            }))
        }),
        { name: 'organization-storage' }
    )
);

