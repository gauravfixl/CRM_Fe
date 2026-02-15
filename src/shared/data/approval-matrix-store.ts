import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApprovalType = 'Leave' | 'Attendance' | 'Expense' | 'Asset' | 'Exit' | 'Payroll';

export interface ApprovalLevel {
    level: number;
    approverRole: string;
    approverName?: string;
    condition?: string; // e.g., "amount > 10000" or "days > 3"
    isMandatory: boolean;
}

export interface EscalationRule {
    enabled: boolean;
    afterHours: number;
    escalateTo: string; // Role or specific person
    notifyVia: ('Email' | 'SMS' | 'In-App')[];
}

export interface ApprovalFlow {
    id: string;
    type: ApprovalType;
    name: string;
    description: string;
    levels: ApprovalLevel[];
    escalationRule?: EscalationRule;
    autoApprovalRules?: {
        enabled: boolean;
        conditions: string[]; // e.g., "amount < 1000", "days <= 1"
    };
    isActive: boolean;
    applicableTo: {
        departments?: string[];
        locations?: string[];
        roles?: string[];
    };
    createdAt: string;
    updatedAt: string;
}

export interface BackupApprover {
    id: string;
    primaryApproverId: string;
    primaryApproverName: string;
    backupApproverId: string;
    backupApproverName: string;
    validFrom: string;
    validTo: string;
    reason: string;
}

interface ApprovalMatrixState {
    flows: ApprovalFlow[];
    backupApprovers: BackupApprover[];

    // Flow CRUD
    createFlow: (flow: Omit<ApprovalFlow, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateFlow: (id: string, updates: Partial<ApprovalFlow>) => void;
    deleteFlow: (id: string) => void;
    toggleFlowStatus: (id: string) => void;

    // Backup Approvers
    addBackupApprover: (backup: Omit<BackupApprover, 'id'>) => void;
    removeBackupApprover: (id: string) => void;

    // Queries
    getFlowByType: (type: ApprovalType) => ApprovalFlow[];
    getActiveFlows: () => ApprovalFlow[];

    // Role Mapping (Abstract Role -> Real Users)
    roleMappings: Record<string, string[]>; // e.g. "Finance Head": ["EMP004"]
    updateRoleMapping: (role: string, userIds: string[]) => void;
}

// Initial Approval Flows
const INITIAL_FLOWS: ApprovalFlow[] = [
    {
        id: 'flow-1',
        type: 'Leave',
        name: 'Standard Leave Approval',
        description: 'Default leave approval workflow for all employees',
        levels: [
            { level: 1, approverRole: 'Manager', isMandatory: true },
            { level: 2, approverRole: 'HR Manager', condition: 'days > 5', isMandatory: false }
        ],
        escalationRule: {
            enabled: true,
            afterHours: 24,
            escalateTo: 'HR Head',
            notifyVia: ['Email', 'In-App']
        },
        autoApprovalRules: {
            enabled: true,
            conditions: ['days <= 1', 'balance > 10']
        },
        isActive: true,
        applicableTo: {},
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
    },
    {
        id: 'flow-2',
        type: 'Attendance',
        name: 'Attendance Regularization',
        description: 'Approval flow for attendance corrections',
        levels: [
            { level: 1, approverRole: 'Manager', isMandatory: true }
        ],
        escalationRule: {
            enabled: true,
            afterHours: 48,
            escalateTo: 'HR Manager',
            notifyVia: ['Email']
        },
        isActive: true,
        applicableTo: {},
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
    },
    {
        id: 'flow-3',
        type: 'Expense',
        name: 'Expense Reimbursement',
        description: 'Multi-level expense approval based on amount',
        levels: [
            { level: 1, approverRole: 'Manager', condition: 'amount <= 10000', isMandatory: true },
            { level: 2, approverRole: 'Finance Head', condition: 'amount > 10000', isMandatory: true },
            { level: 3, approverRole: 'CFO', condition: 'amount > 50000', isMandatory: true }
        ],
        autoApprovalRules: {
            enabled: true,
            conditions: ['amount < 500']
        },
        isActive: true,
        applicableTo: {},
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
    },
    {
        id: 'flow-4',
        type: 'Asset',
        name: 'Asset Allocation',
        description: 'Approval for asset requests',
        levels: [
            { level: 1, approverRole: 'Manager', isMandatory: true },
            { level: 2, approverRole: 'IT Head', isMandatory: true }
        ],
        isActive: true,
        applicableTo: {},
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
    },
    {
        id: 'flow-5',
        type: 'Exit',
        name: 'Employee Exit Clearance',
        description: 'Multi-department exit approval',
        levels: [
            { level: 1, approverRole: 'Manager', isMandatory: true },
            { level: 2, approverRole: 'IT Admin', isMandatory: true },
            { level: 3, approverRole: 'Finance', isMandatory: true },
            { level: 4, approverRole: 'HR Head', isMandatory: true }
        ],
        isActive: true,
        applicableTo: {},
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
    }
];

export const useApprovalMatrixStore = create<ApprovalMatrixState>()(
    persist(
        (set, get) => ({
            flows: INITIAL_FLOWS,
            backupApprovers: [],
            roleMappings: {
                'Finance Head': [],
                'HR Head': [],
                'IT Head': [],
                'CFO': []
            },

            updateRoleMapping: (role, userIds) => set((state) => ({
                roleMappings: { ...state.roleMappings, [role]: userIds }
            })),

            createFlow: (flowData) => set((state) => {
                const newFlow: ApprovalFlow = {
                    ...flowData,
                    id: `flow-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                return { flows: [...state.flows, newFlow] };
            }),

            updateFlow: (id, updates) => set((state) => ({
                flows: state.flows.map(flow =>
                    flow.id === id
                        ? { ...flow, ...updates, updatedAt: new Date().toISOString() }
                        : flow
                )
            })),

            deleteFlow: (id) => set((state) => ({
                flows: state.flows.filter(f => f.id !== id)
            })),

            toggleFlowStatus: (id) => set((state) => ({
                flows: state.flows.map(flow =>
                    flow.id === id
                        ? { ...flow, isActive: !flow.isActive, updatedAt: new Date().toISOString() }
                        : flow
                )
            })),

            addBackupApprover: (backupData) => set((state) => ({
                backupApprovers: [...state.backupApprovers, { ...backupData, id: `backup-${Date.now()}` }]
            })),

            removeBackupApprover: (id) => set((state) => ({
                backupApprovers: state.backupApprovers.filter(b => b.id !== id)
            })),

            getFlowByType: (type) => get().flows.filter(f => f.type === type),
            getActiveFlows: () => get().flows.filter(f => f.isActive)
        }),
        { name: 'approval-matrix-storage' }
    )
);
