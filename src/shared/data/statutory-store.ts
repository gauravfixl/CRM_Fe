import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PFRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    uan: string;
    month: string;
    basicPay: number;
    employeeContribution: number; // 12% of basic
    employerContribution: number; // 12% of basic (3.67% EPF + 8.33% EPS)
    epsContribution: number;
    edliContribution: number;
    status: 'Pending' | 'Filed' | 'Paid';
}

export interface ESIRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    esicNumber: string;
    month: string;
    grossWage: number;
    esiEmployee: number; // 0.75%
    esiEmployer: number; // 3.25%
    status: 'Pending' | 'Filed' | 'Paid';
}

export interface PTRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    state: string;
    month: string;
    grossSalary: number;
    ptDeduction: number;
    status: 'Pending' | 'Filed' | 'Paid';
}

export interface PTSlab {
    state: string;
    slabs: { from: number; to: number; tax: number }[];
    frequency: 'Monthly' | 'Quarterly' | 'Half-Yearly';
}

export interface LWFRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    state: string;
    employeeContribution: number;
    employerContribution: number;
    period: string;
    status: 'Pending' | 'Filed' | 'Paid';
}

export interface GratuityRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    dateOfJoining: string;
    yearsOfService: number;
    lastDrawnSalary: number;
    gratuityAmount: number;
    status: 'Not Eligible' | 'Eligible' | 'Provisioned' | 'Paid';
}

export interface Form16Record {
    id: string;
    employeeId: string;
    employeeName: string;
    fiscalYear: string;
    partAStatus: 'Pending' | 'Generated' | 'Issued';
    partBStatus: 'Pending' | 'Generated' | 'Issued';
    generatedDate?: string;
    totalIncome: number;
    totalTaxDeducted: number;
}

export interface Form24QRecord {
    id: string;
    fiscalYear: string;
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    status: 'Pending' | 'Filed' | 'Acknowledged';
    filingDate?: string;
    employeeCount: number;
    totalTaxDeducted: number;
}

export interface ComplianceEvent {
    id: string;
    type: 'PF' | 'ESI' | 'PT' | 'LWF' | 'TDS' | 'Form16';
    title: string;
    dueDate: string;
    status: 'Upcoming' | 'Due Today' | 'Overdue' | 'Completed';
}

// ── Store Interface ────────────────────────────────────────────────────────────

interface StatutoryState {
    pfRecords: PFRecord[];
    esiRecords: ESIRecord[];
    ptRecords: PTRecord[];
    ptSlabs: PTSlab[];
    lwfRecords: LWFRecord[];
    gratuityRecords: GratuityRecord[];
    form16Records: Form16Record[];
    form24QRecords: Form24QRecord[];
    complianceEvents: ComplianceEvent[];

    // PF Actions
    addPFRecord: (record: PFRecord) => void;
    updatePFRecord: (id: string, updates: Partial<PFRecord>) => void;
    deletePFRecord: (id: string) => void;

    // ESI Actions
    addESIRecord: (record: ESIRecord) => void;
    updateESIRecord: (id: string, updates: Partial<ESIRecord>) => void;
    deleteESIRecord: (id: string) => void;

    // PT Actions
    addPTRecord: (record: PTRecord) => void;
    updatePTRecord: (id: string, updates: Partial<PTRecord>) => void;
    deletePTRecord: (id: string) => void;

    // LWF Actions
    addLWFRecord: (record: LWFRecord) => void;
    updateLWFRecord: (id: string, updates: Partial<LWFRecord>) => void;
    deleteLWFRecord: (id: string) => void;

    // Gratuity Actions
    addGratuityRecord: (record: GratuityRecord) => void;
    updateGratuityRecord: (id: string, updates: Partial<GratuityRecord>) => void;
    deleteGratuityRecord: (id: string) => void;

    // Form16 Actions
    addForm16Record: (record: Form16Record) => void;
    updateForm16Record: (id: string, updates: Partial<Form16Record>) => void;
    deleteForm16Record: (id: string) => void;

    // Form24Q Actions
    addForm24QRecord: (record: Form24QRecord) => void;
    updateForm24QRecord: (id: string, updates: Partial<Form24QRecord>) => void;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const mockPFRecords: PFRecord[] = [
    { id: 'pf-1', employeeId: 'EMP001', employeeName: 'Arjun Mehta', uan: '100234567891', month: 'Mar 2026', basicPay: 45000, employeeContribution: 5400, employerContribution: 5400, epsContribution: 3749, edliContribution: 675, status: 'Paid' },
    { id: 'pf-2', employeeId: 'EMP002', employeeName: 'Priya Sharma', uan: '100234567892', month: 'Mar 2026', basicPay: 38000, employeeContribution: 4560, employerContribution: 4560, epsContribution: 3165, edliContribution: 570, status: 'Filed' },
    { id: 'pf-3', employeeId: 'EMP003', employeeName: 'Rahul Iyer', uan: '100234567893', month: 'Mar 2026', basicPay: 52000, employeeContribution: 6240, employerContribution: 6240, epsContribution: 4329, edliContribution: 780, status: 'Pending' },
    { id: 'pf-4', employeeId: 'EMP004', employeeName: 'Sneha Kulkarni', uan: '100234567894', month: 'Mar 2026', basicPay: 35000, employeeContribution: 4200, employerContribution: 4200, epsContribution: 2912, edliContribution: 525, status: 'Paid' },
];

const mockESIRecords: ESIRecord[] = [
    { id: 'esi-1', employeeId: 'EMP005', employeeName: 'Vikram Reddy', esicNumber: '3100123456', month: 'Mar 2026', grossWage: 18000, esiEmployee: 135, esiEmployer: 585, status: 'Paid' },
    { id: 'esi-2', employeeId: 'EMP006', employeeName: 'Anjali Nair', esicNumber: '3100123457', month: 'Mar 2026', grossWage: 20500, esiEmployee: 154, esiEmployer: 666, status: 'Filed' },
    { id: 'esi-3', employeeId: 'EMP007', employeeName: 'Karthik Das', esicNumber: '3100123458', month: 'Mar 2026', grossWage: 16200, esiEmployee: 122, esiEmployer: 527, status: 'Pending' },
    { id: 'esi-4', employeeId: 'EMP008', employeeName: 'Meena Patel', esicNumber: '3100123459', month: 'Mar 2026', grossWage: 19800, esiEmployee: 149, esiEmployer: 644, status: 'Paid' },
];

const mockPTRecords: PTRecord[] = [
    { id: 'pt-1', employeeId: 'EMP001', employeeName: 'Arjun Mehta', state: 'Maharashtra', month: 'Mar 2026', grossSalary: 75000, ptDeduction: 200, status: 'Paid' },
    { id: 'pt-2', employeeId: 'EMP002', employeeName: 'Priya Sharma', state: 'Karnataka', month: 'Mar 2026', grossSalary: 63000, ptDeduction: 200, status: 'Filed' },
    { id: 'pt-3', employeeId: 'EMP003', employeeName: 'Rahul Iyer', state: 'Tamil Nadu', month: 'Mar 2026', grossSalary: 85000, ptDeduction: 208, status: 'Pending' },
    { id: 'pt-4', employeeId: 'EMP004', employeeName: 'Sneha Kulkarni', state: 'Maharashtra', month: 'Mar 2026', grossSalary: 58000, ptDeduction: 200, status: 'Paid' },
];

const mockPTSlabs: PTSlab[] = [
    { state: 'Maharashtra', slabs: [{ from: 0, to: 7500, tax: 0 }, { from: 7501, to: 10000, tax: 175 }, { from: 10001, to: 999999, tax: 200 }, { from: 10001, to: 999999, tax: 300 }], frequency: 'Monthly' },
    { state: 'Karnataka', slabs: [{ from: 0, to: 15000, tax: 0 }, { from: 15001, to: 25000, tax: 150 }, { from: 25001, to: 999999, tax: 200 }], frequency: 'Monthly' },
    { state: 'Tamil Nadu', slabs: [{ from: 0, to: 21000, tax: 0 }, { from: 21001, to: 30000, tax: 100 }, { from: 30001, to: 45000, tax: 235 }, { from: 45001, to: 60000, tax: 510 }, { from: 60001, to: 75000, tax: 760 }, { from: 75001, to: 999999, tax: 1095 }], frequency: 'Half-Yearly' },
    { state: 'West Bengal', slabs: [{ from: 0, to: 10000, tax: 0 }, { from: 10001, to: 15000, tax: 110 }, { from: 15001, to: 25000, tax: 130 }, { from: 25001, to: 40000, tax: 150 }, { from: 40001, to: 999999, tax: 200 }], frequency: 'Monthly' },
];

const mockLWFRecords: LWFRecord[] = [
    { id: 'lwf-1', employeeId: 'EMP001', employeeName: 'Arjun Mehta', state: 'Maharashtra', employeeContribution: 25, employerContribution: 75, period: 'Jan-Jun 2026', status: 'Paid' },
    { id: 'lwf-2', employeeId: 'EMP002', employeeName: 'Priya Sharma', state: 'Karnataka', employeeContribution: 20, employerContribution: 40, period: 'Jan-Jun 2026', status: 'Filed' },
    { id: 'lwf-3', employeeId: 'EMP003', employeeName: 'Rahul Iyer', state: 'Tamil Nadu', employeeContribution: 0, employerContribution: 0, period: 'Jan-Jun 2026', status: 'Pending' },
    { id: 'lwf-4', employeeId: 'EMP004', employeeName: 'Sneha Kulkarni', state: 'Maharashtra', employeeContribution: 25, employerContribution: 75, period: 'Jan-Jun 2026', status: 'Paid' },
];

const mockGratuityRecords: GratuityRecord[] = [
    { id: 'gr-1', employeeId: 'EMP010', employeeName: 'Suresh Kumar', dateOfJoining: '2018-03-15', yearsOfService: 8, lastDrawnSalary: 65000, gratuityAmount: 300000, status: 'Provisioned' },
    { id: 'gr-2', employeeId: 'EMP011', employeeName: 'Lakshmi Venkat', dateOfJoining: '2016-07-01', yearsOfService: 10, lastDrawnSalary: 82000, gratuityAmount: 473077, status: 'Eligible' },
    { id: 'gr-3', employeeId: 'EMP012', employeeName: 'Amit Joshi', dateOfJoining: '2022-01-10', yearsOfService: 4, lastDrawnSalary: 55000, gratuityAmount: 0, status: 'Not Eligible' },
    { id: 'gr-4', employeeId: 'EMP013', employeeName: 'Deepa Rajan', dateOfJoining: '2019-11-20', yearsOfService: 6, lastDrawnSalary: 72000, gratuityAmount: 249231, status: 'Provisioned' },
];

const mockForm16Records: Form16Record[] = [
    { id: 'f16-1', employeeId: 'EMP001', employeeName: 'Arjun Mehta', fiscalYear: '2025-26', partAStatus: 'Generated', partBStatus: 'Generated', generatedDate: '2026-04-01', totalIncome: 900000, totalTaxDeducted: 62400 },
    { id: 'f16-2', employeeId: 'EMP002', employeeName: 'Priya Sharma', fiscalYear: '2025-26', partAStatus: 'Generated', partBStatus: 'Pending', generatedDate: '2026-04-01', totalIncome: 756000, totalTaxDeducted: 41600 },
    { id: 'f16-3', employeeId: 'EMP003', employeeName: 'Rahul Iyer', fiscalYear: '2025-26', partAStatus: 'Pending', partBStatus: 'Pending', totalIncome: 1020000, totalTaxDeducted: 87600 },
    { id: 'f16-4', employeeId: 'EMP004', employeeName: 'Sneha Kulkarni', fiscalYear: '2025-26', partAStatus: 'Issued', partBStatus: 'Issued', generatedDate: '2026-03-28', totalIncome: 696000, totalTaxDeducted: 33200 },
];

const mockForm24QRecords: Form24QRecord[] = [
    { id: 'q24-1', fiscalYear: '2025-26', quarter: 'Q1', status: 'Acknowledged', filingDate: '2025-07-28', employeeCount: 124, totalTaxDeducted: 1850000 },
    { id: 'q24-2', fiscalYear: '2025-26', quarter: 'Q2', status: 'Acknowledged', filingDate: '2025-10-30', employeeCount: 128, totalTaxDeducted: 1920000 },
    { id: 'q24-3', fiscalYear: '2025-26', quarter: 'Q3', status: 'Filed', filingDate: '2026-01-29', employeeCount: 131, totalTaxDeducted: 2010000 },
    { id: 'q24-4', fiscalYear: '2025-26', quarter: 'Q4', status: 'Pending', employeeCount: 134, totalTaxDeducted: 2180000 },
];

const mockComplianceEvents: ComplianceEvent[] = [
    { id: 'ev-1', type: 'PF', title: 'PF ECR Filing - March 2026', dueDate: '2026-04-15', status: 'Upcoming' },
    { id: 'ev-2', type: 'ESI', title: 'ESI Challan - March 2026', dueDate: '2026-04-15', status: 'Upcoming' },
    { id: 'ev-3', type: 'TDS', title: 'TDS Payment - March 2026', dueDate: '2026-04-07', status: 'Due Today' },
    { id: 'ev-4', type: 'PT', title: 'PT Return - Q4 FY2025-26', dueDate: '2026-04-30', status: 'Upcoming' },
    { id: 'ev-5', type: 'Form16', title: 'Form 16 Issuance Deadline', dueDate: '2026-06-15', status: 'Upcoming' },
    { id: 'ev-6', type: 'LWF', title: 'LWF Filing - H2 FY2025-26', dueDate: '2026-04-30', status: 'Upcoming' },
    { id: 'ev-7', type: 'TDS', title: 'Form 24Q Q4 Filing', dueDate: '2026-05-31', status: 'Upcoming' },
];

// ── Store ──────────────────────────────────────────────────────────────────────

export const useStatutoryStore = create<StatutoryState>()(
    persist(
        (set) => ({
            pfRecords: mockPFRecords,
            esiRecords: mockESIRecords,
            ptRecords: mockPTRecords,
            ptSlabs: mockPTSlabs,
            lwfRecords: mockLWFRecords,
            gratuityRecords: mockGratuityRecords,
            form16Records: mockForm16Records,
            form24QRecords: mockForm24QRecords,
            complianceEvents: mockComplianceEvents,

            // PF
            addPFRecord: (record) => set((s) => ({ pfRecords: [...s.pfRecords, record] })),
            updatePFRecord: (id, updates) => set((s) => ({ pfRecords: s.pfRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
            deletePFRecord: (id) => set((s) => ({ pfRecords: s.pfRecords.filter((r) => r.id !== id) })),

            // ESI
            addESIRecord: (record) => set((s) => ({ esiRecords: [...s.esiRecords, record] })),
            updateESIRecord: (id, updates) => set((s) => ({ esiRecords: s.esiRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
            deleteESIRecord: (id) => set((s) => ({ esiRecords: s.esiRecords.filter((r) => r.id !== id) })),

            // PT
            addPTRecord: (record) => set((s) => ({ ptRecords: [...s.ptRecords, record] })),
            updatePTRecord: (id, updates) => set((s) => ({ ptRecords: s.ptRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
            deletePTRecord: (id) => set((s) => ({ ptRecords: s.ptRecords.filter((r) => r.id !== id) })),

            // LWF
            addLWFRecord: (record) => set((s) => ({ lwfRecords: [...s.lwfRecords, record] })),
            updateLWFRecord: (id, updates) => set((s) => ({ lwfRecords: s.lwfRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
            deleteLWFRecord: (id) => set((s) => ({ lwfRecords: s.lwfRecords.filter((r) => r.id !== id) })),

            // Gratuity
            addGratuityRecord: (record) => set((s) => ({ gratuityRecords: [...s.gratuityRecords, record] })),
            updateGratuityRecord: (id, updates) => set((s) => ({ gratuityRecords: s.gratuityRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
            deleteGratuityRecord: (id) => set((s) => ({ gratuityRecords: s.gratuityRecords.filter((r) => r.id !== id) })),

            // Form16
            addForm16Record: (record) => set((s) => ({ form16Records: [...s.form16Records, record] })),
            updateForm16Record: (id, updates) => set((s) => ({ form16Records: s.form16Records.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
            deleteForm16Record: (id) => set((s) => ({ form16Records: s.form16Records.filter((r) => r.id !== id) })),

            // Form24Q
            addForm24QRecord: (record) => set((s) => ({ form24QRecords: [...s.form24QRecords, record] })),
            updateForm24QRecord: (id, updates) => set((s) => ({ form24QRecords: s.form24QRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
        }),
        { name: 'statutory-compliance-storage' }
    )
);
