import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    checkIn: () => void;
    checkOut: () => void;
    addLeaveRequest: (request: Omit<MeState['leave']['requests'][0], 'id' | 'appliedOn' | 'status'>) => void;
    cancelLeaveRequest: (id: string) => void;
    addPersonalGoal: (goal: Omit<MeState['performance']['goals'][0], 'id'>) => void;
    updatePerformanceScore: (score: string, ratingDesc: string) => void;
}

export const useMeStore = create<MeState>()(
    persist(
        (set) => ({
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
            documents: [
                { id: 'd1', name: "Offer_Letter_FXL_2026.pdf", cat: "Company", date: "Jan 12, 2026", size: "1.2 MB" },
                { id: 'd2', name: "Aadhar_Card_Verified.jpg", cat: "Personal", date: "Jan 13, 2026", size: "450 KB" },
            ],

            updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
            updateBankDetails: (data) => set((state) => ({ bankDetails: { ...state.bankDetails, ...data } })),
            checkIn: () => set((state) => {
                const now = new Date();
                const checkInTime = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
                const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format

                // Check if there's already a log for today
                const existingLogIndex = state.attendance.logs.findIndex(log => log.date === todayDate);

                let updatedLogs = [...state.attendance.logs];

                if (existingLogIndex >= 0) {
                    // Update existing log
                    updatedLogs[existingLogIndex] = {
                        ...updatedLogs[existingLogIndex],
                        checkIn: checkInTime,
                    };
                } else {
                    // Create new log for today
                    const newLog = {
                        id: `log-${Date.now()}`,
                        date: todayDate,
                        checkIn: checkInTime,
                        checkOut: '',
                        duration: '',
                        status: 'Present' as const,
                        totalHours: ''
                    };
                    updatedLogs = [newLog, ...updatedLogs];
                }

                return {
                    attendance: {
                        ...state.attendance,
                        isCheckedIn: true,
                        checkInTime: checkInTime,
                        logs: updatedLogs
                    }
                };
            }),
            checkOut: () => set((state) => {
                const now = new Date();
                const checkOutTime = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
                const todayDate = now.toISOString().split('T')[0];

                // Find today's log
                const todayLogIndex = state.attendance.logs.findIndex(log => log.date === todayDate);

                if (todayLogIndex >= 0 && state.attendance.checkInTime) {
                    const todayLog = state.attendance.logs[todayLogIndex];

                    // Calculate duration
                    const checkInParts = state.attendance.checkInTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    const checkOutParts = checkOutTime.match(/(\d+):(\d+)\s*(AM|PM)/i);

                    if (checkInParts && checkOutParts) {
                        let checkInHour = parseInt(checkInParts[1]);
                        const checkInMin = parseInt(checkInParts[2]);
                        const checkInPeriod = checkInParts[3].toUpperCase();

                        let checkOutHour = parseInt(checkOutParts[1]);
                        const checkOutMin = parseInt(checkOutParts[2]);
                        const checkOutPeriod = checkOutParts[3].toUpperCase();

                        // Convert to 24-hour format
                        if (checkInPeriod === 'PM' && checkInHour !== 12) checkInHour += 12;
                        if (checkInPeriod === 'AM' && checkInHour === 12) checkInHour = 0;
                        if (checkOutPeriod === 'PM' && checkOutHour !== 12) checkOutHour += 12;
                        if (checkOutPeriod === 'AM' && checkOutHour === 12) checkOutHour = 0;

                        const checkInDate = new Date(now);
                        checkInDate.setHours(checkInHour, checkInMin, 0);

                        const checkOutDate = new Date(now);
                        checkOutDate.setHours(checkOutHour, checkOutMin, 0);

                        const diffMs = checkOutDate.getTime() - checkInDate.getTime();
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                        const duration = `${diffHours}h ${diffMins}m`;
                        const totalHours = `${(diffHours + diffMins / 60).toFixed(1)}h`;

                        // Determine status based on check-in time
                        let status: 'On-Time' | 'Late' | 'Present' = 'On-Time';
                        if (checkInHour > 9 || (checkInHour === 9 && checkInMin > 15)) {
                            status = 'Late';
                        }

                        const updatedLogs = [...state.attendance.logs];
                        updatedLogs[todayLogIndex] = {
                            ...todayLog,
                            checkOut: checkOutTime,
                            duration,
                            totalHours,
                            status
                        };

                        return {
                            attendance: {
                                ...state.attendance,
                                isCheckedIn: false,
                                checkInTime: null,
                                logs: updatedLogs
                            }
                        };
                    }
                }

                return {
                    attendance: {
                        ...state.attendance,
                        isCheckedIn: false,
                        checkInTime: null
                    }
                };
            }),
            addLeaveRequest: (req) => set((state) => ({
                leave: {
                    ...state.leave,
                    requests: [
                        { ...req, id: `LR-${Math.floor(Math.random() * 1000)}`, appliedOn: new Date().toISOString().split('T')[0], status: 'Pending' },
                        ...state.leave.requests
                    ]
                }
            })),
            cancelLeaveRequest: (id) => set((state) => ({
                leave: {
                    ...state.leave,
                    requests: state.leave.requests.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r)
                }
            })),
            addPersonalGoal: (goal) => set((state) => ({
                performance: {
                    ...state.performance,
                    goals: [{ ...goal, id: `G-${Math.floor(Math.random() * 1000)}` }, ...state.performance.goals],
                    activeGoals: state.performance.activeGoals + 1
                }
            })),
            updatePerformanceScore: (score, ratingDesc) => set((state) => ({
                performance: { ...state.performance, score, ratingDesc }
            }))
        }),
        {
            name: 'me-storage',
        }
    )
);


