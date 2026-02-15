import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SalaryComponent {
    id: string;
    name: string;
    type: 'Earning' | 'Deduction';
    amountType: 'Fixed' | 'Percentage of Basic';
    value: number;
    isTaxable: boolean;
    isStatutory: boolean;
}

export interface ReimbursementClaim {
    id: string;
    employeeName: string;
    employeeId: string;
    category: string;
    amount: number;
    receiptUrl?: string;
    submittedDate: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
    remarks?: string;
    taxable: boolean;
}

export interface TaxDeclaration {
    id: string;
    employeeId: string;
    employeeName: string;
    fiscalYear: string;
    regime: 'Old' | 'New';
    status: 'Pending' | 'submitted' | 'Verified';
    totalSavings: number;
    estimatedTax: number;
    declarations: {
        category: string; // e.g., "80C", "HRA", "80D"
        amount: number;
    }[];
    submittedDate?: string;
}

export interface InvestmentProof {
    id: string;
    employeeId: string;
    employeeName: string;
    type: string;
    amount: number;
    documentUrl: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedDate: string;
    remarks?: string;
}

export interface PayRun {
    id: string;
    month: string;
    status: 'Draft' | 'Processing' | 'Approved' | 'Locked' | 'Paid';
    totalNetPay: number;
    totalDeductions: number;
    totalTDS: number;
    totalEmployees: number;
    inclusionCount: number;
    exclusionCount: number;
    processedAt?: string;
    step: number; // 0: Input, 1: Preview, 2: Approve, 3: Completed
}

export interface Payslip {
    id: string;
    employeeName: string;
    employeeId: string;
    month: string;
    netAmount: number;
    status: 'Pending' | 'Generated' | 'Distributed';
    generatedDate?: string;
}

interface PayrollState {
    salaryComponents: SalaryComponent[];
    payRuns: PayRun[];
    claims: ReimbursementClaim[];
    declarations: TaxDeclaration[];
    proofs: InvestmentProof[];
    payslips: Payslip[];
    statutorySettings: {
        pfEnabled: boolean;
        pfRate: number;
        esiEnabled: boolean;
        esiRate: number;
        tdsEnabled: boolean;
        ptEnabled: boolean;
    };
    declarationWindowOpen: boolean;
    proofWindowOpen: boolean;

    // Actions
    addPayRun: (run: Omit<PayRun, 'id'>) => void;
    updatePayRun: (id: string, updates: Partial<PayRun>) => void;
    deletePayRun: (id: string) => void;

    addClaim: (claim: Omit<ReimbursementClaim, 'id'>) => void;
    updateClaim: (id: string, updates: Partial<ReimbursementClaim>) => void;
    deleteClaim: (id: string) => void;
    updateClaimStatus: (id: string, status: ReimbursementClaim['status'], remarks?: string) => void;

    addDeclaration: (declaration: Omit<TaxDeclaration, 'id'>) => void;
    updateDeclaration: (id: string, updates: Partial<TaxDeclaration>) => void;
    deleteDeclaration: (id: string) => void;
    updateDeclarationStatus: (id: string, status: TaxDeclaration['status']) => void;

    addProof: (proof: Omit<InvestmentProof, 'id'>) => void;
    updateProof: (id: string, updates: Partial<InvestmentProof>) => void;
    deleteProof: (id: string) => void;
    updateProofStatus: (id: string, status: InvestmentProof['status'], remarks?: string) => void;

    addPayslip: (payslip: Omit<Payslip, 'id'>) => void;
    updatePayslipStatus: (id: string, status: Payslip['status']) => void;
    deletePayslip: (id: string) => void;

    addComponent: (component: Omit<SalaryComponent, 'id'>) => void;
    updateComponent: (id: string, updates: Partial<SalaryComponent>) => void;
    deleteComponent: (id: string) => void;

    updateStatutorySettings: (settings: Partial<PayrollState['statutorySettings']>) => void;

    setDeclarationWindow: (open: boolean) => void;
    setProofWindow: (open: boolean) => void;
}

export const usePayrollStore = create<PayrollState>()(
    persist(
        (set) => ({
            salaryComponents: [
                { id: 'c1', name: 'Basic Pay', type: 'Earning', amountType: 'Fixed', value: 50000, isTaxable: true, isStatutory: true },
                { id: 'c2', name: 'HRA', type: 'Earning', amountType: 'Percentage of Basic', value: 40, isTaxable: true, isStatutory: false },
                { id: 'c3', name: 'Standard Deduction', type: 'Deduction', amountType: 'Fixed', value: 50000, isTaxable: false, isStatutory: true },
            ],
            payRuns: [
                { id: 'pr-1', month: 'January 2026', status: 'Draft', totalNetPay: 12500000, totalDeductions: 1500000, totalTDS: 850000, totalEmployees: 145, inclusionCount: 142, exclusionCount: 3, step: 0 },
                { id: 'pr-2', month: 'December 2025', status: 'Paid', totalNetPay: 12450000, totalDeductions: 1480000, totalTDS: 840000, totalEmployees: 144, inclusionCount: 144, exclusionCount: 0, processedAt: '2025-12-30', step: 3 },
            ],
            claims: [
                { id: 'cl-1', employeeName: 'Rajesh Kumar', employeeId: 'EMP001', category: 'Travel', amount: 4500, submittedDate: '2026-01-15', status: 'Pending', taxable: false },
                { id: 'cl-2', employeeName: 'Priya Sharma', employeeId: 'EMP002', category: 'Medical', amount: 12000, submittedDate: '2026-01-12', status: 'Approved', taxable: true },
            ],
            declarations: [
                { id: 'dec-1', employeeId: 'EMP001', employeeName: 'Rajesh Kumar', fiscalYear: '2025-26', regime: 'Old', status: 'Verified', totalSavings: 150000, estimatedTax: 45000, declarations: [{ category: '80C', amount: 150000 }], submittedDate: '2026-01-05' },
                { id: 'dec-2', employeeId: 'EMP002', employeeName: 'Priya Sharma', fiscalYear: '2025-26', regime: 'New', status: 'Pending', totalSavings: 0, estimatedTax: 12000, declarations: [], submittedDate: '2026-01-08' },
            ],
            proofs: [
                { id: 'pf-1', employeeId: 'EMP001', employeeName: 'Rajesh Kumar', type: 'LIC Receipt', amount: 45000, documentUrl: '#', status: 'Pending', submittedDate: '2026-01-18' },
            ],
            payslips: [
                { id: "PSL001", employeeName: "Rajesh Kumar", employeeId: "EMP001", month: "Jan 2026", netAmount: 92450, status: "Distributed", generatedDate: "Jan 31, 2026" },
                { id: "PSL002", employeeName: "Priya Sharma", employeeId: "EMP002", month: "Jan 2026", netAmount: 112000, status: "Generated", generatedDate: "Jan 31, 2026" },
                { id: "PSL003", employeeName: "Amit Patel", employeeId: "EMP003", month: "Jan 2026", netAmount: 78500, status: "Pending" },
                { id: "PSL004", employeeName: "Sneha Reddy", employeeId: "EMP004", month: "Dec 2025", netAmount: 85500, status: "Distributed", generatedDate: "Dec 30, 2025" },
            ],
            statutorySettings: {
                pfEnabled: true,
                pfRate: 12,
                esiEnabled: true,
                esiRate: 0.75,
                tdsEnabled: true,
                ptEnabled: true,
            },
            declarationWindowOpen: true,
            proofWindowOpen: false,

            addPayRun: (run) => set((state) => ({ payRuns: [{ ...run, id: `pr-${Date.now()}` }, ...state.payRuns] })),
            updatePayRun: (id, updates) => set((state) => ({
                payRuns: state.payRuns.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deletePayRun: (id) => set((state) => ({ payRuns: state.payRuns.filter(r => r.id !== id) })),

            addClaim: (claim) => set((state) => ({ claims: [{ ...claim, id: `cl-${Date.now()}` }, ...state.claims] })),
            updateClaim: (id, updates) => set((state) => ({
                claims: state.claims.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteClaim: (id) => set((state) => ({ claims: state.claims.filter(c => c.id !== id) })),
            updateClaimStatus: (id, status, remarks) => set((state) => ({
                claims: state.claims.map(c => c.id === id ? { ...c, status, remarks } : c)
            })),

            addDeclaration: (declaration) => set((state) => ({ declarations: [{ ...declaration, id: `dec-${Date.now()}` }, ...state.declarations] })),
            updateDeclaration: (id, updates) => set((state) => ({
                declarations: state.declarations.map(d => d.id === id ? { ...d, ...updates } : d)
            })),
            deleteDeclaration: (id) => set((state) => ({ declarations: state.declarations.filter(d => d.id !== id) })),
            updateDeclarationStatus: (id, status) => set((state) => ({
                declarations: state.declarations.map(d => d.id === id ? { ...d, status } : d)
            })),

            addProof: (proof) => set((state) => ({ proofs: [{ ...proof, id: `pf-${Date.now()}` }, ...state.proofs] })),
            updateProof: (id, updates) => set((state) => ({
                proofs: state.proofs.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            deleteProof: (id) => set((state) => ({ proofs: state.proofs.filter(p => p.id !== id) })),
            updateProofStatus: (id, status, remarks) => set((state) => ({
                proofs: state.proofs.map(p => p.id === id ? { ...p, status, remarks } : p)
            })),

            addPayslip: (payslip) => set((state) => ({ payslips: [{ ...payslip, id: `PSL-${Date.now()}` }, ...state.payslips] })),
            updatePayslipStatus: (id, status) => set((state) => ({
                payslips: state.payslips.map(p => p.id === id ? { ...p, status, generatedDate: status !== 'Pending' ? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : p.generatedDate } : p)
            })),
            deletePayslip: (id) => set((state) => ({
                payslips: state.payslips.filter(p => p.id !== id)
            })),

            addComponent: (component) => set((state) => ({ salaryComponents: [...state.salaryComponents, { ...component, id: `c-${Date.now()}` }] })),
            updateComponent: (id, updates) => set((state) => ({
                salaryComponents: state.salaryComponents.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteComponent: (id) => set((state) => ({ salaryComponents: state.salaryComponents.filter(c => c.id !== id) })),

            updateStatutorySettings: (settings) => set((state) => ({
                statutorySettings: { ...state.statutorySettings, ...settings }
            })),

            setDeclarationWindow: (open) => set({ declarationWindowOpen: open }),
            setProofWindow: (open) => set({ proofWindowOpen: open }),
        }),
        { name: 'payroll-v3-storage' }
    )
);
