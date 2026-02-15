import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
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
}

export interface Notification {
    id: string;
    type: 'Info' | 'Success' | 'Warning' | 'Error';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
    icon?: string;
}

export interface Request {
    id: string;
    type: 'Document' | 'Information' | 'Access' | 'Support';
    from: {
        id: string;
        name: string;
        avatar: string;
    };
    subject: string;
    message: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
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

    // Notifications
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;

    // Requests
    updateRequestStatus: (id: string, status: Request['status']) => void;
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
        details: {
            title: 'Client Meeting Expense',
            description: 'Lunch with client at ITC',
            amount: 4500,
            reason: 'Business development meeting'
        }
    },
    {
        id: 'app-3',
        category: 'Attendance',
        requestedBy: { id: 'EMP004', name: 'Sneha Kapoor', avatar: 'SK', department: 'HR' },
        requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        details: {
            title: 'Attendance Regularization',
            description: 'Forgot to punch in',
            startDate: '2026-01-18',
            reason: 'Biometric device was not working'
        }
    },
    {
        id: 'app-4',
        category: 'Leave',
        requestedBy: { id: 'EMP005', name: 'Vikram M', avatar: 'VM', department: 'Product' },
        requestedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: 'Approved',
        details: {
            title: 'Sick Leave',
            description: 'Medical emergency',
            startDate: '2026-01-20',
            endDate: '2026-01-21',
            days: 2,
            reason: 'Fever and cold'
        },
        approvedBy: 'Drashi Garg',
        approvedAt: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString()
    }
];

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: 'Info',
        title: 'New Leave Request',
        message: 'Aditya Singh has requested 3 days leave starting Jan 25',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        actionUrl: '/hrmcubicle/inbox/approvals'
    },
    {
        id: 'notif-2',
        type: 'Success',
        title: 'Payroll Processed',
        message: 'January 2026 payroll has been successfully processed',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        isRead: false
    },
    {
        id: 'notif-3',
        type: 'Warning',
        title: 'Pending Approvals',
        message: 'You have 3 pending approval requests',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRead: true
    },
    {
        id: 'notif-4',
        type: 'Info',
        title: 'Holiday Reminder',
        message: 'Republic Day on Jan 26 - Office will be closed',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true
    },
    {
        id: 'notif-5',
        type: 'Error',
        title: 'Biometric Sync Failed',
        message: 'Unable to sync attendance data from device #3',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        isRead: true
    }
];

const MOCK_REQUESTS: Request[] = [
    {
        id: 'req-1',
        type: 'Document',
        from: { id: 'EMP006', name: 'Priya Sharma', avatar: 'PS' },
        subject: 'Request for Salary Certificate',
        message: 'Hi, I need a salary certificate for my home loan application. Please provide at the earliest.',
        priority: 'High',
        status: 'Open',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'req-2',
        type: 'Information',
        from: { id: 'EMP007', name: 'Rahul Verma', avatar: 'RV' },
        subject: 'Query about Leave Balance',
        message: 'Can you please confirm my current leave balance? The portal is showing incorrect data.',
        priority: 'Medium',
        status: 'In Progress',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'req-3',
        type: 'Access',
        from: { id: 'EMP008', name: 'Neha Patel', avatar: 'NP' },
        subject: 'Access to Payroll Module',
        message: 'I need access to the payroll module for generating reports. Please grant permissions.',
        priority: 'Low',
        status: 'Resolved',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
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
        { name: 'inbox-storage' }
    )
);
