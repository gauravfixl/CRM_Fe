import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Delegated' | 'Escalated';
export type ApprovalCategory = 'Leave' | 'Attendance' | 'Expense' | 'Asset' | 'Timesheet';

export interface ApprovalItem {
    id: string;
    category: ApprovalCategory;
    requestedBy: {
        id: string;
        name: string;
        avatar: string;
        department: string;
    };
    requestedAt: string;
    status: ApprovalStatus;
    priority: 'Low' | 'Medium' | 'High';
    details: {
        title: string;
        description: string;
        amount?: number;
        startDate?: string;
        endDate?: string;
        days?: number;
        reason?: string;
    };
    approvedBy?: string;
    approvedAt?: string;
    rejectionReason?: string;
    delegatedTo?: string;
    escalatedTo?: string;
}

export type NotificationType = 'Info' | 'Success' | 'Warning' | 'Error';
export type NotificationCategory = 'Announcement' | 'Policy' | 'Payroll' | 'Performance' | 'System';

export interface Notification {
    id: string;
    type: NotificationType;
    category: NotificationCategory;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
}

export type RequestType = 'Leave' | 'Attendance' | 'Expense' | 'Asset' | 'Profile Update' | 'Letter';
export type RequestStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Request {
    id: string;
    type: RequestType;
    from: {
        id: string;
        name: string;
        avatar: string;
    };
    subject: string;
    message: string;
    priority: 'Low' | 'Medium' | 'High';
    status: RequestStatus;
    createdAt: string;
    updatedAt: string;
}

interface InboxState {
    approvals: ApprovalItem[];
    notifications: Notification[];
    requests: Request[];

    // Approvals
    approveRequest: (id: string, approvedBy: string) => void;
    rejectRequest: (id: string, reason: string) => void;
    delegateRequest: (id: string, delegatedTo: string) => void;
    escalateRequest: (id: string, escalatedTo: string) => void;
    bulkApprove: (ids: string[], approvedBy: string) => void;

    // Notifications
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;

    // Requests
    updateRequestStatus: (id: string, status: RequestStatus) => void;
    deleteRequest: (id: string) => void;
}

// Mock Data
const MOCK_APPROVALS: ApprovalItem[] = [
    {
        id: 'app-1',
        category: 'Leave',
        requestedBy: { id: 'EMP002', name: 'Aditya Singh', avatar: 'AS', department: 'Engineering' },
        requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        priority: 'High',
        details: {
            title: 'Casual Leave Request',
            description: 'Family function',
            startDate: '2026-01-25',
            endDate: '2026-01-27',
            days: 3,
            reason: 'Attending family wedding in Delhi'
        }
    },
    {
        id: 'app-2',
        category: 'Expense',
        requestedBy: { id: 'EMP003', name: 'Rohan Gupta', avatar: 'RG', department: 'Sales' },
        requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        priority: 'Medium',
        details: {
            title: 'Client Meeting Expense',
            description: 'Lunch with client at ITC',
            amount: 4500,
            reason: 'Business development meeting'
        }
    },
    {
        id: 'app-5',
        category: 'Asset',
        requestedBy: { id: 'EMP009', name: 'Ishita Goyal', avatar: 'IG', department: 'Design' },
        requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'Escalated',
        priority: 'High',
        escalatedTo: 'Head of Operations',
        details: {
            title: 'MacBook Pro Request',
            description: 'Hardware upgrade needed for rendering',
            reason: 'Current laptop lagging during heavy video edits'
        }
    },
    {
        id: 'app-6',
        category: 'Attendance',
        requestedBy: { id: 'EMP010', name: 'Karan Mehra', avatar: 'KM', department: 'Marketing' },
        requestedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        status: 'Delegated',
        priority: 'Low',
        delegatedTo: 'Team Lead - Sarah',
        details: {
            title: 'Missed Punch Regularization',
            description: 'Technical glitch in biometric',
            startDate: '2026-01-19',
            reason: 'The scanner was not reading my thumbprint after rain'
        }
    }
];

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: 'Info',
        category: 'Announcement',
        title: 'New Office Policy Update',
        message: 'The flexible work policy has been updated for Q1 2026.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isRead: false,
    },
    {
        id: 'notif-2',
        type: 'Success',
        category: 'Payroll',
        title: 'Salary Credited',
        message: 'Your salary for January 2026 has been credited.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        isRead: false
    },
    {
        id: 'notif-6',
        type: 'Warning',
        category: 'Performance',
        title: 'Appraisal Cycle Started',
        message: 'Self-appraisal window is now open until Jan 30.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        isRead: false
    }
];

const MOCK_REQUESTS: Request[] = [
    {
        id: 'req-1',
        type: 'Letter',
        from: { id: 'EMP006', name: 'Priya Sharma', avatar: 'PS' },
        subject: 'Salary Certificate for Loan',
        message: 'I need a salary certificate for my home loan application.',
        priority: 'High',
        status: 'Open',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'req-4',
        type: 'Profile Update',
        from: { id: 'EMP011', name: 'Manish Verma', avatar: 'MV' },
        subject: 'Home Address Correction',
        message: 'I have shifted to a new apartment. Need to update my permanent address.',
        priority: 'Medium',
        status: 'In Progress',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
];

export const useInboxStore = create<InboxState>()(
    persist(
        (set) => ({
            approvals: MOCK_APPROVALS,
            notifications: MOCK_NOTIFICATIONS,
            requests: MOCK_REQUESTS,

            approveRequest: (id, approvedBy) => set((state) => ({
                approvals: state.approvals.map(a =>
                    a.id === id
                        ? { ...a, status: 'Approved', approvedBy, approvedAt: new Date().toISOString() }
                        : a
                )
            })),

            rejectRequest: (id, reason) => set((state) => ({
                approvals: state.approvals.map(a =>
                    a.id === id
                        ? { ...a, status: 'Rejected', rejectionReason: reason }
                        : a
                )
            })),

            delegateRequest: (id, delegatedTo) => set((state) => ({
                approvals: state.approvals.map(a =>
                    a.id === id
                        ? { ...a, status: 'Delegated', delegatedTo }
                        : a
                )
            })),

            escalateRequest: (id, escalatedTo) => set((state) => ({
                approvals: state.approvals.map(a =>
                    a.id === id
                        ? { ...a, status: 'Escalated', escalatedTo }
                        : a
                )
            })),

            bulkApprove: (ids, approvedBy) => set((state) => ({
                approvals: state.approvals.map(a =>
                    ids.includes(a.id)
                        ? { ...a, status: 'Approved', approvedBy, approvedAt: new Date().toISOString() }
                        : a
                )
            })),

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, isRead: true } : n
                )
            })),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true }))
            })),

            deleteNotification: (id) => set((state) => ({
                notifications: state.notifications.filter(n => n.id !== id)
            })),

            updateRequestStatus: (id, status) => set((state) => ({
                requests: state.requests.map(r =>
                    r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
                )
            })),

            deleteRequest: (id) => set((state) => ({
                requests: state.requests.filter(r => r.id !== id)
            }))
        }),
        { name: 'inbox-storage-v2' }
    )
);
