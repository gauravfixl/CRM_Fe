import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AttendanceLog {
    id: string;
    empId: string;
    empName: string;
    date: string; // YYYY-MM-DD
    checkIn: string | null; // HH:MM
    checkOut: string | null; // HH:MM
    totalHours: string; // e.g. "8h 30m"
    status: 'Present' | 'Absent' | 'Half Day' | 'On Leave' | 'Weekend';
    remark?: string;
    regularizationStatus: 'None' | 'Pending' | 'Approved' | 'Rejected';
}

interface AttendanceState {
    logs: AttendanceLog[];
    isCheckedIn: boolean;
    checkInTime: string | null; // Timestamp for timer

    // Actions
    clockIn: (empId: string, empName: string) => void;
    clockOut: (empId: string) => void;
    requestRegularization: (logId: string, reason: string) => void;
    approveRegularization: (logId: string) => void;
    getLogsByEmployee: (empId: string) => AttendanceLog[];
}

// Mock Data for Calendar Generation
const generateMockLogs = () => {
    const logs: AttendanceLog[] = [];
    const empId = "EMP001";
    // Generate for last 10 days
    for (let i = 0; i < 10; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;

        logs.push({
            id: `log-${i}`,
            empId,
            empName: "Drashi Garg",
            date: dateStr,
            checkIn: isWeekend ? null : "09:30",
            checkOut: isWeekend ? null : "18:30",
            totalHours: isWeekend ? "0h" : "9h 00m",
            status: isWeekend ? "Weekend" : "Present",
            regularizationStatus: "None"
        });
    }
    return logs;
};

export const useAttendanceStore = create<AttendanceState>()(
    persist(
        (set, get) => ({
            logs: generateMockLogs(),
            isCheckedIn: false,
            checkInTime: null,

            clockIn: (empId, empName) => {
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = now.toISOString().split('T')[0];

                set((state) => {
                    // Check if log exists for today
                    const existingLog = state.logs.find(l => l.date === dateStr && l.empId === empId);
                    if (existingLog) return state; // Already logged

                    const newLog: AttendanceLog = {
                        id: Math.random().toString(36).substr(2, 9),
                        empId,
                        empName,
                        date: dateStr,
                        checkIn: timeStr,
                        checkOut: null,
                        totalHours: "0h",
                        status: "Present",
                        regularizationStatus: "None"
                    };
                    return {
                        logs: [newLog, ...state.logs],
                        isCheckedIn: true,
                        checkInTime: now.toISOString()
                    };
                });
            },

            clockOut: (empId) => {
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = now.toISOString().split('T')[0];

                set((state) => ({
                    logs: state.logs.map(l => {
                        if (l.empId === empId && l.date === dateStr) {
                            // Calculate hours (Simplified)
                            return { ...l, checkOut: timeStr, totalHours: "8h 45m" }; // Mock calc
                        }
                        return l;
                    }),
                    isCheckedIn: false,
                    checkInTime: null
                }));
            },

            requestRegularization: (logId, reason) => set((state) => ({
                logs: state.logs.map(l => l.id === logId ? { ...l, regularizationStatus: "Pending", remark: reason } : l)
            })),

            approveRegularization: (logId) => set((state) => ({
                logs: state.logs.map(l => l.id === logId ? { ...l, regularizationStatus: "Approved" } : l)
            })),

            getLogsByEmployee: (empId) => get().logs.filter(l => l.empId === empId)
        }),
        { name: 'attendance-storage' }
    )
);
