import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamMember {
    id: string;
    name: string;
    avatar: string;
    designation: string;
    department: string;
    email: string;
    phone: string;
    joiningDate: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    reportingTo: string;
}

export interface TeamAttendance {
    empId: string;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    status: 'Present' | 'Absent' | 'Half Day' | 'On Leave';
    totalHours: string;
}

export interface TeamLeave {
    id: string;
    empId: string;
    empName: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

interface TeamState {
    members: TeamMember[];
    attendance: TeamAttendance[];
    leaves: TeamLeave[];

    addMember: (member: Omit<TeamMember, 'id'>) => void;
    updateMember: (id: string, updates: Partial<TeamMember>) => void;
    removeMember: (id: string) => void;
}

const MOCK_TEAM_MEMBERS: TeamMember[] = [
    {
        id: 'EMP002',
        name: 'Aditya Singh',
        avatar: 'AS',
        designation: 'Senior Developer',
        department: 'Engineering',
        email: 'aditya.singh@company.com',
        phone: '+91 98765 43210',
        joiningDate: '2023-06-15',
        status: 'Active',
        reportingTo: 'Drashi Garg'
    },
    {
        id: 'EMP003',
        name: 'Rohan Gupta',
        avatar: 'RG',
        designation: 'Sales Executive',
        department: 'Sales',
        email: 'rohan.gupta@company.com',
        phone: '+91 98765 43211',
        joiningDate: '2024-01-10',
        status: 'Active',
        reportingTo: 'Drashi Garg'
    },
    {
        id: 'EMP004',
        name: 'Sneha Kapoor',
        avatar: 'SK',
        designation: 'HR Executive',
        department: 'HR',
        email: 'sneha.kapoor@company.com',
        phone: '+91 98765 43212',
        joiningDate: '2023-11-20',
        status: 'On Leave',
        reportingTo: 'Drashi Garg'
    },
    {
        id: 'EMP005',
        name: 'Vikram M',
        avatar: 'VM',
        designation: 'Product Manager',
        department: 'Product',
        email: 'vikram.m@company.com',
        phone: '+91 98765 43213',
        joiningDate: '2022-08-05',
        status: 'Active',
        reportingTo: 'Drashi Garg'
    },
    {
        id: 'EMP006',
        name: 'Priya Sharma',
        avatar: 'PS',
        designation: 'UI/UX Designer',
        department: 'Design',
        email: 'priya.sharma@company.com',
        phone: '+91 98765 43214',
        joiningDate: '2024-03-12',
        status: 'Active',
        reportingTo: 'Drashi Garg'
    }
];

const MOCK_TEAM_ATTENDANCE: TeamAttendance[] = [
    { empId: 'EMP002', date: '2026-01-19', checkIn: '09:15', checkOut: '18:30', status: 'Present', totalHours: '9.25h' },
    { empId: 'EMP003', date: '2026-01-19', checkIn: '09:45', checkOut: null, status: 'Present', totalHours: '0h' },
    { empId: 'EMP004', date: '2026-01-19', checkIn: null, checkOut: null, status: 'On Leave', totalHours: '0h' },
    { empId: 'EMP005', date: '2026-01-19', checkIn: '09:00', checkOut: '18:00', status: 'Present', totalHours: '9h' },
    { empId: 'EMP006', date: '2026-01-19', checkIn: '10:30', checkOut: null, status: 'Present', totalHours: '0h' },
];

const MOCK_TEAM_LEAVES: TeamLeave[] = [
    {
        id: 'TL1',
        empId: 'EMP002',
        empName: 'Aditya Singh',
        type: 'Casual Leave',
        startDate: '2026-01-25',
        endDate: '2026-01-27',
        days: 3,
        reason: 'Family function',
        status: 'Pending'
    },
    {
        id: 'TL2',
        empId: 'EMP004',
        empName: 'Sneha Kapoor',
        type: 'Sick Leave',
        startDate: '2026-01-18',
        endDate: '2026-01-19',
        days: 2,
        reason: 'Fever',
        status: 'Approved'
    }
];

export const useTeamStore = create<TeamState>()(
    persist(
        (set) => ({
            members: MOCK_TEAM_MEMBERS,
            attendance: MOCK_TEAM_ATTENDANCE,
            leaves: MOCK_TEAM_LEAVES,

            addMember: (memberData) => set((state) => ({
                members: [...state.members, { ...memberData, id: `EMP${Date.now()}` }]
            })),

            updateMember: (id, updates) => set((state) => ({
                members: state.members.map(m => m.id === id ? { ...m, ...updates } : m)
            })),

            removeMember: (id) => set((state) => ({
                members: state.members.filter(m => m.id !== id)
            }))
        }),
        { name: 'team-storage' }
    )
);
