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
    description?: string;
    dueDate: string;
    status: 'Upcoming' | 'Due Today' | 'Overdue' | 'Completed';
    completedDate?: string;
    completedBy?: string;
    relatedMonth?: string;
}

export interface ActivityLog {
    id: string;
    type: 'PF' | 'ESI' | 'PT' | 'LWF' | 'TDS' | 'Form16' | 'Gratuity';
    action: string;
    description: string;
    timestamp: string;
    performedBy: string;
    severity?: 'success' | 'info' | 'warning';
}

export interface MonthlyFiling {
    id: string;
    month: string;
    pfStatus: 'Pending' | 'Filed' | 'Paid';
    esiStatus: 'Pending' | 'Filed' | 'Paid';
    ptStatus: 'Pending' | 'Filed' | 'Paid';
    tdsStatus: 'Pending' | 'Filed' | 'Paid';
    lwfStatus?: 'Pending' | 'Filed' | 'Paid' | 'Not Applicable';
    filedBy?: string;
    filedDate?: string;
    notes?: string;
}

export type ChallanType = 'PF' | 'ESI' | 'PT' | 'TDS' | 'LWF';

export interface Challan {
    id: string;
    type: ChallanType;
    period: string;
    challanNumber: string;
    amount: number;
    employeeCount: number;
    generatedDate: string;
    generatedBy: string;
    status: 'Generated' | 'Paid' | 'Reconciled';
    paidDate?: string;
    reconciledDate?: string;
    reconciliationNotes?: string;
    expectedAmount?: number;
    variance?: number;
    bankReference?: string;
    notes?: string;
}

export interface ComplianceHealthScore {
    overall: number;
    pfScore: number;
    esiScore: number;
    ptScore: number;
    tdsScore: number;
    onTimeFilingPercent: number;
    overdueCount: number;
    reconciledPercent: number;
}

// ── Round 2 Batch 4 Types ────────────────────────────────────────────────

export interface PFTransferRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    uan: string;
    previousEmployerPfNumber: string;
    previousEmployerName: string;
    requestDate: string;
    form13Generated: boolean;
    form13GeneratedDate?: string;
    epfoAckNumber?: string;
    status: 'Submitted' | 'Under Review' | 'Transferred' | 'Rejected';
    transferredAmount?: number;
    transferredDate?: string;
    rejectionReason?: string;
    notes?: string;
}

export interface PFWithdrawalClaim {
    id: string;
    employeeId: string;
    employeeName: string;
    uan: string;
    claimType: 'Form 19 (Final Settlement)' | 'Form 10C (Pension)' | 'Form 31 (Advance)' | 'Form 10D (Pension Benefit)';
    claimDate: string;
    reason?: string;
    claimedAmount: number;
    settledAmount?: number;
    status: 'Submitted' | 'Verified' | 'Approved' | 'Settled' | 'Rejected';
    settledDate?: string;
    rejectionReason?: string;
    documentsAttached?: string[];
}

export interface PFAdvance {
    id: string;
    employeeId: string;
    employeeName: string;
    uan: string;
    purpose: 'Marriage' | 'Education' | 'Medical' | 'Housing' | 'Covid-19' | 'Natural Calamity' | 'Other';
    requestedAmount: number;
    approvedAmount?: number;
    requestDate: string;
    approvalDate?: string;
    status: 'Pending' | 'Approved' | 'Disbursed' | 'Rejected';
    eligibleLimit?: number;
    eligibilityNotes?: string;
    disbursedDate?: string;
    rejectionReason?: string;
}

export interface ESIBreach {
    id: string;
    employeeId: string;
    employeeName: string;
    esicNumber: string;
    breachMonth: string;
    breachGrossWage: number;
    ceiling: number;
    action: 'Flagged' | 'Continued' | 'Exited';
    exitDate?: string;
    notes?: string;
}

export interface ESIBenefitClaim {
    id: string;
    employeeId: string;
    employeeName: string;
    benefitType: 'Sickness' | 'Maternity' | 'Disablement' | 'Dependent' | 'Medical' | 'Funeral';
    claimDate: string;
    amount?: number;
    durationDays?: number;
    status: 'Submitted' | 'Approved' | 'Settled' | 'Rejected';
    settledDate?: string;
    notes?: string;
}

export interface PTExemption {
    id: string;
    employeeId: string;
    employeeName: string;
    state: string;
    exemptionType: 'Senior Citizen' | 'Disability' | 'Parents of Disabled Child' | 'Ex-Servicemen' | 'Other';
    certificateNumber?: string;
    validFrom: string;
    validTo?: string;
    documentName?: string;
    status: 'Active' | 'Expired' | 'Revoked';
    approvedBy?: string;
    notes?: string;
}

export interface GratuityProvision {
    id: string;
    month: string;                              // e.g. "Mar 2026"
    totalLiability: number;                     // PVGD/total future liability
    currentServiceCost: number;                 // monthly provision
    interestCost: number;                       // interest on prior obligation
    actuarialGainLoss: number;
    fundedAmount?: number;                      // trust fund balance
    unfundedLiability: number;
    eligibleEmployeeCount: number;
    discountRate: number;                       // %
    salaryGrowthRate: number;                   // %
    attritionRate: number;                      // %
    recordedBy: string;
    recordedDate: string;
}

export interface Form16DigitalSign {
    id: string;
    form16Id: string;
    employeeId: string;
    employeeName: string;
    fiscalYear: string;
    signedBy: string;                           // signer name
    signedByDesignation: string;
    signatureCertSerial?: string;
    signedDate: string;
    tracesAckNumber?: string;
    tracesSubmittedDate?: string;
    tracesStatus: 'Not Submitted' | 'Submitted' | 'Acknowledged' | 'Rejected';
    form12BaGenerated?: boolean;
    form12BaPerks?: number;                     // perquisite value
}

export interface StateLwfConfig {
    state: string;
    employeeContribution: number;
    employerContribution: number;
    frequency: 'Monthly' | 'Half-Yearly' | 'Annually';
    dueDate: string;                            // e.g. "30-Jun, 31-Dec"
    applicable: boolean;
    notes?: string;
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
    activityLogs: ActivityLog[];
    monthlyFilings: MonthlyFiling[];
    challans: Challan[];
    // Round 2 Batch 4 slices
    pfTransferRequests: PFTransferRequest[];
    pfWithdrawalClaims: PFWithdrawalClaim[];
    pfAdvances: PFAdvance[];
    esiBreaches: ESIBreach[];
    esiBenefitClaims: ESIBenefitClaim[];
    ptExemptions: PTExemption[];
    gratuityProvisions: GratuityProvision[];
    form16Signatures: Form16DigitalSign[];
    stateLwfConfigs: StateLwfConfig[];

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

    // Compliance Event Actions
    addComplianceEvent: (event: Omit<ComplianceEvent, 'id'>) => void;
    updateComplianceEvent: (id: string, updates: Partial<ComplianceEvent>) => void;
    deleteComplianceEvent: (id: string) => void;
    markEventComplete: (id: string, performedBy: string) => void;

    // Activity Log Actions
    addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
    clearActivityLogs: () => void;

    // Monthly Filing Actions
    addMonthlyFiling: (filing: Omit<MonthlyFiling, 'id'>) => void;
    updateMonthlyFiling: (id: string, updates: Partial<MonthlyFiling>) => void;
    deleteMonthlyFiling: (id: string) => void;
    markFilingFiled: (id: string, type: 'pf' | 'esi' | 'pt' | 'tds' | 'lwf', filedBy: string) => void;

    // Bulk actions
    bulkUpdatePFStatus: (ids: string[], status: PFRecord['status']) => void;
    bulkUpdateESIStatus: (ids: string[], status: ESIRecord['status']) => void;
    bulkUpdatePTStatus: (ids: string[], status: PTRecord['status']) => void;

    // Round 2 — challans & compliance health
    generateChallan: (type: ChallanType, period: string, generatedBy: string) => Challan;
    markChallanPaid: (id: string, bankReference?: string) => void;
    reconcileChallan: (id: string, notes?: string) => { matched: boolean; variance: number };
    deleteChallan: (id: string) => void;
    bulkMarkFilingFiled: (ids: string[], type: 'pf' | 'esi' | 'pt' | 'tds' | 'lwf', filedBy: string) => { updated: number };
    getComplianceHealthScore: () => ComplianceHealthScore;

    // ── Round 2 Batch 4 — PF advanced ──
    addPFTransferRequest: (req: Omit<PFTransferRequest, 'id'>) => void;
    updatePFTransferRequest: (id: string, updates: Partial<PFTransferRequest>) => void;
    deletePFTransferRequest: (id: string) => void;
    generateForm13: (id: string) => void;

    addPFWithdrawalClaim: (claim: Omit<PFWithdrawalClaim, 'id'>) => void;
    updatePFWithdrawalClaim: (id: string, updates: Partial<PFWithdrawalClaim>) => void;
    deletePFWithdrawalClaim: (id: string) => void;
    settleWithdrawalClaim: (id: string, settledAmount: number) => void;

    addPFAdvance: (advance: Omit<PFAdvance, 'id'>) => void;
    updatePFAdvance: (id: string, updates: Partial<PFAdvance>) => void;
    deletePFAdvance: (id: string) => void;
    approvePFAdvance: (id: string, approvedAmount: number, notes?: string) => void;
    computeEligibleAdvance: (employeeId: string, purpose: PFAdvance['purpose']) => { eligibleLimit: number; reason: string };

    // ── Round 2 Batch 4 — ESI advanced ──
    addESIBreach: (breach: Omit<ESIBreach, 'id'>) => void;
    updateESIBreach: (id: string, updates: Partial<ESIBreach>) => void;
    autoDetectESIBreaches: (ceiling: number) => { flagged: number };
    exitEmployeeFromESI: (breachId: string, exitDate: string) => void;

    addESIBenefitClaim: (claim: Omit<ESIBenefitClaim, 'id'>) => void;
    updateESIBenefitClaim: (id: string, updates: Partial<ESIBenefitClaim>) => void;
    deleteESIBenefitClaim: (id: string) => void;

    // ── Round 2 Batch 4 — PT advanced ──
    addPTExemption: (exemption: Omit<PTExemption, 'id'>) => void;
    updatePTExemption: (id: string, updates: Partial<PTExemption>) => void;
    deletePTExemption: (id: string) => void;
    bulkUpdatePTExemptionStatus: (ids: string[], status: PTExemption['status']) => void;

    // ── Round 2 Batch 4 — Gratuity actuarial ──
    addGratuityProvision: (provision: Omit<GratuityProvision, 'id'>) => void;
    updateGratuityProvision: (id: string, updates: Partial<GratuityProvision>) => void;
    deleteGratuityProvision: (id: string) => void;
    computeGratuityLiability: (discountRate: number, salaryGrowthRate: number, attritionRate: number) => { totalLiability: number; currentServiceCost: number; eligibleCount: number };

    // ── Round 2 Batch 4 — LWF config ──
    updateStateLwfConfig: (state: string, updates: Partial<StateLwfConfig>) => void;

    // ── Round 2 Batch 4 — Form 16 digital sign ──
    addForm16Signature: (sig: Omit<Form16DigitalSign, 'id'>) => void;
    updateForm16Signature: (id: string, updates: Partial<Form16DigitalSign>) => void;
    deleteForm16Signature: (id: string) => void;
    submitToTraces: (id: string) => { ackNumber: string };
    bulkSubmitToTraces: (ids: string[]) => { submitted: number; acknowledged: number };
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
    { id: 'ev-1', type: 'PF', title: 'PF ECR Filing - March 2026', description: 'Monthly ECR + challan for PF contributions', dueDate: '2026-04-15', status: 'Upcoming', relatedMonth: 'March 2026' },
    { id: 'ev-2', type: 'ESI', title: 'ESI Challan - March 2026', description: 'Monthly ESI payment and return', dueDate: '2026-04-15', status: 'Upcoming', relatedMonth: 'March 2026' },
    { id: 'ev-3', type: 'TDS', title: 'TDS Payment - March 2026', description: 'Monthly TDS deposit (salary)', dueDate: '2026-04-07', status: 'Upcoming', relatedMonth: 'March 2026' },
    { id: 'ev-4', type: 'PT', title: 'PT Return - Q4 FY2025-26', description: 'State professional tax quarterly return', dueDate: '2026-04-30', status: 'Upcoming' },
    { id: 'ev-5', type: 'Form16', title: 'Form 16 Issuance Deadline', description: 'Issue Form 16 Part A + B to all employees', dueDate: '2026-06-15', status: 'Upcoming' },
    { id: 'ev-6', type: 'LWF', title: 'LWF Filing - H2 FY2025-26', description: 'Labour Welfare Fund half-yearly filing', dueDate: '2026-04-30', status: 'Upcoming' },
    { id: 'ev-7', type: 'TDS', title: 'Form 24Q Q4 Filing', description: 'Quarterly TDS return for Q4', dueDate: '2026-05-31', status: 'Upcoming' },
    { id: 'ev-8', type: 'PF', title: 'PF ECR Filing - February 2026', description: 'Completed on time', dueDate: '2026-03-15', status: 'Completed', completedDate: '2026-03-13', completedBy: 'HR Manager', relatedMonth: 'February 2026' },
    { id: 'ev-9', type: 'ESI', title: 'ESI Challan - February 2026', description: 'Completed', dueDate: '2026-03-15', status: 'Completed', completedDate: '2026-03-14', completedBy: 'Payroll Admin', relatedMonth: 'February 2026' },
];

const mockActivityLogs: ActivityLog[] = [
    { id: 'act-1', type: 'PF', action: 'ECR Filed', description: 'PF ECR filed for February 2026 (98 employees, ₹5.2L)', timestamp: '2026-03-13T10:15:00Z', performedBy: 'HR Manager', severity: 'success' },
    { id: 'act-2', type: 'ESI', action: 'Challan Generated', description: 'ESI challan generated for February 2026', timestamp: '2026-03-14T14:30:00Z', performedBy: 'Payroll Admin', severity: 'success' },
    { id: 'act-3', type: 'PT', action: 'Q3 Return Filed', description: 'PT Q3 return filed for Maharashtra (32 employees)', timestamp: '2026-03-28T11:00:00Z', performedBy: 'HR Manager', severity: 'success' },
    { id: 'act-4', type: 'Form16', action: 'Part A Generated', description: 'Form 16 Part A generated for 2 employees (Rajesh Kumar, Sneha Kulkarni)', timestamp: '2026-04-01T09:00:00Z', performedBy: 'Payroll Admin', severity: 'info' },
    { id: 'act-5', type: 'Gratuity', action: 'Provisioning Updated', description: 'Gratuity provision updated for March 2026 (₹10.2L total)', timestamp: '2026-03-30T16:45:00Z', performedBy: 'Finance Admin', severity: 'info' },
    { id: 'act-6', type: 'TDS', action: 'March Payment', description: 'TDS for March 2026 due on April 7 — reminder queued', timestamp: '2026-04-05T08:00:00Z', performedBy: 'System', severity: 'warning' },
];

const mockMonthlyFilings: MonthlyFiling[] = [
    { id: 'mf-1', month: 'January 2026', pfStatus: 'Paid', esiStatus: 'Paid', ptStatus: 'Filed', tdsStatus: 'Paid', lwfStatus: 'Not Applicable', filedBy: 'HR Manager', filedDate: '2026-02-13' },
    { id: 'mf-2', month: 'February 2026', pfStatus: 'Paid', esiStatus: 'Paid', ptStatus: 'Filed', tdsStatus: 'Paid', lwfStatus: 'Not Applicable', filedBy: 'HR Manager', filedDate: '2026-03-13' },
    { id: 'mf-3', month: 'March 2026', pfStatus: 'Pending', esiStatus: 'Pending', ptStatus: 'Pending', tdsStatus: 'Pending', lwfStatus: 'Pending' },
    { id: 'mf-4', month: 'April 2026', pfStatus: 'Pending', esiStatus: 'Pending', ptStatus: 'Pending', tdsStatus: 'Pending' },
];

// ── Store ──────────────────────────────────────────────────────────────────────

export const useStatutoryStore = create<StatutoryState>()(
    persist(
        (set, get) => ({
            pfRecords: mockPFRecords,
            esiRecords: mockESIRecords,
            ptRecords: mockPTRecords,
            ptSlabs: mockPTSlabs,
            lwfRecords: mockLWFRecords,
            gratuityRecords: mockGratuityRecords,
            form16Records: mockForm16Records,
            form24QRecords: mockForm24QRecords,
            complianceEvents: mockComplianceEvents,
            activityLogs: mockActivityLogs,
            monthlyFilings: mockMonthlyFilings,
            challans: [
                { id: 'ch-1', type: 'PF', period: 'Mar 2026', challanNumber: 'EPF-202603-0041', amount: 58400, employeeCount: 24, generatedDate: '2026-04-02', generatedBy: 'Finance', status: 'Reconciled', paidDate: '2026-04-10', reconciledDate: '2026-04-12', bankReference: 'HDFC-TXN-5A6B7C', expectedAmount: 58400, variance: 0 },
                { id: 'ch-2', type: 'ESI', period: 'Mar 2026', challanNumber: 'ESI-202603-0089', amount: 3880, employeeCount: 4, generatedDate: '2026-04-05', generatedBy: 'Finance', status: 'Paid', paidDate: '2026-04-11', bankReference: 'ICICI-TXN-88AA99', expectedAmount: 3880, variance: 0 },
                { id: 'ch-3', type: 'TDS', period: 'Mar 2026', challanNumber: 'TDS-202603-0112', amount: 142500, employeeCount: 24, generatedDate: '2026-04-06', generatedBy: 'Finance', status: 'Generated', expectedAmount: 142500, variance: 0 },
                { id: 'ch-4', type: 'PT', period: 'Mar 2026', challanNumber: 'PT-KA-202603-0067', amount: 4800, employeeCount: 24, generatedDate: '2026-04-08', generatedBy: 'Finance', status: 'Generated', expectedAmount: 4800, variance: 0 },
            ],

            // ── Round 2 Batch 4 seed data ──
            pfTransferRequests: [
                { id: 'pft-1', employeeId: 'EMP001', employeeName: 'Arjun Mehta', uan: '100234567891', previousEmployerPfNumber: 'MH/BAN/12345/001234', previousEmployerName: 'Acme Technologies Ltd', requestDate: '2026-02-15', form13Generated: true, form13GeneratedDate: '2026-02-17', epfoAckNumber: 'EPFO-ACK-89012', status: 'Transferred', transferredAmount: 285000, transferredDate: '2026-03-22', notes: 'Standard inter-employer transfer' },
                { id: 'pft-2', employeeId: 'EMP004', employeeName: 'Sneha Kulkarni', uan: '100234567894', previousEmployerPfNumber: 'KA/BAN/65432/000987', previousEmployerName: 'TechSphere Services', requestDate: '2026-03-10', form13Generated: true, form13GeneratedDate: '2026-03-12', status: 'Under Review', notes: 'Awaiting EPFO confirmation' },
                { id: 'pft-3', employeeId: 'EMP008', employeeName: 'Meena Patel', uan: '100234567898', previousEmployerPfNumber: 'DL/NCR/87654/012345', previousEmployerName: 'Innovate Solutions', requestDate: '2026-03-28', form13Generated: false, status: 'Submitted' },
            ],
            pfWithdrawalClaims: [
                { id: 'pfw-1', employeeId: 'EMP010', employeeName: 'Ramesh Kumar', uan: '100234567810', claimType: 'Form 19 (Final Settlement)', claimDate: '2026-01-15', reason: 'Resignation', claimedAmount: 342000, settledAmount: 342000, status: 'Settled', settledDate: '2026-02-28', documentsAttached: ['pan.pdf', 'aadhaar.pdf', 'bank_passbook.pdf'] },
                { id: 'pfw-2', employeeId: 'EMP012', employeeName: 'Lakshmi Nair', uan: '100234567812', claimType: 'Form 31 (Advance)', claimDate: '2026-03-05', reason: 'Medical treatment', claimedAmount: 75000, status: 'Approved', documentsAttached: ['medical_certificate.pdf'] },
                { id: 'pfw-3', employeeId: 'EMP015', employeeName: 'Suresh Gupta', uan: '100234567815', claimType: 'Form 10C (Pension)', claimDate: '2026-02-20', reason: 'Superannuation', claimedAmount: 185000, status: 'Verified' },
            ],
            pfAdvances: [
                { id: 'pfa-1', employeeId: 'EMP002', employeeName: 'Priya Sharma', uan: '100234567892', purpose: 'Housing', requestedAmount: 300000, approvedAmount: 300000, requestDate: '2026-02-10', approvalDate: '2026-02-18', status: 'Disbursed', eligibleLimit: 450000, disbursedDate: '2026-02-25', eligibilityNotes: '36 months of service, eligible for housing advance' },
                { id: 'pfa-2', employeeId: 'EMP005', employeeName: 'Vikram Reddy', uan: '100234567895', purpose: 'Medical', requestedAmount: 50000, requestDate: '2026-03-20', status: 'Pending', eligibleLimit: 75000, eligibilityNotes: 'Eligible for medical advance up to 6 months basic' },
                { id: 'pfa-3', employeeId: 'EMP007', employeeName: 'Karthik Das', uan: '100234567897', purpose: 'Marriage', requestedAmount: 150000, approvedAmount: 120000, requestDate: '2026-02-28', approvalDate: '2026-03-05', status: 'Approved', eligibleLimit: 120000, eligibilityNotes: '7 years of service; 50% of employee share eligible' },
            ],
            esiBreaches: [
                { id: 'esb-1', employeeId: 'EMP020', employeeName: 'Divya Menon', esicNumber: '3100123465', breachMonth: 'Feb 2026', breachGrossWage: 22500, ceiling: 21000, action: 'Continued', notes: 'Will exit at contribution period boundary (Sep 2026)' },
                { id: 'esb-2', employeeId: 'EMP022', employeeName: 'Naveen Joshi', esicNumber: '3100123467', breachMonth: 'Jan 2026', breachGrossWage: 23400, ceiling: 21000, action: 'Flagged' },
            ],
            esiBenefitClaims: [
                { id: 'ebc-1', employeeId: 'EMP005', employeeName: 'Vikram Reddy', benefitType: 'Sickness', claimDate: '2026-02-10', amount: 4500, durationDays: 15, status: 'Settled', settledDate: '2026-03-02' },
                { id: 'ebc-2', employeeId: 'EMP006', employeeName: 'Anjali Nair', benefitType: 'Maternity', claimDate: '2026-01-28', amount: 82000, durationDays: 182, status: 'Approved' },
                { id: 'ebc-3', employeeId: 'EMP008', employeeName: 'Meena Patel', benefitType: 'Medical', claimDate: '2026-03-15', amount: 12000, status: 'Submitted' },
            ],
            ptExemptions: [
                { id: 'pte-1', employeeId: 'EMP030', employeeName: 'Rajan Pillai', state: 'Maharashtra', exemptionType: 'Senior Citizen', certificateNumber: 'SR-MH-2025-78912', validFrom: '2025-04-01', validTo: '2027-03-31', documentName: 'senior_cert.pdf', status: 'Active', approvedBy: 'HR Manager' },
                { id: 'pte-2', employeeId: 'EMP031', employeeName: 'Anand Verma', state: 'Karnataka', exemptionType: 'Disability', certificateNumber: 'DIS-KA-2024-34567', validFrom: '2024-06-01', validTo: '2027-05-31', documentName: 'disability_cert.pdf', status: 'Active', approvedBy: 'HR Manager', notes: '40% physical disability' },
                { id: 'pte-3', employeeId: 'EMP032', employeeName: 'Kavita Rao', state: 'Maharashtra', exemptionType: 'Parents of Disabled Child', validFrom: '2023-04-01', validTo: '2025-03-31', status: 'Expired' },
            ],
            gratuityProvisions: [
                { id: 'gp-1', month: 'Mar 2026', totalLiability: 12500000, currentServiceCost: 185000, interestCost: 62500, actuarialGainLoss: -15000, fundedAmount: 8500000, unfundedLiability: 4000000, eligibleEmployeeCount: 28, discountRate: 7.2, salaryGrowthRate: 8.5, attritionRate: 12.0, recordedBy: 'Finance Lead', recordedDate: '2026-04-05' },
                { id: 'gp-2', month: 'Feb 2026', totalLiability: 12300000, currentServiceCost: 182000, interestCost: 61500, actuarialGainLoss: 8000, fundedAmount: 8350000, unfundedLiability: 3950000, eligibleEmployeeCount: 28, discountRate: 7.2, salaryGrowthRate: 8.5, attritionRate: 12.0, recordedBy: 'Finance Lead', recordedDate: '2026-03-05' },
                { id: 'gp-3', month: 'Jan 2026', totalLiability: 12150000, currentServiceCost: 180000, interestCost: 60750, actuarialGainLoss: -5500, fundedAmount: 8200000, unfundedLiability: 3950000, eligibleEmployeeCount: 27, discountRate: 7.2, salaryGrowthRate: 8.5, attritionRate: 12.0, recordedBy: 'Finance Lead', recordedDate: '2026-02-05' },
            ],
            form16Signatures: [],
            stateLwfConfigs: [
                { state: 'Maharashtra', employeeContribution: 25, employerContribution: 75, frequency: 'Half-Yearly', dueDate: '15-Jul, 15-Jan', applicable: true },
                { state: 'Karnataka', employeeContribution: 20, employerContribution: 40, frequency: 'Half-Yearly', dueDate: '15-Jul, 15-Jan', applicable: true },
                { state: 'Delhi', employeeContribution: 0.75, employerContribution: 2.25, frequency: 'Monthly', dueDate: '15th of next month', applicable: true, notes: '% of wages' },
                { state: 'Gujarat', employeeContribution: 6, employerContribution: 12, frequency: 'Half-Yearly', dueDate: '31-Jul, 31-Jan', applicable: true },
                { state: 'Tamil Nadu', employeeContribution: 10, employerContribution: 20, frequency: 'Annually', dueDate: '31-Dec', applicable: true },
                { state: 'Telangana', employeeContribution: 2, employerContribution: 5, frequency: 'Annually', dueDate: '31-Jan', applicable: true },
                { state: 'West Bengal', employeeContribution: 3, employerContribution: 15, frequency: 'Half-Yearly', dueDate: '30-Jun, 31-Dec', applicable: true },
                { state: 'Uttar Pradesh', employeeContribution: 0, employerContribution: 0, frequency: 'Annually', dueDate: '—', applicable: false, notes: 'Not applicable' },
            ],

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

            // Compliance events
            addComplianceEvent: (event) => set((s) => ({ complianceEvents: [...s.complianceEvents, { ...event, id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateComplianceEvent: (id, updates) => set((s) => ({ complianceEvents: s.complianceEvents.map((e) => (e.id === id ? { ...e, ...updates } : e)) })),
            deleteComplianceEvent: (id) => set((s) => ({ complianceEvents: s.complianceEvents.filter((e) => e.id !== id) })),
            markEventComplete: (id, performedBy) => set((s) => ({
                complianceEvents: s.complianceEvents.map((e) => e.id === id ? {
                    ...e,
                    status: 'Completed' as const,
                    completedDate: new Date().toISOString().split('T')[0],
                    completedBy: performedBy,
                } : e)
            })),

            // Activity logs
            addActivityLog: (log) => set((s) => ({
                activityLogs: [{
                    ...log,
                    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                    timestamp: new Date().toISOString(),
                }, ...s.activityLogs].slice(0, 100)
            })),
            clearActivityLogs: () => set({ activityLogs: [] }),

            // Monthly filing
            addMonthlyFiling: (filing) => set((s) => ({ monthlyFilings: [...s.monthlyFilings, { ...filing, id: `mf-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }] })),
            updateMonthlyFiling: (id, updates) => set((s) => ({ monthlyFilings: s.monthlyFilings.map((f) => (f.id === id ? { ...f, ...updates } : f)) })),
            deleteMonthlyFiling: (id) => set((s) => ({ monthlyFilings: s.monthlyFilings.filter((f) => f.id !== id) })),
            markFilingFiled: (id, type, filedBy) => set((s) => ({
                monthlyFilings: s.monthlyFilings.map((f) => {
                    if (f.id !== id) return f;
                    const today = new Date().toISOString().split('T')[0];
                    const statusKey = `${type}Status` as const;
                    const nextFiling: MonthlyFiling = { ...f, filedBy, filedDate: today, [statusKey]: 'Filed' } as MonthlyFiling;
                    return nextFiling;
                })
            })),

            // Bulk status updates
            bulkUpdatePFStatus: (ids, status) => set((s) => ({ pfRecords: s.pfRecords.map((r) => ids.includes(r.id) ? { ...r, status } : r) })),
            bulkUpdateESIStatus: (ids, status) => set((s) => ({ esiRecords: s.esiRecords.map((r) => ids.includes(r.id) ? { ...r, status } : r) })),
            bulkUpdatePTStatus: (ids, status) => set((s) => ({ ptRecords: s.ptRecords.map((r) => ids.includes(r.id) ? { ...r, status } : r) })),

            // ── Round 2 — challans & compliance health ────────────────────────
            generateChallan: (type, period, generatedBy) => {
                const state = get();
                let amount = 0;
                let employeeCount = 0;
                if (type === 'PF') {
                    const recs = state.pfRecords.filter(r => r.month === period);
                    amount = recs.reduce((s, r) => s + r.employeeContribution + r.employerContribution, 0);
                    employeeCount = recs.length;
                } else if (type === 'ESI') {
                    const recs = state.esiRecords.filter(r => r.month === period);
                    amount = recs.reduce((s, r) => s + r.esiEmployee + r.esiEmployer, 0);
                    employeeCount = recs.length;
                } else if (type === 'PT') {
                    const recs = state.ptRecords.filter(r => r.month === period);
                    amount = recs.reduce((s, r) => s + r.ptDeduction, 0);
                    employeeCount = recs.length;
                } else if (type === 'LWF') {
                    const recs = state.lwfRecords.filter(r => r.period === period);
                    amount = recs.reduce((s, r) => s + r.employeeContribution + r.employerContribution, 0);
                    employeeCount = recs.length;
                } else if (type === 'TDS') {
                    amount = Math.round(employeeCount * 5000 + Math.random() * 50000);
                    employeeCount = 24;
                }
                if (amount === 0) {
                    amount = Math.round(10000 + Math.random() * 90000);
                    employeeCount = Math.max(1, employeeCount);
                }
                const prefix = type === 'PF' ? 'EPF' : type === 'ESI' ? 'ESI' : type === 'PT' ? `PT-KA` : type === 'TDS' ? 'TDS' : 'LWF';
                const periodCode = period.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
                const challan: Challan = {
                    id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                    type,
                    period,
                    challanNumber: `${prefix}-${periodCode}-${Math.floor(Math.random() * 9000) + 1000}`,
                    amount,
                    employeeCount,
                    generatedDate: new Date().toISOString().split('T')[0],
                    generatedBy,
                    status: 'Generated',
                    expectedAmount: amount,
                    variance: 0,
                };
                set((s) => ({
                    challans: [challan, ...s.challans],
                    activityLogs: [{
                        id: `al-${Date.now()}`, type, action: 'Challan Generated',
                        description: `${type} challan ${challan.challanNumber} for ${period} (${(amount / 1000).toFixed(0)}K)`,
                        timestamp: new Date().toISOString(), performedBy: generatedBy, severity: 'success',
                    }, ...s.activityLogs],
                }));
                return challan;
            },

            markChallanPaid: (id, bankReference) => set((s) => {
                const challan = s.challans.find(c => c.id === id);
                const updatedChallans = s.challans.map(c => c.id === id ? {
                    ...c, status: 'Paid' as const, paidDate: new Date().toISOString().split('T')[0], bankReference: bankReference ?? c.bankReference,
                } : c);
                // Cascade: auto-update matching MonthlyFiling entry
                let updatedFilings = s.monthlyFilings;
                if (challan) {
                    // Challan period is like "Mar 2026" and MonthlyFiling.month is same format.
                    const filingIdx = s.monthlyFilings.findIndex(f => f.month === challan.period);
                    const typeToKey: Record<ChallanType, keyof MonthlyFiling | null> = {
                        'PF': 'pfStatus',
                        'ESI': 'esiStatus',
                        'PT': 'ptStatus',
                        'TDS': 'tdsStatus',
                        'LWF': 'lwfStatus',
                    };
                    const key = typeToKey[challan.type];
                    if (key && filingIdx !== -1) {
                        updatedFilings = s.monthlyFilings.map((f, i) => i === filingIdx ? { ...f, [key]: 'Paid' as const, filedBy: 'Finance', filedDate: new Date().toISOString().split('T')[0] } : f);
                    } else if (key) {
                        // No filing yet for this month — create a skeleton
                        updatedFilings = [
                            ...s.monthlyFilings,
                            {
                                id: `mf-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                                month: challan.period,
                                pfStatus: challan.type === 'PF' ? 'Paid' : 'Pending',
                                esiStatus: challan.type === 'ESI' ? 'Paid' : 'Pending',
                                ptStatus: challan.type === 'PT' ? 'Paid' : 'Pending',
                                tdsStatus: challan.type === 'TDS' ? 'Paid' : 'Pending',
                                lwfStatus: challan.type === 'LWF' ? 'Paid' : 'Pending',
                                filedBy: 'Finance',
                                filedDate: new Date().toISOString().split('T')[0],
                                notes: 'Auto-created from challan payment',
                            }
                        ];
                    }
                }
                return {
                    challans: updatedChallans,
                    monthlyFilings: updatedFilings,
                    activityLogs: [{
                        id: `al-${Date.now()}`,
                        type: (challan?.type ?? 'PF') as ActivityLog['type'],
                        action: 'Challan Paid',
                        description: `Challan ${challan?.challanNumber ?? id} marked paid${bankReference ? ` · ref ${bankReference}` : ''}. ${challan?.type} filing auto-updated.`,
                        timestamp: new Date().toISOString(), performedBy: 'Finance', severity: 'success',
                    }, ...s.activityLogs],
                };
            }),

            reconcileChallan: (id, notes) => {
                const state = get();
                const challan = state.challans.find(c => c.id === id);
                if (!challan) return { matched: false, variance: 0 };
                const expected = challan.expectedAmount ?? challan.amount;
                const variance = challan.amount - expected;
                const matched = Math.abs(variance) < 1;
                set((s) => ({
                    challans: s.challans.map(c => c.id === id ? {
                        ...c, status: 'Reconciled' as const, reconciledDate: new Date().toISOString().split('T')[0], reconciliationNotes: notes, variance,
                    } : c),
                }));
                return { matched, variance };
            },

            deleteChallan: (id) => set((s) => ({ challans: s.challans.filter(c => c.id !== id) })),

            bulkMarkFilingFiled: (ids, type, filedBy) => {
                const statusKey = `${type}Status` as const;
                let updated = 0;
                set((s) => ({
                    monthlyFilings: s.monthlyFilings.map(f => {
                        if (!ids.includes(f.id)) return f;
                        if ((f as any)[statusKey] === 'Filed' || (f as any)[statusKey] === 'Paid') return f;
                        updated++;
                        return { ...f, [statusKey]: 'Filed', filedBy, filedDate: new Date().toISOString().split('T')[0] } as MonthlyFiling;
                    }),
                }));
                return { updated };
            },

            getComplianceHealthScore: () => {
                const state = get();
                const totalFilings = state.monthlyFilings.length * 4;
                const filedCount = state.monthlyFilings.reduce((s, f) =>
                    s + (f.pfStatus !== 'Pending' ? 1 : 0) + (f.esiStatus !== 'Pending' ? 1 : 0) + (f.ptStatus !== 'Pending' ? 1 : 0) + (f.tdsStatus !== 'Pending' ? 1 : 0), 0);
                const onTimePct = totalFilings > 0 ? Math.round((filedCount / totalFilings) * 100) : 100;
                const overdueCount = state.complianceEvents.filter(e => e.status === 'Overdue').length;
                const totalChallans = state.challans.length;
                const reconciled = state.challans.filter(c => c.status === 'Reconciled').length;
                const reconciledPct = totalChallans > 0 ? Math.round((reconciled / totalChallans) * 100) : 100;

                const pfFiled = state.monthlyFilings.filter(f => f.pfStatus !== 'Pending').length;
                const esiFiled = state.monthlyFilings.filter(f => f.esiStatus !== 'Pending').length;
                const ptFiled = state.monthlyFilings.filter(f => f.ptStatus !== 'Pending').length;
                const tdsFiled = state.monthlyFilings.filter(f => f.tdsStatus !== 'Pending').length;
                const total = Math.max(1, state.monthlyFilings.length);
                const pfScore = Math.round((pfFiled / total) * 100);
                const esiScore = Math.round((esiFiled / total) * 100);
                const ptScore = Math.round((ptFiled / total) * 100);
                const tdsScore = Math.round((tdsFiled / total) * 100);

                const overall = Math.max(0, Math.min(100, Math.round((onTimePct + reconciledPct) / 2 - overdueCount * 5)));

                return {
                    overall,
                    pfScore, esiScore, ptScore, tdsScore,
                    onTimeFilingPercent: onTimePct,
                    overdueCount,
                    reconciledPercent: reconciledPct,
                };
            },

            // ── Round 2 Batch 4 — PF advanced ──
            addPFTransferRequest: (req) => set((s) => ({
                pfTransferRequests: [{ ...req, id: `pft-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...s.pfTransferRequests]
            })),
            updatePFTransferRequest: (id, updates) => set((s) => ({
                pfTransferRequests: s.pfTransferRequests.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deletePFTransferRequest: (id) => set((s) => ({
                pfTransferRequests: s.pfTransferRequests.filter(r => r.id !== id)
            })),
            generateForm13: (id) => set((s) => ({
                pfTransferRequests: s.pfTransferRequests.map(r => r.id === id ? {
                    ...r,
                    form13Generated: true,
                    form13GeneratedDate: new Date().toISOString().split('T')[0],
                    status: r.status === 'Submitted' ? 'Under Review' as const : r.status,
                } : r)
            })),

            addPFWithdrawalClaim: (claim) => set((s) => ({
                pfWithdrawalClaims: [{ ...claim, id: `pfw-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...s.pfWithdrawalClaims]
            })),
            updatePFWithdrawalClaim: (id, updates) => set((s) => ({
                pfWithdrawalClaims: s.pfWithdrawalClaims.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deletePFWithdrawalClaim: (id) => set((s) => ({
                pfWithdrawalClaims: s.pfWithdrawalClaims.filter(c => c.id !== id)
            })),
            settleWithdrawalClaim: (id, settledAmount) => set((s) => ({
                pfWithdrawalClaims: s.pfWithdrawalClaims.map(c => c.id === id ? {
                    ...c,
                    settledAmount,
                    status: 'Settled' as const,
                    settledDate: new Date().toISOString().split('T')[0],
                } : c)
            })),

            addPFAdvance: (advance) => set((s) => ({
                pfAdvances: [{ ...advance, id: `pfa-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...s.pfAdvances]
            })),
            updatePFAdvance: (id, updates) => set((s) => ({
                pfAdvances: s.pfAdvances.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            deletePFAdvance: (id) => set((s) => ({
                pfAdvances: s.pfAdvances.filter(a => a.id !== id)
            })),
            approvePFAdvance: (id, approvedAmount, notes) => set((s) => ({
                pfAdvances: s.pfAdvances.map(a => a.id === id ? {
                    ...a,
                    approvedAmount,
                    status: 'Approved' as const,
                    approvalDate: new Date().toISOString().split('T')[0],
                    eligibilityNotes: notes ?? a.eligibilityNotes,
                } : a)
            })),
            computeEligibleAdvance: (employeeId, purpose) => {
                const state = get();
                const pfRecord = state.pfRecords.find(r => r.employeeId === employeeId);
                const basicPay = pfRecord?.basicPay ?? 40000;
                let eligibleLimit = 0;
                let reason = '';
                switch (purpose) {
                    case 'Marriage':
                        eligibleLimit = basicPay * 6;
                        reason = 'Up to 50% of employee PF share; typically 6× basic salary';
                        break;
                    case 'Education':
                        eligibleLimit = basicPay * 6;
                        reason = 'Up to 50% of employee share after 7 yrs of service';
                        break;
                    case 'Medical':
                        eligibleLimit = Math.min(basicPay * 6, 100000);
                        reason = 'Lesser of 6× basic or employee share';
                        break;
                    case 'Housing':
                        eligibleLimit = basicPay * 36;
                        reason = 'Up to 90% of total PF balance for purchase/construction';
                        break;
                    case 'Covid-19':
                        eligibleLimit = basicPay * 3;
                        reason = 'Up to 3 months basic under PMGKY scheme';
                        break;
                    case 'Natural Calamity':
                        eligibleLimit = 50000;
                        reason = 'Non-refundable up to ₹50,000 per Scheme 68K';
                        break;
                    default:
                        eligibleLimit = basicPay * 3;
                        reason = 'Default 3× basic';
                }
                return { eligibleLimit, reason };
            },

            // ── Round 2 Batch 4 — ESI advanced ──
            addESIBreach: (breach) => set((s) => ({
                esiBreaches: [{ ...breach, id: `esb-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...s.esiBreaches]
            })),
            updateESIBreach: (id, updates) => set((s) => ({
                esiBreaches: s.esiBreaches.map(b => b.id === id ? { ...b, ...updates } : b)
            })),
            autoDetectESIBreaches: (ceiling) => {
                const state = get();
                const existingKeys = new Set(state.esiBreaches.map(b => `${b.employeeId}-${b.breachMonth}`));
                const flagged: ESIBreach[] = [];
                state.esiRecords.forEach(r => {
                    if (r.grossWage > ceiling && !existingKeys.has(`${r.employeeId}-${r.month}`)) {
                        flagged.push({
                            id: `esb-${Date.now()}-${Math.random().toString(36).slice(2, 5)}-${flagged.length}`,
                            employeeId: r.employeeId,
                            employeeName: r.employeeName,
                            esicNumber: r.esicNumber,
                            breachMonth: r.month,
                            breachGrossWage: r.grossWage,
                            ceiling,
                            action: 'Flagged',
                        });
                    }
                });
                if (flagged.length) set((s) => ({ esiBreaches: [...flagged, ...s.esiBreaches] }));
                return { flagged: flagged.length };
            },
            exitEmployeeFromESI: (breachId, exitDate) => set((s) => ({
                esiBreaches: s.esiBreaches.map(b => b.id === breachId ? { ...b, action: 'Exited' as const, exitDate } : b)
            })),

            addESIBenefitClaim: (claim) => set((s) => ({
                esiBenefitClaims: [{ ...claim, id: `ebc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...s.esiBenefitClaims]
            })),
            updateESIBenefitClaim: (id, updates) => set((s) => ({
                esiBenefitClaims: s.esiBenefitClaims.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteESIBenefitClaim: (id) => set((s) => ({
                esiBenefitClaims: s.esiBenefitClaims.filter(c => c.id !== id)
            })),

            // ── Round 2 Batch 4 — PT advanced ──
            addPTExemption: (exemption) => set((s) => ({
                ptExemptions: [{ ...exemption, id: `pte-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...s.ptExemptions]
            })),
            updatePTExemption: (id, updates) => set((s) => ({
                ptExemptions: s.ptExemptions.map(e => e.id === id ? { ...e, ...updates } : e)
            })),
            deletePTExemption: (id) => set((s) => ({
                ptExemptions: s.ptExemptions.filter(e => e.id !== id)
            })),
            bulkUpdatePTExemptionStatus: (ids, status) => set((s) => ({
                ptExemptions: s.ptExemptions.map(e => ids.includes(e.id) ? { ...e, status } : e)
            })),

            // ── Round 2 Batch 4 — Gratuity actuarial ──
            addGratuityProvision: (provision) => set((s) => ({
                gratuityProvisions: [{ ...provision, id: `gp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...s.gratuityProvisions]
            })),
            updateGratuityProvision: (id, updates) => set((s) => ({
                gratuityProvisions: s.gratuityProvisions.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            deleteGratuityProvision: (id) => set((s) => ({
                gratuityProvisions: s.gratuityProvisions.filter(p => p.id !== id)
            })),
            computeGratuityLiability: (discountRate, salaryGrowthRate, attritionRate) => {
                const state = get();
                const eligible = state.gratuityRecords.filter(r => r.status === 'Eligible' || r.status === 'Provisioned');
                const eligibleCount = eligible.length;
                // Simplified PVGD: for each eligible employee, project liability at retirement discounted to today.
                const retirementAge = 58;
                const avgAge = 38;
                const yearsToRetirement = Math.max(1, retirementAge - avgAge);
                const growthFactor = Math.pow(1 + salaryGrowthRate / 100, yearsToRetirement);
                const discountFactor = Math.pow(1 + discountRate / 100, yearsToRetirement);
                const attritionFactor = Math.pow(1 - attritionRate / 100, yearsToRetirement);
                const totalLiability = Math.round(
                    eligible.reduce((sum, r) => {
                        const projectedSalary = r.lastDrawnSalary * growthFactor;
                        const projectedGratuity = (15 * projectedSalary * (r.yearsOfService + yearsToRetirement)) / 26;
                        return sum + (projectedGratuity * attritionFactor) / discountFactor;
                    }, 0)
                );
                const currentServiceCost = Math.round(totalLiability / (yearsToRetirement * 12));
                return { totalLiability, currentServiceCost, eligibleCount };
            },

            // ── Round 2 Batch 4 — LWF config ──
            updateStateLwfConfig: (state, updates) => set((s) => ({
                stateLwfConfigs: s.stateLwfConfigs.map(c => c.state === state ? { ...c, ...updates } : c)
            })),

            // ── Round 2 Batch 4 — Form 16 digital signature ──
            addForm16Signature: (sig) => set((s) => ({
                form16Signatures: [{ ...sig, id: `f16s-${Date.now()}-${Math.random().toString(36).slice(2, 5)}` }, ...s.form16Signatures]
            })),
            updateForm16Signature: (id, updates) => set((s) => ({
                form16Signatures: s.form16Signatures.map(sig => sig.id === id ? { ...sig, ...updates } : sig)
            })),
            deleteForm16Signature: (id) => set((s) => ({
                form16Signatures: s.form16Signatures.filter(sig => sig.id !== id)
            })),
            submitToTraces: (id) => {
                const ackNumber = `TRACES-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;
                set((s) => ({
                    form16Signatures: s.form16Signatures.map(sig => sig.id === id ? {
                        ...sig,
                        tracesAckNumber: ackNumber,
                        tracesSubmittedDate: new Date().toISOString().split('T')[0],
                        tracesStatus: 'Submitted' as const,
                    } : sig)
                }));
                return { ackNumber };
            },
            bulkSubmitToTraces: (ids) => {
                let submitted = 0, acknowledged = 0;
                set((s) => ({
                    form16Signatures: s.form16Signatures.map(sig => {
                        if (!ids.includes(sig.id)) return sig;
                        submitted++;
                        const willAck = Math.random() > 0.15;
                        if (willAck) acknowledged++;
                        return {
                            ...sig,
                            tracesAckNumber: `TRACES-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`,
                            tracesSubmittedDate: new Date().toISOString().split('T')[0],
                            tracesStatus: willAck ? 'Acknowledged' as const : 'Submitted' as const,
                        };
                    })
                }));
                return { submitted, acknowledged };
            },
        }),
        { name: 'statutory-compliance-v4' }
    )
);
