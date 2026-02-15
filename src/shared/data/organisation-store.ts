import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfJoining: string;
    dateOfBirth: string;
    gender: "Male" | "Female" | "Other";
    status: "Active" | "On Notice" | "Exited" | "On Leave";
    employmentType: "Full-Time" | "Part-Time" | "Contract" | "Intern";
    departmentId: string;
    designationId: string;
    locationId: string;
    reportingManagerId?: string;
    profileImage?: string;
    bloodGroup?: string;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    documents?: {
        type: string;
        url: string;
        uploadedAt: string;
    }[];
    exitDate?: string;
    exitReason?: string;
}

export interface Department {
    id: string;
    name: string;
    code: string;
    headId?: string; // Employee ID of department head
    parentDepartmentId?: string;
    description?: string;
    employeeCount: number;
    createdAt: string;
    isActive: boolean;
}

export interface Designation {
    id: string;
    title: string;
    code: string;
    level: number; // 1 = Entry, 2 = Mid, 3 = Senior, 4 = Lead, 5 = Executive
    grade?: string; // E.g., "L1", "L2", "M1", "S1"
    departmentId?: string;
    description?: string;
    employeeCount: number;
    createdAt: string;
    isActive: boolean;
}

export interface Location {
    id: string;
    name: string;
    code: string;
    type: "Office" | "Remote" | "Hybrid";
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    hrContactId?: string;
    employeeCount: number;
    timezone: string;
    isActive: boolean;
    createdAt: string;
}

export interface Company {
    name: string;
    tagline?: string;
    logo?: string;
    website?: string;
    industry?: string;
    registrationNumber?: string;
    panNumber?: string;
    gstin?: string;
    incorporationDate?: string;
    contactEmail: string;
    contactPhone: string;
    supportEmail?: string;
    address: {
        building: string;
        area: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };
}

export interface Holiday {
    id: string;
    name: string;
    date: string;
    type: "Public" | "Optional" | "Company";
    locationIds: string[]; // ['All'] for global
    year: number;
}

export interface Policy {
    id: string;
    title: string;
    description?: string;
    category: "HR" | "IT" | "Finance" | "General";
    version: string;
    effectiveDate: string;
    fileUrl?: string;
    fileSize?: string;
    lastUpdated: string;
}

export interface Team {
    id: string;
    name: string;
    departmentId: string;
    leadId: string; // Employee ID
    mission: string;
    memberIds: string[]; // Array of Employee IDs
    stats: {
        velocity: number;
        tasksCompleted: number;
        uptime: string;
    };
    createdAt: string;
}

export interface OrgMetrics {
    totalHeadcount: number;
    activeEmployees: number;
    onNotice: number;
    newJoineesThisMonth: number;
    exitsThisMonth: number;
    attritionRate: number;
    avgTenure: number;
    departmentDistribution: { departmentId: string; count: number }[];
    locationDistribution: { locationId: string; count: number }[];
    employmentTypeDistribution: { type: string; count: number }[];
}

interface OrganisationState {
    employees: Employee[];
    departments: Department[];
    designations: Designation[];
    locations: Location[];
    company: Company;
    holidays: Holiday[];
    policies: Policy[];
    teams: Team[];

    // Company Actions
    updateCompany: (updates: Partial<Company>) => void;

    // Holiday Actions
    addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
    updateHoliday: (id: string, updates: Partial<Holiday>) => void;
    deleteHoliday: (id: string) => void;

    // Policy Actions
    addPolicy: (policy: Omit<Policy, 'id'>) => void;
    updatePolicy: (id: string, updates: Partial<Policy>) => void;
    deletePolicy: (id: string) => void;

    // Team Actions
    addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
    updateTeam: (id: string, updates: Partial<Team>) => void;
    deleteTeam: (id: string) => void;
    addTeamMember: (teamId: string, employeeId: string) => void;
    removeTeamMember: (teamId: string, employeeId: string) => void;

    // Employee Actions
    addEmployee: (employee: Omit<Employee, 'id'>) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;
    bulkImportEmployees: (employees: Omit<Employee, 'id'>[]) => void;

    // Department Actions
    addDepartment: (department: Omit<Department, 'id' | 'employeeCount' | 'createdAt'>) => void;
    updateDepartment: (id: string, updates: Partial<Department>) => void;
    deleteDepartment: (id: string) => void;

    // Designation Actions
    addDesignation: (designation: Omit<Designation, 'id' | 'employeeCount' | 'createdAt'>) => void;
    updateDesignation: (id: string, updates: Partial<Designation>) => void;
    deleteDesignation: (id: string) => void;

    // Location Actions
    addLocation: (location: Omit<Location, 'id' | 'employeeCount' | 'createdAt'>) => void;
    updateLocation: (id: string, updates: Partial<Location>) => void;
    deleteLocation: (id: string) => void;

    // Computed Metrics
    getMetrics: () => OrgMetrics;
}

export const useOrganisationStore = create<OrganisationState>()(
    persist(
        (set, get) => ({
            employees: [
                {
                    id: "EMP001",
                    employeeCode: "FX2024001",
                    firstName: "Rajesh",
                    lastName: "Kumar",
                    email: "rajesh.kumar@fixlsolutions.com",
                    phone: "+91 98765 43210",
                    dateOfJoining: "2024-01-15",
                    dateOfBirth: "1990-05-20",
                    gender: "Male",
                    status: "Active",
                    employmentType: "Full-Time",
                    departmentId: "DEPT001",
                    designationId: "DES001",
                    locationId: "LOC001",
                    profileImage: "RK"
                },
                {
                    id: "EMP002",
                    employeeCode: "FX2024002",
                    firstName: "Priya",
                    lastName: "Sharma",
                    email: "priya.sharma@fixlsolutions.com",
                    phone: "+91 98765 43211",
                    dateOfJoining: "2024-02-01",
                    dateOfBirth: "1992-08-15",
                    gender: "Female",
                    status: "Active",
                    employmentType: "Full-Time",
                    departmentId: "DEPT002",
                    designationId: "DES002",
                    locationId: "LOC001",
                    reportingManagerId: "EMP001",
                    profileImage: "PS"
                },
                {
                    id: "EMP003",
                    employeeCode: "FX2024003",
                    firstName: "Amit",
                    lastName: "Patel",
                    email: "amit.patel@fixlsolutions.com",
                    phone: "+91 98765 43212",
                    dateOfJoining: "2023-11-10",
                    dateOfBirth: "1988-03-25",
                    gender: "Male",
                    status: "Active",
                    employmentType: "Full-Time",
                    departmentId: "DEPT001",
                    designationId: "DES003",
                    locationId: "LOC002",
                    reportingManagerId: "EMP001",
                    profileImage: "AP"
                }
            ],

            departments: [
                {
                    id: "DEPT001",
                    name: "Engineering",
                    code: "ENG",
                    headId: "EMP001",
                    description: "Product development and technical operations",
                    employeeCount: 45,
                    createdAt: "2023-01-01",
                    isActive: true
                },
                {
                    id: "DEPT002",
                    name: "Human Resources",
                    code: "HR",
                    headId: "EMP002",
                    description: "Talent acquisition, employee engagement, and compliance",
                    employeeCount: 12,
                    createdAt: "2023-01-01",
                    isActive: true
                },
                {
                    id: "DEPT003",
                    name: "Sales & Marketing",
                    code: "SALES",
                    description: "Revenue generation and brand management",
                    employeeCount: 28,
                    createdAt: "2023-01-01",
                    isActive: true
                },
                {
                    id: "DEPT004",
                    name: "Finance & Accounts",
                    code: "FIN",
                    description: "Financial planning, accounting, and compliance",
                    employeeCount: 15,
                    createdAt: "2023-01-01",
                    isActive: true
                }
            ],

            designations: [
                {
                    id: "DES001",
                    title: "Senior Engineering Manager",
                    code: "SEM",
                    level: 4,
                    grade: "L4",
                    departmentId: "DEPT001",
                    description: "Leads engineering teams and technical strategy",
                    employeeCount: 5,
                    createdAt: "2023-01-01",
                    isActive: true
                },
                {
                    id: "DES002",
                    title: "HR Business Partner",
                    code: "HRBP",
                    level: 3,
                    grade: "M2",
                    departmentId: "DEPT002",
                    description: "Strategic HR support for business units",
                    employeeCount: 8,
                    createdAt: "2023-01-01",
                    isActive: true
                },
                {
                    id: "DES003",
                    title: "Software Engineer",
                    code: "SWE",
                    level: 2,
                    grade: "L2",
                    departmentId: "DEPT001",
                    description: "Develops and maintains software applications",
                    employeeCount: 32,
                    createdAt: "2023-01-01",
                    isActive: true
                }
            ],

            locations: [
                {
                    id: "LOC001",
                    name: "Bangalore HQ",
                    code: "BLR-HQ",
                    type: "Office",
                    address: {
                        street: "MG Road, Ashok Nagar",
                        city: "Bangalore",
                        state: "Karnataka",
                        country: "India",
                        pincode: "560001"
                    },
                    hrContactId: "EMP002",
                    employeeCount: 85,
                    timezone: "Asia/Kolkata",
                    isActive: true,
                    createdAt: "2023-01-01"
                },
                {
                    id: "LOC002",
                    name: "Mumbai Office",
                    code: "MUM-01",
                    type: "Office",
                    address: {
                        street: "Bandra Kurla Complex",
                        city: "Mumbai",
                        state: "Maharashtra",
                        country: "India",
                        pincode: "400051"
                    },
                    employeeCount: 42,
                    timezone: "Asia/Kolkata",
                    isActive: true,
                    createdAt: "2023-06-01"
                },
                {
                    id: "LOC003",
                    name: "Remote Workforce",
                    code: "REMOTE",
                    type: "Remote",
                    address: {
                        street: "N/A",
                        city: "Multiple",
                        state: "Multiple",
                        country: "India",
                        pincode: "000000"
                    },
                    employeeCount: 23,
                    timezone: "Asia/Kolkata",
                    isActive: true,
                    createdAt: "2023-01-01"
                }
            ],

            company: {
                name: "Fixl Solutions Pvt Ltd",
                tagline: "Empowering businesses through digital excellence",
                industry: "Information Technology",
                website: "https://fixlsolutions.com",
                registrationNumber: "U72900KA2023PTC123456",
                panNumber: "ABCDE1234F",
                gstin: "29ABCDE1234F1Z5",
                incorporationDate: "2023-01-01",
                contactEmail: "info@fixlsolutions.com",
                contactPhone: "+91 80 1234 5678",
                supportEmail: "support@fixlsolutions.com",
                address: {
                    building: "Prestige Cyber Towers",
                    area: "Ashok Nagar",
                    city: "Bangalore",
                    state: "Karnataka",
                    country: "India",
                    pincode: "560001"
                },
                socialLinks: {
                    linkedin: "https://linkedin.com/company/fixl-solutions",
                    twitter: "https://twitter.com/fixlsolutions",
                    facebook: "https://facebook.com/fixlsolutions"
                }
            },

            // Company Actions
            updateCompany: (updates) => set((state) => ({
                company: { ...state.company, ...updates }
            })),

            holidays: [
                { id: "HOL001", name: "New Year's Day", date: "2024-01-01", type: "Public", locationIds: ["All"], year: 2024 },
                { id: "HOL002", name: "Republic Day", date: "2024-01-26", type: "Public", locationIds: ["All"], year: 2024 },
                { id: "HOL003", name: "Holi", date: "2024-03-25", type: "Public", locationIds: ["All"], year: 2024 },
                { id: "HOL004", name: "Eid-ul-Fitr", date: "2024-04-11", type: "Public", locationIds: ["All"], year: 2024 },
                { id: "HOL005", name: "Independence Day", date: "2024-08-15", type: "Public", locationIds: ["All"], year: 2024 },
                { id: "HOL006", name: "Gandhi Jayanti", date: "2024-10-02", type: "Public", locationIds: ["All"], year: 2024 },
                { id: "HOL007", name: "Diwali", date: "2024-11-01", type: "Public", locationIds: ["All"], year: 2024 },
                { id: "HOL008", name: "Christmas", date: "2024-12-25", type: "Public", locationIds: ["All"], year: 2024 },
            ],

            // Holiday Actions
            addHoliday: (holiday) => set((state) => ({
                holidays: [
                    { ...holiday, id: `HOL${String(state.holidays.length + 1).padStart(3, '0')}` },
                    ...state.holidays
                ]
            })),

            updateHoliday: (id, updates) => set((state) => ({
                holidays: state.holidays.map(h => h.id === id ? { ...h, ...updates } : h)
            })),

            deleteHoliday: (id) => set((state) => ({
                holidays: state.holidays.filter(h => h.id !== id)
            })),

            policies: [
                { id: "POL001", title: "Employee Code of Conduct", category: "HR", version: "2.1", effectiveDate: "2023-01-01", fileSize: "1.2 MB", lastUpdated: "2023-12-15" },
                { id: "POL002", title: "IT Security & Assets Policy", category: "IT", version: "1.5", effectiveDate: "2023-06-01", fileSize: "0.8 MB", lastUpdated: "2023-11-20" },
                { id: "POL003", title: "Sexual Harassment Policy (POSH)", category: "HR", version: "3.0", effectiveDate: "2023-01-01", fileSize: "1.5 MB", lastUpdated: "2023-12-28" },
                { id: "POL004", title: "Travel & Reimbursement Policy", category: "Finance", version: "1.2", effectiveDate: "2024-01-01", fileSize: "2.1 MB", lastUpdated: "2024-01-05" },
            ],

            // Policy Actions
            addPolicy: (policy) => set((state) => ({
                policies: [
                    { ...policy, id: `POL${String(state.policies.length + 1).padStart(3, '0')}` },
                    ...state.policies
                ]
            })),

            updatePolicy: (id, updates) => set((state) => ({
                policies: state.policies.map(p => p.id === id ? { ...p, ...updates } : p)
            })),

            deletePolicy: (id) => set((state) => ({
                policies: state.policies.filter(p => p.id !== id)
            })),

            teams: [
                {
                    id: "T001",
                    name: "Talent Acquisition",
                    departmentId: "DEPT001",
                    leadId: "EMP001",
                    mission: "Scaling our workforce with top-tier global talent while ensuring cultural alignment.",
                    memberIds: ["EMP001", "EMP002"],
                    stats: { velocity: 88, tasksCompleted: 142, uptime: "99.2%" },
                    createdAt: "2024-01-01"
                },
                {
                    id: "T002",
                    name: "Frontend Platform",
                    departmentId: "DEPT001",
                    leadId: "EMP003",
                    mission: "Building the world's most intuitive and high-performance user interfaces.",
                    memberIds: ["EMP003"],
                    stats: { velocity: 94, tasksCompleted: 450, uptime: "99.9%" },
                    createdAt: "2024-01-01"
                }
            ],

            // Team Actions
            addTeam: (team) => set((state) => ({
                teams: [
                    {
                        ...team,
                        id: `T${String(state.teams.length + 1).padStart(3, '0')}`,
                        createdAt: new Date().toISOString()
                    },
                    ...state.teams
                ]
            })),

            updateTeam: (id, updates) => set((state) => ({
                teams: state.teams.map(t => t.id === id ? { ...t, ...updates } : t)
            })),

            deleteTeam: (id) => set((state) => ({
                teams: state.teams.filter(t => t.id !== id)
            })),

            addTeamMember: (teamId, employeeId) => set((state) => ({
                teams: state.teams.map(t =>
                    t.id === teamId && !t.memberIds.includes(employeeId)
                        ? { ...t, memberIds: [...t.memberIds, employeeId] }
                        : t
                )
            })),

            removeTeamMember: (teamId, employeeId) => set((state) => ({
                teams: state.teams.map(t =>
                    t.id === teamId
                        ? { ...t, memberIds: t.memberIds.filter(id => id !== employeeId) }
                        : t
                )
            })),

            // Employee Actions
            addEmployee: (employee) => set((state) => ({
                employees: [
                    { ...employee, id: `EMP${String(state.employees.length + 1).padStart(3, '0')}` },
                    ...state.employees
                ]
            })),

            updateEmployee: (id, updates) => set((state) => ({
                employees: state.employees.map(e => e.id === id ? { ...e, ...updates } : e)
            })),

            deleteEmployee: (id) => set((state) => ({
                employees: state.employees.filter(e => e.id !== id)
            })),

            bulkImportEmployees: (employees) => set((state) => ({
                employees: [
                    ...employees.map((emp, idx) => ({
                        ...emp,
                        id: `EMP${String(state.employees.length + idx + 1).padStart(3, '0')}`
                    })),
                    ...state.employees
                ]
            })),

            // Department Actions
            addDepartment: (department) => set((state) => ({
                departments: [
                    {
                        ...department,
                        id: `DEPT${String(state.departments.length + 1).padStart(3, '0')}`,
                        employeeCount: 0,
                        createdAt: new Date().toISOString()
                    },
                    ...state.departments
                ]
            })),

            updateDepartment: (id, updates) => set((state) => ({
                departments: state.departments.map(d => d.id === id ? { ...d, ...updates } : d)
            })),

            deleteDepartment: (id) => set((state) => ({
                departments: state.departments.filter(d => d.id !== id)
            })),

            // Designation Actions
            addDesignation: (designation) => set((state) => ({
                designations: [
                    {
                        ...designation,
                        id: `DES${String(state.designations.length + 1).padStart(3, '0')}`,
                        employeeCount: 0,
                        createdAt: new Date().toISOString()
                    },
                    ...state.designations
                ]
            })),

            updateDesignation: (id, updates) => set((state) => ({
                designations: state.designations.map(d => d.id === id ? { ...d, ...updates } : d)
            })),

            deleteDesignation: (id) => set((state) => ({
                designations: state.designations.filter(d => d.id !== id)
            })),

            // Location Actions
            addLocation: (location) => set((state) => ({
                locations: [
                    {
                        ...location,
                        id: `LOC${String(state.locations.length + 1).padStart(3, '0')}`,
                        employeeCount: 0,
                        createdAt: new Date().toISOString()
                    },
                    ...state.locations
                ]
            })),

            updateLocation: (id, updates) => set((state) => ({
                locations: state.locations.map(l => l.id === id ? { ...l, ...updates } : l)
            })),

            deleteLocation: (id) => set((state) => ({
                locations: state.locations.filter(l => l.id !== id)
            })),

            // Computed Metrics
            getMetrics: () => {
                const state = get();
                const activeEmployees = state.employees.filter(e => e.status === 'Active');
                const onNotice = state.employees.filter(e => e.status === 'On Notice');

                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();

                const newJoineesThisMonth = state.employees.filter(e => {
                    const joinDate = new Date(e.dateOfJoining);
                    return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
                }).length;

                const exitsThisMonth = state.employees.filter(e => {
                    if (!e.exitDate) return false;
                    const exitDate = new Date(e.exitDate);
                    return exitDate.getMonth() === currentMonth && exitDate.getFullYear() === currentYear;
                }).length;

                return {
                    totalHeadcount: state.employees.length,
                    activeEmployees: activeEmployees.length,
                    onNotice: onNotice.length,
                    newJoineesThisMonth,
                    exitsThisMonth,
                    attritionRate: state.employees.length > 0 ? (exitsThisMonth / state.employees.length) * 100 : 0,
                    avgTenure: 2.5, // Placeholder calculation
                    departmentDistribution: state.departments.map(d => ({
                        departmentId: d.id,
                        count: state.employees.filter(e => e.departmentId === d.id).length
                    })),
                    locationDistribution: state.locations.map(l => ({
                        locationId: l.id,
                        count: state.employees.filter(e => e.locationId === l.id).length
                    })),
                    employmentTypeDistribution: [
                        { type: 'Full-Time', count: state.employees.filter(e => e.employmentType === 'Full-Time').length },
                        { type: 'Part-Time', count: state.employees.filter(e => e.employmentType === 'Part-Time').length },
                        { type: 'Contract', count: state.employees.filter(e => e.employmentType === 'Contract').length },
                        { type: 'Intern', count: state.employees.filter(e => e.employmentType === 'Intern').length }
                    ]
                };
            }
        }),
        {
            name: 'organisation-storage-v1',
        }
    )
);
