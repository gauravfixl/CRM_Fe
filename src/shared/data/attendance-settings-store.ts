import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Shift {
    id: string;
    name: string;
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    workingHours: number;
    breakDuration: number; // minutes
    isActive: boolean;
    applicableDays: number[]; // 0-6 (Sunday-Saturday)
}

export interface AttendanceRule {
    id: string;
    name: string;
    type: 'Grace Period' | 'Late Mark' | 'Half Day' | 'Overtime' | 'Weekly Off';
    config: {
        gracePeriodMinutes?: number;
        lateMarkAfterMinutes?: number;
        halfDayThresholdHours?: number;
        overtimeMultiplier?: number; // e.g., 1.5x
        weeklyOffDays?: number[]; // 0-6
    };
    isActive: boolean;
}

export interface Holiday {
    id: string;
    name: string;
    date: string; // YYYY-MM-DD
    type: 'National' | 'Regional' | 'Optional';
    applicableLocations?: string[];
}

export interface EmployeeRoster {
    id: string;
    name: string;
    dept: string;
    currentShiftId: string;
}

interface AttendanceSettingsState {
    shifts: Shift[];
    rules: AttendanceRule[];
    holidays: Holiday[];
    roster: EmployeeRoster[];

    // Shift Management
    createShift: (shift: Omit<Shift, 'id'>) => void;
    updateShift: (id: string, updates: Partial<Shift>) => void;
    deleteShift: (id: string) => void;

    // Rule Management
    createRule: (rule: Omit<AttendanceRule, 'id'>) => void;
    updateRule: (id: string, updates: Partial<AttendanceRule>) => void;
    deleteRule: (id: string) => void;

    // Holiday Management
    addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
    removeHoliday: (id: string) => void;

    // Roster Management
    updateRoster: (empId: string, shiftId: string) => void;
    bulkAssignRoster: (empIds: string[], shiftId: string) => void;
}

// Initial Data
const INITIAL_SHIFTS: Shift[] = [
    {
        id: 'shift-1',
        name: 'General Shift',
        startTime: '09:30',
        endTime: '18:30',
        workingHours: 9,
        breakDuration: 60,
        isActive: true,
        applicableDays: [1, 2, 3, 4, 5] // Mon-Fri
    },
    {
        id: 'shift-2',
        name: 'Morning Shift',
        startTime: '06:00',
        endTime: '14:00',
        workingHours: 8,
        breakDuration: 30,
        isActive: true,
        applicableDays: [1, 2, 3, 4, 5, 6]
    },
    {
        id: 'shift-3',
        name: 'Night Shift',
        startTime: '22:00',
        endTime: '06:00',
        workingHours: 8,
        breakDuration: 30,
        isActive: true,
        applicableDays: [0, 1, 2, 3, 4, 5, 6]
    }
];

const INITIAL_RULES: AttendanceRule[] = [
    {
        id: 'rule-1',
        name: 'Grace Period',
        type: 'Grace Period',
        config: { gracePeriodMinutes: 15 },
        isActive: true
    },
    {
        id: 'rule-2',
        name: 'Late Mark After 30 Min',
        type: 'Late Mark',
        config: { lateMarkAfterMinutes: 30 },
        isActive: true
    },
    {
        id: 'rule-3',
        name: 'Half Day (< 4 Hours)',
        type: 'Half Day',
        config: { halfDayThresholdHours: 4 },
        isActive: true
    },
    {
        id: 'rule-4',
        name: 'Overtime 1.5x Pay',
        type: 'Overtime',
        config: { overtimeMultiplier: 1.5 },
        isActive: true
    },
    {
        id: 'rule-5',
        name: 'Weekend (Sat-Sun)',
        type: 'Weekly Off',
        config: { weeklyOffDays: [0, 6] },
        isActive: true
    }
];

const INITIAL_HOLIDAYS: Holiday[] = [
    { id: 'h1', name: 'Republic Day', date: '2026-01-26', type: 'National' },
    { id: 'h2', name: 'Holi', date: '2026-03-14', type: 'National' },
    { id: 'h3', name: 'Independence Day', date: '2026-08-15', type: 'National' },
    { id: 'h4', name: 'Gandhi Jayanti', date: '2026-10-02', type: 'National' },
    { id: 'h5', name: 'Diwali', date: '2026-10-24', type: 'National' }
];

const INITIAL_ROSTER: EmployeeRoster[] = [
    { id: "E001", name: "Aditya Singh", dept: "Engineering", currentShiftId: "shift-1" },
    { id: "E002", name: "Priya Sharma", dept: "Product", currentShiftId: "shift-3" },
    { id: "E003", name: "Rahul Verma", dept: "Design", currentShiftId: "shift-1" },
    { id: "E004", name: "Sneha Patel", dept: "Marketing", currentShiftId: "shift-2" },
];

export const useAttendanceSettingsStore = create<AttendanceSettingsState>()(
    persist(
        (set) => ({
            shifts: INITIAL_SHIFTS,
            rules: INITIAL_RULES,
            holidays: INITIAL_HOLIDAYS,
            roster: INITIAL_ROSTER,

            createShift: (shiftData) => set((state) => ({
                shifts: [...state.shifts, { ...shiftData, id: `shift-${Date.now()}` }]
            })),

            updateShift: (id, updates) => set((state) => ({
                shifts: state.shifts.map(s => s.id === id ? { ...s, ...updates } : s)
            })),

            deleteShift: (id) => set((state) => ({
                shifts: state.shifts.filter(s => s.id !== id)
            })),

            createRule: (ruleData) => set((state) => ({
                rules: [...state.rules, { ...ruleData, id: `rule-${Date.now()}` }]
            })),

            updateRule: (id, updates) => set((state) => ({
                rules: state.rules.map(r => r.id === id ? { ...r, ...updates } : r)
            })),

            deleteRule: (id) => set((state) => ({
                rules: state.rules.filter(r => r.id !== id)
            })),

            addHoliday: (holidayData) => set((state) => ({
                holidays: [...state.holidays, { ...holidayData, id: `h-${Date.now()}` }]
            })),

            removeHoliday: (id) => set((state) => ({
                holidays: state.holidays.filter(h => h.id !== id)
            })),

            updateRoster: (empId, shiftId) => set((state) => ({
                roster: state.roster.map(r => r.id === empId ? { ...r, currentShiftId: shiftId } : r)
            })),

            bulkAssignRoster: (empIds, shiftId) => set((state) => ({
                roster: state.roster.map(r => empIds.includes(r.id) ? { ...r, currentShiftId: shiftId } : r)
            }))
        }),
        { name: 'attendance-settings-storage-v2' }
    )
);
