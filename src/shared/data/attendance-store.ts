import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    getMyAttendance,
    getEmployeeAttendance,
    requestRegularization as requestRegularizationApi,
    approveRegularization as approveRegularizationApi,
    rejectRegularization as rejectRegularizationApi,
} from "@/modules/hrm/hooks/hrmHooks";
import { axiosInstance as axios } from "@/lib/axios";

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

    // Backend API Sync Methods
    loadAttendanceFromApi: () => Promise<void>;
    syncClockInToApi: (empId: string) => Promise<void>;
    syncClockOutToApi: (empId: string) => Promise<void>;
    syncRegularizationToApi: (logId: string, reason: string) => Promise<void>;
    syncApproveRegularizationToApi: (logId: string) => Promise<void>;
    syncRejectRegularizationToApi: (logId: string, remarks: string) => Promise<void>;
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
            })),

            // ==================== Backend API Sync Methods ====================

            loadAttendanceFromApi: async () => {
                try {
                    const response = await getMyAttendance();
                    if (response?.data?.data && Array.isArray(response.data.data)) {
                        const apiLogs = response.data.data;
                        const mappedLogs: AttendanceLog[] = apiLogs.map((log: any) => ({
                            id: log._id || log.id || Math.random().toString(36).substr(2, 9),
                            empId: log.employeeId?._id || log.employeeId || '',
                            empName: log.employeeId?.firstName ? `${log.employeeId.firstName} ${log.employeeId.lastName || ''}`.trim() : log.empName || 'Unknown',
                            department: log.department || log.employeeId?.department || 'N/A',
                            date: log.date?.split('T')[0] || new Date().toISOString().split('T')[0],
                            checkIn: log.punchIn ? new Date(log.punchIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
                            checkOut: log.punchOut ? new Date(log.punchOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
                            totalHours: log.totalMinutes ? `${Math.floor(log.totalMinutes / 60)}h ${log.totalMinutes % 60}m` : '0h',
                            status: log.status === 'present' ? 'Present' : log.status === 'absent' ? 'Absent' : log.status === 'halfDay' ? 'Half Day' : log.status === 'late' ? 'Late' : log.status === 'onLeave' ? 'On Leave' : log.status === 'weekend' ? 'Weekend' : 'Present',
                            regularizationStatus: log.regularizationStatus || 'None',
                            isDiscrepancy: log.isDiscrepancy || false,
                            remark: log.remark || undefined,
                        }));
                        if (mappedLogs.length > 0) {
                            set({ logs: mappedLogs });
                        }
                    }
                } catch (err) {
                    console.warn("Could not load attendance from API, using local data:", err);
                }
            },

            syncClockInToApi: async (empId) => {
                try {
                    await axios.post("/hrm/attendance/punch", { employeeId: empId, punchType: "IN" });
                } catch (err) {
                    console.warn("Could not sync clock-in to API:", err);
                }
            },

            syncClockOutToApi: async (empId) => {
                try {
                    await axios.post("/hrm/attendance/punch", { employeeId: empId, punchType: "OUT" });
                } catch (err) {
                    console.warn("Could not sync clock-out to API:", err);
                }
            },

            syncRegularizationToApi: async (logId, reason) => {
                try {
                    await requestRegularizationApi({ attendanceId: logId, reason, correctedPunchIn: "", correctedPunchOut: "" });
                } catch (err) {
                    console.warn("Could not sync regularization to API:", err);
                }
            },

            syncApproveRegularizationToApi: async (logId) => {
                try {
                    await approveRegularizationApi(logId);
                } catch (err) {
                    console.warn("Could not sync approve to API:", err);
                }
            },

            syncRejectRegularizationToApi: async (logId, remarks) => {
                try {
                    await rejectRegularizationApi(logId, remarks);
                } catch (err) {
                    console.warn("Could not sync reject to API:", err);
                }
            },
        }),
        { name: 'attendance-storage-v2' }
    )
);
