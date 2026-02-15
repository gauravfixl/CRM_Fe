import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AttendanceLog {
    id: string;
    empId: string;
    empName: string;
    department: string;
    date: string; // YYYY-MM-DD
    checkIn: string | null; // HH:MM
    checkOut: string | null; // HH:MM
    totalHours: string; // e.g. "8h 30m"
    status: 'Present' | 'Absent' | 'Half Day' | 'On Leave' | 'Weekend' | 'Late';
    remark?: string;
    regularizationStatus: 'None' | 'Pending' | 'Approved' | 'Rejected';
    isDiscrepancy?: boolean;
}

interface AttendanceState {
    logs: AttendanceLog[];
    isCheckedIn: boolean;
    checkInTime: string | null; // Timestamp for timer

    // Actions
    clockIn: (empId: string, empName: string, department: string) => void;
    clockOut: (empId: string) => void;
    requestRegularization: (logId: string, reason: string) => void;
    approveRegularization: (logId: string) => void;
    rejectRegularization: (logId: string) => void;
    approveBulkRegularization: (ids: string[]) => void;
    rejectBulkRegularization: (ids: string[]) => void;
    getLogsByEmployee: (empId: string) => AttendanceLog[];
    addBulkLogs: (logs: AttendanceLog[]) => void;
}

// Better Mock Data for Multiple Employees
const generateMockLogs = () => {
    const logs: AttendanceLog[] = [];
    const employees = [
        { id: "E001", name: "Aditya Singh", dept: "Engineering" },
        { id: "E002", name: "Priya Sharma", dept: "Product" },
        { id: "E003", name: "Rahul Verma", dept: "Design" },
        { id: "E004", name: "Sneha Patel", dept: "Marketing" },
        { id: "E005", name: "Drashi Garg", dept: "Engineering" }
    ];

    // Generate for last 7 days
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;

        employees.forEach(emp => {
            if (isWeekend) {
                logs.push({
                    id: `log-${emp.id}-${i}`,
                    empId: emp.id,
                    empName: emp.name,
                    department: emp.dept,
                    date: dateStr,
                    checkIn: null,
                    checkOut: null,
                    totalHours: "0h",
                    status: "Weekend",
                    regularizationStatus: "None"
                });
            } else {
                // Random variation for realism
                const random = Math.random();
                let status: AttendanceLog['status'] = "Present";
                let checkIn = "09:30";
                let checkOut = "18:30";
                let totalHours = "9h 00m";
                let isDiscrepancy = false;

                if (random > 0.9) {
                    status = "Absent";
                    checkIn = null as any;
                    checkOut = null as any;
                    totalHours = "0h";
                } else if (random > 0.7) {
                    status = "Late";
                    checkIn = "10:15";
                    totalHours = "8h 15m";
                    isDiscrepancy = true;
                } else if (random > 0.6) {
                    checkOut = "15:00"; // Early checkout
                    totalHours = "5h 30m";
                    status = "Half Day";
                    isDiscrepancy = true;
                }

                logs.push({
                    id: `log-${emp.id}-${i}`,
                    empId: emp.id,
                    empName: emp.name,
                    department: emp.dept,
                    date: dateStr,
                    checkIn,
                    checkOut,
                    totalHours,
                    status,
                    isDiscrepancy,
                    regularizationStatus: random > 0.8 ? "Pending" : "None",
                    remark: random > 0.8 ? "System error during punch-out" : undefined
                });
            }
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

            clockIn: (empId, empName, department) => {
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = now.toISOString().split('T')[0];

                set((state) => {
                    const existingLog = state.logs.find(l => l.date === dateStr && l.empId === empId);
                    if (existingLog) return state;

                    const newLog: AttendanceLog = {
                        id: Math.random().toString(36).substr(2, 9),
                        empId,
                        empName,
                        department,
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
                            return { ...l, checkOut: timeStr, totalHours: "8h 45m" };
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
                logs: state.logs.map(l => l.id === logId ? { ...l, regularizationStatus: "Approved", isDiscrepancy: false } : l)
            })),

            rejectRegularization: (logId) => set((state) => ({
                logs: state.logs.map(l => l.id === logId ? { ...l, regularizationStatus: "Rejected" } : l)
            })),

            approveBulkRegularization: (ids) => set((state) => ({
                logs: state.logs.map(l => ids.includes(l.id) ? { ...l, regularizationStatus: "Approved", isDiscrepancy: false } : l)
            })),

            rejectBulkRegularization: (ids) => set((state) => ({
                logs: state.logs.map(l => ids.includes(l.id) ? { ...l, regularizationStatus: "Rejected" } : l)
            })),

            getLogsByEmployee: (empId) => get().logs.filter(l => l.empId === empId),

            addBulkLogs: (newLogs) => set((state) => ({
                logs: [...newLogs, ...state.logs]
            }))
        }),
        { name: 'attendance-storage-v2' }
    )
);
