import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TemplateComponent {
    componentId: string;
    name: string;
    type: 'Earning' | 'Deduction' | 'Employer Contribution';
    calculationType: 'Fixed' | '% of Basic' | '% of CTC';
    value: number;
    isActive: boolean;
    isTaxable?: boolean;
    isStatutory?: boolean;
    description?: string;
}

export interface SalaryTemplate {
    id: string;
    name: string;
    description?: string;
    level?: string;
    components: TemplateComponent[];
    ctcRange: string;
    isDefault: boolean;
    isActive: boolean;
    assignedCount: number;
    // ─ Round 2 additions ─
    version?: number;
    parentTemplateId?: string;
    assignedEmployeeIds?: string[];
    lastModifiedDate?: string;
    changelog?: string;
}

export interface EMI {
    month: string;
    amount: number;
    principal: number;
    interest: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    paidDate?: string;
    paidInRunId?: string;
}

export interface LoanPrepayment {
    id: string;
    date: string;
    amount: number;
    type: 'Partial' | 'Full';
    notes?: string;
    processedBy?: string;
}

export interface Loan {
    id: string;
    employeeId: string;
    employeeName: string;
    empCode?: string;
    dept?: string;
    loanType: 'Salary Advance' | 'Personal Loan' | 'Emergency';
    principal: number;
    interestRate: number;
    tenure: number;
    emiAmount: number;
    disbursedDate: string;
    status: 'Active' | 'Closed' | 'Pending';
    remainingBalance: number;
    emis: EMI[];
    prepayments?: LoanPrepayment[];
    monthlyGross?: number;
    existingObligations?: number;
    eligibilityScore?: number;
    eligibilityNotes?: string;
}

export type RevisionApprovalStage = 'Manager' | 'HR' | 'Finance' | 'CEO';

export interface RevisionApprovalStep {
    stage: RevisionApprovalStage;
    status: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: string;
    approvedDate?: string;
    rejectionReason?: string;
    notes?: string;
}

export interface RevisionLetter {
    id: string;
    revisionId: string;
    templateType: 'Standard' | 'Promotion' | 'Retention' | 'Market Correction';
    letterNumber: string;
    generatedDate: string;
    generatedBy: string;
    bodyText: string;
    issued: boolean;
    issuedDate?: string;
}

export interface SalaryRevision {
    id: string;
    employeeId: string;
    employeeName: string;
    empCode?: string;
    department: string;
    designation?: string;
    currentCTC: number;
    revisedCTC: number;
    incrementPercent: number;
    revisionType?: 'Annual Appraisal' | 'Promotion' | 'Market Correction' | 'Retention Bonus' | 'Mid-year Adjustment';
    effectiveDate: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: string;
    approvedDate?: string;
    rejectedBy?: string;
    rejectedDate?: string;
    rejectionReason?: string;
    linkedAppraisalId?: string;
    arrearsFromDate?: string;
    arrearsAmount?: number;
    submittedDate?: string;
    comments?: RevisionComment[];
    // ─ Round 2 additions ─
    approvalChain?: RevisionApprovalStep[];
    currentApprovalStage?: RevisionApprovalStage | 'Complete';
    letterId?: string;
    budgetCategory?: string;
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

export interface EntityLocation {
    id: string;
    entityId: string;
    name: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
    type: 'HQ' | 'Branch' | 'Regional' | 'Remote';
    employeeCount: number;
    isActive: boolean;
}

export interface StatutoryRegistration {
    id: string;
    entityId: string;
    type: string;
    registrationNumber: string;
    state?: string;
    issuedDate?: string;
    expiryDate?: string;
    status: 'Active' | 'Pending' | 'Expired' | 'Suspended';
    notes?: string;
}

export interface EntityPayrollStatus {
    id: string;
    entityId: string;
    month: string;
    status: 'Draft' | 'Processing' | 'Processed' | 'Locked' | 'Paid';
    employeeCount: number;
    totalCost: number;
    processedDate?: string;
    notes?: string;
}

export interface EntityTransfer {
    id: string;
    employeeId: string;
    employeeName: string;
    fromEntityId: string;
    fromEntityName: string;
    toEntityId: string;
    toEntityName: string;
    effectiveDate: string;
    reason?: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    processedBy?: string;
    processedDate?: string;
    preservePF?: boolean;
    preserveESI?: boolean;
    preserveGratuity?: boolean;
}

export interface EntityComplianceSummary {
    entityId: string;
    entityName: string;
    registrationCount: number;
    expiredCount: number;
    activeRegistrations: number;
    locationsCount: number;
    employeeCount: number;
    lastPayrollMonth?: string;
    lastPayrollStatus?: string;
    healthScore: number;
}

export interface RevisionComment {
    id: string;
    author: string;
    text: string;
    timestamp: string;
}

interface SalaryState {
    templates: SalaryTemplate[];
    componentLibrary: TemplateComponent[];
    loans: Loan[];
    revisions: SalaryRevision[];
    entities: Entity[];
    locations: EntityLocation[];
    registrations: StatutoryRegistration[];
    entityPayrollStatus: EntityPayrollStatus[];
    entityTransfers: EntityTransfer[];
    revisionLetters: RevisionLetter[];

    addTemplate: (template: Omit<SalaryTemplate, 'id'>) => void;
    updateTemplate: (id: string, updates: Partial<SalaryTemplate>) => void;
    deleteTemplate: (id: string) => void;
    duplicateTemplate: (id: string) => void;

    // Round 2 — template advanced
    cloneTemplateAsVersion: (id: string, changelog?: string) => string | null;
    assignTemplateToEmployees: (templateId: string, employeeIds: string[]) => { assigned: number };
    unassignTemplateFromEmployees: (templateId: string, employeeIds: string[]) => { removed: number };
    computeCtcBreakdown: (templateId: string, ctc: number) => { componentName: string; monthly: number; annual: number; type: string }[];

    addLibraryComponent: (component: Omit<TemplateComponent, 'componentId'>) => void;
    updateLibraryComponent: (componentId: string, updates: Partial<TemplateComponent>) => void;
    deleteLibraryComponent: (componentId: string) => void;

    addLoan: (loan: Omit<Loan, 'id'>) => void;
    updateLoan: (id: string, updates: Partial<Loan>) => void;
    deleteLoan: (id: string) => void;
    bulkUpdateLoanStatus: (ids: string[], status: Loan['status']) => void;
    bulkDeleteLoans: (ids: string[]) => void;
    markEmiPaid: (loanId: string, month: string) => void;

    // Round 2 — loan advanced
    bulkMarkEmiPaid: (loanIds: string[], month: string) => { updated: number };
    recordPrepayment: (loanId: string, amount: number, type: 'Partial' | 'Full', notes?: string) => { newBalance: number; emisRemaining: number };
    computeLoanEligibility: (employeeId: string, requestedAmount: number, tenure: number, monthlyGross: number, existingObligations: number) => { eligibleAmount: number; maxEmi: number; score: number; notes: string };
    regenerateEmiSchedule: (loanId: string) => void;

    addRevision: (revision: Omit<SalaryRevision, 'id'>) => void;
    updateRevision: (id: string, updates: Partial<SalaryRevision>) => void;
    deleteRevision: (id: string) => void;
    approveRevision: (id: string, approvedBy: string) => void;
    rejectRevision: (id: string, reason: string) => void;
    bulkApproveRevisions: (ids: string[], approvedBy: string) => void;
    bulkDeleteRevisions: (ids: string[]) => void;
    addRevisionComment: (id: string, author: string, text: string) => void;

    // Round 2 — revision advanced
    advanceRevisionApproval: (id: string, approvedBy: string, notes?: string) => void;
    rejectRevisionStage: (id: string, stage: RevisionApprovalStage, rejectedBy: string, reason: string) => void;
    generateRevisionLetter: (revisionId: string, templateType: RevisionLetter['templateType'], generatedBy: string) => RevisionLetter;
    issueRevisionLetter: (letterId: string) => void;
    calculateArrears: (revisionId: string, fromDate: string, toDate: string) => { months: number; amount: number };
    bulkImportRevisions: (rows: Omit<SalaryRevision, 'id'>[]) => { added: number; skipped: number };
    getRevisionBudgetSummary: (effectiveYear: string) => { totalSpend: number; byCategory: Record<string, number>; byDept: Record<string, number>; count: number };

    addEntity: (entity: Omit<Entity, 'id'>) => void;
    updateEntity: (id: string, updates: Partial<Entity>) => void;
    deleteEntity: (id: string) => void;

    addLocation: (location: Omit<EntityLocation, 'id'>) => void;
    updateLocation: (id: string, updates: Partial<EntityLocation>) => void;
    deleteLocation: (id: string) => void;

    addRegistration: (registration: Omit<StatutoryRegistration, 'id'>) => void;
    updateRegistration: (id: string, updates: Partial<StatutoryRegistration>) => void;
    deleteRegistration: (id: string) => void;

    addEntityPayrollStatus: (status: Omit<EntityPayrollStatus, 'id'>) => void;
    updateEntityPayrollStatus: (id: string, updates: Partial<EntityPayrollStatus>) => void;
    deleteEntityPayrollStatus: (id: string) => void;

    // Round 2 — multi-entity advanced
    cloneEntity: (sourceEntityId: string, newName: string, newLegalName: string) => string | null;
    transferEmployee: (employeeId: string, employeeName: string, fromEntityId: string, toEntityId: string, effectiveDate: string, options?: { reason?: string; preservePF?: boolean; preserveESI?: boolean; preserveGratuity?: boolean }) => string;
    completeEntityTransfer: (transferId: string) => void;
    cancelEntityTransfer: (transferId: string) => void;
    bulkUpdateRegistrationStatus: (ids: string[], status: StatutoryRegistration['status']) => void;
    getEntityComplianceSummary: (entityId: string) => EntityComplianceSummary;
    getAllEntityComplianceSummaries: () => EntityComplianceSummary[];
}

export const useSalaryStore = create<SalaryState>()(
    persist(
        (set, get) => ({
            templates: [
                {
                    id: 'tpl-1',
                    name: 'Standard - Junior',
                    description: 'For junior level employees (L1-L3)',
                    level: 'Junior',
                    components: [
                        { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 40, isActive: true, isTaxable: true, isStatutory: true },
                        { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 50, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c3', name: 'DA', type: 'Earning', calculationType: '% of Basic', value: 10, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c4', name: 'Special Allowance', type: 'Earning', calculationType: '% of CTC', value: 15, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c5', name: 'Conveyance', type: 'Earning', calculationType: 'Fixed', value: 1600, isActive: true, isTaxable: false, isStatutory: false },
                        { componentId: 'c6', name: 'Medical Allowance', type: 'Earning', calculationType: 'Fixed', value: 1250, isActive: true, isTaxable: false, isStatutory: false },
                        { componentId: 'c7', name: 'PF (Employee)', type: 'Deduction', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true },
                        { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true, isTaxable: false, isStatutory: true },
                        { componentId: 'c9', name: 'PF (Employer)', type: 'Employer Contribution', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true },
                    ],
                    ctcRange: '4L - 12L',
                    isDefault: true,
                    isActive: true,
                    assignedCount: 48,
                },
                {
                    id: 'tpl-2',
                    name: 'Standard - Mid Level',
                    description: 'For mid level employees (L4-L6)',
                    level: 'Mid',
                    components: [
                        { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 35, isActive: true, isTaxable: true, isStatutory: true },
                        { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 50, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c4', name: 'Special Allowance', type: 'Earning', calculationType: '% of CTC', value: 25, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c5', name: 'Conveyance', type: 'Earning', calculationType: 'Fixed', value: 1600, isActive: true, isTaxable: false, isStatutory: false },
                        { componentId: 'c6', name: 'Medical Allowance', type: 'Earning', calculationType: 'Fixed', value: 1250, isActive: true, isTaxable: false, isStatutory: false },
                        { componentId: 'c7', name: 'PF (Employee)', type: 'Deduction', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true },
                        { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true, isTaxable: false, isStatutory: true },
                        { componentId: 'c9', name: 'PF (Employer)', type: 'Employer Contribution', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true },
                    ],
                    ctcRange: '12L - 25L',
                    isDefault: false,
                    isActive: true,
                    assignedCount: 62,
                },
                {
                    id: 'tpl-3',
                    name: 'Senior Management Package',
                    description: 'For senior level employees (L7-L9)',
                    level: 'Senior',
                    components: [
                        { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 30, isActive: true, isTaxable: true, isStatutory: true },
                        { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 50, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c4', name: 'Special Allowance', type: 'Earning', calculationType: '% of CTC', value: 20, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c10', name: 'LTA', type: 'Earning', calculationType: '% of CTC', value: 5, isActive: true, isTaxable: false, isStatutory: false },
                        { componentId: 'c11', name: 'Performance Bonus', type: 'Earning', calculationType: '% of CTC', value: 10, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c7', name: 'PF (Employee)', type: 'Deduction', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true },
                        { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true, isTaxable: false, isStatutory: true },
                        { componentId: 'c9', name: 'PF (Employer)', type: 'Employer Contribution', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true },
                    ],
                    ctcRange: '25L - 60L',
                    isDefault: false,
                    isActive: true,
                    assignedCount: 25,
                },
                {
                    id: 'tpl-4',
                    name: 'Executive Package',
                    description: 'For CXO and VP level leadership',
                    level: 'Executive',
                    components: [
                        { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 25, isActive: true, isTaxable: true, isStatutory: true },
                        { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 50, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c4', name: 'Special Allowance', type: 'Earning', calculationType: '% of CTC', value: 15, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c10', name: 'LTA', type: 'Earning', calculationType: '% of CTC', value: 8, isActive: true, isTaxable: false, isStatutory: false },
                        { componentId: 'c11', name: 'Performance Bonus', type: 'Earning', calculationType: '% of CTC', value: 15, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c12', name: 'Car Allowance', type: 'Earning', calculationType: 'Fixed', value: 25000, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c7', name: 'PF (Employee)', type: 'Deduction', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true },
                        { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true, isTaxable: false, isStatutory: true },
                        { componentId: 'c9', name: 'PF (Employer)', type: 'Employer Contribution', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true },
                    ],
                    ctcRange: '60L - 2Cr',
                    isDefault: false,
                    isActive: true,
                    assignedCount: 7,
                },
                {
                    id: 'tpl-5',
                    name: 'Intern Stipend',
                    description: 'For interns and trainees',
                    level: 'Intern',
                    components: [
                        { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 50, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 40, isActive: true, isTaxable: true, isStatutory: false },
                        { componentId: 'c5', name: 'Conveyance', type: 'Earning', calculationType: 'Fixed', value: 1600, isActive: true, isTaxable: false, isStatutory: false },
                        { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true, isTaxable: false, isStatutory: true },
                    ],
                    ctcRange: '1.8L - 4L',
                    isDefault: false,
                    isActive: false,
                    assignedCount: 12,
                },
            ],
            componentLibrary: [
                { componentId: 'c1', name: 'Basic Pay', type: 'Earning', calculationType: '% of CTC', value: 40, isActive: true, isTaxable: true, isStatutory: true, description: 'Foundation pay — basis for PF, HRA, gratuity' },
                { componentId: 'c2', name: 'HRA', type: 'Earning', calculationType: '% of Basic', value: 50, isActive: true, isTaxable: true, isStatutory: false, description: 'House rent allowance (metro: 50%, non-metro: 40%)' },
                { componentId: 'c3', name: 'DA', type: 'Earning', calculationType: '% of Basic', value: 10, isActive: true, isTaxable: true, isStatutory: false, description: 'Dearness allowance' },
                { componentId: 'c4', name: 'Special Allowance', type: 'Earning', calculationType: '% of CTC', value: 15, isActive: true, isTaxable: true, isStatutory: false, description: 'Flexible allowance component' },
                { componentId: 'c5', name: 'Conveyance', type: 'Earning', calculationType: 'Fixed', value: 1600, isActive: true, isTaxable: false, isStatutory: false, description: 'Transport to workplace' },
                { componentId: 'c6', name: 'Medical Allowance', type: 'Earning', calculationType: 'Fixed', value: 1250, isActive: true, isTaxable: false, isStatutory: false, description: 'Medical reimbursement' },
                { componentId: 'c10', name: 'LTA', type: 'Earning', calculationType: '% of CTC', value: 5, isActive: true, isTaxable: false, isStatutory: false, description: 'Leave Travel Allowance' },
                { componentId: 'c11', name: 'Performance Bonus', type: 'Earning', calculationType: '% of CTC', value: 10, isActive: true, isTaxable: true, isStatutory: false, description: 'Variable performance-linked bonus' },
                { componentId: 'c12', name: 'Car Allowance', type: 'Earning', calculationType: 'Fixed', value: 25000, isActive: true, isTaxable: true, isStatutory: false, description: 'Senior-level perk' },
                { componentId: 'c7', name: 'PF (Employee)', type: 'Deduction', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true, description: 'Employee provident fund contribution (12% of basic)' },
                { componentId: 'c8', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isActive: true, isTaxable: false, isStatutory: true, description: 'State professional tax' },
                { componentId: 'c13', name: 'ESI (Employee)', type: 'Deduction', calculationType: '% of Basic', value: 0.75, isActive: true, isTaxable: false, isStatutory: true, description: 'Employee state insurance (gross < 21K)' },
                { componentId: 'c9', name: 'PF (Employer)', type: 'Employer Contribution', calculationType: '% of Basic', value: 12, isActive: true, isTaxable: false, isStatutory: true, description: 'Employer PF contribution (3.67% EPF + 8.33% EPS)' },
                { componentId: 'c14', name: 'ESI (Employer)', type: 'Employer Contribution', calculationType: '% of Basic', value: 3.25, isActive: true, isTaxable: false, isStatutory: true, description: 'Employer ESI contribution' },
                { componentId: 'c15', name: 'Gratuity', type: 'Employer Contribution', calculationType: '% of Basic', value: 4.81, isActive: true, isTaxable: false, isStatutory: true, description: 'Gratuity provision (4.81% of basic)' },
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
                    id: 'rev-1', empCode: 'EMP001', employeeId: 'EMP001', employeeName: 'Rajesh Kumar',
                    department: 'Engineering', designation: 'Senior Engineer',
                    currentCTC: 1200000, revisedCTC: 1380000, incrementPercent: 15,
                    revisionType: 'Annual Appraisal',
                    effectiveDate: '2026-04-01', reason: 'Exceeds expectations — consistent delivery across 3 quarters.',
                    status: 'Approved', approvedBy: 'VP Engineering', approvedDate: '2026-03-28',
                    linkedAppraisalId: 'APR-001', submittedDate: '2026-03-20',
                    arrearsFromDate: '2026-04-01', arrearsAmount: 15000,
                    comments: [],
                },
                {
                    id: 'rev-2', empCode: 'EMP002', employeeId: 'EMP002', employeeName: 'Priya Sharma',
                    department: 'Product', designation: 'Product Manager',
                    currentCTC: 1500000, revisedCTC: 1680000, incrementPercent: 12,
                    revisionType: 'Annual Appraisal',
                    effectiveDate: '2026-04-01', reason: 'Meets expectations — strong product launches.',
                    status: 'Pending', linkedAppraisalId: 'APR-002', submittedDate: '2026-03-22',
                    comments: [],
                },
                {
                    id: 'rev-3', empCode: 'EMP003', employeeId: 'EMP003', employeeName: 'Amit Patel',
                    department: 'Sales', designation: 'Regional Sales Lead',
                    currentCTC: 900000, revisedCTC: 1035000, incrementPercent: 15,
                    revisionType: 'Promotion',
                    effectiveDate: '2026-04-01', reason: 'Promotion from L3 to L4 — exceeded sales targets.',
                    status: 'Pending', linkedAppraisalId: 'APR-003', submittedDate: '2026-03-23',
                    comments: [],
                },
                {
                    id: 'rev-4', empCode: 'EMP004', employeeId: 'EMP004', employeeName: 'Sneha Reddy',
                    department: 'HR', designation: 'HR Business Partner',
                    currentCTC: 1000000, revisedCTC: 1080000, incrementPercent: 8,
                    revisionType: 'Annual Appraisal',
                    effectiveDate: '2026-04-01', reason: 'Meets expectations.',
                    status: 'Rejected', rejectedBy: 'HR Head', rejectedDate: '2026-03-25',
                    rejectionReason: 'Budget overshoot for HR dept this cycle.',
                    submittedDate: '2026-03-20', comments: [],
                },
                {
                    id: 'rev-5', empCode: 'EMP005', employeeId: 'EMP005', employeeName: 'Vikram Singh',
                    department: 'Engineering', designation: 'Junior Engineer',
                    currentCTC: 500000, revisedCTC: 600000, incrementPercent: 20,
                    revisionType: 'Market Correction',
                    effectiveDate: '2026-05-01', reason: 'Market adjustment — below band for role.',
                    status: 'Pending', submittedDate: '2026-03-28', comments: [],
                },
                {
                    id: 'rev-6', empCode: 'EMP006', employeeId: 'EMP006', employeeName: 'Meera Iyer',
                    department: 'Design', designation: 'Senior Designer',
                    currentCTC: 1100000, revisedCTC: 1320000, incrementPercent: 20,
                    revisionType: 'Retention Bonus',
                    effectiveDate: '2026-04-01', reason: 'Retention — counter offer received.',
                    status: 'Approved', approvedBy: 'Design Head', approvedDate: '2026-03-29',
                    submittedDate: '2026-03-25',
                    arrearsFromDate: '2026-04-01', arrearsAmount: 18333,
                    comments: [],
                },
            ],

            entities: [
                {
                    id: 'ent-1', name: 'Fixl Solutions Pvt. Ltd.', legalName: 'Fixl Solutions Private Limited',
                    gstin: '29AABCF1234D1ZF', pan: 'AABCF1234D',
                    address: '123, Tech Park, Whitefield, Bangalore 560066', state: 'Karnataka', isActive: true,
                    employeeCount: 98, pfCode: 'BGBNG0012345', esiCode: 'KRBNG0012345000',
                    ptRegistration: 'PT/KA/2024/001234', payrollProcessed: true,
                },
                {
                    id: 'ent-2', name: 'Fixl Digital Services LLP', legalName: 'Fixl Digital Services LLP',
                    gstin: '27AAHFF5678L1ZB', pan: 'AAHFF5678L',
                    address: '456, Business Hub, BKC, Mumbai 400051', state: 'Maharashtra', isActive: true,
                    employeeCount: 47, pfCode: 'MHBOM0067890', esiCode: 'MHBOM0067890000',
                    ptRegistration: 'PT/MH/2024/005678', payrollProcessed: false,
                },
                {
                    id: 'ent-3', name: 'Fixl Global Technologies Inc.', legalName: 'Fixl Global Technologies Incorporated',
                    gstin: '', pan: 'AACCF9012M',
                    address: '789, Embassy Tech Park, Hebbal, Bangalore 560024', state: 'Karnataka', isActive: true,
                    employeeCount: 22, pfCode: 'KAGBL0089012', esiCode: '',
                    ptRegistration: 'PT/KA/2024/009012', payrollProcessed: false,
                },
            ],
            locations: [
                { id: 'loc-1', entityId: 'ent-1', name: 'Bangalore HQ', address: 'Tech Park, Whitefield, Bangalore', city: 'Bangalore', state: 'Karnataka', pincode: '560066', type: 'HQ', employeeCount: 85, isActive: true },
                { id: 'loc-2', entityId: 'ent-1', name: 'Bangalore Annex', address: 'Koramangala, Bangalore', city: 'Bangalore', state: 'Karnataka', pincode: '560034', type: 'Branch', employeeCount: 13, isActive: true },
                { id: 'loc-3', entityId: 'ent-2', name: 'Mumbai BKC', address: 'Business Hub, BKC, Mumbai', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', type: 'HQ', employeeCount: 32, isActive: true },
                { id: 'loc-4', entityId: 'ent-2', name: 'Pune Office', address: 'Hinjawadi Phase 2, Pune', city: 'Pune', state: 'Maharashtra', pincode: '411057', type: 'Branch', employeeCount: 15, isActive: true },
                { id: 'loc-5', entityId: 'ent-3', name: 'Hebbal Innovation Center', address: 'Embassy Tech Park, Hebbal, Bangalore', city: 'Bangalore', state: 'Karnataka', pincode: '560024', type: 'HQ', employeeCount: 22, isActive: true },
            ],
            registrations: [
                { id: 'reg-1', entityId: 'ent-1', type: 'PF Establishment Code', registrationNumber: 'BGBNG0012345000', state: 'Karnataka', issuedDate: '2022-04-01', status: 'Active' },
                { id: 'reg-2', entityId: 'ent-1', type: 'ESI Code', registrationNumber: 'KRBNG0012345000', state: 'Karnataka', issuedDate: '2022-04-15', status: 'Active' },
                { id: 'reg-3', entityId: 'ent-1', type: 'PT Registration', registrationNumber: 'PT/KA/2024/001234', state: 'Karnataka', issuedDate: '2023-08-10', status: 'Active' },
                { id: 'reg-4', entityId: 'ent-1', type: 'Shops & Establishment', registrationNumber: 'S&E/KA/BGL/78901', state: 'Karnataka', issuedDate: '2022-04-05', expiryDate: '2027-04-05', status: 'Active' },
                { id: 'reg-5', entityId: 'ent-2', type: 'PF Establishment Code', registrationNumber: 'MHBOM0067890000', state: 'Maharashtra', issuedDate: '2023-06-01', status: 'Active' },
                { id: 'reg-6', entityId: 'ent-2', type: 'ESI Code', registrationNumber: 'MHBOM0067890000', state: 'Maharashtra', status: 'Pending', notes: 'Awaiting final approval.' },
                { id: 'reg-7', entityId: 'ent-2', type: 'PT Registration', registrationNumber: 'PT/MH/2024/005678', state: 'Maharashtra', issuedDate: '2023-07-12', status: 'Active' },
                { id: 'reg-8', entityId: 'ent-3', type: 'PF Establishment Code', registrationNumber: 'KAGBL0089012000', state: 'Karnataka', issuedDate: '2025-01-10', status: 'Active' },
                { id: 'reg-9', entityId: 'ent-3', type: 'ESI Code', registrationNumber: '', state: 'Karnataka', status: 'Pending', notes: 'Application submitted 10 days ago.' },
            ],
            entityPayrollStatus: [
                { id: 'eps-1', entityId: 'ent-1', month: 'April 2026', status: 'Draft', employeeCount: 98, totalCost: 0 },
                { id: 'eps-2', entityId: 'ent-1', month: 'March 2026', status: 'Paid', employeeCount: 98, totalCost: 18500000, processedDate: '2026-03-31' },
                { id: 'eps-3', entityId: 'ent-1', month: 'February 2026', status: 'Paid', employeeCount: 96, totalCost: 18200000, processedDate: '2026-02-28' },
                { id: 'eps-4', entityId: 'ent-2', month: 'April 2026', status: 'Draft', employeeCount: 47, totalCost: 0 },
                { id: 'eps-5', entityId: 'ent-2', month: 'March 2026', status: 'Processed', employeeCount: 47, totalCost: 8900000, processedDate: '2026-03-30' },
                { id: 'eps-6', entityId: 'ent-2', month: 'February 2026', status: 'Paid', employeeCount: 45, totalCost: 8600000, processedDate: '2026-02-28' },
                { id: 'eps-7', entityId: 'ent-3', month: 'April 2026', status: 'Draft', employeeCount: 22, totalCost: 0 },
                { id: 'eps-8', entityId: 'ent-3', month: 'March 2026', status: 'Processing', employeeCount: 22, totalCost: 4200000 },
                { id: 'eps-9', entityId: 'ent-3', month: 'February 2026', status: 'Paid', employeeCount: 20, totalCost: 3800000, processedDate: '2026-02-28' },
            ],
            entityTransfers: [
                { id: 'etr-seed-1', employeeId: 'EMP003', employeeName: 'Amit Patel', fromEntityId: 'ent-1', fromEntityName: 'Fixl Solutions Pvt Ltd', toEntityId: 'ent-2', toEntityName: 'Fixl Digital Services', effectiveDate: '2026-03-01', reason: 'Organizational restructuring', status: 'Completed', processedBy: 'HR Manager', processedDate: '2026-03-01', preservePF: true, preserveESI: true, preserveGratuity: true },
                { id: 'etr-seed-2', employeeId: 'EMP010', employeeName: 'Ravi Mehta', fromEntityId: 'ent-2', fromEntityName: 'Fixl Digital Services', toEntityId: 'ent-3', toEntityName: 'Fixl Innovations', effectiveDate: '2026-05-01', reason: 'Project assignment', status: 'Scheduled', preservePF: true, preserveESI: true, preserveGratuity: true },
            ],
            revisionLetters: [
                { id: 'rl-seed-1', revisionId: 'rev-1', templateType: 'Standard', letterNumber: 'LTR-2026-0001', generatedDate: '2026-01-15', generatedBy: 'HR Manager', bodyText: 'Dear Employee,\n\nCongratulations on your revision.\n\nRegards,\nHR Team', issued: true, issuedDate: '2026-01-16' },
            ],

            addTemplate: (template) => set((state) => ({ templates: [...state.templates, { ...template, id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateTemplate: (id, updates) => set((state) => ({
                templates: state.templates.map(t => t.id === id ? { ...t, ...updates } : t)
            })),
            deleteTemplate: (id) => set((state) => ({ templates: state.templates.filter(t => t.id !== id) })),
            duplicateTemplate: (id) => set((state) => {
                const t = state.templates.find(tp => tp.id === id);
                if (!t) return {};
                const copy: SalaryTemplate = { ...t, id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, name: `${t.name} (Copy)`, assignedCount: 0, isDefault: false };
                return { templates: [...state.templates, copy] };
            }),

            // Round 2 — template advanced
            cloneTemplateAsVersion: (id, changelog) => {
                const state = get();
                const t = state.templates.find(tp => tp.id === id);
                if (!t) return null;
                const parentVersion = t.version ?? 1;
                const newId = `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
                const clone: SalaryTemplate = {
                    ...t,
                    id: newId,
                    name: `${t.name.replace(/ v\d+$/, '')} v${parentVersion + 1}`,
                    version: parentVersion + 1,
                    parentTemplateId: t.parentTemplateId ?? t.id,
                    assignedCount: 0,
                    assignedEmployeeIds: [],
                    isDefault: false,
                    lastModifiedDate: new Date().toISOString().split('T')[0],
                    changelog: changelog ?? `Version ${parentVersion + 1} cloned from ${t.name}`,
                };
                set((s) => ({ templates: [...s.templates, clone] }));
                return newId;
            },

            assignTemplateToEmployees: (templateId, employeeIds) => {
                let assigned = 0;
                set((state) => ({
                    templates: state.templates.map(t => {
                        if (t.id !== templateId) return t;
                        const existing = new Set(t.assignedEmployeeIds ?? []);
                        employeeIds.forEach(eid => { if (!existing.has(eid)) { existing.add(eid); assigned++; } });
                        const newList = Array.from(existing);
                        return { ...t, assignedEmployeeIds: newList, assignedCount: newList.length, lastModifiedDate: new Date().toISOString().split('T')[0] };
                    })
                }));
                return { assigned };
            },

            unassignTemplateFromEmployees: (templateId, employeeIds) => {
                let removed = 0;
                set((state) => ({
                    templates: state.templates.map(t => {
                        if (t.id !== templateId) return t;
                        const keep = (t.assignedEmployeeIds ?? []).filter(eid => {
                            if (employeeIds.includes(eid)) { removed++; return false; }
                            return true;
                        });
                        return { ...t, assignedEmployeeIds: keep, assignedCount: keep.length };
                    })
                }));
                return { removed };
            },

            computeCtcBreakdown: (templateId, ctc) => {
                const t = get().templates.find(tp => tp.id === templateId);
                if (!t) return [];
                const annualCtc = ctc;
                const basicPct = t.components.find(c => c.name === 'Basic Pay' && c.calculationType === '% of CTC')?.value ?? 40;
                const annualBasic = Math.round(annualCtc * basicPct / 100);
                return t.components.filter(c => c.isActive).map(c => {
                    let annual = 0;
                    if (c.calculationType === '% of CTC') annual = Math.round(annualCtc * c.value / 100);
                    else if (c.calculationType === '% of Basic') annual = Math.round(annualBasic * c.value / 100);
                    else if (c.calculationType === 'Fixed') annual = c.value * 12;
                    return {
                        componentName: c.name,
                        monthly: Math.round(annual / 12),
                        annual,
                        type: c.type,
                    };
                });
            },

            addLibraryComponent: (component) => set((state) => ({
                componentLibrary: [...state.componentLibrary, { ...component, componentId: `c-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateLibraryComponent: (componentId, updates) => set((state) => ({
                componentLibrary: state.componentLibrary.map(c => c.componentId === componentId ? { ...c, ...updates } : c)
            })),
            deleteLibraryComponent: (componentId) => set((state) => ({
                componentLibrary: state.componentLibrary.filter(c => c.componentId !== componentId)
            })),

            addLoan: (loan) => set((state) => ({ loans: [...state.loans, { ...loan, id: `ln-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateLoan: (id, updates) => set((state) => ({
                loans: state.loans.map(l => l.id === id ? { ...l, ...updates } : l)
            })),
            deleteLoan: (id) => set((state) => ({ loans: state.loans.filter(l => l.id !== id) })),
            bulkUpdateLoanStatus: (ids, status) => set((state) => ({
                loans: state.loans.map(l => ids.includes(l.id) ? { ...l, status } : l)
            })),
            bulkDeleteLoans: (ids) => set((state) => ({
                loans: state.loans.filter(l => !ids.includes(l.id))
            })),
            markEmiPaid: (loanId, month) => set((state) => ({
                loans: state.loans.map(l => {
                    if (l.id !== loanId) return l;
                    const updatedEmis = l.emis.map(e => e.month === month ? { ...e, status: 'Paid' as const, paidDate: new Date().toISOString().split('T')[0] } : e);
                    const paidPrincipal = updatedEmis.filter(e => e.status === 'Paid').reduce((s, e) => s + e.principal, 0);
                    const remainingBalance = Math.max(0, l.principal - paidPrincipal);
                    const allPaid = updatedEmis.every(e => e.status === 'Paid');
                    return { ...l, emis: updatedEmis, remainingBalance, status: (allPaid ? 'Closed' : l.status) as Loan['status'] };
                })
            })),

            bulkMarkEmiPaid: (loanIds, month) => {
                let updated = 0;
                set((state) => ({
                    loans: state.loans.map(l => {
                        if (!loanIds.includes(l.id)) return l;
                        const target = l.emis.find(e => e.month === month && e.status !== 'Paid');
                        if (!target) return l;
                        updated++;
                        const updatedEmis = l.emis.map(e => e.month === month ? { ...e, status: 'Paid' as const, paidDate: new Date().toISOString().split('T')[0] } : e);
                        const paidPrincipal = updatedEmis.filter(e => e.status === 'Paid').reduce((s, e) => s + e.principal, 0);
                        const remainingBalance = Math.max(0, l.principal - paidPrincipal);
                        const allPaid = updatedEmis.every(e => e.status === 'Paid');
                        return { ...l, emis: updatedEmis, remainingBalance, status: (allPaid ? 'Closed' : l.status) as Loan['status'] };
                    })
                }));
                return { updated };
            },

            recordPrepayment: (loanId, amount, type, notes) => {
                const state = get();
                const loan = state.loans.find(l => l.id === loanId);
                if (!loan) return { newBalance: 0, emisRemaining: 0 };
                const prepayment: LoanPrepayment = {
                    id: `pp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                    date: new Date().toISOString().split('T')[0],
                    amount,
                    type,
                    notes,
                    processedBy: 'Finance',
                };
                const newBalance = Math.max(0, loan.remainingBalance - amount);
                let updatedEmis = loan.emis;
                if (type === 'Full' || newBalance === 0) {
                    updatedEmis = loan.emis.map(e => e.status === 'Pending' ? { ...e, status: 'Paid' as const, paidDate: new Date().toISOString().split('T')[0] } : e);
                } else if (newBalance > 0) {
                    let runningBalance = newBalance;
                    const monthlyRate = loan.interestRate / 12 / 100;
                    updatedEmis = loan.emis.map(e => {
                        if (e.status === 'Paid') return e;
                        if (runningBalance <= 0) return { ...e, status: 'Paid' as const, paidDate: new Date().toISOString().split('T')[0] };
                        const interest = Math.round(runningBalance * monthlyRate);
                        const principal = Math.min(e.amount - interest, runningBalance);
                        runningBalance -= principal;
                        return { ...e, principal, interest };
                    });
                }
                const emisRemaining = updatedEmis.filter(e => e.status !== 'Paid').length;
                set((s) => ({
                    loans: s.loans.map(l => l.id === loanId ? {
                        ...l,
                        remainingBalance: newBalance,
                        emis: updatedEmis,
                        prepayments: [...(l.prepayments ?? []), prepayment],
                        status: (newBalance === 0 || type === 'Full') ? 'Closed' as const : l.status,
                    } : l)
                }));
                return { newBalance, emisRemaining };
            },

            computeLoanEligibility: (employeeId, requestedAmount, tenure, monthlyGross, existingObligations) => {
                const state = get();
                const takeHomeRatio = 0.5;
                const availableCapacity = Math.max(0, (monthlyGross * takeHomeRatio) - existingObligations);
                const maxEmi = availableCapacity;
                const interestRate = 0.10;
                const monthlyRate = interestRate / 12;
                const factor = (Math.pow(1 + monthlyRate, tenure) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, tenure));
                const eligibleAmount = Math.floor(maxEmi * factor);
                let score = 100;
                const notes: string[] = [];
                if (requestedAmount > eligibleAmount) { score -= 40; notes.push(`Requested ${requestedAmount} exceeds eligibility ${eligibleAmount}`); }
                if (monthlyGross < 25000) { score -= 20; notes.push('Low monthly income'); }
                const activeLoans = state.loans.filter(l => l.employeeId === employeeId && l.status === 'Active').length;
                if (activeLoans > 1) { score -= 20; notes.push(`${activeLoans} active loans already`); }
                if (tenure > 36) { score -= 10; notes.push('Long tenure increases risk'); }
                return { eligibleAmount, maxEmi: Math.round(maxEmi), score: Math.max(0, score), notes: notes.join(' · ') || 'Eligible' };
            },

            regenerateEmiSchedule: (loanId) => set((state) => ({
                loans: state.loans.map(l => {
                    if (l.id !== loanId) return l;
                    const monthlyRate = l.interestRate / 12 / 100;
                    let balance = l.remainingBalance;
                    const remaining = l.emis.filter(e => e.status !== 'Paid').length;
                    if (remaining === 0) return l;
                    const emi = Math.round(balance * monthlyRate * Math.pow(1 + monthlyRate, remaining) / (Math.pow(1 + monthlyRate, remaining) - 1));
                    let idx = 0;
                    const updatedEmis = l.emis.map(e => {
                        if (e.status === 'Paid') return e;
                        idx++;
                        const interest = Math.round(balance * monthlyRate);
                        const principal = idx === remaining ? balance : emi - interest;
                        balance = Math.max(0, balance - principal);
                        return { ...e, amount: emi, principal, interest };
                    });
                    return { ...l, emis: updatedEmis, emiAmount: emi };
                })
            })),

            addRevision: (revision) => set((state) => ({ revisions: [...state.revisions, { ...revision, id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateRevision: (id, updates) => set((state) => ({
                revisions: state.revisions.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteRevision: (id) => set((state) => ({ revisions: state.revisions.filter(r => r.id !== id) })),
            approveRevision: (id, approvedBy) => set((state) => ({
                revisions: state.revisions.map(r => r.id === id ? {
                    ...r,
                    status: 'Approved' as const,
                    approvedBy,
                    approvedDate: new Date().toISOString().split('T')[0],
                } : r)
            })),
            rejectRevision: (id, reason) => set((state) => ({
                revisions: state.revisions.map(r => r.id === id ? {
                    ...r,
                    status: 'Rejected' as const,
                    rejectionReason: reason,
                    rejectedBy: 'HR Manager',
                    rejectedDate: new Date().toISOString().split('T')[0],
                } : r)
            })),
            bulkApproveRevisions: (ids, approvedBy) => set((state) => ({
                revisions: state.revisions.map(r => ids.includes(r.id) ? {
                    ...r,
                    status: 'Approved' as const,
                    approvedBy,
                    approvedDate: new Date().toISOString().split('T')[0],
                } : r)
            })),
            bulkDeleteRevisions: (ids) => set((state) => ({
                revisions: state.revisions.filter(r => !ids.includes(r.id))
            })),
            addRevisionComment: (id, author, text) => set((state) => ({
                revisions: state.revisions.map(r => r.id === id ? {
                    ...r,
                    comments: [...(r.comments ?? []), {
                        id: `rcm-${Date.now()}`,
                        author, text,
                        timestamp: new Date().toISOString(),
                    }]
                } : r)
            })),

            // Round 2 — revision advanced
            advanceRevisionApproval: (id, approvedBy, notes) => set((state) => ({
                revisions: state.revisions.map(r => {
                    if (r.id !== id) return r;
                    const defaultChain: RevisionApprovalStep[] = [
                        { stage: 'Manager', status: 'Pending' },
                        { stage: 'HR', status: 'Pending' },
                        { stage: 'Finance', status: 'Pending' },
                    ];
                    const chain: RevisionApprovalStep[] = r.approvalChain ?? defaultChain;
                    const idx = chain.findIndex(s => s.status === 'Pending');
                    if (idx === -1) return r;
                    const updated = chain.map((s, i) => i === idx ? { ...s, status: 'Approved' as const, approvedBy, approvedDate: new Date().toISOString().split('T')[0], notes } : s);
                    const nextIdx = updated.findIndex(s => s.status === 'Pending');
                    const isComplete = nextIdx === -1;
                    return {
                        ...r,
                        approvalChain: updated,
                        currentApprovalStage: isComplete ? 'Complete' as const : updated[nextIdx].stage,
                        status: isComplete ? 'Approved' as const : r.status,
                        approvedBy: isComplete ? approvedBy : r.approvedBy,
                        approvedDate: isComplete ? new Date().toISOString().split('T')[0] : r.approvedDate,
                    };
                })
            })),

            rejectRevisionStage: (id, stage, rejectedBy, reason) => set((state) => ({
                revisions: state.revisions.map(r => {
                    if (r.id !== id) return r;
                    const chain = (r.approvalChain ?? []).map(s => s.stage === stage ? { ...s, status: 'Rejected' as const, rejectionReason: reason, approvedBy: rejectedBy, approvedDate: new Date().toISOString().split('T')[0] } : s);
                    return {
                        ...r,
                        approvalChain: chain,
                        status: 'Rejected' as const,
                        rejectedBy,
                        rejectedDate: new Date().toISOString().split('T')[0],
                        rejectionReason: reason,
                    };
                })
            })),

            generateRevisionLetter: (revisionId, templateType, generatedBy) => {
                const state = get();
                const revision = state.revisions.find(r => r.id === revisionId);
                const letterNumber = `LTR-${new Date().getFullYear()}-${String(state.revisionLetters.length + 1).padStart(4, '0')}`;
                const bodyText = revision ? (
                    `Dear ${revision.employeeName},\n\n` +
                    `We are pleased to inform you of your salary revision.\n\n` +
                    `Current CTC: ₹${revision.currentCTC.toLocaleString('en-IN')}\n` +
                    `Revised CTC: ₹${revision.revisedCTC.toLocaleString('en-IN')}\n` +
                    `Increment: ${revision.incrementPercent.toFixed(2)}%\n` +
                    `Effective Date: ${revision.effectiveDate}\n` +
                    `Reason: ${revision.reason}\n\n` +
                    `Congratulations!\n\nRegards,\nHR Team`
                ) : 'Letter body';
                const letter: RevisionLetter = {
                    id: `rl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                    revisionId,
                    templateType,
                    letterNumber,
                    generatedDate: new Date().toISOString().split('T')[0],
                    generatedBy,
                    bodyText,
                    issued: false,
                };
                set((s) => ({
                    revisionLetters: [letter, ...s.revisionLetters],
                    revisions: s.revisions.map(r => r.id === revisionId ? { ...r, letterId: letter.id } : r),
                }));
                return letter;
            },

            issueRevisionLetter: (letterId) => set((state) => ({
                revisionLetters: state.revisionLetters.map(l => l.id === letterId ? { ...l, issued: true, issuedDate: new Date().toISOString().split('T')[0] } : l)
            })),

            calculateArrears: (revisionId, fromDate, toDate) => {
                const revision = get().revisions.find(r => r.id === revisionId);
                if (!revision) return { months: 0, amount: 0 };
                const from = new Date(fromDate);
                const to = new Date(toDate);
                const monthsDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
                const months = Math.max(0, monthsDiff);
                const monthlyDelta = (revision.revisedCTC - revision.currentCTC) / 12;
                const amount = Math.round(monthlyDelta * months);
                set((state) => ({
                    revisions: state.revisions.map(r => r.id === revisionId ? { ...r, arrearsFromDate: fromDate, arrearsAmount: amount } : r)
                }));
                return { months, amount };
            },

            bulkImportRevisions: (rows) => {
                let added = 0, skipped = 0;
                const newRevisions: SalaryRevision[] = [];
                rows.forEach(row => {
                    if (!row.employeeName || !row.employeeId || !row.revisedCTC) { skipped++; return; }
                    newRevisions.push({ ...row, id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${added}` });
                    added++;
                });
                set((state) => ({ revisions: [...newRevisions, ...state.revisions] }));
                return { added, skipped };
            },

            getRevisionBudgetSummary: (effectiveYear) => {
                const state = get();
                const relevant = state.revisions.filter(r => r.effectiveDate.startsWith(effectiveYear) && r.status === 'Approved');
                const totalSpend = relevant.reduce((s, r) => s + (r.revisedCTC - r.currentCTC), 0);
                const byCategory: Record<string, number> = {};
                const byDept: Record<string, number> = {};
                relevant.forEach(r => {
                    const cat = r.revisionType ?? 'Other';
                    byCategory[cat] = (byCategory[cat] ?? 0) + (r.revisedCTC - r.currentCTC);
                    byDept[r.department] = (byDept[r.department] ?? 0) + (r.revisedCTC - r.currentCTC);
                });
                return { totalSpend, byCategory, byDept, count: relevant.length };
            },

            addEntity: (entity) => set((state) => ({ entities: [...state.entities, { ...entity, id: `ent-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateEntity: (id, updates) => set((state) => ({
                entities: state.entities.map(e => e.id === id ? { ...e, ...updates } : e)
            })),
            deleteEntity: (id) => set((state) => ({
                entities: state.entities.filter(e => e.id !== id),
                locations: state.locations.filter(l => l.entityId !== id),
                registrations: state.registrations.filter(r => r.entityId !== id),
                entityPayrollStatus: state.entityPayrollStatus.filter(s => s.entityId !== id),
            })),

            addLocation: (location) => set((state) => ({ locations: [...state.locations, { ...location, id: `loc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateLocation: (id, updates) => set((state) => ({
                locations: state.locations.map(l => l.id === id ? { ...l, ...updates } : l)
            })),
            deleteLocation: (id) => set((state) => ({ locations: state.locations.filter(l => l.id !== id) })),

            addRegistration: (registration) => set((state) => ({ registrations: [...state.registrations, { ...registration, id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateRegistration: (id, updates) => set((state) => ({
                registrations: state.registrations.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteRegistration: (id) => set((state) => ({ registrations: state.registrations.filter(r => r.id !== id) })),

            addEntityPayrollStatus: (status) => set((state) => ({ entityPayrollStatus: [...state.entityPayrollStatus, { ...status, id: `eps-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateEntityPayrollStatus: (id, updates) => set((state) => ({
                entityPayrollStatus: state.entityPayrollStatus.map(s => s.id === id ? { ...s, ...updates } : s)
            })),
            deleteEntityPayrollStatus: (id) => set((state) => ({ entityPayrollStatus: state.entityPayrollStatus.filter(s => s.id !== id) })),

            // ── Round 2 — multi-entity advanced ──────────────────────────────
            cloneEntity: (sourceEntityId, newName, newLegalName) => {
                const state = get();
                const src = state.entities.find(e => e.id === sourceEntityId);
                if (!src) return null;
                const newEntityId = `ent-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
                const cloned: Entity = {
                    ...src,
                    id: newEntityId,
                    name: newName,
                    legalName: newLegalName,
                    employeeCount: 0,
                    payrollProcessed: false,
                };
                const clonedRegistrations = state.registrations
                    .filter(r => r.entityId === sourceEntityId)
                    .map(r => ({ ...r, id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 3)}`, entityId: newEntityId, registrationNumber: `PENDING-${r.type}`, status: 'Pending' as const }));
                set((s) => ({
                    entities: [...s.entities, cloned],
                    registrations: [...s.registrations, ...clonedRegistrations],
                }));
                return newEntityId;
            },

            transferEmployee: (employeeId, employeeName, fromEntityId, toEntityId, effectiveDate, options) => {
                const state = get();
                const fromEnt = state.entities.find(e => e.id === fromEntityId);
                const toEnt = state.entities.find(e => e.id === toEntityId);
                const transferId = `etr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
                const transfer: EntityTransfer = {
                    id: transferId,
                    employeeId,
                    employeeName,
                    fromEntityId,
                    fromEntityName: fromEnt?.name ?? '—',
                    toEntityId,
                    toEntityName: toEnt?.name ?? '—',
                    effectiveDate,
                    reason: options?.reason,
                    status: 'Scheduled',
                    preservePF: options?.preservePF ?? true,
                    preserveESI: options?.preserveESI ?? true,
                    preserveGratuity: options?.preserveGratuity ?? true,
                };
                set((s) => ({ entityTransfers: [transfer, ...s.entityTransfers] }));
                return transferId;
            },

            completeEntityTransfer: (transferId) => {
                const state = get();
                const tr = state.entityTransfers.find(x => x.id === transferId);
                set((s) => ({
                    entityTransfers: s.entityTransfers.map(t => t.id === transferId ? {
                        ...t,
                        status: 'Completed' as const,
                        processedBy: 'HR Manager',
                        processedDate: new Date().toISOString().split('T')[0],
                    } : t),
                    entities: s.entities.map(e => {
                        if (!tr) return e;
                        if (e.id === tr.fromEntityId) return { ...e, employeeCount: Math.max(0, (e.employeeCount ?? 0) - 1) };
                        if (e.id === tr.toEntityId) return { ...e, employeeCount: (e.employeeCount ?? 0) + 1 };
                        return e;
                    }),
                }));
                // Cascade: update the payroll employee's entity association via lazy dynamic import (avoids circular)
                if (tr) {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const { usePayrollStore } = require('./payroll-store') as typeof import('./payroll-store');
                    usePayrollStore.getState().reassignEmployeeEntity(tr.employeeId, tr.toEntityId, tr.toEntityName);
                }
            },

            cancelEntityTransfer: (transferId) => set((state) => ({
                entityTransfers: state.entityTransfers.map(t => t.id === transferId ? { ...t, status: 'Cancelled' as const } : t)
            })),

            bulkUpdateRegistrationStatus: (ids, status) => set((state) => ({
                registrations: state.registrations.map(r => ids.includes(r.id) ? { ...r, status } : r)
            })),

            getEntityComplianceSummary: (entityId) => {
                const state = get();
                const entity = state.entities.find(e => e.id === entityId);
                const regs = state.registrations.filter(r => r.entityId === entityId);
                const locations = state.locations.filter(l => l.entityId === entityId);
                const payrollRuns = state.entityPayrollStatus.filter(p => p.entityId === entityId);
                const latestRun = payrollRuns.sort((a, b) => b.month.localeCompare(a.month))[0];
                const active = regs.filter(r => r.status === 'Active').length;
                const expired = regs.filter(r => r.status === 'Expired').length;
                const expectedRegs = 4;
                const regScore = Math.min(100, Math.round((active / expectedRegs) * 100));
                const expiredPenalty = expired * 15;
                const payrollBonus = latestRun && latestRun.status === 'Paid' ? 10 : 0;
                const healthScore = Math.max(0, Math.min(100, regScore - expiredPenalty + payrollBonus));
                return {
                    entityId,
                    entityName: entity?.name ?? '—',
                    registrationCount: regs.length,
                    expiredCount: expired,
                    activeRegistrations: active,
                    locationsCount: locations.length,
                    employeeCount: entity?.employeeCount ?? 0,
                    lastPayrollMonth: latestRun?.month,
                    lastPayrollStatus: latestRun?.status,
                    healthScore,
                };
            },

            getAllEntityComplianceSummaries: () => {
                const state = get();
                const getSummary = get().getEntityComplianceSummary;
                return state.entities.map(e => getSummary(e.id));
            },
        }),
        { name: 'salary-store-v5' }
    )
);
