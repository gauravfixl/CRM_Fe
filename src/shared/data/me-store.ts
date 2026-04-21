import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    createLeaveRequest,
    getActiveLeaveTypes,
    getLeaveBalance,
    getMyAttendance,
    getMyLeaveRequests,
    punch,
    rejectLeaveRequest,
    requestRegularization,
    getEmployeeById,
    getMyGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getAllFeedback,
    getAllAppraisals,
} from "@/modules/hrm/hooks/hrmHooks";
import axios from "@/lib/axios";

const formatISODate = (value: any) => {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
};

const formatTime = (value: any) => {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });
};

const minutesToDuration = (minutes: number) => {
    const safe = Math.max(0, Number(minutes) || 0);
    const h = Math.floor(safe / 60);
    const m = safe % 60;
    return `${h}h ${m}m`;
};

const minutesToHoursLabel = (minutes: number) => {
    const safe = Math.max(0, Number(minutes) || 0);
    return `${(safe / 60).toFixed(1)}h`;
};

export interface MeState {
    user: {
        name: string;
        empId: string;
        designation: string;
        department: string;
        location: string;
        workEmail: string;
        personalEmail: string;
        mobile: string;
        avatar: string;
        joiningDate: string;
        dob: string;
        gender: string;
        bio: string;
        reportingTo: {
            name: string;
            role: string;
            avatar: string;
        };
        emergencyContact: {
            name: string;
            relationship: string;
            mobile: string;
        };
        workExperience: Array<{
            company: string;
            role: string;
            duration: string;
        }>;
    };
    bankDetails: {
        bankName: string;
        accountNo: string;
        ifsc: string;
        pan: string;
    };
    attendance: {
        isCheckedIn: boolean;
        checkInTime: string | null;
        stats: {
            avgArrival: string;
            onTimeRate: string;
            avgDailyHours: string;
            penalties: string;
        };
        logs: Array<{
            id: string;
            date: string;
            checkIn: string;
            checkOut: string;
            duration: string;
            status: 'Present' | 'Late' | 'Absent' | 'Half Day' | 'On-Time';
            totalHours: string;
        }>;
    };
    leave: {
        balances: Array<{
            type: string;
            total: number;
            consumed: number;
            color: string;
            icon: string;
        }>;
        requests: Array<{
            id: string;
            type: string;
            startDate: string;
            endDate: string;
            days: number;
            reason: string;
            status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
            appliedOn: string;
        }>;
    };
    finances: {
        salary: {
            takeHome: string;
            ytd: string;
            deductions: string;
            taxSaved: string;
        };
        payslips: Array<{
            id: string;
            month: string;
            date: string;
            net: string;
        }>;
    };
    performance: {
        score: string;
        activeGoals: number;
        ratingDesc: string;
        reviewsDone: number;
        praises: Array<{
            from: string;
            msg: string;
            time: string;
            icon: string;
        }>;
        goals: Array<{
            id: string;
            title: string;
            progress: number;
            status: string;
            priority: string;
            category: string;
            dueDate: string;
            weightage: number;
        }>;
    };
    assets: Array<{
        id: string;
        name: string;
        category: string;
        serial: string;
        assignedDate: string;
        status?: string;
        condition?: string;
    }>;
    holidays: Array<{
        id: string;
        name: string;
        date: string;
        day: string;
        type: string;
        location: string;
        month: string;
        status: "upcoming" | "past";
    }>;
    documents: Array<{
        id: string;
        name: string;
        cat: string;
        date: string;
        size: string;
    }>;

    // Actions
    updateUser: (data: Partial<MeState['user']>) => void;
    updateBankDetails: (data: Partial<MeState['bankDetails']>) => void;
    loadMyAttendance: () => Promise<void>;
    loadMyLeave: () => Promise<void>;
    checkIn: () => Promise<void>;
    checkOut: () => Promise<void>;
    requestAttendanceRegularization: (data: {
        attendanceDate: string;
        requestedIn?: string;
        requestedOut?: string;
        reason: string;
    }) => Promise<void>;
    addLeaveRequest: (request: Omit<MeState['leave']['requests'][0], 'id' | 'appliedOn' | 'status'>) => Promise<void>;
    cancelLeaveRequest: (id: string) => Promise<void>;
    addPersonalGoal: (goal: Omit<MeState['performance']['goals'][0], 'id'>) => void;
    updatePerformanceScore: (score: string, ratingDesc: string) => void;
    loadMyProfile: () => Promise<void>;
    updateMyProfile: (data: Partial<MeState['user']>) => Promise<void>;
    loadMyGoals: () => Promise<void>;
    createMyGoal: (data: { goal: string; targetDate: string; keyPerformanceIndicators?: string[] }) => Promise<void>;
    updateMyGoal: (goalId: string, data: Record<string, any>) => Promise<void>;
    deleteMyGoal: (goalId: string) => Promise<void>;
    loadMyFeedback: () => Promise<void>;
    loadMyAppraisals: () => Promise<void>;
}

export const useMeStore = create<MeState>()(
    persist(
        (set, get) => ({
            user: {
                name: "Abhinav Singh",
                empId: "FXL-HR-2026-001",
                designation: "Lead HR Operations",
                department: "Human Resources",
                location: "Gurgaon HQ",
                workEmail: "abhinav.hr@fixlsolutions.com",
                personalEmail: "abhinav.singh@gmail.com",
                mobile: "+91 98110 54321",
                avatar: "https://i.pravatar.cc/150?u=abhinav1",
                joiningDate: "Jan 12, 2026",
                dob: "May 15, 1992",
                gender: "Male",
                bio: "Strategic HR Leader with over 10 years of experience in talent management, organizational development, and employee relations.",
                reportingTo: {
                    name: "Siddharth Malhotra",
                    role: "Chief People Officer",
                    avatar: "https://i.pravatar.cc/150?u=siddharth"
                },
                emergencyContact: {
                    name: "Anjali Singh",
                    relationship: "Spouse",
                    mobile: "+91 98110 54322"
                },
                workExperience: [
                    { company: "Global HR Tech Solutions", role: "Senior HR Manager", duration: "2022 - 2025" },
                    { company: "Talent Pro Services", role: "HR Operations Associate", duration: "2019 - 2022" },
                    { company: "Innovate Corp", role: "Junior Recruiter", duration: "2016 - 2019" }
                ]
            },
            bankDetails: {
                bankName: "HDFC Bank Ltd",
                accountNo: "XXXX XXXX 8921",
                ifsc: "HDFC0001234",
                pan: "ABCDE1234F"
            },
            attendance: {
                isCheckedIn: false,
                checkInTime: null,
                stats: {
                    avgArrival: "09:12 AM",
                    onTimeRate: "94%",
                    avgDailyHours: "8h 45m",
                    penalties: "01"
                },
                logs: [
                    { id: '1', date: "2026-01-19", checkIn: "09:12 AM", checkOut: "06:21 PM", duration: "9h 09m", status: "On-Time", totalHours: "9.1h" },
                    { id: '2', date: "2026-01-18", checkIn: "09:45 AM", checkOut: "07:05 PM", duration: "9h 20m", status: "Late", totalHours: "9.3h" },
                    { id: '3', date: "2026-01-17", checkIn: "09:05 AM", checkOut: "06:10 PM", duration: "9h 05m", status: "On-Time", totalHours: "9.0h" },
                ]
            },
            leave: {
                balances: [
                    { type: "Casual Leave", total: 12, consumed: 4, color: "#8F87F1", icon: "🎭" },
                    { type: "Sick Leave", total: 10, consumed: 2, color: "#C68EFD", icon: "🤒" },
                    { type: "Earned Leave", total: 15, consumed: 0, color: "#E9A5F1", icon: "⭐" },
                ],
                requests: [
                    { id: "LR-101", type: "Casual Leave", startDate: "2026-02-12", endDate: "2026-02-13", days: 2, reason: "Family function", status: "Approved", appliedOn: "2026-01-15" },
                ]
            },
            finances: {
                salary: {
                    takeHome: "₹ 82,450",
                    ytd: "₹ 10.42 L",
                    deductions: "₹ 15,550",
                    taxSaved: "₹ 4,200"
                },
                payslips: [
                    { id: 'p1', month: "December 2025", date: "Dec 31, 2025", net: "₹ 82,450" },
                    { id: 'p2', month: "November 2025", date: "Nov 30, 2025", net: "₹ 82,450" },
                ]
            },
            performance: {
                score: "4.8",
                activeGoals: 3,
                ratingDesc: "Exceeding Expectations (Top 5%)",
                reviewsDone: 85,
                praises: [
                    { from: "Sana Khan", msg: "Excellent work on the payroll automation flow!", time: "2 days ago", icon: "🔥" },
                    { from: "Rajesh Kumar", msg: "Great leadership during the engineering sprint.", time: "1 week ago", icon: "🌟" },
                ],
                goals: [
                    { id: "G-101", title: "Complete Advanced HR Analytics Certification", progress: 65, status: "On Track", priority: "High", category: "Technical", dueDate: "2026-03-31", weightage: 30 },
                    { id: "G-102", title: "Implement new Onboarding Workflow", progress: 40, status: "At Risk", priority: "Medium", category: "Operational", dueDate: "2026-02-15", weightage: 40 },
                    { id: "G-103", title: "Achieve 98% Payroll Accuracy", progress: 95, status: "Ahead", priority: "High", category: "Finance", dueDate: "2026-06-30", weightage: 30 },
                ]
            },
            assets: [
                { id: "ASST-0992", name: "Apple MacBook Pro M2", category: "Laptop", serial: "FVFHX21JQ059", assignedDate: "Jan 12, 2026" },
                { id: "ASST-0412", name: "Dell 27\" 4K Monitor", category: "Monitors", serial: "CN-0DFJ2-3310", assignedDate: "Jan 15, 2026" },
            ],
            holidays: [],
            documents: [
                { id: 'd1', name: "Offer_Letter_FXL_2026.pdf", cat: "Company", date: "Jan 12, 2026", size: "1.2 MB" },
                { id: 'd2', name: "Aadhar_Card_Verified.jpg", cat: "Personal", date: "Jan 13, 2026", size: "450 KB" },
            ],

            updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
            updateBankDetails: (data) => set((state) => ({ bankDetails: { ...state.bankDetails, ...data } })),
            loadMyAttendance: async () => {
                const response = await getMyAttendance();
                const records = response?.data?.data ?? [];

                const mappedLogs = records.map((doc: any) => {
                    const date = formatISODate(doc.date);
                    const firstIn = doc.firstIn ? formatTime(doc.firstIn) : "";
                    const lastOut = doc.lastOut ? formatTime(doc.lastOut) : "";
                    const workMinutes = Number(doc.workMinutes ?? 0);

                    let status: MeState["attendance"]["logs"][number]["status"] = "Absent";
                    if (doc.status === "Present") {
                        status = Number(doc.lateMinutes) > 0 ? "Late" : "On-Time";
                    } else if (doc.status === "HalfDay") {
                        status = "Half Day";
                    } else if (doc.status === "Absent") {
                        status = "Absent";
                    } else if (doc.status === "Leave" || doc.status === "Holiday" || doc.status === "Weekend") {
                        status = "Absent";
                    }

                    return {
                        id: String(doc._id ?? ""),
                        date,
                        checkIn: firstIn || "",
                        checkOut: lastOut || "",
                        duration: minutesToDuration(workMinutes),
                        status,
                        totalHours: minutesToHoursLabel(workMinutes),
                    };
                });

                const today = new Date().toISOString().split("T")[0];
                const todayLog = mappedLogs.find((l: typeof mappedLogs[number]) => l.date === today);
                const isCheckedIn = Boolean(todayLog?.checkIn) && !(todayLog?.checkOut);

                set((state) => ({
                    attendance: {
                        ...state.attendance,
                        isCheckedIn,
                        checkInTime: isCheckedIn ? todayLog?.checkIn ?? null : null,
                        logs: mappedLogs,
                    },
                }));
            },
            loadMyLeave: async () => {
                const [balanceRes, requestsRes] = await Promise.all([
                    getLeaveBalance(),
                    getMyLeaveRequests(),
                ]);

                const balances = balanceRes?.data?.data ?? [];
                const mappedBalances = balances.map((b: any) => ({
                    type: b?.leaveTypeId?.name ?? "Leave",
                    total: Number(b.totalAllocated ?? 0),
                    consumed: Number(b.used ?? 0),
                    color: "#E5E7EB",
                    icon: "",
                }));

                const requests = requestsRes?.data?.data ?? [];
                const mappedRequests = requests.map((r: any) => {
                    const start = r.startDate ? new Date(r.startDate) : null;
                    const end = r.endDate ? new Date(r.endDate) : null;
                    let days = 1;
                    if (start && end) {
                        days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    }
                    if (r.isHalfDay) days = 0.5;

                    return {
                        id: String(r._id ?? ""),
                        type: r.leaveType ?? "Leave",
                        startDate: r.startDate ? new Date(r.startDate).toISOString().split("T")[0] : "",
                        endDate: r.endDate ? new Date(r.endDate).toISOString().split("T")[0] : "",
                        days: Number(days),
                        reason: r.reason ?? "",
                        status: r.status ?? "Pending",
                        appliedOn: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "",
                    } as MeState["leave"]["requests"][number];
                });

                set((state) => ({
                    leave: {
                        ...state.leave,
                        balances: mappedBalances,
                        requests: mappedRequests,
                    },
                }));
            },
            checkIn: async () => {
                await punch({ punchType: "IN", source: "web" });
                await get().loadMyAttendance();
            },
            checkOut: async () => {
                await punch({ punchType: "OUT", source: "web" });
                await get().loadMyAttendance();
            },
            requestAttendanceRegularization: async ({ attendanceDate, requestedIn, requestedOut, reason }) => {
                const buildDate = (time?: string) => {
                    if (!time) return undefined;
                    const [hh, mm] = time.split(":");
                    if (!hh || !mm) return undefined;
                    const iso = `${attendanceDate}T${hh}:${mm}:00`;
                    const d = new Date(iso);
                    return Number.isNaN(d.getTime()) ? undefined : d;
                };

                const payload: Parameters<typeof requestRegularization>[0] = {
                    attendanceDate,
                    reason,
                    requestedIn: buildDate(requestedIn),
                    requestedOut: buildDate(requestedOut),
                };

                await requestRegularization(payload);
                await get().loadMyAttendance();
            },
            addLeaveRequest: async (req) => {
                // Map UI leave name → backend leaveTypeId
                const leaveTypesRes = await getActiveLeaveTypes();
                const leaveTypes = leaveTypesRes?.data?.data ?? [];
                const match = leaveTypes.find(
                    (t: any): t is { _id: string; name: string } => String(t?.name ?? "").toLowerCase() === String(req.type ?? "").toLowerCase()
                );

                if (!match?._id) {
                    throw new Error(`Leave type not found: ${req.type}`);
                }

                await createLeaveRequest({
                    leaveType: String(match._id),
                    startDate: req.startDate,
                    endDate: req.endDate,
                    isHalfDay: false,
                    reason: req.reason,
                });

                await get().loadMyLeave();
            },
            cancelLeaveRequest: async (id: string) => {
                // Backend supports approve/reject; "Cancelled" isn't a first-class state.
                await rejectLeaveRequest(id, "Cancelled by employee");
                await get().loadMyLeave();
            },
            addPersonalGoal: (goal) => set((state) => ({
                performance: {
                    ...state.performance,
                    goals: [{ ...goal, id: `G-${Math.floor(Math.random() * 1000)}` }, ...state.performance.goals],
                    activeGoals: state.performance.activeGoals + 1
                }
            })),
            updatePerformanceScore: (score, ratingDesc) => set((state) => ({
                performance: { ...state.performance, score, ratingDesc }
            })),

            // ===== PROFILE API INTEGRATION =====
            loadMyProfile: async () => {
                try {
                    const empId = get().user.empId;
                    if (!empId) return;
                    const res = await getEmployeeById(empId);
                    const emp = res?.data?.data ?? res?.data;
                    if (!emp) return;

                    set((state) => ({
                        user: {
                            ...state.user,
                            name: emp.name || emp.firstName ? `${emp.firstName || ''} ${emp.lastName || ''}`.trim() : state.user.name,
                            designation: emp.designation || emp.position || state.user.designation,
                            department: emp.department?.name || emp.department || state.user.department,
                            location: emp.location || emp.workLocation || state.user.location,
                            workEmail: emp.workEmail || emp.email || state.user.workEmail,
                            personalEmail: emp.personalEmail || state.user.personalEmail,
                            mobile: emp.mobile || emp.phone || state.user.mobile,
                            avatar: emp.avatar || emp.profileImage || state.user.avatar,
                            joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : state.user.joiningDate,
                            dob: emp.dob || emp.dateOfBirth || state.user.dob,
                            gender: emp.gender || state.user.gender,
                            bio: emp.bio || state.user.bio,
                        }
                    }));
                } catch (err) {
                    console.error("Failed to load profile:", err);
                }
            },

            updateMyProfile: async (data) => {
                try {
                    const empId = get().user.empId;
                    if (!empId) return;
                    await axios.patch(`/employees/update/${empId}`, data);
                    set((state) => ({ user: { ...state.user, ...data } }));
                } catch (err) {
                    console.error("Failed to update profile:", err);
                    throw err;
                }
            },

            // ===== PERFORMANCE GOALS API INTEGRATION =====
            loadMyGoals: async () => {
                try {
                    const empId = get().user.empId;
                    if (!empId) return;
                    const res = await getMyGoals(empId);
                    const goals = res?.data?.data ?? [];

                    const mappedGoals = goals.map((g: any) => ({
                        id: String(g._id ?? ""),
                        title: g.goal || g.title || "",
                        progress: Number(g.progress ?? 0),
                        status: g.status || "On Track",
                        priority: g.priority || "Medium",
                        category: g.category || "General",
                        dueDate: g.targetDate ? new Date(g.targetDate).toISOString().split("T")[0] : "",
                        weightage: Number(g.weightage ?? 0),
                    }));

                    set((state) => ({
                        performance: {
                            ...state.performance,
                            goals: mappedGoals,
                            activeGoals: mappedGoals.length,
                        }
                    }));
                } catch (err) {
                    console.error("Failed to load goals:", err);
                }
            },

            createMyGoal: async (data) => {
                try {
                    const empId = get().user.empId;
                    await createGoal({ employee: empId, ...data });
                    await get().loadMyGoals();
                } catch (err) {
                    console.error("Failed to create goal:", err);
                    throw err;
                }
            },

            updateMyGoal: async (goalId, data) => {
                try {
                    await updateGoal(goalId, data);
                    await get().loadMyGoals();
                } catch (err) {
                    console.error("Failed to update goal:", err);
                    throw err;
                }
            },

            deleteMyGoal: async (goalId) => {
                try {
                    await deleteGoal(goalId);
                    await get().loadMyGoals();
                } catch (err) {
                    console.error("Failed to delete goal:", err);
                    throw err;
                }
            },

            // ===== FEEDBACK API INTEGRATION =====
            loadMyFeedback: async () => {
                try {
                    const res = await getAllFeedback();
                    const feedbacks = res?.data?.data ?? [];
                    const empId = get().user.empId;

                    const myFeedbacks = feedbacks
                        .filter((f: any) => String(f.employee?._id || f.employee) === empId || true)
                        .slice(0, 10)
                        .map((f: any) => ({
                            from: f.givenBy?.name || f.givenBy || "Anonymous",
                            msg: f.comments || "",
                            time: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "",
                            icon: f.rating >= 4 ? "🌟" : f.rating >= 3 ? "👍" : "💬",
                        }));

                    if (myFeedbacks.length > 0) {
                        set((state) => ({
                            performance: {
                                ...state.performance,
                                praises: myFeedbacks,
                            }
                        }));
                    }
                } catch (err) {
                    console.error("Failed to load feedback:", err);
                }
            },

            // ===== APPRAISALS API INTEGRATION =====
            loadMyAppraisals: async () => {
                try {
                    const res = await getAllAppraisals();
                    const appraisals = res?.data?.data ?? [];

                    if (appraisals.length > 0) {
                        const latest = appraisals[0];
                        const score = latest.overallRating || latest.rating;
                        if (score) {
                            set((state) => ({
                                performance: {
                                    ...state.performance,
                                    score: String(score),
                                    ratingDesc: latest.ratingDescription || state.performance.ratingDesc,
                                    reviewsDone: latest.completionPercentage || state.performance.reviewsDone,
                                }
                            }));
                        }
                    }
                } catch (err) {
                    console.error("Failed to load appraisals:", err);
                }
            }
        }),
        {
            name: 'me-storage',
        }
    )
);


