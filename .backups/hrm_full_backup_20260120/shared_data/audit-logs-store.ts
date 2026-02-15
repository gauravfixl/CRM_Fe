import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuditAction =
    | 'Login' | 'Logout'
    | 'Create' | 'Update' | 'Delete'
    | 'Approve' | 'Reject'
    | 'Download' | 'Export'
    | 'View' | 'Access';

export type AuditModule =
    | 'Authentication'
    | 'Roles & Permissions'
    | 'Employees'
    | 'Attendance'
    | 'Leave'
    | 'Payroll'
    | 'Performance'
    | 'Assets'
    | 'Documents'
    | 'Settings'
    | 'System';

export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    userRole: string;
    action: AuditAction;
    module: AuditModule;
    description: string;
    ipAddress: string;
    deviceInfo: string;
    metadata?: Record<string, any>; // Additional context
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface AuditLogsState {
    logs: AuditLog[];

    // Log Creation
    addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;

    // Bulk Operations
    clearOldLogs: (beforeDate: string) => void;
    exportLogs: (filters?: Partial<AuditLog>) => AuditLog[];

    // Queries
    getLogsByUser: (userId: string) => AuditLog[];
    getLogsByModule: (module: AuditModule) => AuditLog[];
    getLogsByDateRange: (startDate: string, endDate: string) => AuditLog[];
    getRecentLogs: (count: number) => AuditLog[];
}

// Helper to generate mock logs
const generateMockLogs = (): AuditLog[] => {
    const users = [
        { id: 'EMP001', name: 'Drashi Garg', role: 'Super Admin' },
        { id: 'EMP002', name: 'Aditya Singh', role: 'HR Manager' },
        { id: 'EMP003', name: 'Rohan Gupta', role: 'Manager' }
    ];

    const actions: { action: AuditAction; module: AuditModule; desc: string; severity: AuditLog['severity'] }[] = [
        { action: 'Login', module: 'Authentication', desc: 'User logged in successfully', severity: 'Low' },
        { action: 'Create', module: 'Roles & Permissions', desc: 'Created new role "Team Lead"', severity: 'High' },
        { action: 'Update', module: 'Employees', desc: 'Updated employee salary details', severity: 'High' },
        { action: 'Approve', module: 'Leave', desc: 'Approved leave request for 3 days', severity: 'Medium' },
        { action: 'Delete', module: 'Roles & Permissions', desc: 'Deleted custom role', severity: 'Critical' },
        { action: 'Export', module: 'Payroll', desc: 'Exported payroll data for Jan 2026', severity: 'Medium' },
        { action: 'Update', module: 'Settings', desc: 'Modified attendance grace period', severity: 'High' },
        { action: 'Logout', module: 'Authentication', desc: 'User logged out', severity: 'Low' }
    ];

    const logs: AuditLog[] = [];
    for (let i = 0; i < 50; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const actionData = actions[Math.floor(Math.random() * actions.length)];
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 72)); // Last 3 days

        logs.push({
            id: `log-${i + 1}`,
            timestamp: date.toISOString(),
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            action: actionData.action,
            module: actionData.module,
            description: actionData.desc,
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            deviceInfo: Math.random() > 0.5 ? 'Chrome on Windows' : 'Safari on macOS',
            severity: actionData.severity
        });
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const useAuditLogsStore = create<AuditLogsState>()(
    persist(
        (set, get) => ({
            logs: generateMockLogs(),

            addLog: (logData) => set((state) => {
                const newLog: AuditLog = {
                    ...logData,
                    id: `log-${Date.now()}`,
                    timestamp: new Date().toISOString()
                };
                return { logs: [newLog, ...state.logs] };
            }),

            clearOldLogs: (beforeDate) => set((state) => ({
                logs: state.logs.filter(log => new Date(log.timestamp) >= new Date(beforeDate))
            })),

            exportLogs: (filters) => {
                let logs = get().logs;
                if (filters) {
                    logs = logs.filter(log => {
                        return Object.entries(filters).every(([key, value]) => {
                            if (!value) return true;
                            return log[key as keyof AuditLog] === value;
                        });
                    });
                }
                return logs;
            },

            getLogsByUser: (userId) => get().logs.filter(log => log.userId === userId),
            getLogsByModule: (module) => get().logs.filter(log => log.module === module),
            getLogsByDateRange: (startDate, endDate) => {
                const start = new Date(startDate).getTime();
                const end = new Date(endDate).getTime();
                return get().logs.filter(log => {
                    const logTime = new Date(log.timestamp).getTime();
                    return logTime >= start && logTime <= end;
                });
            },
            getRecentLogs: (count) => get().logs.slice(0, count)
        }),
        { name: 'audit-logs-storage' }
    )
);
