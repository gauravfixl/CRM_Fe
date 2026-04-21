import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStatutoryStore } from './statutory-store';
import { useSalaryStore } from './salary-store';

export interface SalaryComponent {
    id: string;
    name: string;
    type: 'Earning' | 'Deduction';
    amountType: 'Fixed' | 'Percentage of Basic';
    value: number;
    isTaxable: boolean;
    isStatutory: boolean;
}

export interface ReceiptOcr {
    detectedAmount?: number;
    detectedDate?: string;
    detectedVendor?: string;
    detectedCategory?: string;
    confidence: number;
    extractedAt: string;
    rawText?: string;
}

export interface ReimbursementPolicyRule {
    id: string;
    category: string;
    monthlyCap: number;
    perClaimCap: number;
    receiptRequired: boolean;
    autoApproveIfWithinCap?: boolean;
    autoRejectIfNoReceipt?: boolean;
    mileageRatePerKm?: number;
    active: boolean;
}

export interface ReimbursementClaim {
    id: string;
    empCode?: string;
    employeeName: string;
    employeeId: string;
    dept?: string;
    category: string;
    amount: number;
    description?: string;
    receiptUrl?: string;
    receiptName?: string;
    submittedDate: string;
    approvedDate?: string;
    approvedBy?: string;
    rejectedDate?: string;
    rejectionReason?: string;
    rejectionTags?: string[];
    paidDate?: string;
    paidInRunId?: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
    remarks?: string;
    taxable: boolean;
    comments?: ClaimComment[];
    // ─ Round 2 additions ─
    receiptOcr?: ReceiptOcr;
    duplicateOfClaimId?: string;
    autoValidated?: boolean;
    validationIssues?: string[];
    mileageKm?: number;
}

export interface ClaimComment {
    id: string;
    author: string;
    text: string;
    timestamp: string;
}

export interface ReimbursementCategory {
    id: string;
    name: string;
    monthlyLimit: number;
    taxable: boolean;
    color: string;
    description?: string;
    active: boolean;
}

export interface PayslipTemplate {
    companyName: string;
    companyAddress: string;
    companyGstin?: string;
    companyPan?: string;
    logoText: string;
    footerText: string;
    primaryColor: string;
    activeTemplateId: string;
}

export interface PayrollCycle {
    cycleStart: number;          // day of month
    cycleEnd: number;            // day of month OR 31 for end of month
    payoutDay: number;           // day of next month
    frequency: 'Monthly' | 'Bi-Weekly' | 'Weekly';
    cutoffDay: number;           // attendance cutoff
    allowOverlap: boolean;
    autoRunEnabled: boolean;     // auto-start next cycle
}

export interface BankAccount {
    id: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    branch?: string;
    accountType: 'Current' | 'Savings';
    purpose: 'Salary Disbursement' | 'Reimbursement' | 'Statutory' | 'General';
    isPrimary: boolean;
    isActive: boolean;
    balance?: number;
    notes?: string;
    addedDate: string;
}

export interface SettingsSnapshot {
    id: string;
    name: string;
    description?: string;
    capturedDate: string;
    capturedBy: string;
    statutorySettings: {
        pfEnabled: boolean;
        pfRate: number;
        esiEnabled: boolean;
        esiRate: number;
        tdsEnabled: boolean;
        ptEnabled: boolean;
    };
    payrollCycle: PayrollCycle;
    componentCount: number;
    bankAccountCount: number;
    reason?: string;
    isLocked?: boolean;
}

export interface PolicyTemplate {
    id: string;
    name: string;
    description?: string;
    category: 'Small Business' | 'Mid-Market' | 'Enterprise' | 'Custom';
    statutoryOverride?: Partial<{
        pfEnabled: boolean;
        pfRate: number;
        esiEnabled: boolean;
        esiRate: number;
        tdsEnabled: boolean;
        ptEnabled: boolean;
    }>;
    cycleOverride?: Partial<PayrollCycle>;
    createdBy: string;
    createdDate: string;
    lastAppliedDate?: string;
    lastAppliedBy?: string;
    usageCount: number;
}

export interface SettingValidationRule {
    id: string;
    settingKey: string;
    label: string;
    operator: 'min' | 'max' | 'range' | 'enum';
    minValue?: number;
    maxValue?: number;
    allowedValues?: string[];
    severity: 'warning' | 'error';
    message: string;
    active: boolean;
}

export interface SettingsPermission {
    id: string;
    role: string;
    scope: 'Structure' | 'Statutory' | 'Cycle' | 'Bank' | 'Audit' | 'All';
    canView: boolean;
    canEdit: boolean;
    canApprove?: boolean;
}

// ── Round 2 Batch 4 — Dashboard types ──
export type DashboardWidgetType =
    | 'PayrollKpi'
    | 'ComplianceHealth'
    | 'PendingApprovals'
    | 'RecentClaims'
    | 'UpcomingFilings'
    | 'HeadcountTrend'
    | 'CostTrend'
    | 'TaxSavings'
    | 'StatutoryLiability'
    | 'EmployeeHighlights'
    | 'MonthlyVariance'
    | 'CalendarMini';

export interface DashboardWidget {
    id: string;
    type: DashboardWidgetType;
    title: string;
    enabled: boolean;
    order: number;
    size: 'sm' | 'md' | 'lg' | 'full';
    config?: Record<string, string | number | boolean>;
}

export interface DashboardAlert {
    id: string;
    severity: 'info' | 'warning' | 'critical';
    source: 'Payroll' | 'Compliance' | 'Reimbursement' | 'Tax' | 'Loan' | 'Leave' | 'Entity';
    title: string;
    description: string;
    createdAt: string;
    dueDate?: string;
    link?: string;
    linkLabel?: string;
    dismissed?: boolean;
    actionTaken?: boolean;
    actionedBy?: string;
    actionedAt?: string;
}

export interface QuickAction {
    id: string;
    label: string;
    description?: string;
    icon: string;              // lucide icon name
    href: string;
    color: string;             // hex or token
    pinned: boolean;
    order: number;
}

export interface CustomReportFilter {
    field: string;
    op: 'eq' | 'ne' | 'gt' | 'lt' | 'contains';
    value: string;
}

export interface CustomReportDefinition {
    id: string;
    name: string;
    source: 'PayRuns' | 'Employees' | 'Claims' | 'Payslips' | 'Declarations';
    columns: string[];
    filters: CustomReportFilter[];
    groupBy?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    pivotField?: string;
    createdBy: string;
    createdDate: string;
    lastRunDate?: string;
}

export interface ScheduledReport {
    id: string;
    name: string;
    reportType: 'Payroll Register' | 'Variance Report' | 'Bank Transfer JV' | 'YTD Statement' | 'PF Report' | 'ESI Report' | 'PT Report' | 'TDS Report';
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
    nextRun: string;
    recipients: string[];
    format: 'CSV' | 'Excel' | 'PDF';
    isActive: boolean;
    lastRun?: string;
    lastRunStatus?: 'Success' | 'Failed';
    notes?: string;
}

export interface SettingsAuditLog {
    id: string;
    timestamp: string;
    actor: string;
    area: 'Components' | 'Statutory' | 'Cycle' | 'Bank' | 'Template' | 'Categories' | 'Other';
    action: string;
    details: string;
}

export interface DownloadHistoryEntry {
    id: string;
    timestamp: string;
    reportName: string;
    format: string;
    month?: string;
    downloadedBy: string;
    rowCount?: number;
}

export interface DeclarationPolicyRule {
    id: string;
    category: string;                     // 80C, 80D, HRA, etc.
    maxAmount: number;                    // -1 = no cap
    requiresPAN?: boolean;
    requiresReceipt?: boolean;
    requiresLandlordPAN?: boolean;        // HRA > 1L
    description?: string;
    active: boolean;
}

export interface TaxDeclaration {
    id: string;
    empCode?: string;
    employeeId: string;
    employeeName: string;
    dept?: string;
    pan?: string;
    fiscalYear: string;
    regime: 'Old' | 'New';
    status: 'Pending' | 'Submitted' | 'Verified' | 'Rejected';
    // Income
    grossSalary?: number;
    basicSalary?: number;
    // Computed
    totalSavings: number;
    estimatedTax: number;
    taxableIncome?: number;
    // Line items
    declarations: {
        id?: string;
        category: string;
        subCategory?: string;
        amount: number;
        notes?: string;
    }[];
    // Lifecycle
    submittedDate?: string;
    verifiedDate?: string;
    verifiedBy?: string;
    rejectedDate?: string;
    rejectionReason?: string;
    notes?: string;
    // ─ Round 2 additions ─
    lockedUntil?: string;                 // declaration window end (ISO date)
    lockedBy?: string;
    lockReason?: string;
    recommendedRegime?: 'Old' | 'New';   // auto-computed suggestion
    recommendedSavings?: number;          // ₹ saved if switched to recommended
    oldRegimeTax?: number;                // cached tax for both regimes
    newRegimeTax?: number;
    maxPossibleSavings?: number;          // max 80C/80D/HRA utilisation vs current
    gapFromMax?: number;                  // max - current savings (declared)
}

export interface ProofComment {
    id: string;
    author: string;
    text: string;
    timestamp: string;
}

export interface ProofPolicyRule {
    id: string;
    category: string;
    maxAmount: number;                    // -1 = no cap
    documentRequired: boolean;
    autoApproveIfWithinCap?: boolean;    // auto-approve if under cap with doc
    autoRejectIfNoDoc?: boolean;
    active: boolean;
}

export interface OcrExtraction {
    detectedAmount?: number;
    detectedDate?: string;
    detectedVendor?: string;
    detectedType?: string;
    confidence: number;                   // 0-1
    extractedAt: string;
    rawText?: string;                     // simulated raw text
}

export interface InvestmentProof {
    id: string;
    empCode?: string;
    employeeId: string;
    employeeName: string;
    dept?: string;
    fiscalYear?: string;
    type: string;
    subCategory?: string;
    amount: number;
    // Document
    documentUrl: string;
    documentName?: string;
    documentSize?: number;
    documentType?: string;
    // Lifecycle
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedDate: string;
    approvedBy?: string;
    approvedDate?: string;
    approvalComment?: string;
    rejectedBy?: string;
    rejectedDate?: string;
    rejectionReason?: string;
    rejectionTags?: string[];
    // Audit
    comments?: ProofComment[];
    // Cross-link
    linkedDeclarationId?: string;
    remarks?: string;
    // ─ Round 2 additions ─
    ocrExtraction?: OcrExtraction;        // populated on OCR run
    matchStatus?: 'Match' | 'Mismatch' | 'Unmatched' | 'NotChecked';
    matchNotes?: string;                  // e.g. "Declared 150K but proof shows 120K"
    autoValidated?: boolean;              // ran through auto-validator
    validationIssues?: string[];          // array of issue codes
    reminderSent?: boolean;
    reminderDate?: string;
    reminderCount?: number;
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

export type ApprovalStage = 'Manager' | 'HR' | 'Finance' | 'CFO';

export interface ApprovalStep {
    stage: ApprovalStage;
    status: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: string;
    approvedDate?: string;
    rejectionReason?: string;
    notes?: string;
}

export interface PayrollEmployee {
    id: string;
    payRunId: string;
    empCode: string;
    name: string;
    dept: string;
    designation: string;
    email?: string;
    bankAccount?: string;
    ifsc?: string;
    // Earnings
    basic: number;
    hra: number;
    specialAllowance: number;
    conveyance: number;
    medicalAllowance: number;
    variable: number;
    // Attendance adjustments
    lopDays: number;
    otHours: number;
    // Deductions
    pf: number;
    esi: number;
    pt: number;
    tds: number;
    otherDeductions: number;
    // State
    included: boolean;
    status: 'Pending' | 'Verified' | 'Flagged';
    approved: boolean;
    remarks?: string;
    // ─ Round 2 additions ─
    joiningDate?: string;          // full date like '2026-04-12'
    exitDate?: string;             // mid-cycle exit
    proratedDays?: number;         // auto-computed days worked in cycle
    isProrated?: boolean;          // flag to show pro-rata UI
    onHold?: boolean;              // salary on hold
    holdReason?: string;
    holdDate?: string;
    approvalChain?: ApprovalStep[];
    currentApprovalStage?: ApprovalStage | 'Complete';
    entityId?: string;             // Multi-entity association
    entityName?: string;
}

// ── Helpers (pure) ─────────────────────────────────────────────────────────────

export const calculateEmployeeNet = (emp: PayrollEmployee) => {
    const fixedEarnings = emp.basic + emp.hra + emp.specialAllowance + emp.conveyance + emp.medicalAllowance;
    const perDay = fixedEarnings / 30;
    const lopDeduction = perDay * emp.lopDays;
    const otAmount = (perDay / 8) * 1.5 * emp.otHours;
    const grossEarnings = fixedEarnings + emp.variable + otAmount - lopDeduction;
    const totalDeductions = emp.pf + emp.esi + emp.pt + emp.tds + emp.otherDeductions;
    return {
        fixedEarnings,
        grossEarnings,
        totalDeductions,
        netSalary: grossEarnings - totalDeductions,
        lopDeduction,
        otAmount,
    };
};

// Rough tax calculator (FY 2025-26 simplified slabs) — used by store actions
export const computeTax = (grossSalary: number, deductions: number, regime: 'Old' | 'New'): number => {
    const taxable = Math.max(0, regime === 'Old' ? grossSalary - deductions : grossSalary);
    let tax = 0;
    if (regime === 'New') {
        const slabs = [
            { upto: 300000, rate: 0 },
            { upto: 700000, rate: 0.05 },
            { upto: 1000000, rate: 0.10 },
            { upto: 1200000, rate: 0.15 },
            { upto: 1500000, rate: 0.20 },
            { upto: Infinity, rate: 0.30 },
        ];
        let prev = 0;
        for (const s of slabs) {
            if (taxable > prev) {
                const slice = Math.min(taxable, s.upto) - prev;
                tax += slice * s.rate;
                prev = s.upto;
            }
        }
    } else {
        const slabs = [
            { upto: 250000, rate: 0 },
            { upto: 500000, rate: 0.05 },
            { upto: 1000000, rate: 0.20 },
            { upto: Infinity, rate: 0.30 },
        ];
        let prev = 0;
        for (const s of slabs) {
            if (taxable > prev) {
                const slice = Math.min(taxable, s.upto) - prev;
                tax += slice * s.rate;
                prev = s.upto;
            }
        }
    }
    return Math.round(tax * 1.04); // 4% cess
};

const stepToStatus = (step: number): PayRun['status'] => {
    switch (step) {
        case 0: return 'Draft';
        case 1: return 'Processing';
        case 2: return 'Approved';
        case 3: return 'Locked';
        default: return 'Draft';
    }
};

const recomputeRunTotals = (payRuns: PayRun[], employees: PayrollEmployee[], payRunId: string): PayRun[] => {
    const runEmps = employees.filter(e => e.payRunId === payRunId);
    const included = runEmps.filter(e => e.included);
    let totalNetPay = 0;
    let totalDeductions = 0;
    let totalTDS = 0;
    included.forEach(e => {
        const c = calculateEmployeeNet(e);
        totalNetPay += c.netSalary;
        totalDeductions += c.totalDeductions;
        totalTDS += e.tds;
    });
    return payRuns.map(r => r.id === payRunId ? {
        ...r,
        totalNetPay: Math.round(totalNetPay),
        totalDeductions: Math.round(totalDeductions),
        totalTDS: Math.round(totalTDS),
        totalEmployees: runEmps.length,
        inclusionCount: included.length,
        exclusionCount: runEmps.length - included.length,
    } : r);
};

export type PayslipTemplateDesign = 'modern' | 'classic' | 'minimal';
export type PayslipEmailStatus = 'Not Sent' | 'Queued' | 'Sent' | 'Delivered' | 'Failed' | 'Bounced';

export interface Payslip {
    id: string;
    payRunId?: string;
    empCode?: string;
    employeeName: string;
    employeeId: string;
    dept?: string;
    designation?: string;
    month: string;
    // Earnings snapshot
    basic?: number;
    hra?: number;
    specialAllowance?: number;
    conveyance?: number;
    medicalAllowance?: number;
    variable?: number;
    lopDays?: number;
    otHours?: number;
    otAmount?: number;
    lopDeduction?: number;
    grossEarnings?: number;
    // Deductions snapshot
    pf?: number;
    esi?: number;
    pt?: number;
    tds?: number;
    otherDeductions?: number;
    totalDeductions?: number;
    // Final
    netAmount: number;
    // Delivery info
    bankAccount?: string;
    ifsc?: string;
    email?: string;
    status: 'Pending' | 'Generated' | 'Distributed';
    generatedDate?: string;
    distributedDate?: string;
    emailSent?: boolean;
    notes?: string;
    // ─ Round 2 additions ─
    templateDesign?: PayslipTemplateDesign;
    passwordProtected?: boolean;
    passwordHint?: string;                // e.g. "PAN number"
    emailStatus?: PayslipEmailStatus;
    emailSentDate?: string;
    emailDeliveredDate?: string;
    emailFailReason?: string;
    emailAttempts?: number;
    // YTD snapshot at payslip generation time
    ytdGross?: number;
    ytdNet?: number;
    ytdTax?: number;
    ytdPF?: number;
}

interface PayrollState {
    salaryComponents: SalaryComponent[];
    payRuns: PayRun[];
    payrollEmployees: PayrollEmployee[];
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
    payslipTemplate: PayslipTemplate;
    reimbursementCategories: ReimbursementCategory[];
    payrollCycle: PayrollCycle;
    bankAccounts: BankAccount[];
    scheduledReports: ScheduledReport[];
    settingsAuditLog: SettingsAuditLog[];
    downloadHistory: DownloadHistoryEntry[];
    declarationPolicyRules: DeclarationPolicyRule[];
    proofPolicyRules: ProofPolicyRule[];
    reimbursementPolicyRules: ReimbursementPolicyRule[];
    customReports: CustomReportDefinition[];
    settingsSnapshots: SettingsSnapshot[];
    policyTemplates: PolicyTemplate[];
    settingValidationRules: SettingValidationRule[];
    settingsPermissions: SettingsPermission[];
    dashboardWidgets: DashboardWidget[];
    dashboardAlerts: DashboardAlert[];
    quickActions: QuickAction[];
    declarationWindowOpen: boolean;
    proofWindowOpen: boolean;

    // Actions
    addPayRun: (run: Omit<PayRun, 'id'>) => void;
    updatePayRun: (id: string, updates: Partial<PayRun>) => void;
    deletePayRun: (id: string) => void;
    advancePayRunStep: (id: string) => void;
    finalizePayRun: (id: string) => void;

    addPayrollEmployee: (emp: Omit<PayrollEmployee, 'id'>) => void;
    updatePayrollEmployee: (id: string, updates: Partial<PayrollEmployee>) => void;
    deletePayrollEmployee: (id: string) => void;
    bulkUpdatePayrollEmployees: (ids: string[], updates: Partial<PayrollEmployee>) => void;

    // Round 2 — cross-page orchestration
    syncLoanDeductionsToPayRun: (payRunId: string) => { updated: number; totalEmi: number };
    syncClaimReimbursementsToPayRun: (payRunId: string) => { reimbursed: number; total: number };
    syncRevisionToNextPayRun: (revisionId: string) => void;
    recomputeTdsFromDeclarations: (payRunId: string) => { updated: number };
    reassignEmployeeEntity: (empCode: string, entityId: string, entityName: string) => void;
    applyTemplateToPayRunEmployees: (templateId: string, payRunId: string) => { updated: number };

    // Round 2 — advanced pay run actions
    holdEmployee: (id: string, reason: string) => void;
    releaseEmployee: (id: string) => void;
    bulkHoldEmployees: (ids: string[], reason: string) => void;
    advanceApprovalStage: (id: string, approvedBy: string, notes?: string) => void;
    rejectApprovalStage: (id: string, stage: ApprovalStage, rejectedBy: string, reason: string) => void;
    clonePayRun: (sourcePayRunId: string, newMonth: string) => string | null;
    applyBulkAdjustment: (ids: string[], field: 'variable' | 'lopDays' | 'otHours', mode: 'fixed' | 'percent' | 'delta', value: number) => void;
    applyProRata: (id: string) => void;

    addClaim: (claim: Omit<ReimbursementClaim, 'id'>) => void;
    updateClaim: (id: string, updates: Partial<ReimbursementClaim>) => void;
    deleteClaim: (id: string) => void;
    updateClaimStatus: (id: string, status: ReimbursementClaim['status'], remarks?: string) => void;
    bulkUpdateClaimStatus: (ids: string[], status: ReimbursementClaim['status']) => void;
    bulkDeleteClaims: (ids: string[]) => void;
    rejectClaim: (id: string, reason: string, tags?: string[]) => void;
    approveClaim: (id: string, approvedBy: string) => void;
    markClaimPaid: (id: string, runId?: string) => void;
    addClaimComment: (id: string, author: string, text: string) => void;

    addReimbursementCategory: (cat: Omit<ReimbursementCategory, 'id'>) => void;
    updateReimbursementCategory: (id: string, updates: Partial<ReimbursementCategory>) => void;
    deleteReimbursementCategory: (id: string) => void;

    // Round 2 — reimbursement advanced actions
    runOcrOnClaim: (id: string) => ReceiptOcr;
    bulkRunOcrClaims: (ids: string[]) => { processed: number };
    detectDuplicateClaim: (id: string) => string | null;
    bulkDetectDuplicates: (ids: string[]) => { duplicates: number };
    autoValidateClaim: (id: string) => { issues: string[] };
    bulkAutoValidateClaims: (ids: string[]) => { validated: number; flagged: number };
    computeMileage: (distanceKm: number, category: string) => { amount: number; rate: number };
    addReimbursementPolicyRule: (rule: Omit<ReimbursementPolicyRule, 'id'>) => void;
    updateReimbursementPolicyRule: (id: string, updates: Partial<ReimbursementPolicyRule>) => void;
    deleteReimbursementPolicyRule: (id: string) => void;

    // Round 2 — custom reports
    addCustomReport: (report: Omit<CustomReportDefinition, 'id'>) => void;
    updateCustomReport: (id: string, updates: Partial<CustomReportDefinition>) => void;
    deleteCustomReport: (id: string) => void;
    markCustomReportRun: (id: string) => void;

    // Round 2 — settings snapshots / policy templates / validation / permissions
    captureSettingsSnapshot: (name: string, capturedBy: string, reason?: string) => SettingsSnapshot;
    restoreSettingsSnapshot: (id: string, restoredBy: string) => void;
    deleteSettingsSnapshot: (id: string) => void;
    lockSettingsSnapshot: (id: string, locked: boolean) => void;

    addPolicyTemplate: (template: Omit<PolicyTemplate, 'id'>) => void;
    updatePolicyTemplate: (id: string, updates: Partial<PolicyTemplate>) => void;
    deletePolicyTemplate: (id: string) => void;
    applyPolicyTemplate: (id: string, appliedBy: string) => void;

    addSettingValidationRule: (rule: Omit<SettingValidationRule, 'id'>) => void;
    updateSettingValidationRule: (id: string, updates: Partial<SettingValidationRule>) => void;
    deleteSettingValidationRule: (id: string) => void;
    runSettingValidation: () => { issues: { ruleId: string; settingKey: string; currentValue: string; message: string; severity: 'warning' | 'error' }[] };

    addSettingsPermission: (perm: Omit<SettingsPermission, 'id'>) => void;
    updateSettingsPermission: (id: string, updates: Partial<SettingsPermission>) => void;
    deleteSettingsPermission: (id: string) => void;

    // Round 2 Batch 4 — Dashboard
    toggleDashboardWidget: (id: string) => void;
    reorderDashboardWidgets: (orderedIds: string[]) => void;
    resizeDashboardWidget: (id: string, size: DashboardWidget['size']) => void;
    resetDashboardLayout: () => void;

    addDashboardAlert: (alert: Omit<DashboardAlert, 'id' | 'createdAt'>) => void;
    dismissDashboardAlert: (id: string) => void;
    markAlertActioned: (id: string, actionedBy: string) => void;
    clearDismissedAlerts: () => void;

    addQuickAction: (action: Omit<QuickAction, 'id'>) => void;
    updateQuickAction: (id: string, updates: Partial<QuickAction>) => void;
    deleteQuickAction: (id: string) => void;
    toggleQuickActionPin: (id: string) => void;
    reorderQuickActions: (orderedIds: string[]) => void;

    addDeclaration: (declaration: Omit<TaxDeclaration, 'id'>) => void;
    updateDeclaration: (id: string, updates: Partial<TaxDeclaration>) => void;
    deleteDeclaration: (id: string) => void;
    updateDeclarationStatus: (id: string, status: TaxDeclaration['status']) => void;
    bulkUpdateDeclarationStatus: (ids: string[], status: TaxDeclaration['status']) => void;
    bulkDeleteDeclarations: (ids: string[]) => void;
    approveDeclaration: (id: string, verifiedBy: string) => void;
    rejectDeclaration: (id: string, reason: string) => void;

    // Round 2 — advanced declaration actions
    lockDeclaration: (id: string, lockedUntil: string, lockedBy: string, reason?: string) => void;
    unlockDeclaration: (id: string) => void;
    recommendRegime: (id: string) => void;
    recommendAllRegimes: () => { analyzed: number; switched: number };
    bulkFlipRegime: (ids: string[], targetRegime: 'Old' | 'New') => void;
    runGapAnalysis: (id: string) => void;

    // Policy rules (declaration)
    addDeclarationPolicyRule: (rule: Omit<DeclarationPolicyRule, 'id'>) => void;
    updateDeclarationPolicyRule: (id: string, updates: Partial<DeclarationPolicyRule>) => void;
    deleteDeclarationPolicyRule: (id: string) => void;

    addProof: (proof: Omit<InvestmentProof, 'id'>) => void;
    updateProof: (id: string, updates: Partial<InvestmentProof>) => void;
    deleteProof: (id: string) => void;
    updateProofStatus: (id: string, status: InvestmentProof['status'], remarks?: string) => void;
    bulkUpdateProofStatus: (ids: string[], status: InvestmentProof['status']) => void;
    bulkDeleteProofs: (ids: string[]) => void;
    approveProof: (id: string, approvedBy: string, comment?: string) => void;
    rejectProof: (id: string, reason: string, tags?: string[]) => void;
    addProofComment: (id: string, author: string, text: string) => void;

    // Round 2 — OCR, match, auto-validate
    runOcrOnProof: (id: string) => OcrExtraction;
    bulkRunOcr: (ids: string[]) => { processed: number };
    matchProofWithDeclaration: (id: string) => { matched: boolean; notes: string };
    bulkMatchProofs: (ids: string[]) => { matched: number; mismatched: number; unmatched: number };
    autoValidateProof: (id: string) => { issues: string[] };
    bulkAutoValidate: (ids: string[]) => { validated: number; flagged: number };
    sendProofReminder: (id: string) => void;
    bulkSendProofReminders: (ids: string[]) => number;

    // Policy rules (proof)
    addProofPolicyRule: (rule: Omit<ProofPolicyRule, 'id'>) => void;
    updateProofPolicyRule: (id: string, updates: Partial<ProofPolicyRule>) => void;
    deleteProofPolicyRule: (id: string) => void;

    addPayslip: (payslip: Omit<Payslip, 'id'>) => void;
    updatePayslip: (id: string, updates: Partial<Payslip>) => void;
    updatePayslipStatus: (id: string, status: Payslip['status']) => void;
    deletePayslip: (id: string) => void;
    bulkUpdatePayslipStatus: (ids: string[], status: Payslip['status']) => void;
    bulkDeletePayslips: (ids: string[]) => void;
    generatePayslipsFromRun: (payRunId: string) => number;
    regeneratePayslip: (id: string) => void;
    updatePayslipTemplate: (updates: Partial<PayslipTemplate>) => void;

    // Round 2 — email tracking + templates
    sendPayslipEmail: (id: string) => { success: boolean; reason?: string };
    bulkSendPayslipEmails: (ids: string[]) => { sent: number; failed: number };
    setPayslipTemplateDesign: (id: string, design: PayslipTemplateDesign) => void;
    setPayslipPasswordProtection: (id: string, enabled: boolean, hint?: string) => void;
    bulkSetPayslipTemplateDesign: (ids: string[], design: PayslipTemplateDesign) => void;
    recomputePayslipYtd: (id: string) => void;

    addComponent: (component: Omit<SalaryComponent, 'id'>) => void;
    updateComponent: (id: string, updates: Partial<SalaryComponent>) => void;
    deleteComponent: (id: string) => void;

    updateStatutorySettings: (settings: Partial<PayrollState['statutorySettings']>) => void;

    updatePayrollCycle: (updates: Partial<PayrollCycle>) => void;

    addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
    updateBankAccount: (id: string, updates: Partial<BankAccount>) => void;
    deleteBankAccount: (id: string) => void;
    setPrimaryBankAccount: (id: string) => void;

    addScheduledReport: (report: Omit<ScheduledReport, 'id'>) => void;
    updateScheduledReport: (id: string, updates: Partial<ScheduledReport>) => void;
    deleteScheduledReport: (id: string) => void;
    toggleScheduledReport: (id: string) => void;
    markScheduledReportRun: (id: string, status: 'Success' | 'Failed') => void;

    addSettingsAudit: (entry: Omit<SettingsAuditLog, 'id' | 'timestamp'>) => void;
    clearSettingsAudit: () => void;

    addDownloadHistory: (entry: Omit<DownloadHistoryEntry, 'id' | 'timestamp'>) => void;
    clearDownloadHistory: () => void;

    setDeclarationWindow: (open: boolean) => void;
    setProofWindow: (open: boolean) => void;
}

export const usePayrollStore = create<PayrollState>()(
    persist(
        (set, get) => ({
            salaryComponents: [
                { id: 'c1', name: 'Basic Pay', type: 'Earning', amountType: 'Fixed', value: 50000, isTaxable: true, isStatutory: true },
                { id: 'c2', name: 'HRA', type: 'Earning', amountType: 'Percentage of Basic', value: 40, isTaxable: true, isStatutory: false },
                { id: 'c3', name: 'Standard Deduction', type: 'Deduction', amountType: 'Fixed', value: 50000, isTaxable: false, isStatutory: true },
            ],
            payRuns: [
                { id: 'pr-apr26', month: 'April 2026', status: 'Draft', totalNetPay: 0, totalDeductions: 0, totalTDS: 0, totalEmployees: 0, inclusionCount: 0, exclusionCount: 0, step: 0 },
                { id: 'pr-mar26', month: 'March 2026', status: 'Paid', totalNetPay: 0, totalDeductions: 0, totalTDS: 0, totalEmployees: 0, inclusionCount: 0, exclusionCount: 0, processedAt: '2026-03-31', step: 3 },
                { id: 'pr-feb26', month: 'February 2026', status: 'Paid', totalNetPay: 0, totalDeductions: 0, totalTDS: 0, totalEmployees: 0, inclusionCount: 0, exclusionCount: 0, processedAt: '2026-02-28', step: 3 },
                { id: 'pr-jan26', month: 'January 2026', status: 'Paid', totalNetPay: 0, totalDeductions: 0, totalTDS: 0, totalEmployees: 0, inclusionCount: 0, exclusionCount: 0, processedAt: '2026-01-31', step: 3 },
                { id: 'pr-dec25', month: 'December 2025', status: 'Paid', totalNetPay: 0, totalDeductions: 0, totalTDS: 0, totalEmployees: 0, inclusionCount: 0, exclusionCount: 0, processedAt: '2025-12-31', step: 3 },
            ],
            payrollEmployees: [
                // April 2026 run (Draft - current active cycle)
                { id: 'pe-apr-1', payRunId: 'pr-apr26', empCode: 'EMP001', name: 'Rajesh Kumar', dept: 'Engineering', designation: 'Senior Engineer', email: 'rajesh@fixl.com', bankAccount: 'XXXXXXXX1234', ifsc: 'HDFC0001234', basic: 45000, hra: 18000, specialAllowance: 12000, conveyance: 1600, medicalAllowance: 1250, variable: 5000, lopDays: 0, otHours: 0, pf: 5400, esi: 0, pt: 200, tds: 6500, otherDeductions: 0, included: true, status: 'Verified', approved: false },
                { id: 'pe-apr-2', payRunId: 'pr-apr26', empCode: 'EMP002', name: 'Priya Sharma', dept: 'Product', designation: 'Product Manager', email: 'priya@fixl.com', bankAccount: 'XXXXXXXX5678', ifsc: 'ICIC0005678', basic: 55000, hra: 22000, specialAllowance: 15000, conveyance: 1600, medicalAllowance: 1250, variable: 12000, lopDays: 1, otHours: 4, pf: 6600, esi: 0, pt: 200, tds: 9800, otherDeductions: 0, included: true, status: 'Pending', approved: false },
                { id: 'pe-apr-3', payRunId: 'pr-apr26', empCode: 'EMP003', name: 'Amit Patel', dept: 'Sales', designation: 'Regional Sales Lead', email: 'amit@fixl.com', bankAccount: 'XXXXXXXX9012', ifsc: 'AXIS0009012', basic: 38000, hra: 15200, specialAllowance: 6200, conveyance: 1600, medicalAllowance: 1250, variable: 25000, lopDays: 0, otHours: 0, pf: 4560, esi: 0, pt: 200, tds: 5200, otherDeductions: 0, included: true, status: 'Verified', approved: false },
                { id: 'pe-apr-4', payRunId: 'pr-apr26', empCode: 'EMP004', name: 'Sneha Reddy', dept: 'HR', designation: 'HR Business Partner', email: 'sneha@fixl.com', bankAccount: 'XXXXXXXX3456', ifsc: 'SBIN0003456', basic: 42000, hra: 16800, specialAllowance: 17950, conveyance: 0, medicalAllowance: 1250, variable: 0, lopDays: 0, otHours: 0, pf: 5040, esi: 0, pt: 200, tds: 4800, otherDeductions: 0, included: true, status: 'Verified', approved: false },
                { id: 'pe-apr-5', payRunId: 'pr-apr26', empCode: 'EMP005', name: 'Vikram Singh', dept: 'Engineering', designation: 'Junior Engineer', email: 'vikram@fixl.com', bankAccount: 'XXXXXXXX7890', ifsc: 'HDFC0007890', basic: 28000, hra: 11200, specialAllowance: 5950, conveyance: 1600, medicalAllowance: 1250, variable: 3000, lopDays: 2, otHours: 8, pf: 3360, esi: 360, pt: 200, tds: 2100, otherDeductions: 0, included: true, status: 'Verified', approved: false },
                { id: 'pe-apr-6', payRunId: 'pr-apr26', empCode: 'EMP006', name: 'Meera Iyer', dept: 'Design', designation: 'Senior Designer', email: 'meera@fixl.com', bankAccount: 'XXXXXXXX2345', ifsc: 'KKBK0002345', basic: 48000, hra: 19200, specialAllowance: 11950, conveyance: 1600, medicalAllowance: 1250, variable: 4000, lopDays: 0, otHours: 0, pf: 5760, esi: 0, pt: 200, tds: 7200, otherDeductions: 0, included: false, status: 'Flagged', approved: false, remarks: 'On sabbatical leave' },
                // March 2026 run (Paid - history)
                { id: 'pe-mar-1', payRunId: 'pr-mar26', empCode: 'EMP001', name: 'Rajesh Kumar', dept: 'Engineering', designation: 'Senior Engineer', email: 'rajesh@fixl.com', bankAccount: 'XXXXXXXX1234', ifsc: 'HDFC0001234', basic: 45000, hra: 18000, specialAllowance: 12000, conveyance: 1600, medicalAllowance: 1250, variable: 5000, lopDays: 0, otHours: 0, pf: 5400, esi: 0, pt: 200, tds: 6500, otherDeductions: 0, included: true, status: 'Verified', approved: true },
                { id: 'pe-mar-2', payRunId: 'pr-mar26', empCode: 'EMP002', name: 'Priya Sharma', dept: 'Product', designation: 'Product Manager', email: 'priya@fixl.com', bankAccount: 'XXXXXXXX5678', ifsc: 'ICIC0005678', basic: 55000, hra: 22000, specialAllowance: 15000, conveyance: 1600, medicalAllowance: 1250, variable: 10000, lopDays: 0, otHours: 0, pf: 6600, esi: 0, pt: 200, tds: 9500, otherDeductions: 0, included: true, status: 'Verified', approved: true },
                { id: 'pe-mar-3', payRunId: 'pr-mar26', empCode: 'EMP003', name: 'Amit Patel', dept: 'Sales', designation: 'Regional Sales Lead', email: 'amit@fixl.com', bankAccount: 'XXXXXXXX9012', ifsc: 'AXIS0009012', basic: 38000, hra: 15200, specialAllowance: 6200, conveyance: 1600, medicalAllowance: 1250, variable: 18000, lopDays: 0, otHours: 0, pf: 4560, esi: 0, pt: 200, tds: 4100, otherDeductions: 0, included: true, status: 'Verified', approved: true },
                // February 2026 run (Paid - history)
                { id: 'pe-feb-1', payRunId: 'pr-feb26', empCode: 'EMP001', name: 'Rajesh Kumar', dept: 'Engineering', designation: 'Senior Engineer', email: 'rajesh@fixl.com', bankAccount: 'XXXXXXXX1234', ifsc: 'HDFC0001234', basic: 45000, hra: 18000, specialAllowance: 12000, conveyance: 1600, medicalAllowance: 1250, variable: 3000, lopDays: 0, otHours: 0, pf: 5400, esi: 0, pt: 200, tds: 6200, otherDeductions: 0, included: true, status: 'Verified', approved: true },
                { id: 'pe-feb-2', payRunId: 'pr-feb26', empCode: 'EMP002', name: 'Priya Sharma', dept: 'Product', designation: 'Product Manager', email: 'priya@fixl.com', bankAccount: 'XXXXXXXX5678', ifsc: 'ICIC0005678', basic: 55000, hra: 22000, specialAllowance: 15000, conveyance: 1600, medicalAllowance: 1250, variable: 8000, lopDays: 0, otHours: 0, pf: 6600, esi: 0, pt: 200, tds: 9200, otherDeductions: 0, included: true, status: 'Verified', approved: true },
                // January 2026 run (Paid - history)
                { id: 'pe-jan-1', payRunId: 'pr-jan26', empCode: 'EMP001', name: 'Rajesh Kumar', dept: 'Engineering', designation: 'Senior Engineer', email: 'rajesh@fixl.com', bankAccount: 'XXXXXXXX1234', ifsc: 'HDFC0001234', basic: 45000, hra: 18000, specialAllowance: 12000, conveyance: 1600, medicalAllowance: 1250, variable: 4000, lopDays: 0, otHours: 0, pf: 5400, esi: 0, pt: 200, tds: 6300, otherDeductions: 0, included: true, status: 'Verified', approved: true },
                // December 2025 run (Paid - history)
                { id: 'pe-dec-1', payRunId: 'pr-dec25', empCode: 'EMP001', name: 'Rajesh Kumar', dept: 'Engineering', designation: 'Senior Engineer', basic: 45000, hra: 18000, specialAllowance: 12000, conveyance: 1600, medicalAllowance: 1250, variable: 5000, lopDays: 0, otHours: 0, pf: 5400, esi: 0, pt: 200, tds: 6500, otherDeductions: 0, included: true, status: 'Verified', approved: true },
                { id: 'pe-dec-2', payRunId: 'pr-dec25', empCode: 'EMP002', name: 'Priya Sharma', dept: 'Product', designation: 'Product Manager', basic: 55000, hra: 22000, specialAllowance: 15000, conveyance: 1600, medicalAllowance: 1250, variable: 10000, lopDays: 0, otHours: 0, pf: 6600, esi: 0, pt: 200, tds: 9500, otherDeductions: 0, included: true, status: 'Verified', approved: true },
            ],
            claims: [
                { id: 'cl-1', empCode: 'EMP001', employeeName: 'Rajesh Kumar', employeeId: 'EMP001', dept: 'Engineering', category: 'Travel', amount: 4500, description: 'Client visit - Bangalore', receiptName: 'travel_bill_jan.pdf', submittedDate: '2026-01-15', status: 'Pending', taxable: false, comments: [] },
                { id: 'cl-2', empCode: 'EMP002', employeeName: 'Priya Sharma', employeeId: 'EMP002', dept: 'Product', category: 'Medical', amount: 12000, description: 'Health checkup', receiptName: 'medical_receipt.pdf', submittedDate: '2026-01-12', approvedDate: '2026-01-14', approvedBy: 'HR Manager', status: 'Approved', taxable: true, comments: [] },
                { id: 'cl-3', empCode: 'EMP003', employeeName: 'Amit Patel', employeeId: 'EMP003', dept: 'Sales', category: 'Fuel/LTA', amount: 8500, description: 'Field travel fuel reimbursement', receiptName: 'fuel_bills.pdf', submittedDate: '2026-01-18', status: 'Pending', taxable: false, comments: [] },
                { id: 'cl-4', empCode: 'EMP004', employeeName: 'Sneha Reddy', employeeId: 'EMP004', dept: 'HR', category: 'Misc', amount: 2200, description: 'Team lunch expenses', receiptName: 'lunch_receipt.jpg', submittedDate: '2026-01-10', rejectedDate: '2026-01-13', rejectionReason: 'Amount exceeds category monthly limit', rejectionTags: ['Policy Cap Hit'], status: 'Rejected', taxable: false, comments: [] },
                { id: 'cl-5', empCode: 'EMP005', employeeName: 'Vikram Singh', employeeId: 'EMP005', dept: 'Engineering', category: 'Medical', amount: 6800, description: 'Dental treatment', receiptName: 'dental_bill.pdf', submittedDate: '2026-01-08', approvedDate: '2026-01-09', approvedBy: 'HR Manager', paidDate: '2026-01-20', paidInRunId: 'pr-jan26', status: 'Paid', taxable: false, comments: [] },
                { id: 'cl-6', empCode: 'EMP006', employeeName: 'Meera Iyer', employeeId: 'EMP006', dept: 'Design', category: 'Travel', amount: 15000, description: 'Conference attendance - Mumbai', receiptName: 'conference_travel.pdf', submittedDate: '2026-01-20', status: 'Pending', taxable: false, comments: [] },
            ],
            declarations: [
                {
                    id: 'dec-1', empCode: 'EMP001', employeeId: 'EMP001', employeeName: 'Rajesh Kumar', dept: 'Engineering', pan: 'ABCPR1234K',
                    fiscalYear: '2025-26', regime: 'Old', status: 'Verified',
                    grossSalary: 960000, basicSalary: 540000,
                    totalSavings: 335000, estimatedTax: 45000, taxableIncome: 625000,
                    declarations: [
                        { id: 'ln-1', category: '80C', subCategory: 'LIC Premium', amount: 75000 },
                        { id: 'ln-2', category: '80C', subCategory: 'PPF', amount: 75000 },
                        { id: 'ln-3', category: '80D', subCategory: 'Health Insurance (Self+Family)', amount: 25000 },
                        { id: 'ln-4', category: 'HRA', subCategory: 'Rent Paid', amount: 240000 },
                        { id: 'ln-5', category: 'Sec 24', subCategory: 'Home Loan Interest', amount: 120000 },
                    ],
                    submittedDate: '2026-01-05', verifiedDate: '2026-01-15', verifiedBy: 'HR Manager',
                },
                {
                    id: 'dec-2', empCode: 'EMP002', employeeId: 'EMP002', employeeName: 'Priya Sharma', dept: 'Product', pan: 'DEFPS5678M',
                    fiscalYear: '2025-26', regime: 'New', status: 'Pending',
                    grossSalary: 1260000, basicSalary: 660000,
                    totalSavings: 0, estimatedTax: 92000, taxableIncome: 1260000,
                    declarations: [], submittedDate: '2026-01-08',
                },
                {
                    id: 'dec-3', empCode: 'EMP003', employeeId: 'EMP003', employeeName: 'Amit Patel', dept: 'Sales', pan: 'GHIAP9012Q',
                    fiscalYear: '2025-26', regime: 'Old', status: 'Submitted',
                    grossSalary: 876000, basicSalary: 456000,
                    totalSavings: 175000, estimatedTax: 28000, taxableIncome: 701000,
                    declarations: [
                        { id: 'ln-6', category: '80C', subCategory: 'ELSS Mutual Fund', amount: 100000 },
                        { id: 'ln-7', category: '80C', subCategory: 'EPF', amount: 50000 },
                        { id: 'ln-8', category: '80D', subCategory: 'Health Insurance', amount: 25000 },
                    ],
                    submittedDate: '2026-01-10',
                },
                {
                    id: 'dec-4', empCode: 'EMP004', employeeId: 'EMP004', employeeName: 'Sneha Reddy', dept: 'HR', pan: 'JKLSR3456B',
                    fiscalYear: '2025-26', regime: 'Old', status: 'Submitted',
                    grossSalary: 936000, basicSalary: 504000,
                    totalSavings: 200000, estimatedTax: 32000, taxableIncome: 736000,
                    declarations: [
                        { id: 'ln-9', category: '80C', subCategory: 'LIC + PPF', amount: 150000 },
                        { id: 'ln-10', category: '80D', subCategory: 'Parents Health Insurance', amount: 50000 },
                    ],
                    submittedDate: '2026-01-12',
                },
                {
                    id: 'dec-5', empCode: 'EMP005', employeeId: 'EMP005', employeeName: 'Vikram Singh', dept: 'Engineering', pan: 'MNOVS7890X',
                    fiscalYear: '2025-26', regime: 'New', status: 'Rejected',
                    grossSalary: 564000, basicSalary: 336000,
                    totalSavings: 0, estimatedTax: 15600, taxableIncome: 564000,
                    declarations: [], submittedDate: '2026-01-06',
                    rejectedDate: '2026-01-11', rejectionReason: 'No supporting documents attached.',
                },
                {
                    id: 'dec-6', empCode: 'EMP006', employeeId: 'EMP006', employeeName: 'Meera Iyer', dept: 'Design', pan: 'PQRMI1234T',
                    fiscalYear: '2025-26', regime: 'Old', status: 'Verified',
                    grossSalary: 1020000, basicSalary: 576000,
                    totalSavings: 275000, estimatedTax: 52000, taxableIncome: 745000,
                    declarations: [
                        { id: 'ln-11', category: '80C', subCategory: 'PPF', amount: 150000 },
                        { id: 'ln-12', category: '80D', subCategory: 'Health Insurance', amount: 25000 },
                        { id: 'ln-13', category: 'HRA', subCategory: 'Rent Paid', amount: 300000 },
                        { id: 'ln-14', category: '80G', subCategory: 'Donations', amount: 10000 },
                    ],
                    submittedDate: '2026-01-09', verifiedDate: '2026-01-18', verifiedBy: 'HR Manager',
                },
            ],
            proofs: [
                {
                    id: 'pf-1', empCode: 'EMP001', employeeId: 'EMP001', employeeName: 'Rajesh Kumar', dept: 'Engineering', fiscalYear: '2025-26',
                    type: 'LIC', subCategory: 'Life Insurance Premium', amount: 75000,
                    documentUrl: '#', documentName: 'LIC_receipt_2026.pdf', documentSize: 248576, documentType: 'application/pdf',
                    status: 'Approved', submittedDate: '2026-01-18',
                    approvedBy: 'HR Manager', approvedDate: '2026-01-22', approvalComment: 'Valid receipt, premium matches declaration.',
                    comments: [], linkedDeclarationId: 'dec-1',
                },
                {
                    id: 'pf-2', empCode: 'EMP001', employeeId: 'EMP001', employeeName: 'Rajesh Kumar', dept: 'Engineering', fiscalYear: '2025-26',
                    type: 'PPF', subCategory: 'Public Provident Fund', amount: 75000,
                    documentUrl: '#', documentName: 'PPF_passbook.pdf', documentSize: 184320, documentType: 'application/pdf',
                    status: 'Pending', submittedDate: '2026-01-18', comments: [], linkedDeclarationId: 'dec-1',
                },
                {
                    id: 'pf-3', empCode: 'EMP002', employeeId: 'EMP002', employeeName: 'Priya Sharma', dept: 'Product', fiscalYear: '2025-26',
                    type: '80D', subCategory: 'Health Insurance', amount: 25000,
                    documentUrl: '#', documentName: 'health_policy.pdf', documentSize: 512000, documentType: 'application/pdf',
                    status: 'Pending', submittedDate: '2026-01-20', comments: [],
                },
                {
                    id: 'pf-4', empCode: 'EMP003', employeeId: 'EMP003', employeeName: 'Amit Patel', dept: 'Sales', fiscalYear: '2025-26',
                    type: '80C', subCategory: 'ELSS Mutual Fund', amount: 100000,
                    documentUrl: '#', documentName: 'elss_statement.pdf', documentSize: 356000, documentType: 'application/pdf',
                    status: 'Approved', submittedDate: '2026-01-11',
                    approvedBy: 'HR Manager', approvedDate: '2026-01-16', approvalComment: 'Valid ELSS investment.',
                    comments: [], linkedDeclarationId: 'dec-3',
                },
                {
                    id: 'pf-5', empCode: 'EMP004', employeeId: 'EMP004', employeeName: 'Sneha Reddy', dept: 'HR', fiscalYear: '2025-26',
                    type: 'HRA', subCategory: 'Rent Receipt', amount: 180000,
                    documentUrl: '#', documentName: 'rent_receipts_2026.pdf', documentSize: 768000, documentType: 'application/pdf',
                    status: 'Rejected', submittedDate: '2026-01-13',
                    rejectedDate: '2026-01-15', rejectionReason: 'Landlord PAN missing. Rent > ₹1L needs landlord PAN per Sec 10(13A).',
                    rejectionTags: ['Missing PAN', 'Policy Gap'], comments: [],
                },
                {
                    id: 'pf-6', empCode: 'EMP006', employeeId: 'EMP006', employeeName: 'Meera Iyer', dept: 'Design', fiscalYear: '2025-26',
                    type: '80C', subCategory: 'PPF', amount: 150000,
                    documentUrl: '#', documentName: 'ppf_passbook.pdf', documentSize: 294912, documentType: 'application/pdf',
                    status: 'Approved', submittedDate: '2026-01-10',
                    approvedBy: 'HR Manager', approvedDate: '2026-01-14', comments: [], linkedDeclarationId: 'dec-6',
                },
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
            payslipTemplate: {
                companyName: 'Fixl Solutions Pvt. Ltd.',
                companyAddress: '123, Tech Park, Whitefield, Bangalore, KA 560066',
                companyGstin: '29AABCF1234D1ZF',
                companyPan: 'AABCF1234D',
                logoText: 'FS',
                footerText: 'This is a computer-generated payslip and does not require signature.',
                primaryColor: '#8B5CF6',
                activeTemplateId: 'T1',
            },
            reimbursementCategories: [
                { id: 'rc-1', name: 'Medical', monthlyLimit: 25000, taxable: false, color: '#8B5CF6', description: 'Doctor visits, medicines, hospitalisation', active: true },
                { id: 'rc-2', name: 'Travel', monthlyLimit: 50000, taxable: false, color: '#EC4899', description: 'Official travel, client visits, conferences', active: true },
                { id: 'rc-3', name: 'Fuel/LTA', monthlyLimit: 45000, taxable: false, color: '#F59E0B', description: 'Fuel bills, LTA reimbursement', active: true },
                { id: 'rc-4', name: 'Misc', monthlyLimit: 10000, taxable: true, color: '#6366F1', description: 'Team lunches, office supplies, misc expenses', active: true },
                { id: 'rc-5', name: 'Internet/Phone', monthlyLimit: 3000, taxable: false, color: '#10B981', description: 'Home internet, mobile bills', active: true },
            ],
            payrollCycle: {
                cycleStart: 1,
                cycleEnd: 31,
                payoutDay: 5,
                frequency: 'Monthly',
                cutoffDay: 25,
                allowOverlap: false,
                autoRunEnabled: false,
            },
            bankAccounts: [
                { id: 'ba-1', bankName: 'HDFC Bank', accountName: 'Fixl Solutions Pvt. Ltd. - Salary Account', accountNumber: '50100XXXXXXXX8829', ifsc: 'HDFC0001234', branch: 'Whitefield, Bangalore', accountType: 'Current', purpose: 'Salary Disbursement', isPrimary: true, isActive: true, balance: 4200000, addedDate: '2024-04-15', notes: 'Primary payroll account — NEFT/RTGS enabled' },
                { id: 'ba-2', bankName: 'ICICI Bank', accountName: 'Fixl Solutions Pvt. Ltd. - Reimbursements', accountNumber: '62200XXXXXXXX7241', ifsc: 'ICIC0006220', branch: 'Koramangala, Bangalore', accountType: 'Current', purpose: 'Reimbursement', isPrimary: false, isActive: true, balance: 850000, addedDate: '2024-06-10' },
                { id: 'ba-3', bankName: 'Axis Bank', accountName: 'Fixl Solutions Pvt. Ltd. - Statutory', accountNumber: '92101XXXXXXXX3350', ifsc: 'UTIB0000921', branch: 'HSR Layout, Bangalore', accountType: 'Current', purpose: 'Statutory', isPrimary: false, isActive: true, balance: 1500000, addedDate: '2023-11-20', notes: 'Dedicated for PF, ESI, TDS payments' },
            ],
            scheduledReports: [
                { id: 'sr-1', name: 'Monthly Payroll Register', reportType: 'Payroll Register', frequency: 'Monthly', nextRun: '2026-05-05', recipients: ['finance@fixl.com', 'hr@fixl.com'], format: 'Excel', isActive: true, lastRun: '2026-04-05', lastRunStatus: 'Success' },
                { id: 'sr-2', name: 'Quarterly TDS Summary', reportType: 'TDS Report', frequency: 'Quarterly', nextRun: '2026-07-07', recipients: ['tax@fixl.com', 'cfo@fixl.com'], format: 'PDF', isActive: true, lastRun: '2026-04-07', lastRunStatus: 'Success' },
                { id: 'sr-3', name: 'Weekly Variance Check', reportType: 'Variance Report', frequency: 'Weekly', nextRun: '2026-04-24', recipients: ['audit@fixl.com'], format: 'CSV', isActive: false, lastRun: '2026-04-10', lastRunStatus: 'Success' },
            ],
            settingsAuditLog: [
                { id: 'al-1', timestamp: '2026-04-10T10:30:00Z', actor: 'HR Admin', area: 'Statutory', action: 'Updated PF rate', details: 'PF rate changed from 12% to 12% (confirmed no change)' },
                { id: 'al-2', timestamp: '2026-04-08T14:15:00Z', actor: 'Payroll Admin', area: 'Bank', action: 'Added account', details: 'Axis Bank account added for statutory payouts' },
                { id: 'al-3', timestamp: '2026-04-05T09:00:00Z', actor: 'HR Admin', area: 'Cycle', action: 'Updated payout day', details: 'Payout day set to 5th of next month' },
            ],
            downloadHistory: [],
            declarationPolicyRules: [
                { id: 'dpr-1', category: '80C', maxAmount: 150000, requiresReceipt: true, description: 'Section 80C investments (LIC, PPF, ELSS, etc.)', active: true },
                { id: 'dpr-2', category: '80CCD(1B)', maxAmount: 50000, requiresReceipt: true, description: 'NPS contribution over and above 80C', active: true },
                { id: 'dpr-3', category: '80D', maxAmount: 100000, requiresReceipt: true, description: 'Health insurance premium', active: true },
                { id: 'dpr-4', category: 'HRA', maxAmount: -1, requiresLandlordPAN: true, requiresReceipt: true, description: 'HRA exemption — landlord PAN required for rent > ₹1L/year', active: true },
                { id: 'dpr-5', category: 'Sec 24', maxAmount: 200000, requiresReceipt: true, description: 'Home loan interest', active: true },
                { id: 'dpr-6', category: '80E', maxAmount: -1, requiresReceipt: true, description: 'Education loan interest', active: true },
                { id: 'dpr-7', category: '80G', maxAmount: -1, requiresReceipt: true, description: 'Charitable donations', active: true },
                { id: 'dpr-8', category: '80TTA', maxAmount: 10000, requiresReceipt: false, description: 'Savings account interest', active: true },
            ],
            proofPolicyRules: [
                { id: 'ppr-1', category: '80C', maxAmount: 150000, documentRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoDoc: true, active: true },
                { id: 'ppr-2', category: 'LIC', maxAmount: 150000, documentRequired: true, autoApproveIfWithinCap: true, autoRejectIfNoDoc: true, active: true },
                { id: 'ppr-3', category: 'PPF', maxAmount: 150000, documentRequired: true, autoApproveIfWithinCap: true, autoRejectIfNoDoc: true, active: true },
                { id: 'ppr-4', category: '80D', maxAmount: 100000, documentRequired: true, autoApproveIfWithinCap: true, autoRejectIfNoDoc: true, active: true },
                { id: 'ppr-5', category: 'HRA', maxAmount: -1, documentRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoDoc: true, active: true },
                { id: 'ppr-6', category: 'Sec 24', maxAmount: 200000, documentRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoDoc: true, active: true },
                { id: 'ppr-7', category: '80E', maxAmount: -1, documentRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoDoc: true, active: true },
                { id: 'ppr-8', category: '80G', maxAmount: -1, documentRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoDoc: true, active: true },
                { id: 'ppr-9', category: 'Others', maxAmount: 50000, documentRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoDoc: false, active: true },
            ],
            reimbursementPolicyRules: [
                { id: 'rpr-1', category: 'Travel', monthlyCap: 25000, perClaimCap: 10000, receiptRequired: true, autoApproveIfWithinCap: true, autoRejectIfNoReceipt: true, mileageRatePerKm: 12, active: true },
                { id: 'rpr-2', category: 'Medical', monthlyCap: 15000, perClaimCap: 15000, receiptRequired: true, autoApproveIfWithinCap: true, autoRejectIfNoReceipt: true, active: true },
                { id: 'rpr-3', category: 'Fuel/LTA', monthlyCap: 20000, perClaimCap: 10000, receiptRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoReceipt: true, mileageRatePerKm: 10, active: true },
                { id: 'rpr-4', category: 'Misc', monthlyCap: 5000, perClaimCap: 3000, receiptRequired: true, autoApproveIfWithinCap: false, autoRejectIfNoReceipt: false, active: true },
                { id: 'rpr-5', category: 'Internet/Phone', monthlyCap: 2000, perClaimCap: 2000, receiptRequired: true, autoApproveIfWithinCap: true, autoRejectIfNoReceipt: false, active: true },
            ],
            customReports: [
                { id: 'cr-1', name: 'Department-wise Net Pay', source: 'Employees', columns: ['name', 'dept', 'basic', 'netPay'], filters: [], groupBy: 'dept', createdBy: 'HR Manager', createdDate: '2026-01-15' },
                { id: 'cr-2', name: 'High-value Claims (>10K)', source: 'Claims', columns: ['employeeName', 'category', 'amount', 'status'], filters: [{ field: 'amount', op: 'gt', value: '10000' }], createdBy: 'HR Manager', createdDate: '2026-02-08' },
            ],
            settingsSnapshots: [
                {
                    id: 'snap-1', name: 'FY 2025-26 Opening', description: 'Baseline at FY start',
                    capturedDate: '2025-04-01', capturedBy: 'HR Manager',
                    statutorySettings: { pfEnabled: true, pfRate: 12, esiEnabled: true, esiRate: 0.75, tdsEnabled: true, ptEnabled: true },
                    payrollCycle: { cycleStart: 1, cycleEnd: 31, payoutDay: 5, frequency: 'Monthly', cutoffDay: 25, allowOverlap: false, autoRunEnabled: false },
                    componentCount: 3, bankAccountCount: 1, reason: 'Fiscal year opening snapshot', isLocked: true,
                },
                {
                    id: 'snap-2', name: 'Pre-budget adjustment', description: 'Taken before Feb 2026 rate change',
                    capturedDate: '2026-01-28', capturedBy: 'Finance Lead',
                    statutorySettings: { pfEnabled: true, pfRate: 12, esiEnabled: true, esiRate: 0.75, tdsEnabled: true, ptEnabled: true },
                    payrollCycle: { cycleStart: 1, cycleEnd: 31, payoutDay: 5, frequency: 'Monthly', cutoffDay: 25, allowOverlap: false, autoRunEnabled: false },
                    componentCount: 3, bankAccountCount: 1, reason: 'Regulatory change preparation',
                },
            ],
            policyTemplates: [
                { id: 'pt-1', name: 'Small Business Starter', description: '<25 employees, basic PF/PT', category: 'Small Business', statutoryOverride: { pfEnabled: true, pfRate: 12, esiEnabled: false, esiRate: 0, tdsEnabled: true, ptEnabled: true }, cycleOverride: { frequency: 'Monthly', payoutDay: 7 }, createdBy: 'System', createdDate: '2025-04-01', usageCount: 4 },
                { id: 'pt-2', name: 'Mid-Market Standard', description: '25-250 employees, full statutory', category: 'Mid-Market', statutoryOverride: { pfEnabled: true, pfRate: 12, esiEnabled: true, esiRate: 0.75, tdsEnabled: true, ptEnabled: true }, cycleOverride: { frequency: 'Monthly', payoutDay: 5 }, createdBy: 'System', createdDate: '2025-04-01', usageCount: 12 },
                { id: 'pt-3', name: 'Enterprise Complex', description: '250+ employees, multi-state', category: 'Enterprise', statutoryOverride: { pfEnabled: true, pfRate: 12, esiEnabled: true, esiRate: 0.75, tdsEnabled: true, ptEnabled: true }, cycleOverride: { frequency: 'Monthly', payoutDay: 3, autoRunEnabled: true }, createdBy: 'System', createdDate: '2025-04-01', usageCount: 6 },
            ],
            settingValidationRules: [
                { id: 'svr-1', settingKey: 'pfRate', label: 'PF Rate', operator: 'range', minValue: 0, maxValue: 20, severity: 'error', message: 'PF rate must be between 0 and 20%', active: true },
                { id: 'svr-2', settingKey: 'esiRate', label: 'ESI Rate', operator: 'range', minValue: 0, maxValue: 5, severity: 'error', message: 'ESI rate must be between 0 and 5%', active: true },
                { id: 'svr-3', settingKey: 'payoutDay', label: 'Payout Day', operator: 'range', minValue: 1, maxValue: 10, severity: 'warning', message: 'Payout day after 10th may affect compliance', active: true },
                { id: 'svr-4', settingKey: 'cutoffDay', label: 'Cutoff Day', operator: 'range', minValue: 20, maxValue: 31, severity: 'warning', message: 'Cutoff day should be in last 10 days of month', active: true },
            ],
            settingsPermissions: [
                { id: 'sp-1', role: 'Org Admin', scope: 'All', canView: true, canEdit: true, canApprove: true },
                { id: 'sp-2', role: 'HR Manager', scope: 'Structure', canView: true, canEdit: true, canApprove: false },
                { id: 'sp-3', role: 'HR Manager', scope: 'Statutory', canView: true, canEdit: false, canApprove: false },
                { id: 'sp-4', role: 'Finance', scope: 'Bank', canView: true, canEdit: true, canApprove: true },
                { id: 'sp-5', role: 'Finance', scope: 'Statutory', canView: true, canEdit: true, canApprove: false },
                { id: 'sp-6', role: 'Auditor', scope: 'Audit', canView: true, canEdit: false, canApprove: false },
                { id: 'sp-7', role: 'Payroll Ops', scope: 'Cycle', canView: true, canEdit: true, canApprove: false },
            ],
            dashboardWidgets: [
                { id: 'dw-kpi', type: 'PayrollKpi', title: 'Payroll KPIs', enabled: true, order: 0, size: 'full' },
                { id: 'dw-compliance', type: 'ComplianceHealth', title: 'Compliance health', enabled: true, order: 1, size: 'md' },
                { id: 'dw-approvals', type: 'PendingApprovals', title: 'Pending approvals', enabled: true, order: 2, size: 'md' },
                { id: 'dw-claims', type: 'RecentClaims', title: 'Recent reimbursement claims', enabled: true, order: 3, size: 'md' },
                { id: 'dw-filings', type: 'UpcomingFilings', title: 'Upcoming statutory filings', enabled: true, order: 4, size: 'md' },
                { id: 'dw-headcount', type: 'HeadcountTrend', title: 'Headcount trend', enabled: true, order: 5, size: 'lg' },
                { id: 'dw-cost', type: 'CostTrend', title: 'Cost-to-company trend', enabled: true, order: 6, size: 'lg' },
                { id: 'dw-taxsave', type: 'TaxSavings', title: 'Tax savings summary', enabled: false, order: 7, size: 'md' },
                { id: 'dw-liability', type: 'StatutoryLiability', title: 'Statutory liability', enabled: false, order: 8, size: 'md' },
                { id: 'dw-highlights', type: 'EmployeeHighlights', title: 'Employee highlights', enabled: true, order: 9, size: 'md' },
                { id: 'dw-variance', type: 'MonthlyVariance', title: 'Monthly variance', enabled: false, order: 10, size: 'lg' },
                { id: 'dw-calendar', type: 'CalendarMini', title: 'Payroll calendar', enabled: true, order: 11, size: 'md' },
            ],
            dashboardAlerts: [
                { id: 'da-1', severity: 'critical', source: 'Compliance', title: 'PF challan pending', description: 'PF challan for Mar 2026 must be paid before 15-Apr-2026 to avoid penalty.', createdAt: '2026-04-10T09:00:00Z', dueDate: '2026-04-15', link: '/hrmcubicle/payroll/statutory', linkLabel: 'Open statutory' },
                { id: 'da-2', severity: 'warning', source: 'Payroll', title: '3 employees on hold', description: 'Rajesh, Sneha and Vikram are on hold in the April pay run. Release or exclude before lockdown.', createdAt: '2026-04-12T08:15:00Z', link: '/hrmcubicle/payroll/processing', linkLabel: 'Open processing' },
                { id: 'da-3', severity: 'warning', source: 'Tax', title: 'Declaration window closing', description: 'Tax declaration window closes on 30-Apr-2026. 8 employees have not submitted.', createdAt: '2026-04-15T10:30:00Z', dueDate: '2026-04-30', link: '/hrmcubicle/payroll/tax-declarations', linkLabel: 'Review declarations' },
                { id: 'da-4', severity: 'info', source: 'Reimbursement', title: '12 claims awaiting approval', description: 'Reimbursement claims have been pending for over 5 days.', createdAt: '2026-04-16T11:00:00Z', link: '/hrmcubicle/payroll/reimbursements', linkLabel: 'Review claims' },
                { id: 'da-5', severity: 'warning', source: 'Entity', title: 'Ent-3 registrations expiring', description: 'Fixl Innovations has 2 statutory registrations expiring in the next 30 days.', createdAt: '2026-04-17T07:00:00Z', link: '/hrmcubicle/payroll/multi-entity', linkLabel: 'Open multi-entity' },
            ],
            quickActions: [
                { id: 'qa-1', label: 'Run payroll', description: 'Start the current month payroll cycle', icon: 'Play', href: '/hrmcubicle/payroll/processing', color: '#8B5CF6', pinned: true, order: 0 },
                { id: 'qa-2', label: 'Generate payslips', description: 'Batch payslip generation', icon: 'FileText', href: '/hrmcubicle/payroll/payslips', color: '#3B82F6', pinned: true, order: 1 },
                { id: 'qa-3', label: 'Add employee', description: 'Onboard new employee into payroll', icon: 'UserPlus', href: '/hrmcubicle/payroll/processing', color: '#10B981', pinned: true, order: 2 },
                { id: 'qa-4', label: 'Review claims', description: 'Approve pending reimbursements', icon: 'Receipt', href: '/hrmcubicle/payroll/reimbursements', color: '#F59E0B', pinned: true, order: 3 },
                { id: 'qa-5', label: 'View reports', description: 'Payroll + compliance reports', icon: 'BarChart3', href: '/hrmcubicle/payroll/payroll-reports', color: '#EC4899', pinned: true, order: 4 },
                { id: 'qa-6', label: 'Statutory filings', description: 'PF / ESI / PT / TDS', icon: 'ShieldCheck', href: '/hrmcubicle/payroll/statutory', color: '#14B8A6', pinned: true, order: 5 },
                { id: 'qa-7', label: 'Tax declarations', description: 'Review employee declarations', icon: 'Calculator', href: '/hrmcubicle/payroll/tax-declarations', color: '#6366F1', pinned: false, order: 6 },
                { id: 'qa-8', label: 'Loans & advances', description: 'Approve/track loans', icon: 'Landmark', href: '/hrmcubicle/payroll/loans', color: '#0EA5E9', pinned: false, order: 7 },
            ],
            declarationWindowOpen: true,
            proofWindowOpen: false,

            addPayRun: (run) => set((state) => ({ payRuns: [{ ...run, id: `pr-${Date.now()}` }, ...state.payRuns] })),
            updatePayRun: (id, updates) => set((state) => ({
                payRuns: state.payRuns.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deletePayRun: (id) => set((state) => ({
                payRuns: state.payRuns.filter(r => r.id !== id),
                payrollEmployees: state.payrollEmployees.filter(e => e.payRunId !== id),
            })),
            advancePayRunStep: (id) => set((state) => ({
                payRuns: state.payRuns.map(r => r.id === id && r.step < 3
                    ? { ...r, step: r.step + 1, status: stepToStatus(r.step + 1) }
                    : r)
            })),
            finalizePayRun: (id) => {
                // ── Step 1 — lock the run & update status ──
                set((state) => ({
                    payRuns: state.payRuns.map(r => r.id === id
                        ? { ...r, status: 'Locked' as const, step: 3, processedAt: new Date().toISOString().split('T')[0] }
                        : r)
                }));
                const state = get();
                const run = state.payRuns.find(r => r.id === id);
                if (!run) return;
                const includedEmps = state.payrollEmployees.filter(e => e.payRunId === id && e.included);
                const runMonth = run.month;  // e.g. "March 2026"
                const monthShort = (() => {
                    // Convert "March 2026" → "Mar 2026" for statutory records
                    const [m, y] = runMonth.split(' ');
                    const mm = m.slice(0, 3);
                    return `${mm} ${y}`;
                })();

                // ── Step 2 — auto-generate payslips ──
                get().generatePayslipsFromRun(id);

                // ── Step 3 — create PF / ESI / PT records in statutory-store ──
                const statutoryStore = useStatutoryStore.getState();
                const existingPfKeys = new Set(statutoryStore.pfRecords.map(r => `${r.employeeId}::${r.month}`));
                const existingEsiKeys = new Set(statutoryStore.esiRecords.map(r => `${r.employeeId}::${r.month}`));
                const existingPtKeys = new Set(statutoryStore.ptRecords.map(r => `${r.employeeId}::${r.month}`));

                includedEmps.forEach(emp => {
                    // PF record
                    if (emp.pf > 0 && !existingPfKeys.has(`${emp.empCode}::${monthShort}`)) {
                        const employerPf = emp.pf;
                        const epsContribution = Math.round(Math.min(emp.basic, 15000) * 0.0833);
                        const edliContribution = Math.round(Math.min(emp.basic, 15000) * 0.005);
                        statutoryStore.addPFRecord({
                            id: `pf-${Date.now()}-${Math.random().toString(36).slice(2, 5)}-${emp.empCode}`,
                            employeeId: emp.empCode,
                            employeeName: emp.name,
                            uan: '100' + emp.empCode.replace(/\D/g, '').padEnd(9, '0').slice(0, 9),
                            month: monthShort,
                            basicPay: emp.basic,
                            employeeContribution: emp.pf,
                            employerContribution: employerPf,
                            epsContribution,
                            edliContribution,
                            status: 'Pending',
                        });
                    }
                    // ESI record (only if esi > 0)
                    if (emp.esi > 0 && !existingEsiKeys.has(`${emp.empCode}::${monthShort}`)) {
                        const gross = emp.basic + emp.hra + emp.specialAllowance + emp.conveyance + emp.medicalAllowance + emp.variable;
                        const esiEmployer = Math.round(gross * 0.0325);
                        statutoryStore.addESIRecord({
                            id: `esi-${Date.now()}-${Math.random().toString(36).slice(2, 5)}-${emp.empCode}`,
                            employeeId: emp.empCode,
                            employeeName: emp.name,
                            esicNumber: '310' + emp.empCode.replace(/\D/g, '').padEnd(7, '0').slice(0, 7),
                            month: monthShort,
                            grossWage: gross,
                            esiEmployee: emp.esi,
                            esiEmployer,
                            status: 'Pending',
                        });
                    }
                    // PT record (only if pt > 0)
                    if (emp.pt > 0 && !existingPtKeys.has(`${emp.empCode}::${monthShort}`)) {
                        const gross = emp.basic + emp.hra + emp.specialAllowance + emp.conveyance + emp.medicalAllowance + emp.variable;
                        statutoryStore.addPTRecord({
                            id: `pt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}-${emp.empCode}`,
                            employeeId: emp.empCode,
                            employeeName: emp.name,
                            state: 'Maharashtra',
                            month: monthShort,
                            grossSalary: gross,
                            ptDeduction: emp.pt,
                            status: 'Pending',
                        });
                    }
                });

                // ── Step 4 — upsert MonthlyFiling ──
                const existingFiling = statutoryStore.monthlyFilings.find(f => f.month === monthShort);
                if (!existingFiling) {
                    statutoryStore.addMonthlyFiling({
                        month: monthShort,
                        pfStatus: 'Pending',
                        esiStatus: 'Pending',
                        ptStatus: 'Pending',
                        tdsStatus: 'Pending',
                        lwfStatus: 'Pending',
                        notes: 'Auto-created from payroll finalization',
                    });
                }

                // ── Step 5 — mark approved claims paid against this run ──
                const claims = get().claims;
                const approvedClaims = claims.filter(c => c.status === 'Approved' && (c.paidInRunId === id || !c.paidInRunId));
                approvedClaims.forEach(c => get().markClaimPaid(c.id, id));

                // ── Step 6 — activity log ──
                statutoryStore.addActivityLog({
                    type: 'PF',
                    action: 'Payroll finalized',
                    description: `Pay run "${runMonth}" finalized; ${includedEmps.length} employees, PF/ESI/PT records auto-created.`,
                    performedBy: 'Payroll System',
                    severity: 'success',
                });

                // ── Step 7 — dashboard alert ──
                get().addDashboardAlert({
                    severity: 'info',
                    source: 'Payroll',
                    title: `Pay run ${runMonth} finalized`,
                    description: `${includedEmps.length} employees processed. PF/ESI/PT records + payslips generated. Review statutory filings.`,
                    link: '/hrmcubicle/payroll/statutory',
                    linkLabel: 'Open statutory',
                });

                // ── Step 8 — mark active loan EMIs paid for this month ──
                const salaryStore = useSalaryStore.getState();
                const activeLoans = salaryStore.loans.filter(l => l.status === 'Active');
                activeLoans.forEach(loan => {
                    const pendingEmi = loan.emis.find(e => e.status === 'Pending');
                    if (pendingEmi && includedEmps.some(e => e.empCode === loan.employeeId)) {
                        salaryStore.markEmiPaid(loan.id, pendingEmi.month);
                    }
                });
            },

            // ── Cross-page orchestration ──
            syncLoanDeductionsToPayRun: (payRunId) => {
                const salaryStore = useSalaryStore.getState();
                const state = get();
                const runEmps = state.payrollEmployees.filter(e => e.payRunId === payRunId && e.included);
                let updated = 0;
                let totalEmi = 0;
                const updatedEmps = state.payrollEmployees.map(e => {
                    if (!runEmps.some(re => re.id === e.id)) return e;
                    const activeLoansForEmp = salaryStore.loans.filter(l => l.status === 'Active' && l.employeeId === e.empCode);
                    const monthEmi = activeLoansForEmp.reduce((sum, l) => {
                        const pending = l.emis.find(emi => emi.status === 'Pending');
                        return sum + (pending?.amount ?? 0);
                    }, 0);
                    if (monthEmi === 0) return e;
                    updated++;
                    totalEmi += monthEmi;
                    return { ...e, otherDeductions: (e.otherDeductions ?? 0) + monthEmi };
                });
                if (updated > 0) {
                    set({
                        payrollEmployees: updatedEmps,
                        payRuns: recomputeRunTotals(state.payRuns, updatedEmps, payRunId),
                    });
                }
                return { updated, totalEmi };
            },

            syncClaimReimbursementsToPayRun: (payRunId) => {
                const state = get();
                const runEmps = state.payrollEmployees.filter(e => e.payRunId === payRunId && e.included);
                const approvedClaimsByEmp: Record<string, number> = {};
                state.claims.forEach(c => {
                    if (c.status === 'Approved' && (!c.paidInRunId || c.paidInRunId === payRunId)) {
                        approvedClaimsByEmp[c.employeeId] = (approvedClaimsByEmp[c.employeeId] ?? 0) + c.amount;
                    }
                });
                let reimbursed = 0;
                let total = 0;
                const updatedEmps = state.payrollEmployees.map(e => {
                    if (!runEmps.some(re => re.id === e.id)) return e;
                    const claimAmt = approvedClaimsByEmp[e.empCode] ?? 0;
                    if (claimAmt === 0) return e;
                    reimbursed++;
                    total += claimAmt;
                    return { ...e, variable: (e.variable ?? 0) + claimAmt };
                });
                if (reimbursed > 0) {
                    set({
                        payrollEmployees: updatedEmps,
                        payRuns: recomputeRunTotals(state.payRuns, updatedEmps, payRunId),
                    });
                }
                return { reimbursed, total };
            },

            syncRevisionToNextPayRun: (revisionId) => {
                const salaryStore = useSalaryStore.getState();
                const revision = salaryStore.revisions.find(r => r.id === revisionId);
                if (!revision || revision.status !== 'Approved') return;
                const state = get();
                // Find the next Draft/Processing pay run that falls on/after the effectiveDate.
                const effective = new Date(revision.effectiveDate);
                const targetRuns = state.payRuns.filter(r => r.status === 'Draft' || r.status === 'Processing');
                if (!targetRuns.length) return;
                // Compute scale factor from CTC delta
                const scale = revision.currentCTC > 0 ? revision.revisedCTC / revision.currentCTC : 1;
                const updatedEmps = state.payrollEmployees.map(e => {
                    const empInTarget = targetRuns.some(r => r.id === e.payRunId);
                    if (!empInTarget) return e;
                    if (e.empCode !== revision.empCode && e.empCode !== revision.employeeId) return e;
                    const runMonth = state.payRuns.find(r => r.id === e.payRunId)?.month;
                    if (!runMonth) return e;
                    const runDate = new Date(runMonth);
                    if (runDate < effective) return e;
                    return {
                        ...e,
                        basic: Math.round(e.basic * scale),
                        hra: Math.round(e.hra * scale),
                        specialAllowance: Math.round(e.specialAllowance * scale),
                        variable: Math.round(e.variable * scale),
                        pf: Math.round(e.pf * scale),
                        remarks: `Revised CTC applied (${revision.incrementPercent.toFixed(1)}%)`,
                    };
                });
                const affectedRunIds = new Set(targetRuns.map(r => r.id));
                let nextRuns = state.payRuns;
                affectedRunIds.forEach(rid => { nextRuns = recomputeRunTotals(nextRuns, updatedEmps, rid); });
                set({ payrollEmployees: updatedEmps, payRuns: nextRuns });
            },

            reassignEmployeeEntity: (empCode, entityId, entityName) => set((state) => ({
                payrollEmployees: state.payrollEmployees.map(e =>
                    e.empCode === empCode ? { ...e, entityId, entityName } : e
                )
            })),

            applyTemplateToPayRunEmployees: (templateId, payRunId) => {
                const salaryStore = useSalaryStore.getState();
                const template = salaryStore.templates.find(t => t.id === templateId);
                if (!template) return { updated: 0 };
                const assignedIds = new Set(template.assignedEmployeeIds ?? []);
                if (assignedIds.size === 0) return { updated: 0 };
                const state = get();
                let updated = 0;
                const updatedEmps = state.payrollEmployees.map(e => {
                    if (e.payRunId !== payRunId) return e;
                    if (!assignedIds.has(e.empCode) && !assignedIds.has(e.id)) return e;
                    // Compute annual CTC from current components as a baseline
                    const currentMonthlyGross = e.basic + e.hra + e.specialAllowance + e.conveyance + e.medicalAllowance;
                    const annualCtc = currentMonthlyGross * 12;
                    const breakdown = salaryStore.computeCtcBreakdown(templateId, annualCtc);
                    const get1 = (name: string) => breakdown.find(b => b.componentName.toLowerCase() === name.toLowerCase())?.monthly ?? 0;
                    const newBasic = get1('Basic Pay') || e.basic;
                    const newHra = get1('HRA') || e.hra;
                    const newSpecial = get1('Special Allowance') || e.specialAllowance;
                    const newConveyance = get1('Conveyance') || e.conveyance;
                    const newMedical = get1('Medical Allowance') || e.medicalAllowance;
                    const newPf = get1('PF (Employee)') || Math.round(newBasic * 0.12);
                    const newPt = get1('Professional Tax') || e.pt;
                    updated++;
                    return {
                        ...e,
                        basic: newBasic,
                        hra: newHra,
                        specialAllowance: newSpecial,
                        conveyance: newConveyance,
                        medicalAllowance: newMedical,
                        pf: newPf,
                        pt: newPt,
                        remarks: `Template "${template.name}" applied`,
                    };
                });
                if (updated > 0) {
                    set({
                        payrollEmployees: updatedEmps,
                        payRuns: recomputeRunTotals(state.payRuns, updatedEmps, payRunId),
                    });
                }
                return { updated };
            },

            recomputeTdsFromDeclarations: (payRunId) => {
                const state = get();
                const runEmps = state.payrollEmployees.filter(e => e.payRunId === payRunId && e.included);
                let updated = 0;
                const updatedEmps = state.payrollEmployees.map(e => {
                    if (!runEmps.some(re => re.id === e.id)) return e;
                    const decl = state.declarations.find(d => (d.empCode === e.empCode || d.employeeId === e.empCode) && d.status === 'Verified');
                    if (!decl) return e;
                    const gross = decl.grossSalary ?? 0;
                    const savings = decl.totalSavings ?? 0;
                    const annualTax = computeTax(gross, savings, decl.regime);
                    const monthlyTds = Math.round(annualTax * 1.04 / 12); // include 4% cess
                    if (e.tds === monthlyTds) return e;
                    updated++;
                    return { ...e, tds: monthlyTds };
                });
                if (updated > 0) {
                    set({
                        payrollEmployees: updatedEmps,
                        payRuns: recomputeRunTotals(state.payRuns, updatedEmps, payRunId),
                    });
                }
                return { updated };
            },

            addPayrollEmployee: (emp) => set((state) => {
                const newEmp: PayrollEmployee = { ...emp, id: `pe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
                const newEmployees = [...state.payrollEmployees, newEmp];
                return {
                    payrollEmployees: newEmployees,
                    payRuns: recomputeRunTotals(state.payRuns, newEmployees, emp.payRunId),
                };
            }),
            updatePayrollEmployee: (id, updates) => set((state) => {
                const existing = state.payrollEmployees.find(e => e.id === id);
                const newEmployees = state.payrollEmployees.map(e => e.id === id ? { ...e, ...updates } : e);
                if (!existing) return { payrollEmployees: newEmployees };
                return {
                    payrollEmployees: newEmployees,
                    payRuns: recomputeRunTotals(state.payRuns, newEmployees, existing.payRunId),
                };
            }),
            deletePayrollEmployee: (id) => set((state) => {
                const existing = state.payrollEmployees.find(e => e.id === id);
                const newEmployees = state.payrollEmployees.filter(e => e.id !== id);
                return {
                    payrollEmployees: newEmployees,
                    payRuns: existing ? recomputeRunTotals(state.payRuns, newEmployees, existing.payRunId) : state.payRuns,
                };
            }),
            bulkUpdatePayrollEmployees: (ids, updates) => set((state) => {
                const newEmployees = state.payrollEmployees.map(e => ids.includes(e.id) ? { ...e, ...updates } : e);
                const affectedRunIds = Array.from(new Set(state.payrollEmployees.filter(e => ids.includes(e.id)).map(e => e.payRunId)));
                let newPayRuns = state.payRuns;
                affectedRunIds.forEach(runId => {
                    newPayRuns = recomputeRunTotals(newPayRuns, newEmployees, runId);
                });
                return { payrollEmployees: newEmployees, payRuns: newPayRuns };
            }),

            addClaim: (claim) => set((state) => ({ claims: [{ ...claim, id: `cl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }, ...state.claims] })),
            updateClaim: (id, updates) => set((state) => ({
                claims: state.claims.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteClaim: (id) => set((state) => ({ claims: state.claims.filter(c => c.id !== id) })),
            updateClaimStatus: (id, status, remarks) => set((state) => ({
                claims: state.claims.map(c => c.id === id ? { ...c, status, remarks } : c)
            })),
            bulkUpdateClaimStatus: (ids, status) => set((state) => ({
                claims: state.claims.map(c => ids.includes(c.id) ? { ...c, status } : c)
            })),
            bulkDeleteClaims: (ids) => set((state) => ({
                claims: state.claims.filter(c => !ids.includes(c.id))
            })),
            rejectClaim: (id, reason, tags) => set((state) => ({
                claims: state.claims.map(c => c.id === id ? {
                    ...c,
                    status: 'Rejected' as const,
                    rejectionReason: reason,
                    rejectionTags: tags ?? [],
                    rejectedDate: new Date().toISOString().split('T')[0],
                } : c)
            })),
            approveClaim: (id, approvedBy) => set((state) => ({
                claims: state.claims.map(c => c.id === id ? {
                    ...c,
                    status: 'Approved' as const,
                    approvedBy,
                    approvedDate: new Date().toISOString().split('T')[0],
                } : c)
            })),
            markClaimPaid: (id, runId) => set((state) => {
                const claim = state.claims.find(c => c.id === id);
                const updatedClaims = state.claims.map(c => c.id === id ? {
                    ...c,
                    status: 'Paid' as const,
                    paidDate: new Date().toISOString().split('T')[0],
                    paidInRunId: runId,
                } : c);
                // If a runId is provided, add claim amount to that employee's variable earnings so it shows up in pay run
                if (!runId || !claim) return { claims: updatedClaims };
                const updatedEmps = state.payrollEmployees.map(e => {
                    if (e.payRunId !== runId) return e;
                    if (e.empCode !== claim.employeeId && e.empCode !== claim.empCode) return e;
                    return { ...e, variable: (e.variable ?? 0) + claim.amount };
                });
                return {
                    claims: updatedClaims,
                    payrollEmployees: updatedEmps,
                    payRuns: recomputeRunTotals(state.payRuns, updatedEmps, runId),
                };
            }),
            addClaimComment: (id, author, text) => set((state) => ({
                claims: state.claims.map(c => c.id === id ? {
                    ...c,
                    comments: [...(c.comments ?? []), {
                        id: `cm-${Date.now()}`,
                        author,
                        text,
                        timestamp: new Date().toISOString(),
                    }],
                } : c)
            })),

            addReimbursementCategory: (cat) => set((state) => ({
                reimbursementCategories: [...state.reimbursementCategories, { ...cat, id: `rc-${Date.now()}` }]
            })),
            updateReimbursementCategory: (id, updates) => set((state) => ({
                reimbursementCategories: state.reimbursementCategories.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteReimbursementCategory: (id) => set((state) => ({
                reimbursementCategories: state.reimbursementCategories.filter(c => c.id !== id)
            })),

            // ── Round 2 — reimbursement advanced ─────────────────────────────
            runOcrOnClaim: (id) => {
                const claim = get().claims.find(c => c.id === id);
                if (!claim) return { confidence: 0, extractedAt: new Date().toISOString() };
                const variance = (claim.id.charCodeAt(claim.id.length - 1) % 7) * 0.015;
                const detectedAmount = Math.round(claim.amount * (1 - variance));
                const confidence = 0.82 + (claim.id.charCodeAt(0) % 16) / 100;
                const vendors = ['Uber India', 'Apollo Pharmacy', 'Indian Oil', 'BigBasket', 'Swiggy', 'HP Petrol Pump', 'Indigo Airlines'];
                const vendor = vendors[claim.id.charCodeAt(1) % vendors.length];
                const extraction: ReceiptOcr = {
                    detectedAmount,
                    detectedDate: claim.submittedDate,
                    detectedVendor: vendor,
                    detectedCategory: claim.category,
                    confidence,
                    extractedAt: new Date().toISOString(),
                    rawText: `${vendor}\nDate: ${claim.submittedDate}\nTotal: ₹${detectedAmount}\nGST included\nRef: ${claim.id.slice(-8).toUpperCase()}`,
                };
                set((state) => ({ claims: state.claims.map(c => c.id === id ? { ...c, receiptOcr: extraction } : c) }));
                return extraction;
            },

            bulkRunOcrClaims: (ids) => {
                const runOcr = get().runOcrOnClaim;
                ids.forEach(id => runOcr(id));
                return { processed: ids.length };
            },

            detectDuplicateClaim: (id) => {
                const claim = get().claims.find(c => c.id === id);
                if (!claim) return null;
                const dup = get().claims.find(c =>
                    c.id !== id &&
                    c.employeeId === claim.employeeId &&
                    c.category === claim.category &&
                    Math.abs(c.amount - claim.amount) < 1 &&
                    Math.abs(new Date(c.submittedDate).getTime() - new Date(claim.submittedDate).getTime()) < 7 * 24 * 3600 * 1000
                );
                if (dup) {
                    set((state) => ({ claims: state.claims.map(c => c.id === id ? { ...c, duplicateOfClaimId: dup.id } : c) }));
                    return dup.id;
                }
                set((state) => ({ claims: state.claims.map(c => c.id === id ? { ...c, duplicateOfClaimId: undefined } : c) }));
                return null;
            },

            bulkDetectDuplicates: (ids) => {
                const detect = get().detectDuplicateClaim;
                let duplicates = 0;
                ids.forEach(id => { if (detect(id)) duplicates++; });
                return { duplicates };
            },

            autoValidateClaim: (id) => {
                const state = get();
                const claim = state.claims.find(c => c.id === id);
                if (!claim) return { issues: [] };
                const issues: string[] = [];
                const rule = state.reimbursementPolicyRules.find(r => r.category === claim.category && r.active);
                if (rule) {
                    if (rule.receiptRequired && !claim.receiptName) issues.push('Receipt missing');
                    if (rule.perClaimCap > 0 && claim.amount > rule.perClaimCap) issues.push(`Exceeds per-claim cap ${rule.perClaimCap}`);
                    if (rule.monthlyCap > 0) {
                        const monthPrefix = claim.submittedDate.slice(0, 7);
                        const monthTotal = state.claims
                            .filter(c => c.employeeId === claim.employeeId && c.category === claim.category && c.submittedDate.startsWith(monthPrefix) && c.status !== 'Rejected')
                            .reduce((s, c) => s + c.amount, 0);
                        if (monthTotal > rule.monthlyCap) issues.push(`Exceeds monthly cap ${rule.monthlyCap}`);
                    }
                }
                if (claim.duplicateOfClaimId) issues.push('Duplicate claim detected');
                if (claim.receiptOcr && claim.receiptOcr.detectedAmount) {
                    const diff = Math.abs(claim.receiptOcr.detectedAmount - claim.amount);
                    if (diff > claim.amount * 0.1) issues.push('OCR amount mismatch > 10%');
                }
                set((s) => ({ claims: s.claims.map(c => c.id === id ? { ...c, autoValidated: true, validationIssues: issues } : c) }));
                return { issues };
            },

            bulkAutoValidateClaims: (ids) => {
                const validate = get().autoValidateClaim;
                let validated = 0, flagged = 0;
                ids.forEach(id => {
                    const r = validate(id);
                    if (r.issues.length === 0) validated++; else flagged++;
                });
                return { validated, flagged };
            },

            computeMileage: (distanceKm, category) => {
                const rule = get().reimbursementPolicyRules.find(r => r.category === category && r.active);
                const rate = rule?.mileageRatePerKm ?? 10;
                return { amount: Math.round(distanceKm * rate), rate };
            },

            addReimbursementPolicyRule: (rule) => set((state) => ({
                reimbursementPolicyRules: [...state.reimbursementPolicyRules, { ...rule, id: `rpr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateReimbursementPolicyRule: (id, updates) => set((state) => ({
                reimbursementPolicyRules: state.reimbursementPolicyRules.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteReimbursementPolicyRule: (id) => set((state) => ({
                reimbursementPolicyRules: state.reimbursementPolicyRules.filter(r => r.id !== id)
            })),

            // ── Round 2 — custom reports ─────────────────────────────────────
            addCustomReport: (report) => set((state) => ({
                customReports: [...state.customReports, { ...report, id: `cr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateCustomReport: (id, updates) => set((state) => ({
                customReports: state.customReports.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteCustomReport: (id) => set((state) => ({
                customReports: state.customReports.filter(r => r.id !== id)
            })),
            markCustomReportRun: (id) => set((state) => ({
                customReports: state.customReports.map(r => r.id === id ? { ...r, lastRunDate: new Date().toISOString() } : r)
            })),

            // ── Round 2 — settings snapshots / policies / validation ─────────
            captureSettingsSnapshot: (name, capturedBy, reason) => {
                const state = get();
                const snapshot: SettingsSnapshot = {
                    id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                    name,
                    capturedDate: new Date().toISOString().split('T')[0],
                    capturedBy,
                    statutorySettings: { ...state.statutorySettings },
                    payrollCycle: { ...state.payrollCycle },
                    componentCount: state.salaryComponents.length,
                    bankAccountCount: state.bankAccounts.length,
                    reason,
                };
                set((s) => ({
                    settingsSnapshots: [snapshot, ...s.settingsSnapshots],
                    settingsAuditLog: [{
                        id: `sal-${Date.now()}`, timestamp: new Date().toISOString(), actor: capturedBy,
                        area: 'Other' as const,
                        action: 'Snapshot captured',
                        details: `"${name}"${reason ? ` · ${reason}` : ''}`,
                    }, ...s.settingsAuditLog],
                }));
                return snapshot;
            },

            restoreSettingsSnapshot: (id, restoredBy) => {
                const state = get();
                const snap = state.settingsSnapshots.find(s => s.id === id);
                if (!snap) return;
                set((s) => ({
                    statutorySettings: { ...snap.statutorySettings },
                    payrollCycle: { ...snap.payrollCycle },
                    settingsAuditLog: [{
                        id: `sal-${Date.now()}`, timestamp: new Date().toISOString(), actor: restoredBy,
                        area: 'Other' as const,
                        action: 'Snapshot restored',
                        details: `Restored "${snap.name}" from ${snap.capturedDate}`,
                    }, ...s.settingsAuditLog],
                }));
            },

            deleteSettingsSnapshot: (id) => set((state) => ({
                settingsSnapshots: state.settingsSnapshots.filter(s => s.id !== id || s.isLocked)
            })),

            lockSettingsSnapshot: (id, locked) => set((state) => ({
                settingsSnapshots: state.settingsSnapshots.map(s => s.id === id ? { ...s, isLocked: locked } : s)
            })),

            addPolicyTemplate: (template) => set((state) => ({
                policyTemplates: [...state.policyTemplates, { ...template, id: `pt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updatePolicyTemplate: (id, updates) => set((state) => ({
                policyTemplates: state.policyTemplates.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            deletePolicyTemplate: (id) => set((state) => ({
                policyTemplates: state.policyTemplates.filter(p => p.id !== id)
            })),
            applyPolicyTemplate: (id, appliedBy) => {
                const state = get();
                const tpl = state.policyTemplates.find(p => p.id === id);
                if (!tpl) return;
                set((s) => ({
                    statutorySettings: { ...s.statutorySettings, ...(tpl.statutoryOverride ?? {}) },
                    payrollCycle: { ...s.payrollCycle, ...(tpl.cycleOverride ?? {}) },
                    policyTemplates: s.policyTemplates.map(p => p.id === id ? { ...p, lastAppliedDate: new Date().toISOString().split('T')[0], lastAppliedBy: appliedBy, usageCount: (p.usageCount ?? 0) + 1 } : p),
                    settingsAuditLog: [{
                        id: `sal-${Date.now()}`, timestamp: new Date().toISOString(), actor: appliedBy,
                        area: 'Template' as const,
                        action: 'Policy template applied',
                        details: `Applied "${tpl.name}"`,
                    }, ...s.settingsAuditLog],
                }));
            },

            addSettingValidationRule: (rule) => set((state) => ({
                settingValidationRules: [...state.settingValidationRules, { ...rule, id: `svr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateSettingValidationRule: (id, updates) => set((state) => ({
                settingValidationRules: state.settingValidationRules.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteSettingValidationRule: (id) => set((state) => ({
                settingValidationRules: state.settingValidationRules.filter(r => r.id !== id)
            })),
            runSettingValidation: () => {
                const state = get();
                const issues: { ruleId: string; settingKey: string; currentValue: string; message: string; severity: 'warning' | 'error' }[] = [];
                const values: Record<string, number | undefined> = {
                    pfRate: state.statutorySettings.pfRate,
                    esiRate: state.statutorySettings.esiRate,
                    payoutDay: state.payrollCycle.payoutDay,
                    cutoffDay: state.payrollCycle.cutoffDay,
                };
                state.settingValidationRules.filter(r => r.active).forEach(rule => {
                    const val = values[rule.settingKey];
                    if (val === undefined) return;
                    let violated = false;
                    if (rule.operator === 'min' && rule.minValue !== undefined && val < rule.minValue) violated = true;
                    if (rule.operator === 'max' && rule.maxValue !== undefined && val > rule.maxValue) violated = true;
                    if (rule.operator === 'range' && rule.minValue !== undefined && rule.maxValue !== undefined && (val < rule.minValue || val > rule.maxValue)) violated = true;
                    if (violated) issues.push({ ruleId: rule.id, settingKey: rule.settingKey, currentValue: String(val), message: rule.message, severity: rule.severity });
                });
                return { issues };
            },

            addSettingsPermission: (perm) => set((state) => ({
                settingsPermissions: [...state.settingsPermissions, { ...perm, id: `sp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateSettingsPermission: (id, updates) => set((state) => ({
                settingsPermissions: state.settingsPermissions.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            deleteSettingsPermission: (id) => set((state) => ({
                settingsPermissions: state.settingsPermissions.filter(p => p.id !== id)
            })),

            addDeclaration: (declaration) => set((state) => ({ declarations: [{ ...declaration, id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }, ...state.declarations] })),
            updateDeclaration: (id, updates) => set((state) => ({
                declarations: state.declarations.map(d => d.id === id ? { ...d, ...updates } : d)
            })),
            deleteDeclaration: (id) => set((state) => ({ declarations: state.declarations.filter(d => d.id !== id) })),
            updateDeclarationStatus: (id, status) => set((state) => ({
                declarations: state.declarations.map(d => d.id === id ? { ...d, status } : d)
            })),
            bulkUpdateDeclarationStatus: (ids, status) => set((state) => ({
                declarations: state.declarations.map(d => ids.includes(d.id) ? { ...d, status } : d)
            })),
            bulkDeleteDeclarations: (ids) => set((state) => ({
                declarations: state.declarations.filter(d => !ids.includes(d.id))
            })),
            approveDeclaration: (id, verifiedBy) => set((state) => ({
                declarations: state.declarations.map(d => d.id === id ? {
                    ...d,
                    status: 'Verified' as const,
                    verifiedBy,
                    verifiedDate: new Date().toISOString().split('T')[0],
                } : d)
            })),
            rejectDeclaration: (id, reason) => set((state) => ({
                declarations: state.declarations.map(d => d.id === id ? {
                    ...d,
                    status: 'Rejected' as const,
                    rejectionReason: reason,
                    rejectedDate: new Date().toISOString().split('T')[0],
                } : d)
            })),

            addProof: (proof) => set((state) => ({ proofs: [{ ...proof, id: `pf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }, ...state.proofs] })),
            updateProof: (id, updates) => set((state) => ({
                proofs: state.proofs.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            deleteProof: (id) => set((state) => ({ proofs: state.proofs.filter(p => p.id !== id) })),
            updateProofStatus: (id, status, remarks) => set((state) => ({
                proofs: state.proofs.map(p => p.id === id ? { ...p, status, remarks } : p)
            })),
            bulkUpdateProofStatus: (ids, status) => set((state) => ({
                proofs: state.proofs.map(p => ids.includes(p.id) ? { ...p, status } : p)
            })),
            bulkDeleteProofs: (ids) => set((state) => ({
                proofs: state.proofs.filter(p => !ids.includes(p.id))
            })),
            approveProof: (id, approvedBy, comment) => set((state) => {
                const proof = state.proofs.find(p => p.id === id);
                const updatedProofs = state.proofs.map(p => p.id === id ? {
                    ...p,
                    status: 'Approved' as const,
                    approvedBy,
                    approvedDate: new Date().toISOString().split('T')[0],
                    approvalComment: comment,
                } : p);
                // Update linked declaration's totalSavings + recompute tax
                if (!proof || !proof.linkedDeclarationId) return { proofs: updatedProofs };
                const declaration = state.declarations.find(d => d.id === proof.linkedDeclarationId);
                if (!declaration) return { proofs: updatedProofs };
                const approvedProofsForDecl = updatedProofs.filter(p =>
                    p.linkedDeclarationId === proof.linkedDeclarationId && p.status === 'Approved'
                );
                const newTotalSavings = approvedProofsForDecl.reduce((sum, p) => sum + p.amount, 0);
                const gross = declaration.grossSalary ?? 0;
                const newEstimatedTax = Math.round(computeTax(gross, newTotalSavings, declaration.regime));
                const newTaxableIncome = Math.max(0, declaration.regime === 'Old' ? gross - newTotalSavings : gross);
                const updatedDeclarations = state.declarations.map(d => d.id === proof.linkedDeclarationId ? {
                    ...d,
                    totalSavings: newTotalSavings,
                    estimatedTax: newEstimatedTax,
                    taxableIncome: newTaxableIncome,
                } : d);
                return {
                    proofs: updatedProofs,
                    declarations: updatedDeclarations,
                };
            }),
            rejectProof: (id, reason, tags) => set((state) => ({
                proofs: state.proofs.map(p => p.id === id ? {
                    ...p,
                    status: 'Rejected' as const,
                    rejectionReason: reason,
                    rejectionTags: tags ?? [],
                    rejectedDate: new Date().toISOString().split('T')[0],
                } : p)
            })),
            addProofComment: (id, author, text) => set((state) => ({
                proofs: state.proofs.map(p => p.id === id ? {
                    ...p,
                    comments: [...(p.comments ?? []), {
                        id: `cm-${Date.now()}`,
                        author,
                        text,
                        timestamp: new Date().toISOString(),
                    }],
                } : p)
            })),

            addPayslip: (payslip) => set((state) => ({ payslips: [{ ...payslip, id: `PSL-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...state.payslips] })),
            updatePayslip: (id, updates) => set((state) => ({
                payslips: state.payslips.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            updatePayslipStatus: (id, status) => set((state) => ({
                payslips: state.payslips.map(p => {
                    if (p.id !== id) return p;
                    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                    return {
                        ...p,
                        status,
                        generatedDate: (status === 'Generated' || status === 'Distributed') && !p.generatedDate ? today : p.generatedDate,
                        distributedDate: status === 'Distributed' ? today : p.distributedDate,
                        emailSent: status === 'Distributed' ? true : p.emailSent,
                    };
                })
            })),
            deletePayslip: (id) => set((state) => ({
                payslips: state.payslips.filter(p => p.id !== id)
            })),
            bulkUpdatePayslipStatus: (ids, status) => set((state) => {
                const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                return {
                    payslips: state.payslips.map(p => ids.includes(p.id) ? {
                        ...p,
                        status,
                        generatedDate: (status === 'Generated' || status === 'Distributed') && !p.generatedDate ? today : p.generatedDate,
                        distributedDate: status === 'Distributed' ? today : p.distributedDate,
                        emailSent: status === 'Distributed' ? true : p.emailSent,
                    } : p)
                };
            }),
            bulkDeletePayslips: (ids) => set((state) => ({
                payslips: state.payslips.filter(p => !ids.includes(p.id))
            })),
            generatePayslipsFromRun: (payRunId) => {
                const state = get();
                const run = state.payRuns.find(r => r.id === payRunId);
                if (!run) return 0;
                const runEmps = state.payrollEmployees.filter(e => e.payRunId === payRunId && e.included);
                const existingKeys = new Set(state.payslips.filter(p => p.payRunId === payRunId).map(p => `${p.employeeId}::${p.month}`));
                const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                const newSlips: Payslip[] = [];
                runEmps.forEach(e => {
                    const key = `${e.empCode}::${run.month}`;
                    if (existingKeys.has(key)) return;
                    const c = calculateEmployeeNet(e);
                    newSlips.push({
                        id: `PSL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        payRunId: run.id,
                        empCode: e.empCode,
                        employeeName: e.name,
                        employeeId: e.empCode,
                        dept: e.dept,
                        designation: e.designation,
                        month: run.month,
                        basic: e.basic,
                        hra: e.hra,
                        specialAllowance: e.specialAllowance,
                        conveyance: e.conveyance,
                        medicalAllowance: e.medicalAllowance,
                        variable: e.variable,
                        lopDays: e.lopDays,
                        otHours: e.otHours,
                        otAmount: Math.round(c.otAmount),
                        lopDeduction: Math.round(c.lopDeduction),
                        grossEarnings: Math.round(c.grossEarnings),
                        pf: e.pf,
                        esi: e.esi,
                        pt: e.pt,
                        tds: e.tds,
                        otherDeductions: e.otherDeductions,
                        totalDeductions: Math.round(c.totalDeductions),
                        netAmount: Math.round(c.netSalary),
                        bankAccount: e.bankAccount,
                        ifsc: e.ifsc,
                        email: e.email,
                        status: 'Generated',
                        generatedDate: today,
                        emailSent: false,
                    });
                });
                if (newSlips.length) {
                    set({ payslips: [...newSlips, ...state.payslips] });
                }
                return newSlips.length;
            },
            regeneratePayslip: (id) => {
                const state = get();
                const slip = state.payslips.find(p => p.id === id);
                if (!slip) return;
                const emp = state.payrollEmployees.find(e =>
                    (slip.payRunId ? e.payRunId === slip.payRunId : true) &&
                    (e.empCode === slip.empCode || e.empCode === slip.employeeId)
                );
                if (!emp) {
                    set({
                        payslips: state.payslips.map(p => p.id === id ? {
                            ...p,
                            status: 'Generated' as const,
                            generatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                        } : p)
                    });
                    return;
                }
                const c = calculateEmployeeNet(emp);
                const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                set({
                    payslips: state.payslips.map(p => p.id === id ? {
                        ...p,
                        empCode: emp.empCode,
                        dept: emp.dept,
                        designation: emp.designation,
                        basic: emp.basic,
                        hra: emp.hra,
                        specialAllowance: emp.specialAllowance,
                        conveyance: emp.conveyance,
                        medicalAllowance: emp.medicalAllowance,
                        variable: emp.variable,
                        lopDays: emp.lopDays,
                        otHours: emp.otHours,
                        otAmount: Math.round(c.otAmount),
                        lopDeduction: Math.round(c.lopDeduction),
                        grossEarnings: Math.round(c.grossEarnings),
                        pf: emp.pf,
                        esi: emp.esi,
                        pt: emp.pt,
                        tds: emp.tds,
                        otherDeductions: emp.otherDeductions,
                        totalDeductions: Math.round(c.totalDeductions),
                        netAmount: Math.round(c.netSalary),
                        bankAccount: emp.bankAccount,
                        ifsc: emp.ifsc,
                        email: emp.email,
                        status: 'Generated' as const,
                        generatedDate: today,
                    } : p)
                });
            },
            updatePayslipTemplate: (updates) => set((state) => ({
                payslipTemplate: { ...state.payslipTemplate, ...updates }
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

            updatePayrollCycle: (updates) => set((state) => ({
                payrollCycle: { ...state.payrollCycle, ...updates }
            })),

            addBankAccount: (account) => set((state) => ({
                bankAccounts: [...state.bankAccounts, { ...account, id: `ba-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateBankAccount: (id, updates) => set((state) => ({
                bankAccounts: state.bankAccounts.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            deleteBankAccount: (id) => set((state) => ({
                bankAccounts: state.bankAccounts.filter(a => a.id !== id)
            })),
            setPrimaryBankAccount: (id) => set((state) => ({
                bankAccounts: state.bankAccounts.map(a => ({ ...a, isPrimary: a.id === id }))
            })),

            addScheduledReport: (report) => set((state) => ({
                scheduledReports: [...state.scheduledReports, { ...report, id: `sr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateScheduledReport: (id, updates) => set((state) => ({
                scheduledReports: state.scheduledReports.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteScheduledReport: (id) => set((state) => ({
                scheduledReports: state.scheduledReports.filter(r => r.id !== id)
            })),
            toggleScheduledReport: (id) => set((state) => ({
                scheduledReports: state.scheduledReports.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
            })),
            markScheduledReportRun: (id, status) => set((state) => ({
                scheduledReports: state.scheduledReports.map(r => r.id === id ? {
                    ...r,
                    lastRun: new Date().toISOString().split('T')[0],
                    lastRunStatus: status,
                } : r)
            })),

            addSettingsAudit: (entry) => set((state) => ({
                settingsAuditLog: [{
                    ...entry,
                    id: `al-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                    timestamp: new Date().toISOString(),
                }, ...state.settingsAuditLog].slice(0, 100),
            })),
            clearSettingsAudit: () => set({ settingsAuditLog: [] }),

            addDownloadHistory: (entry) => set((state) => ({
                downloadHistory: [{
                    ...entry,
                    id: `dh-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                    timestamp: new Date().toISOString(),
                }, ...state.downloadHistory].slice(0, 200),
            })),
            clearDownloadHistory: () => set({ downloadHistory: [] }),

            // ─── Round 2: Salary Processing advanced ──────────────────────
            holdEmployee: (id, reason) => set((state) => {
                const emp = state.payrollEmployees.find(e => e.id === id);
                if (!emp) return {};
                const newEmployees = state.payrollEmployees.map(e => e.id === id ? {
                    ...e,
                    onHold: true,
                    holdReason: reason,
                    holdDate: new Date().toISOString().split('T')[0],
                    included: false,
                } : e);
                return {
                    payrollEmployees: newEmployees,
                    payRuns: recomputeRunTotals(state.payRuns, newEmployees, emp.payRunId),
                };
            }),
            releaseEmployee: (id) => set((state) => {
                const emp = state.payrollEmployees.find(e => e.id === id);
                if (!emp) return {};
                const newEmployees = state.payrollEmployees.map(e => e.id === id ? {
                    ...e,
                    onHold: false,
                    holdReason: undefined,
                    holdDate: undefined,
                    included: true,
                } : e);
                return {
                    payrollEmployees: newEmployees,
                    payRuns: recomputeRunTotals(state.payRuns, newEmployees, emp.payRunId),
                };
            }),
            bulkHoldEmployees: (ids, reason) => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const newEmployees = state.payrollEmployees.map(e => ids.includes(e.id) ? {
                    ...e,
                    onHold: true,
                    holdReason: reason,
                    holdDate: today,
                    included: false,
                } : e);
                const affectedRunIds = Array.from(new Set(
                    state.payrollEmployees.filter(e => ids.includes(e.id)).map(e => e.payRunId)
                ));
                let newPayRuns = state.payRuns;
                affectedRunIds.forEach(runId => {
                    newPayRuns = recomputeRunTotals(newPayRuns, newEmployees, runId);
                });
                return { payrollEmployees: newEmployees, payRuns: newPayRuns };
            }),

            advanceApprovalStage: (id, approvedBy, notes) => set((state) => {
                return {
                    payrollEmployees: state.payrollEmployees.map(e => {
                        if (e.id !== id) return e;
                        const today = new Date().toISOString().split('T')[0];
                        const defaultChain: ApprovalStep[] = [
                            { stage: 'Manager', status: 'Pending' },
                            { stage: 'HR', status: 'Pending' },
                            { stage: 'Finance', status: 'Pending' },
                        ];
                        const chain = e.approvalChain ?? defaultChain;
                        const nextPending = chain.find(s => s.status === 'Pending');
                        if (!nextPending) return e;
                        const updatedChain = chain.map(s => s.stage === nextPending.stage ? {
                            ...s,
                            status: 'Approved' as const,
                            approvedBy,
                            approvedDate: today,
                            notes,
                        } : s);
                        const nextStage = updatedChain.find(s => s.status === 'Pending')?.stage;
                        const allApproved = updatedChain.every(s => s.status === 'Approved');
                        return {
                            ...e,
                            approvalChain: updatedChain,
                            currentApprovalStage: allApproved ? 'Complete' as const : nextStage,
                            approved: allApproved,
                        };
                    })
                };
            }),

            rejectApprovalStage: (id, stage, rejectedBy, reason) => set((state) => ({
                payrollEmployees: state.payrollEmployees.map(e => {
                    if (e.id !== id) return e;
                    const today = new Date().toISOString().split('T')[0];
                    const chain = e.approvalChain ?? [];
                    const updatedChain = chain.map(s => s.stage === stage ? {
                        ...s,
                        status: 'Rejected' as const,
                        approvedBy: rejectedBy,
                        approvedDate: today,
                        rejectionReason: reason,
                    } : s);
                    return {
                        ...e,
                        approvalChain: updatedChain,
                        currentApprovalStage: stage,
                        approved: false,
                    };
                })
            })),

            clonePayRun: (sourcePayRunId, newMonth) => {
                const state = get();
                const source = state.payRuns.find(r => r.id === sourcePayRunId);
                if (!source) return null;
                if (state.payRuns.some(r => r.month.toLowerCase() === newMonth.toLowerCase())) return null;
                const newRunId = `pr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
                const newRun: PayRun = {
                    id: newRunId,
                    month: newMonth,
                    status: 'Draft',
                    totalNetPay: 0,
                    totalDeductions: 0,
                    totalTDS: 0,
                    totalEmployees: 0,
                    inclusionCount: 0,
                    exclusionCount: 0,
                    step: 0,
                };
                const sourceEmps = state.payrollEmployees.filter(e => e.payRunId === sourcePayRunId);
                const clonedEmps: PayrollEmployee[] = sourceEmps.map(e => ({
                    ...e,
                    id: `pe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    payRunId: newRunId,
                    approved: false,
                    status: 'Pending' as const,
                    approvalChain: undefined,
                    currentApprovalStage: undefined,
                    onHold: false,
                    holdReason: undefined,
                    holdDate: undefined,
                    lopDays: 0,
                    otHours: 0,
                    variable: 0,
                }));
                const newEmployees = [...state.payrollEmployees, ...clonedEmps];
                set({
                    payRuns: recomputeRunTotals([newRun, ...state.payRuns], newEmployees, newRunId),
                    payrollEmployees: newEmployees,
                });
                return newRunId;
            },

            applyBulkAdjustment: (ids, field, mode, value) => set((state) => {
                const newEmployees = state.payrollEmployees.map(e => {
                    if (!ids.includes(e.id)) return e;
                    const current = e[field] as number;
                    let next = current;
                    if (mode === 'fixed') next = value;
                    else if (mode === 'delta') next = current + value;
                    else if (mode === 'percent') next = current * (1 + value / 100);
                    return { ...e, [field]: Math.round(next) };
                });
                const affectedRunIds = Array.from(new Set(
                    state.payrollEmployees.filter(e => ids.includes(e.id)).map(e => e.payRunId)
                ));
                let newPayRuns = state.payRuns;
                affectedRunIds.forEach(runId => {
                    newPayRuns = recomputeRunTotals(newPayRuns, newEmployees, runId);
                });
                return { payrollEmployees: newEmployees, payRuns: newPayRuns };
            }),

            applyProRata: (id) => set((state) => {
                const emp = state.payrollEmployees.find(e => e.id === id);
                if (!emp || !emp.joiningDate) return {};
                const payRun = state.payRuns.find(r => r.id === emp.payRunId);
                if (!payRun) return {};
                // Parse month from payrun.month (e.g. "April 2026")
                const [monthName, yearStr] = payRun.month.split(' ');
                const monthIdx = ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(monthName);
                const year = parseInt(yearStr);
                if (monthIdx < 0 || isNaN(year)) return {};
                const monthStart = new Date(year, monthIdx, 1);
                const monthEnd = new Date(year, monthIdx + 1, 0);
                const daysInMonth = monthEnd.getDate();
                const joinDate = new Date(emp.joiningDate);
                const exitDate = emp.exitDate ? new Date(emp.exitDate) : null;
                const effectiveStart = joinDate > monthStart ? joinDate : monthStart;
                const effectiveEnd = exitDate && exitDate < monthEnd ? exitDate : monthEnd;
                const workedDays = Math.max(0, Math.min(daysInMonth,
                    Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
                ));
                const ratio = workedDays / daysInMonth;
                const newEmp: PayrollEmployee = {
                    ...emp,
                    basic: Math.round(emp.basic * ratio),
                    hra: Math.round(emp.hra * ratio),
                    specialAllowance: Math.round(emp.specialAllowance * ratio),
                    conveyance: Math.round(emp.conveyance * ratio),
                    medicalAllowance: Math.round(emp.medicalAllowance * ratio),
                    proratedDays: workedDays,
                    isProrated: true,
                };
                const newEmployees = state.payrollEmployees.map(e => e.id === id ? newEmp : e);
                return {
                    payrollEmployees: newEmployees,
                    payRuns: recomputeRunTotals(state.payRuns, newEmployees, emp.payRunId),
                };
            }),

            // ─── Round 2: Payslip advanced ────────────────────────────────
            sendPayslipEmail: (id) => {
                const state = get();
                const slip = state.payslips.find(p => p.id === id);
                if (!slip) return { success: false, reason: 'Payslip not found' };
                if (!slip.email) {
                    set({
                        payslips: state.payslips.map(p => p.id === id ? {
                            ...p,
                            emailStatus: 'Failed' as const,
                            emailFailReason: 'No email address on file',
                            emailAttempts: (p.emailAttempts ?? 0) + 1,
                        } : p)
                    });
                    return { success: false, reason: 'No email on file' };
                }
                // Simulate 90% success rate deterministically
                const willSucceed = id.charCodeAt(id.length - 1) % 10 !== 0;
                const today = new Date().toISOString();
                set({
                    payslips: state.payslips.map(p => p.id === id ? {
                        ...p,
                        status: willSucceed ? 'Distributed' as const : p.status,
                        emailSent: willSucceed,
                        emailStatus: willSucceed ? 'Sent' as const : 'Failed' as const,
                        emailSentDate: willSucceed ? today : p.emailSentDate,
                        emailDeliveredDate: willSucceed ? today : undefined,
                        emailFailReason: willSucceed ? undefined : 'SMTP relay timeout',
                        emailAttempts: (p.emailAttempts ?? 0) + 1,
                    } : p)
                });
                return { success: willSucceed, reason: willSucceed ? undefined : 'SMTP relay timeout' };
            },

            bulkSendPayslipEmails: (ids) => {
                let sent = 0, failed = 0;
                const getEmailResult = (payslipId: string, hasEmail: boolean) => {
                    if (!hasEmail) return false;
                    return payslipId.charCodeAt(payslipId.length - 1) % 10 !== 0;
                };
                set((state) => {
                    const today = new Date().toISOString();
                    return {
                        payslips: state.payslips.map(p => {
                            if (!ids.includes(p.id)) return p;
                            const willSucceed = getEmailResult(p.id, !!p.email);
                            if (willSucceed) sent++; else failed++;
                            return {
                                ...p,
                                status: willSucceed ? 'Distributed' as const : p.status,
                                emailSent: willSucceed,
                                emailStatus: willSucceed ? 'Sent' as const : 'Failed' as const,
                                emailSentDate: willSucceed ? today : p.emailSentDate,
                                emailDeliveredDate: willSucceed ? today : undefined,
                                emailFailReason: willSucceed ? undefined : (!p.email ? 'No email address' : 'SMTP relay timeout'),
                                emailAttempts: (p.emailAttempts ?? 0) + 1,
                            };
                        })
                    };
                });
                return { sent, failed };
            },

            setPayslipTemplateDesign: (id, design) => set((state) => ({
                payslips: state.payslips.map(p => p.id === id ? { ...p, templateDesign: design } : p)
            })),

            setPayslipPasswordProtection: (id, enabled, hint) => set((state) => ({
                payslips: state.payslips.map(p => p.id === id ? {
                    ...p,
                    passwordProtected: enabled,
                    passwordHint: enabled ? (hint ?? 'PAN number') : undefined,
                } : p)
            })),

            bulkSetPayslipTemplateDesign: (ids, design) => set((state) => ({
                payslips: state.payslips.map(p => ids.includes(p.id) ? { ...p, templateDesign: design } : p)
            })),

            recomputePayslipYtd: (id) => set((state) => {
                const target = state.payslips.find(p => p.id === id);
                if (!target) return {};
                // Sum all previous payslips for the same employee in same FY
                const [, yearStr] = target.month.split(' ');
                const year = parseInt(yearStr);
                const sameEmpSlips = state.payslips.filter(p =>
                    p.employeeId === target.employeeId &&
                    (p.month.endsWith(String(year)) || p.month.endsWith(String(year - 1)))
                );
                let ytdGross = 0, ytdNet = 0, ytdTax = 0, ytdPF = 0;
                sameEmpSlips.forEach(p => {
                    ytdGross += p.grossEarnings ?? 0;
                    ytdNet += p.netAmount ?? 0;
                    ytdTax += p.tds ?? 0;
                    ytdPF += p.pf ?? 0;
                });
                return {
                    payslips: state.payslips.map(p => p.id === id ? {
                        ...p,
                        ytdGross: Math.round(ytdGross),
                        ytdNet: Math.round(ytdNet),
                        ytdTax: Math.round(ytdTax),
                        ytdPF: Math.round(ytdPF),
                    } : p)
                };
            }),

            // ─── Round 2: Tax Declaration advanced ────────────────────────
            lockDeclaration: (id, lockedUntil, lockedBy, reason) => set((state) => ({
                declarations: state.declarations.map(d => d.id === id ? {
                    ...d,
                    lockedUntil,
                    lockedBy,
                    lockReason: reason,
                } : d)
            })),

            unlockDeclaration: (id) => set((state) => ({
                declarations: state.declarations.map(d => d.id === id ? {
                    ...d,
                    lockedUntil: undefined,
                    lockedBy: undefined,
                    lockReason: undefined,
                } : d)
            })),

            recommendRegime: (id) => set((state) => ({
                declarations: state.declarations.map(d => {
                    if (d.id !== id) return d;
                    const oldTax = computeTax(d.grossSalary ?? 0, d.totalSavings, 'Old');
                    const newTax = computeTax(d.grossSalary ?? 0, d.totalSavings, 'New');
                    const recommended: 'Old' | 'New' = oldTax < newTax ? 'Old' : 'New';
                    const savings = Math.abs(oldTax - newTax);
                    return {
                        ...d,
                        oldRegimeTax: oldTax,
                        newRegimeTax: newTax,
                        recommendedRegime: recommended,
                        recommendedSavings: savings,
                    };
                })
            })),

            recommendAllRegimes: () => {
                const state = get();
                let analyzed = 0, switched = 0;
                set({
                    declarations: state.declarations.map(d => {
                        analyzed++;
                        const oldTax = computeTax(d.grossSalary ?? 0, d.totalSavings, 'Old');
                        const newTax = computeTax(d.grossSalary ?? 0, d.totalSavings, 'New');
                        const recommended: 'Old' | 'New' = oldTax < newTax ? 'Old' : 'New';
                        if (recommended !== d.regime) switched++;
                        return {
                            ...d,
                            oldRegimeTax: oldTax,
                            newRegimeTax: newTax,
                            recommendedRegime: recommended,
                            recommendedSavings: Math.abs(oldTax - newTax),
                        };
                    })
                });
                return { analyzed, switched };
            },

            bulkFlipRegime: (ids, targetRegime) => set((state) => ({
                declarations: state.declarations.map(d => ids.includes(d.id) ? { ...d, regime: targetRegime } : d)
            })),

            runGapAnalysis: (id) => set((state) => ({
                declarations: state.declarations.map(d => {
                    if (d.id !== id) return d;
                    // Max possible: 80C (1.5L) + 80CCD1B (50K) + 80D (1L) + HRA (dynamic) + Sec24 (2L)
                    const maxCaps: Record<string, number> = {
                        '80C': 150000,
                        '80CCD(1B)': 50000,
                        '80D': 100000,
                        'Sec 24': 200000,
                        '80TTA': 10000,
                    };
                    const byCategory = new Map<string, number>();
                    d.declarations.forEach(line => {
                        byCategory.set(line.category, (byCategory.get(line.category) ?? 0) + line.amount);
                    });
                    let maxPossible = 0;
                    for (const [cat, cap] of Object.entries(maxCaps)) {
                        const current = byCategory.get(cat) ?? 0;
                        maxPossible += Math.max(current, cap);
                    }
                    // Add HRA at max 50% of basic if not yet declared
                    const hraCurrent = byCategory.get('HRA') ?? 0;
                    const hraMax = (d.basicSalary ?? 0) * 0.5;
                    maxPossible += Math.max(hraCurrent, hraMax);
                    return {
                        ...d,
                        maxPossibleSavings: Math.round(maxPossible),
                        gapFromMax: Math.round(maxPossible - d.totalSavings),
                    };
                })
            })),

            addDeclarationPolicyRule: (rule) => set((state) => ({
                declarationPolicyRules: [...state.declarationPolicyRules, { ...rule, id: `dpr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateDeclarationPolicyRule: (id, updates) => set((state) => ({
                declarationPolicyRules: state.declarationPolicyRules.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteDeclarationPolicyRule: (id) => set((state) => ({
                declarationPolicyRules: state.declarationPolicyRules.filter(r => r.id !== id)
            })),

            // ─── Round 2: Proof Submission advanced ───────────────────────
            runOcrOnProof: (id) => {
                const state = get();
                const proof = state.proofs.find(p => p.id === id);
                if (!proof) {
                    return { confidence: 0, extractedAt: new Date().toISOString() };
                }
                // Simulate OCR: detected amount is within ±5% of declared amount
                const variance = (Math.random() - 0.5) * 0.1;
                const detectedAmount = Math.round(proof.amount * (1 + variance));
                const confidence = 0.85 + Math.random() * 0.13;
                const extraction: OcrExtraction = {
                    detectedAmount,
                    detectedDate: proof.submittedDate,
                    detectedType: proof.type,
                    detectedVendor: proof.type === 'LIC' ? 'LIC of India' :
                        proof.type === 'PPF' ? 'SBI' :
                            proof.type === '80D' ? 'Star Health Insurance' :
                                proof.type === 'HRA' ? 'Landlord Rent Receipt' :
                                    'Unknown vendor',
                    confidence: Number(confidence.toFixed(2)),
                    extractedAt: new Date().toISOString(),
                    rawText: `Simulated OCR text for ${proof.documentName ?? 'document'}`,
                };
                set({
                    proofs: state.proofs.map(p => p.id === id ? { ...p, ocrExtraction: extraction } : p)
                });
                return extraction;
            },

            bulkRunOcr: (ids) => {
                let processed = 0;
                const state = get();
                const updated = state.proofs.map(p => {
                    if (!ids.includes(p.id)) return p;
                    processed++;
                    const variance = ((p.id.charCodeAt(p.id.length - 1) - 40) / 100) * 0.1;
                    const detectedAmount = Math.round(p.amount * (1 + variance));
                    const confidence = 0.85 + (p.id.charCodeAt(p.id.length - 1) % 13) / 100;
                    return {
                        ...p,
                        ocrExtraction: {
                            detectedAmount,
                            detectedDate: p.submittedDate,
                            detectedType: p.type,
                            detectedVendor: `Auto-detected (${p.type})`,
                            confidence: Number(confidence.toFixed(2)),
                            extractedAt: new Date().toISOString(),
                            rawText: `Simulated OCR for ${p.documentName ?? 'document'}`,
                        } as OcrExtraction,
                    };
                });
                set({ proofs: updated });
                return { processed };
            },

            matchProofWithDeclaration: (id) => {
                const state = get();
                const proof = state.proofs.find(p => p.id === id);
                if (!proof) return { matched: false, notes: 'Proof not found' };
                const declaration = state.declarations.find(d => d.id === proof.linkedDeclarationId);
                if (!declaration) {
                    set({
                        proofs: state.proofs.map(p => p.id === id ? {
                            ...p,
                            matchStatus: 'Unmatched' as const,
                            matchNotes: 'No linked declaration',
                        } : p)
                    });
                    return { matched: false, notes: 'No linked declaration' };
                }
                // Check if proof amount is within declared line items
                const matchingLine = declaration.declarations.find(line =>
                    line.category === proof.type ||
                    (line.subCategory ?? '').toLowerCase().includes(proof.type.toLowerCase())
                );
                let matched = false, notes = '';
                if (!matchingLine) {
                    notes = `No ${proof.type} line in declaration`;
                } else if (Math.abs(matchingLine.amount - proof.amount) / Math.max(1, matchingLine.amount) > 0.05) {
                    notes = `Declared ₹${matchingLine.amount.toLocaleString()} but proof shows ₹${proof.amount.toLocaleString()}`;
                } else {
                    matched = true;
                    notes = `Amount matches declaration (within 5% tolerance)`;
                }
                set({
                    proofs: state.proofs.map(p => p.id === id ? {
                        ...p,
                        matchStatus: matched ? 'Match' as const : 'Mismatch' as const,
                        matchNotes: notes,
                    } : p)
                });
                return { matched, notes };
            },

            bulkMatchProofs: (ids) => {
                const state = get();
                let matched = 0, mismatched = 0, unmatched = 0;
                const updatedProofs = state.proofs.map(p => {
                    if (!ids.includes(p.id)) return p;
                    const declaration = state.declarations.find(d => d.id === p.linkedDeclarationId);
                    if (!declaration) {
                        unmatched++;
                        return { ...p, matchStatus: 'Unmatched' as const, matchNotes: 'No linked declaration' };
                    }
                    const line = declaration.declarations.find(l =>
                        l.category === p.type ||
                        (l.subCategory ?? '').toLowerCase().includes(p.type.toLowerCase())
                    );
                    if (!line) {
                        mismatched++;
                        return { ...p, matchStatus: 'Mismatch' as const, matchNotes: `No ${p.type} line in declaration` };
                    }
                    if (Math.abs(line.amount - p.amount) / Math.max(1, line.amount) > 0.05) {
                        mismatched++;
                        return {
                            ...p,
                            matchStatus: 'Mismatch' as const,
                            matchNotes: `Declared ₹${line.amount.toLocaleString()} but proof shows ₹${p.amount.toLocaleString()}`,
                        };
                    }
                    matched++;
                    return { ...p, matchStatus: 'Match' as const, matchNotes: 'Amount matches declaration' };
                });
                set({ proofs: updatedProofs });
                return { matched, mismatched, unmatched };
            },

            autoValidateProof: (id) => {
                const state = get();
                const proof = state.proofs.find(p => p.id === id);
                if (!proof) return { issues: ['Proof not found'] };
                const rule = state.proofPolicyRules.find(r => r.category === proof.type && r.active);
                const issues: string[] = [];
                if (!rule) {
                    issues.push(`No policy rule defined for ${proof.type}`);
                } else {
                    if (rule.documentRequired && !proof.documentName) {
                        issues.push('Document required but missing');
                    }
                    if (rule.maxAmount > 0 && proof.amount > rule.maxAmount) {
                        issues.push(`Amount exceeds cap of ₹${rule.maxAmount.toLocaleString()}`);
                    }
                }
                if (proof.ocrExtraction && proof.ocrExtraction.detectedAmount) {
                    const diff = Math.abs(proof.ocrExtraction.detectedAmount - proof.amount) / proof.amount;
                    if (diff > 0.1) issues.push(`OCR detected amount differs by ${(diff * 100).toFixed(1)}%`);
                }
                set({
                    proofs: state.proofs.map(p => p.id === id ? {
                        ...p,
                        autoValidated: true,
                        validationIssues: issues,
                    } : p)
                });
                return { issues };
            },

            bulkAutoValidate: (ids) => {
                const state = get();
                let validated = 0, flagged = 0;
                const updated = state.proofs.map(p => {
                    if (!ids.includes(p.id)) return p;
                    const rule = state.proofPolicyRules.find(r => r.category === p.type && r.active);
                    const issues: string[] = [];
                    if (!rule) issues.push(`No policy for ${p.type}`);
                    else {
                        if (rule.documentRequired && !p.documentName) issues.push('Missing document');
                        if (rule.maxAmount > 0 && p.amount > rule.maxAmount) issues.push(`Exceeds cap ₹${rule.maxAmount.toLocaleString()}`);
                    }
                    if (p.ocrExtraction?.detectedAmount) {
                        const diff = Math.abs(p.ocrExtraction.detectedAmount - p.amount) / p.amount;
                        if (diff > 0.1) issues.push(`OCR mismatch ${(diff * 100).toFixed(1)}%`);
                    }
                    validated++;
                    if (issues.length) flagged++;
                    return { ...p, autoValidated: true, validationIssues: issues };
                });
                set({ proofs: updated });
                return { validated, flagged };
            },

            sendProofReminder: (id) => set((state) => ({
                proofs: state.proofs.map(p => p.id === id ? {
                    ...p,
                    reminderSent: true,
                    reminderDate: new Date().toISOString().split('T')[0],
                    reminderCount: (p.reminderCount ?? 0) + 1,
                } : p)
            })),

            bulkSendProofReminders: (ids) => {
                let count = 0;
                set((state) => {
                    const today = new Date().toISOString().split('T')[0];
                    return {
                        proofs: state.proofs.map(p => {
                            if (!ids.includes(p.id)) return p;
                            count++;
                            return {
                                ...p,
                                reminderSent: true,
                                reminderDate: today,
                                reminderCount: (p.reminderCount ?? 0) + 1,
                            };
                        })
                    };
                });
                return count;
            },

            addProofPolicyRule: (rule) => set((state) => ({
                proofPolicyRules: [...state.proofPolicyRules, { ...rule, id: `ppr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateProofPolicyRule: (id, updates) => set((state) => ({
                proofPolicyRules: state.proofPolicyRules.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteProofPolicyRule: (id) => set((state) => ({
                proofPolicyRules: state.proofPolicyRules.filter(r => r.id !== id)
            })),

            // ── Round 2 Batch 4 — Dashboard ──
            toggleDashboardWidget: (id) => set((state) => ({
                dashboardWidgets: state.dashboardWidgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w)
            })),
            reorderDashboardWidgets: (orderedIds) => set((state) => ({
                dashboardWidgets: state.dashboardWidgets.map(w => {
                    const newOrder = orderedIds.indexOf(w.id);
                    return newOrder === -1 ? w : { ...w, order: newOrder };
                })
            })),
            resizeDashboardWidget: (id, size) => set((state) => ({
                dashboardWidgets: state.dashboardWidgets.map(w => w.id === id ? { ...w, size } : w)
            })),
            resetDashboardLayout: () => set((state) => ({
                dashboardWidgets: state.dashboardWidgets.map((w, i) => ({
                    ...w,
                    enabled: !['TaxSavings', 'StatutoryLiability', 'MonthlyVariance'].includes(w.type),
                    order: i,
                    size: w.type === 'PayrollKpi' ? 'full' : w.type === 'HeadcountTrend' || w.type === 'CostTrend' || w.type === 'MonthlyVariance' ? 'lg' : 'md',
                }))
            })),

            addDashboardAlert: (alert) => set((state) => ({
                dashboardAlerts: [
                    { ...alert, id: `da-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, createdAt: new Date().toISOString() },
                    ...state.dashboardAlerts,
                ]
            })),
            dismissDashboardAlert: (id) => set((state) => ({
                dashboardAlerts: state.dashboardAlerts.map(a => a.id === id ? { ...a, dismissed: true } : a)
            })),
            markAlertActioned: (id, actionedBy) => set((state) => ({
                dashboardAlerts: state.dashboardAlerts.map(a => a.id === id ? {
                    ...a,
                    actionTaken: true,
                    actionedBy,
                    actionedAt: new Date().toISOString(),
                } : a)
            })),
            clearDismissedAlerts: () => set((state) => ({
                dashboardAlerts: state.dashboardAlerts.filter(a => !a.dismissed)
            })),

            addQuickAction: (action) => set((state) => ({
                quickActions: [...state.quickActions, { ...action, id: `qa-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }]
            })),
            updateQuickAction: (id, updates) => set((state) => ({
                quickActions: state.quickActions.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            deleteQuickAction: (id) => set((state) => ({
                quickActions: state.quickActions.filter(a => a.id !== id)
            })),
            toggleQuickActionPin: (id) => set((state) => ({
                quickActions: state.quickActions.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a)
            })),
            reorderQuickActions: (orderedIds) => set((state) => ({
                quickActions: state.quickActions.map(a => {
                    const newOrder = orderedIds.indexOf(a.id);
                    return newOrder === -1 ? a : { ...a, order: newOrder };
                })
            })),
        }),
        { name: 'payroll-v11-storage' }
    )
);
