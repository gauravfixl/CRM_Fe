import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TemplateComponent {
    componentId: string;
    name: string;
    type: 'Earning' | 'Deduction';
    calculationType: 'Fixed' | '% of Basic' | '% of CTC';
    value: number;
    isActive: boolean;
}

export interface SalaryTemplate {
    id: string;
    name: string;
    components: TemplateComponent[];
    ctcRange: string;
    isDefault: boolean;
}

export interface EMI {
    month: string;
    amount: number;
    principal: number;
    interest: number;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Loan {
    id: string;
    employeeId: string;
    employeeName: string;
    loanType: 'Salary Advance' | 'Personal Loan' | 'Emergency';
    principal: number;
    interestRate: number;
    tenure: number;
    emiAmount: number;
    disbursedDate: string;
    status: 'Active' | 'Closed' | 'Pending';
    remainingBalance: number;
    emis: EMI[];
}

export interface SalaryRevision {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    currentCTC: number;
    revisedCTC: number;
    incrementPercent: number;
    effectiveDate: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: string;
    linkedAppraisalId?: string;
}

export interface Entity {
    id: string;
    name: string;
    legalName: string;
    gstin: string;
    pan: string;
    address: string;
    state: string;
    isActive: boolean;
    employeeCount?: number;
    pfCode?: string;
    esiCode?: string;
    ptRegistration?: string;
    payrollProcessed?: boolean;
}

interface SalaryState {
    templates: SalaryTemplate[];
    loans: Loan[];
    revisions: SalaryRevision[];
    entities: Entity[];

    addTemplate: (template: Omit<SalaryTemplate, 'id'>) => void;
    updateTemplate: (id: string, updates: Partial<SalaryTemplate>) => void;
    deleteTemplate: (id: string) => void;

    addLoan: (loan: Omit<Loan, 'id'>) => void;
    updateLoan: (id: string, updates: Partial<Loan>) => void;
    deleteLoan: (id: string) => void;

    addRevision: (revision: Omit<SalaryRevision, 'id'>) => void;
    updateRevision: (id: string, updates: Partial<SalaryRevision>) => void;
    deleteRevision: (id: string) => void;

    addEntity: (entity: Omit<Entity, 'id'>) => void;
    updateEntity: (id: string, updates: Partial<Entity>) => void;
    deleteEntity: (id: string) => void;
}

export const useSalaryStore = create<SalaryState>()(
    persist(
        (set) => ({
            templates: [
                {
                    id: 'tpl-1',
                    name: 'Standard CTC Package',
                    components: [
                        { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 40, isActive: true },
                        { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 50, isActive: true },
                        { componentId: 'c3', name: 'DA', type: 'Earning', calculationType: '% of Basic', value: 10, isActive: true },
                        { componentId: 'c4', name: 'Special Allowance', type: 'Earning', calculationType: '% of CTC', value: 15, isActive: true },
                        { componentId: 'c5', name: 'Conveyance', type: 'Earning', calculationType: 'Fixed', value: 1600, isActive: true },
                        { componentId: 'c6', name: 'Medical Allowance', type: 'Earning', calculationType: 'Fixed', value: 1250, isActive: true },
                        { componentId: 'c7', name: 'PF (Employee)', type: 'Deduction', calculationType: '% of Basic', value: 12, isActive: true },
                        { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true },
                    ],
                    ctcRange: '4L - 12L',
                    isDefault: true,
                },
                {
                    id: 'tpl-2',
                    name: 'Senior Management Package',
                    components: [
                        { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 35, isActive: true },
                        { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 50, isActive: true },
                        { componentId: 'c4', name: 'Special Allowance', type: 'Earning', calculationType: '% of CTC', value: 20, isActive: true },
                        { componentId: 'c9', name: 'LTA', type: 'Earning', calculationType: '% of CTC', value: 5, isActive: true },
                        { componentId: 'c10', name: 'Performance Bonus', type: 'Earning', calculationType: '% of CTC', value: 10, isActive: true },
                        { componentId: 'c7', name: 'PF (Employee)', type: 'Deduction', calculationType: '% of Basic', value: 12, isActive: true },
                        { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true },
                    ],
                    ctcRange: '12L - 30L',
                    isDefault: false,
                },
                {
                    id: 'tpl-3',
                    name: 'Intern/Trainee Package',
                    components: [
                        { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 50, isActive: true },
                        { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 40, isActive: true },
                        { componentId: 'c5', name: 'Conveyance', type: 'Earning', calculationType: 'Fixed', value: 1600, isActive: true },
                        { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true },
                    ],
                    ctcRange: '1.8L - 4L',
                    isDefault: false,
                },
            ],

            loans: [
                {
                    id: 'ln-1', employeeId: 'EMP001', employeeName: 'Rajesh Kumar', loanType: 'Personal Loan',
                    principal: 200000, interestRate: 8.5, tenure: 24, emiAmount: 9075,
                    disbursedDate: '2025-06-15', status: 'Active', remainingBalance: 145200,
                    emis: [
                        { month: 'Jul 2025', amount: 9075, principal: 7658, interest: 1417, status: 'Paid' },
                        { month: 'Aug 2025', amount: 9075, principal: 7712, interest: 1363, status: 'Paid' },
                        { month: 'Sep 2025', amount: 9075, principal: 7767, interest: 1308, status: 'Paid' },
                        { month: 'Oct 2025', amount: 9075, principal: 7822, interest: 1253, status: 'Paid' },
                        { month: 'Nov 2025', amount: 9075, principal: 7878, interest: 1197, status: 'Paid' },
                        { month: 'Dec 2025', amount: 9075, principal: 7933, interest: 1142, status: 'Paid' },
                        { month: 'Jan 2026', amount: 9075, principal: 7990, interest: 1085, status: 'Pending' },
                    ],
                },
                {
                    id: 'ln-2', employeeId: 'EMP003', employeeName: 'Amit Patel', loanType: 'Emergency',
                    principal: 50000, interestRate: 0, tenure: 6, emiAmount: 8334,
                    disbursedDate: '2025-11-01', status: 'Active', remainingBalance: 33336,
                    emis: [
                        { month: 'Nov 2025', amount: 8334, principal: 8334, interest: 0, status: 'Paid' },
                        { month: 'Dec 2025', amount: 8334, principal: 8334, interest: 0, status: 'Paid' },
                        { month: 'Jan 2026', amount: 8334, principal: 8334, interest: 0, status: 'Pending' },
                    ],
                },
                {
                    id: 'ln-3', employeeId: 'EMP004', employeeName: 'Sneha Reddy', loanType: 'Salary Advance',
                    principal: 30000, interestRate: 0, tenure: 3, emiAmount: 10000,
                    disbursedDate: '2026-01-05', status: 'Pending', remainingBalance: 30000,
                    emis: [],
                },
                {
                    id: 'ln-4', employeeId: 'EMP002', employeeName: 'Priya Sharma', loanType: 'Personal Loan',
                    principal: 150000, interestRate: 7, tenure: 18, emiAmount: 8934,
                    disbursedDate: '2024-09-01', status: 'Closed', remainingBalance: 0,
                    emis: [
                        { month: 'Sep 2024', amount: 8934, principal: 8059, interest: 875, status: 'Paid' },
                        { month: 'Oct 2024', amount: 8934, principal: 8106, interest: 828, status: 'Paid' },
                    ],
                },
            ],

            revisions: [
                {
                    id: 'rev-1', employeeId: 'EMP001', employeeName: 'Rajesh Kumar', department: 'Engineering',
                    currentCTC: 1200000, revisedCTC: 1380000, incrementPercent: 15,
                    effectiveDate: '2026-04-01', reason: 'Annual Appraisal - Exceeds Expectations',
                    status: 'Approved', approvedBy: 'VP Engineering', linkedAppraisalId: 'APR-001',
                },
                {
                    id: 'rev-2', employeeId: 'EMP002', employeeName: 'Priya Sharma', department: 'Product',
                    currentCTC: 1500000, revisedCTC: 1680000, incrementPercent: 12,
                    effectiveDate: '2026-04-01', reason: 'Annual Appraisal - Meets Expectations',
                    status: 'Pending', linkedAppraisalId: 'APR-002',
                },
                {
                    id: 'rev-3', employeeId: 'EMP003', employeeName: 'Amit Patel', department: 'Engineering',
                    currentCTC: 900000, revisedCTC: 1035000, incrementPercent: 15,
                    effectiveDate: '2026-04-01', reason: 'Promotion - L3 to L4',
                    status: 'Pending', linkedAppraisalId: 'APR-003',
                },
                {
                    id: 'rev-4', employeeId: 'EMP004', employeeName: 'Sneha Reddy', department: 'Design',
                    currentCTC: 1000000, revisedCTC: 1080000, incrementPercent: 8,
                    effectiveDate: '2026-04-01', reason: 'Annual Appraisal - Meets Expectations',
                    status: 'Rejected', approvedBy: 'HR Head',
                },
            ],

            entities: [
                {
                    id: 'ent-1', name: 'Fixl Solutions Pvt. Ltd.', legalName: 'Fixl Solutions Private Limited',
                    gstin: '29AABCF1234D1ZF', pan: 'AABCF1234D',
                    address: '123, Tech Park, Whitefield, Bangalore', state: 'Karnataka', isActive: true,
                    employeeCount: 98, pfCode: 'BGBNG0012345', esiCode: 'KRBNG0012345000',
                    ptRegistration: 'PT/KA/2024/001234', payrollProcessed: true,
                },
                {
                    id: 'ent-2', name: 'Fixl Digital Services LLP', legalName: 'Fixl Digital Services LLP',
                    gstin: '27AAHFF5678L1ZB', pan: 'AAHFF5678L',
                    address: '456, Business Hub, BKC, Mumbai', state: 'Maharashtra', isActive: true,
                    employeeCount: 47, pfCode: 'MHBOM0067890', esiCode: 'MHBOM0067890000',
                    ptRegistration: 'PT/MH/2024/005678', payrollProcessed: false,
                },
            ],

            addTemplate: (template) => set((state) => ({ templates: [...state.templates, { ...template, id: `tpl-${Date.now()}` }] })),
            updateTemplate: (id, updates) => set((state) => ({
                templates: state.templates.map(t => t.id === id ? { ...t, ...updates } : t)
            })),
            deleteTemplate: (id) => set((state) => ({ templates: state.templates.filter(t => t.id !== id) })),

            addLoan: (loan) => set((state) => ({ loans: [...state.loans, { ...loan, id: `ln-${Date.now()}` }] })),
            updateLoan: (id, updates) => set((state) => ({
                loans: state.loans.map(l => l.id === id ? { ...l, ...updates } : l)
            })),
            deleteLoan: (id) => set((state) => ({ loans: state.loans.filter(l => l.id !== id) })),

            addRevision: (revision) => set((state) => ({ revisions: [...state.revisions, { ...revision, id: `rev-${Date.now()}` }] })),
            updateRevision: (id, updates) => set((state) => ({
                revisions: state.revisions.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteRevision: (id) => set((state) => ({ revisions: state.revisions.filter(r => r.id !== id) })),

            addEntity: (entity) => set((state) => ({ entities: [...state.entities, { ...entity, id: `ent-${Date.now()}` }] })),
            updateEntity: (id, updates) => set((state) => ({
                entities: state.entities.map(e => e.id === id ? { ...e, ...updates } : e)
            })),
            deleteEntity: (id) => set((state) => ({ entities: state.entities.filter(e => e.id !== id) })),
        }),
        { name: 'salary-store-v1' }
    )
);
