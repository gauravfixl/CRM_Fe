import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OvertimeRequest {
    id: string;
    empId: string;
    empName: string;
    department: string;
    date: string;
    hours: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    priority: 'Low' | 'Medium' | 'High';
    approvedBy?: string;
    estimatedPayout: number;
    hourlyRate: number;
    multiplier: number;
}

interface OvertimeState {
    requests: OvertimeRequest[];

    // Actions
    submitRequest: (request: Omit<OvertimeRequest, 'id' | 'status' | 'estimatedPayout'>) => void;
    approveRequest: (id: string, managerName: string) => void;
    bulkApprove: (ids: string[], managerName: string) => void;
    rejectRequest: (id: string) => void;
    calculateEstimatedPayout: (hours: number, rate: number, mult: number) => number;
}

const MOCK_OT_REQUESTS: OvertimeRequest[] = [
    {
        id: "OT-001",
        empId: "E001",
        empName: "Aditya Singh",
        department: "Engineering",
        date: "2026-01-20",
        hours: 3.5,
        reason: "Critical production bug fix after hours",
        status: "Pending",
        priority: "High",
        estimatedPayout: 5250,
        hourlyRate: 1000,
        multiplier: 1.5
    },
    {
        id: "OT-002",
        empId: "E002",
        empName: "Priya Sharma",
        department: "Product",
        date: "2026-01-21",
        hours: 2,
        reason: "User interview transcription",
        status: "Pending",
        priority: "Medium",
        estimatedPayout: 2400,
        hourlyRate: 800,
        multiplier: 1.5
    }
];

export const useOvertimeStore = create<OvertimeState>()(
    persist(
        (set, get) => ({
            requests: MOCK_OT_REQUESTS,

            submitRequest: (data) => set((state) => ({
                requests: [
                    {
                        ...data,
                        id: `OT-${Date.now()}`,
                        status: 'Pending',
                        estimatedPayout: data.hours * data.hourlyRate * data.multiplier
                    },
                    ...state.requests
                ]
            })),

            approveRequest: (id, managerName) => set((state) => ({
                requests: state.requests.map(r =>
                    r.id === id ? { ...r, status: 'Approved', approvedBy: managerName } : r
                )
            })),

            bulkApprove: (ids, managerName) => set((state) => ({
                requests: state.requests.map(r =>
                    ids.includes(r.id) ? { ...r, status: 'Approved', approvedBy: managerName } : r
                )
            })),

            rejectRequest: (id) => set((state) => ({
                requests: state.requests.map(r =>
                    r.id === id ? { ...r, status: 'Rejected' } : r
                )
            })),

            calculateEstimatedPayout: (hours, rate, mult) => hours * rate * mult
        }),
        { name: 'overtime-storage' }
    )
);
