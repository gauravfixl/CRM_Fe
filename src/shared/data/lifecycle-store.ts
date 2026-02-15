import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingTask {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed";
}

export interface Policy {
    id: string;
    name: string;
    required: boolean;
}

export interface ClearanceStatus {
    it: boolean;
    finance: boolean;
    admin: boolean;
    manager: boolean;
}

export interface SettlementRecord {
    netPayable: number;
    status: "Draft" | "Processed" | "Paid";
    processedDate?: string;
}

export interface NewHire {
    id: string;
    name: string;
    position: string;
    department: string;
    startDate: string;
    progress: number;
    status: "Pre-boarding" | "Onboarding" | "Completed";
    mentor: string;
    tasks: OnboardingTask[];
}

export interface Candidate {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    joiningDate: string;
    salary: string;
    status: "Offer Pending" | "Offer Accepted" | "Offer Rejected" | "BGV In-Progress" | "BGV Verified" | "Ready to Join";
    bgvStatus: "Pending" | "Approved" | "Rejected";
    avatar: string;
}

export interface LifecycleEmployee {
    id: string;
    name: string;
    role: string;
    department: string;
    joinDate: string;
    status: "Probation" | "Active" | "Exited" | "Notice Period";
    performance: number;
    probationEnd: string;
    avatar: string;
    complianceDocs: string[]; // List of signed policy IDs
    exitReason?: string;
    lwd?: string; // Last Working Day
    clearance?: ClearanceStatus;
    settlement?: SettlementRecord;
}

export interface HistoryLog {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'growth' | 'neutral' | 'warning' | 'exit';
    employeeId: string;
    employeeName: string;
}

export interface AssetHistory {
    id: string;
    employeeId: string;
    employeeName: string;
    action: "Assigned" | "Returned";
    date: string;
}

export interface InventoryAsset {
    id: string;
    name: string;
    type: "Laptop" | "Mobile" | "Monitor";
    status: "Available" | "Assigned" | "Repair";
    condition: "Excellent" | "Good" | "Used";
    assignedTo?: string; // Employee ID
    history?: AssetHistory[];
}

const PRE_BOARDING_TASKS = [
    { title: "Offer Letter Release", description: "Generate and send offer", assignedTo: "HR" },
    { title: "Background Verification", description: "Collect and verify documents", assignedTo: "Compliance" },
    { title: "Welcome Kit Delivery", description: "Dispatch physical welcome kit", assignedTo: "Admin" },
    { title: "System Login Request", description: "Request IT for email/AD credentials", assignedTo: "HR" }
];

const ONBOARDING_TASKS = [
    { title: "Employee Profile Creation", description: "Set up HRMS profile", assignedTo: "HR Admin" },
    { title: "Email Account Access", description: "Grant login to company email", assignedTo: "IT Support" },
    { title: "GitHub Access Grant", description: "Add to project repositories", assignedTo: "Engineering" },
    { title: "JIRA Project Invite", description: "Add to sprint boards", assignedTo: "Project Manager" },
    { title: "Dev Environment Setup", description: "Install necessary tools and SDKs", assignedTo: "Engineering" },
    { title: "Product Induction", description: "Meeting with product manager", assignedTo: "Product Team" }
];

interface LifecycleState {
    candidates: Candidate[];
    newHires: NewHire[];
    employees: LifecycleEmployee[];
    history: HistoryLog[];
    assets: InventoryAsset[];
    policies: Policy[];

    // Candidate Actions
    addCandidate: (candidate: Candidate) => void;
    removeCandidate: (id: string) => void;
    updateCandidateStatus: (id: string, status: Candidate['status']) => void;
    moveToOnboarding: (id: string, name: string) => void;

    // New Hire (Onboarding) Actions
    addNewHire: (hire: Omit<NewHire, 'id' | 'progress' | 'status' | 'tasks'>) => void;
    updateNewHire: (id: string, updates: Partial<NewHire>) => void;
    deleteNewHire: (id: string) => void;
    startOnboarding: (id: string) => void;
    completeOnboarding: (hireId: string) => void;

    // Task Actions
    addTaskToHire: (hireId: string, task: Omit<OnboardingTask, 'id' | 'status'>) => void;
    updateTaskStatus: (hireId: string, taskId: string, status: OnboardingTask['status']) => void;
    deleteTaskFromHire: (hireId: string, taskId: string) => void;

    // Employee (Probation/Lifecycle) Actions
    confirmProbation: (id: string) => void;
    updateEmployeeStatus: (id: string, status: LifecycleEmployee['status']) => void;
    promoteEmployee: (id: string, newRole: string) => void;
    transferEmployee: (id: string, newDepartment: string) => void;
    updateSalary: (id: string, newSalary: string) => void;

    // Asset Actions
    addAsset: (asset: Omit<InventoryAsset, 'history' | 'assignedTo'>) => void;
    deleteAsset: (id: string) => void;
    updateAsset: (id: string, updates: Partial<InventoryAsset>) => void;
    assignAsset: (assetId: string, employeeId: string, employeeName: string) => void;
    returnAsset: (assetId: string) => void;

    // Data Management
    onboardingDuration: number;
    setOnboardingDuration: (days: number) => void;
    resetStore: () => void;
    syncTasks: () => void;

    // Advanced Actions
    extendProbation: (id: string, months: number, reason: string) => void;
    bulkConfirmHighPerformers: () => void;
    updateEmployeeCompliance: (id: string, policyId: string) => void;
    addPolicy: (name: string) => void;
    removePolicy: (id: string) => void;

    // Offboarding Actions
    initiateExit: (id: string, reason: string, lwd: string) => void;
    approveClearance: (id: string, dept: keyof ClearanceStatus) => void;
    completeClearance: (id: string) => void;
    finalizeSettlement: (id: string, amount: number) => void;
}

export const useLifecycleStore = create<LifecycleState>()(
    persist(
        (set) => ({
            candidates: [
                {
                    id: "C001",
                    name: "Rohan Sharma",
                    role: "Frontend Developer",
                    department: "Engineering",
                    email: "rohan@example.com",
                    joiningDate: "2024-03-01",
                    salary: "₹ 15,00,000",
                    status: "Ready to Join",
                    bgvStatus: "Approved",
                    avatar: "RS"
                }
            ],
            newHires: [
                {
                    id: "HR001",
                    name: "Arjun Mehta",
                    position: "Senior UI Designer",
                    department: "Design",
                    startDate: "2024-02-01",
                    progress: 35,
                    status: "Onboarding",
                    mentor: "Sarah Chen",
                    tasks: ONBOARDING_TASKS.map((t, i) => ({
                        ...t,
                        id: `T${i + 1}`,
                        status: i < 2 ? "Completed" : "Pending",
                        dueDate: "2024-02-01"
                    })) as OnboardingTask[]
                }
            ],
            employees: [
                {
                    id: "E001",
                    name: "Aditya Singh",
                    role: "Senior Developer",
                    department: "Engineering",
                    joinDate: "2023-11-15",
                    status: "Probation",
                    performance: 85,
                    probationEnd: "2024-05-15",
                    avatar: "AS",
                    complianceDocs: ["P1", "P2"]
                },
                {
                    id: "E002",
                    name: "Priya Sharma",
                    role: "Product Manager",
                    department: "Product",
                    joinDate: "2023-08-10",
                    status: "Active",
                    performance: 92,
                    probationEnd: "2024-02-10",
                    avatar: "PS",
                    complianceDocs: ["P1", "P2", "P3", "P4"]
                },
                {
                    id: "E003",
                    name: "Rahul Verma",
                    role: "UI Designer",
                    department: "Design",
                    joinDate: "2023-09-20",
                    status: "Active",
                    performance: 88,
                    probationEnd: "2024-03-20",
                    avatar: "RV",
                    complianceDocs: ["P1", "P2", "P4"]
                },
                {
                    id: "E004",
                    name: "Sneha Patel",
                    role: "Marketing Executive",
                    department: "Marketing",
                    joinDate: "2023-10-05",
                    status: "Active",
                    performance: 90,
                    probationEnd: "2024-04-05",
                    avatar: "SP",
                    complianceDocs: ["P1", "P2", "P3"]
                }
            ],
            history: [],
            assets: [
                { id: "ASST-001", name: "MacBook Pro M3", type: "Laptop", status: "Assigned", condition: "Excellent", assignedTo: "E001" },
                { id: "ASST-002", name: "Dell Ultrasharp 27", type: "Monitor", status: "Available", condition: "Good" },
                { id: "ASST-003", name: "iPhone 15 Pro", type: "Mobile", status: "Repair", condition: "Used" },
                { id: "ASST-004", name: "Lenovo ThinkPad X1", type: "Laptop", status: "Available", condition: "Excellent" }
            ],
            policies: [
                { id: "P1", name: "POSH Policy", required: true },
                { id: "P2", name: "NDA Agreement", required: true },
                { id: "P3", name: "IT Security", required: true },
                { id: "P4", name: "Code of Conduct", required: true }
            ],
            onboardingDuration: 90,
            setOnboardingDuration: (days) => set({ onboardingDuration: days }),

            // Candidate Actions
            addCandidate: (candidate) => set((state) => ({
                candidates: [...state.candidates, candidate]
            })),
            removeCandidate: (id) => set((state) => ({
                candidates: state.candidates.filter(c => c.id !== id)
            })),
            updateCandidateStatus: (id, status) => set((state) => ({
                candidates: state.candidates.map(c => c.id === id ? { ...c, status } : c)
            })),
            moveToOnboarding: (id, name) => set((state) => {
                const candidate = state.candidates.find(c => c.id === id);
                if (!candidate) return state;

                const newHire: NewHire = {
                    id: `HR${String(state.newHires.length + 1).padStart(3, '0')}`,
                    name: candidate.name,
                    position: candidate.role,
                    department: candidate.department,
                    startDate: candidate.joiningDate,
                    progress: 0,
                    status: "Pre-boarding",
                    mentor: "TBD",
                    tasks: PRE_BOARDING_TASKS.map((t, i) => ({
                        ...t,
                        id: `T${i + 1}`,
                        status: "Pending",
                        dueDate: candidate.joiningDate
                    })) as OnboardingTask[]
                };

                return {
                    candidates: state.candidates.filter(c => c.id !== id),
                    newHires: [newHire, ...state.newHires]
                };
            }),

            // New Hire Actions
            addNewHire: (hire) => set((state) => ({
                newHires: [
                    {
                        ...hire,
                        id: `HR${String(state.newHires.length + 1).padStart(3, '0')}`,
                        progress: 0,
                        status: "Pre-boarding",
                        tasks: PRE_BOARDING_TASKS.map((t, i) => ({
                            ...t,
                            id: `T${i + 1}`,
                            status: "Pending",
                            dueDate: hire.startDate
                        })) as OnboardingTask[]
                    },
                    ...state.newHires
                ]
            })),
            updateNewHire: (id, updates) => set((state) => ({
                newHires: state.newHires.map(h => h.id === id ? { ...h, ...updates } : h)
            })),
            startOnboarding: (id) => set((state) => ({
                newHires: state.newHires.map(h => {
                    if (h.id !== id) return h;
                    return {
                        ...h,
                        status: 'Onboarding',
                        progress: 0,
                        tasks: ONBOARDING_TASKS.map((t, i) => ({
                            ...t,
                            id: `OT${Date.now()}${i}`,
                            status: "Pending",
                            dueDate: h.startDate
                        })) as OnboardingTask[]
                    };
                })
            })),
            deleteNewHire: (id) => set((state) => ({
                newHires: state.newHires.filter(h => h.id !== id)
            })),
            completeOnboarding: (hireId) => set((state) => {
                const hire = state.newHires.find(h => h.id === hireId);
                if (!hire) return state;

                const newEmployee: LifecycleEmployee = {
                    id: `E${String(state.employees.length + 1).padStart(3, '0')}`,
                    name: hire.name,
                    role: hire.position,
                    department: hire.department,
                    joinDate: hire.startDate,
                    status: "Probation",
                    performance: 0,
                    probationEnd: new Date(new Date(hire.startDate).setMonth(new Date(hire.startDate).getMonth() + 6)).toISOString().split('T')[0],
                    avatar: hire.name.split(' ').map(n => n[0]).join(''),
                    complianceDocs: []
                };

                return {
                    newHires: state.newHires.filter(h => h.id !== hireId),
                    employees: [newEmployee, ...state.employees]
                };
            }),

            // Task Actions
            addTaskToHire: (hireId, task) => set((state) => ({
                newHires: state.newHires.map(h => {
                    if (h.id === hireId) {
                        const newTasks = [
                            ...h.tasks,
                            { ...task, id: `T${h.tasks.length + 1}`, status: "Pending" as const }
                        ];
                        const completed = newTasks.filter(t => t.status === "Completed").length;
                        const progress = Math.round((completed / newTasks.length) * 100);
                        return { ...h, tasks: newTasks, progress };
                    }
                    return h;
                })
            })),
            updateTaskStatus: (hireId, taskId, status) => set((state) => ({
                newHires: state.newHires.map(h => {
                    if (h.id === hireId) {
                        const newTasks = h.tasks.map(t => t.id === taskId ? { ...t, status } : t);
                        const completed = newTasks.filter(t => t.status === "Completed").length;
                        const progress = Math.round((completed / newTasks.length) * 100);
                        return { ...h, tasks: newTasks, progress };
                    }
                    return h;
                })
            })),
            deleteTaskFromHire: (hireId, taskId) => set((state) => ({
                newHires: state.newHires.map(h => {
                    if (h.id === hireId) {
                        const newTasks = h.tasks.filter(t => t.id !== taskId);
                        const completed = newTasks.filter(t => t.status === "Completed").length;
                        const progress = newTasks.length > 0 ? Math.round((completed / newTasks.length) * 100) : 0;
                        return { ...h, tasks: newTasks, progress };
                    }
                    return h;
                })
            })),

            // Employee Actions
            confirmProbation: (id) => set((state) => ({
                employees: state.employees.map(e => e.id === id ? { ...e, status: 'Active' } : e)
            })),
            updateEmployeeStatus: (id, status) => set((state) => ({
                employees: state.employees.map(e => e.id === id ? { ...e, status } : e)
            })),

            extendProbation: (id, months, reason) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee) return state;

                const currentDate = new Date(employee.probationEnd);
                const newEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + months)).toISOString().split('T')[0];

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Probation Extended: ${employee.name}`,
                    description: `Extended by ${months} months. Reason: ${reason}`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'neutral',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees.map(e => e.id === id ? { ...e, probationEnd: newEndDate } : e),
                    history: [historyEntry, ...state.history]
                };
            }),

            bulkConfirmHighPerformers: () => set((state) => {
                const topPerformers = state.employees.filter(e => e.status === 'Probation' && e.performance >= 90);
                if (topPerformers.length === 0) return state;

                const newHistoryEntries: HistoryLog[] = topPerformers.map(emp => ({
                    id: `H${Date.now()}-${emp.id}`,
                    title: `Bulk Confirmation: ${emp.name}`,
                    description: `Automatically confirmed due to high performance (${emp.performance}%)`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'growth',
                    employeeId: emp.id,
                    employeeName: emp.name
                }));

                return {
                    employees: state.employees.map(e =>
                        (e.status === 'Probation' && e.performance >= 90) ? { ...e, status: 'Active' as const } : e
                    ),
                    history: [...newHistoryEntries, ...state.history]
                };
            }),

            promoteEmployee: (id, newRole) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee) return state;

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Promotion: ${employee.name}`,
                    description: `Promoted from ${employee.role} to ${newRole}`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'growth',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees.map(e => e.id === id ? { ...e, role: newRole } : e),
                    history: [historyEntry, ...state.history]
                };
            }),

            transferEmployee: (id, newDepartment) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee) return state;

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Transfer: ${employee.name}`,
                    description: `Transferred from ${employee.department} to ${newDepartment}`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'neutral',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees.map(e => e.id === id ? { ...e, department: newDepartment } : e),
                    history: [historyEntry, ...state.history]
                };
            }),

            updateSalary: (id, newSalary) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee) return state;

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Salary Revision: ${employee.name}`,
                    description: `Compensation updated for ${employee.role}`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'growth',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees,
                    history: [historyEntry, ...state.history]
                };
            }),
            updateEmployeeCompliance: (id, policyId) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee) return state;

                const alreadySigned = (employee.complianceDocs || []).includes(policyId);
                const policy = state.policies.find(p => p.id === policyId);
                if (alreadySigned || !policy) return state;

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Policy Signed: ${employee.name}`,
                    description: `Signed policy: ${policy.name}`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'neutral',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees.map(e => e.id === id ? { ...e, complianceDocs: [...(e.complianceDocs || []), policyId] } : e),
                    history: [historyEntry, ...state.history]
                };
            }),

            addPolicy: (name) => set((state) => {
                const newPolicy: Policy = {
                    id: `P${state.policies.length + 1}${Date.now()}`,
                    name,
                    required: true
                };
                return {
                    policies: [...state.policies, newPolicy]
                };
            }),

            removePolicy: (id) => set((state) => ({
                policies: state.policies.filter(p => p.id !== id),
                // Optionally clean up employee docs, but usually they stay for records
            })),

            initiateExit: (id, reason, lwd) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee) return state;

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Exit Initiated: ${employee.name}`,
                    description: `Resignation submitted. Reason: ${reason}. LWD: ${lwd}`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'exit',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees.map(e => e.id === id ? {
                        ...e,
                        status: 'Notice Period',
                        exitReason: reason,
                        lwd,
                        clearance: { it: false, finance: false, admin: false, manager: false }
                    } : e),
                    history: [historyEntry, ...state.history]
                };
            }),

            approveClearance: (id, dept) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee || !employee.clearance) return state;

                const newClearance = { ...employee.clearance, [dept]: true };

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Clearance Approved: ${dept.toUpperCase()}`,
                    description: `${dept.toUpperCase()} department has cleared all dues for ${employee.name}.`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'neutral',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees.map(e => e.id === id ? { ...e, clearance: newClearance } : e),
                    history: [historyEntry, ...state.history]
                };
            }),

            completeClearance: (id) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee) return state;

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Final Clearance Completed`,
                    description: `All departments have cleared ${employee.name}. Ready for F&F settlement.`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'neutral',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees.map(e => e.id === id ? { ...e, status: 'Exited' } : e),
                    history: [historyEntry, ...state.history]
                };
            }),

            finalizeSettlement: (id, amount) => set((state) => {
                const employee = state.employees.find(e => e.id === id);
                if (!employee) return state;

                const historyEntry: HistoryLog = {
                    id: `H${Date.now()}`,
                    title: `Full & Final Settled`,
                    description: `Settlement of ₹${amount.toLocaleString()} processed and paid.`,
                    date: new Date().toISOString().split('T')[0],
                    type: 'growth',
                    employeeId: employee.id,
                    employeeName: employee.name
                };

                return {
                    employees: state.employees.map(e => e.id === id ? {
                        ...e,
                        settlement: { netPayable: amount, status: 'Paid', processedDate: new Date().toISOString().split('T')[0] }
                    } : e),
                    history: [historyEntry, ...state.history]
                };
            }),

            resetStore: () => set({
                candidates: [
                    {
                        id: "C001",
                        name: "Rohan Sharma",
                        role: "Frontend Developer",
                        department: "Engineering",
                        email: "rohan@example.com",
                        joiningDate: "2024-03-01",
                        salary: "₹ 15,00,000",
                        status: "Ready to Join",
                        bgvStatus: "Approved",
                        avatar: "RS"
                    }
                ],
                newHires: [
                    {
                        id: "HR001",
                        name: "Arjun Mehta",
                        position: "Senior UI Designer",
                        department: "Design",
                        startDate: "2024-02-01",
                        progress: 0,
                        status: "Onboarding",
                        mentor: "Sarah Chen",
                        tasks: ONBOARDING_TASKS.map((t, i) => ({
                            ...t,
                            id: `T${i + 1}`,
                            status: "Pending",
                            dueDate: "2024-02-01"
                        })) as OnboardingTask[]
                    }
                ],
                employees: []
            }),

            syncTasks: () => set((state) => ({
                newHires: state.newHires.map(h => {
                    const defaultTasks = h.status === 'Pre-boarding' ? PRE_BOARDING_TASKS : ONBOARDING_TASKS;
                    return {
                        ...h,
                        tasks: defaultTasks.map((t, i) => ({
                            ...t,
                            id: `T${i + 1}`,
                            status: "Pending",
                            dueDate: h.startDate
                        })) as OnboardingTask[],
                        progress: 0
                    };
                })
            })),

            addAsset: (asset) => set((state) => ({
                assets: [{ ...asset, history: [] }, ...state.assets]
            })),
            deleteAsset: (id) => set((state) => ({
                assets: state.assets.filter(a => a.id !== id)
            })),
            updateAsset: (id, updates) => set((state) => ({
                assets: state.assets.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            assignAsset: (assetId, employeeId, employeeName) => set((state) => ({
                assets: state.assets.map(a => {
                    if (a.id === assetId) {
                        const historyEntry: AssetHistory = {
                            id: `AH${Date.now()}`,
                            employeeId,
                            employeeName,
                            action: "Assigned",
                            date: new Date().toISOString().split('T')[0]
                        };
                        return {
                            ...a,
                            status: 'Assigned',
                            assignedTo: employeeId,
                            history: [historyEntry, ...(a.history || [])]
                        };
                    }
                    return a;
                })
            })),
            returnAsset: (assetId) => set((state) => ({
                assets: state.assets.map(a => {
                    if (a.id === assetId) {
                        const employee = state.employees.find(e => e.id === a.assignedTo) || state.newHires.find(h => h.id === a.assignedTo);
                        const historyEntry: AssetHistory = {
                            id: `AH${Date.now()}`,
                            employeeId: a.assignedTo || "Unknown",
                            employeeName: employee ? employee.name : "Previous User",
                            action: "Returned",
                            date: new Date().toISOString().split('T')[0]
                        };
                        return {
                            ...a,
                            status: 'Available',
                            assignedTo: undefined,
                            history: [historyEntry, ...(a.history || [])]
                        };
                    }
                    return a;
                })
            }))
        }),
        {
            name: 'lifecycle-storage-v2',
        }
    )
);
