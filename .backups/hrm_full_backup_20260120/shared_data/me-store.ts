export const ME_DATA = {
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
        bio: "Strategic HR Leader with over 10 years of experience in talent management, organizational development, and employee relations. Passionate about leveraging technology to streamline HR operations and building a high-performance culture.",
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
            { company: "Global Talent Corp", role: "Assistant Manager HR", duration: "2023 - 2025" },
            { company: "Prime Solutions", role: "HR Generalist", duration: "2020 - 2023" }
        ]
    },
    attendance: {
        stats: {
            avgArrival: "09:12 AM",
            onTimeRate: "94%",
            avgDailyHours: "8h 45m",
            penalties: "01"
        },
        recentLogs: [
            { date: "Jan 19, 2026", checkIn: "09:12 AM", checkOut: "06:21 PM", duration: "9h 09m", status: "On-Time" },
            { date: "Jan 18, 2026", checkIn: "09:45 AM", checkOut: "07:05 PM", duration: "9h 20m", status: "Late" },
            { date: "Jan 17, 2026", checkIn: "09:05 AM", checkOut: "06:10 PM", duration: "9h 05m", status: "On-Time" },
        ]
    },
    leave: {
        balances: [
            { type: "Casual Leave", total: 12, consumed: 4, color: "bg-indigo-500", icon: "🎭" },
            { type: "Sick Leave", total: 10, consumed: 2, color: "bg-rose-500", icon: "🤒" },
            { type: "Earned Leave", total: 15, consumed: 0, color: "bg-emerald-500", icon: "⭐" },
        ],
        pastRequests: [
            { id: "LR-101", type: "Casual Leave", start: "Feb 12, 2026", end: "Feb 13, 2026", days: 2, status: "Approved" },
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
            { month: "December 2025", date: "Dec 31, 2025", net: "₹ 82,450" },
            { month: "November 2025", date: "Nov 30, 2025", net: "₹ 82,450" },
        ]
    },
    performance: {
        score: "4.8",
        activeGoals: 3,
        praises: [
            { from: "Sana Khan", msg: "Excellent work on the payroll automation flow!", time: "2 days ago", icon: "🔥" },
            { from: "Rajesh Kumar", msg: "Great leadership during the engineering sprint.", time: "1 week ago", icon: "🌟" },
        ]
    },
    assets: [
        { id: "ASST-0992", name: "Apple MacBook Pro M2", category: "Laptop", serial: "FVFHX21JQ059" },
        { id: "ASST-0412", name: "Dell 27\" 4K Monitor", category: "Monitors", serial: "CN-0DFJ2-3310" },
    ],
    documents: [
        { name: "Offer_Letter_FXL_2026.pdf", cat: "Company", date: "Jan 12, 2026" },
        { name: "Aadhar_Card_Verified.jpg", cat: "Personal", date: "Jan 13, 2026" },
    ]
};
