import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---
export interface SavedReport {
  id: string;
  name: string;
  type: 'HR' | 'Payroll' | 'Attendance' | 'Leave' | 'Performance' | 'Recruitment' | 'Custom';
  filters: ReportFilter[];
  columns: string[];
  lastRun: string;
  schedule: 'none' | 'daily' | 'weekly' | 'monthly';
  createdBy: string;
  createdDate: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  category: 'HR Analytics' | 'Payroll MIS' | 'Attendance' | 'Leave' | 'Performance' | 'Compliance' | 'Recruitment' | 'Expense';
  description: string;
  columns: string[];
  defaultFilters: ReportFilter[];
  popularity: number;
  isFavorite: boolean;
}

export interface ScheduledReport {
  id: string;
  reportId: string;
  reportName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  nextRun: string;
  lastSent: string;
  format: 'PDF' | 'Excel' | 'CSV';
  status: 'Active' | 'Paused';
  day?: string;
  time?: string;
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string;
  value2?: string;
}

export interface ReportRun {
  id: string;
  reportName: string;
  type: string;
  ranBy: string;
  ranDate: string;
  rowCount: number;
  format: string;
}

export interface ScheduleHistory {
  id: string;
  scheduleId: string;
  reportName: string;
  sentDate: string;
  recipients: string[];
  status: 'Sent' | 'Failed' | 'Partial';
  format: string;
}

// --- Mock Data ---
const mockTemplates: ReportTemplate[] = [
  {
    id: 'T001', name: 'Headcount Report', category: 'HR Analytics',
    description: 'Current headcount by department, location, and employment type with trend analysis.',
    columns: ['Employee ID', 'Name', 'Department', 'Location', 'Type', 'Join Date', 'Status'],
    defaultFilters: [], popularity: 95, isFavorite: true,
  },
  {
    id: 'T002', name: 'Attrition Analysis', category: 'HR Analytics',
    description: 'Monthly attrition rates, exit reasons, and department-wise breakdown.',
    columns: ['Employee ID', 'Name', 'Department', 'Exit Date', 'Reason', 'Tenure', 'Manager'],
    defaultFilters: [], popularity: 88, isFavorite: false,
  },
  {
    id: 'T003', name: 'Payroll Cost Summary', category: 'Payroll MIS',
    description: 'Total payroll cost breakdown by component, department, and location.',
    columns: ['Department', 'Basic', 'HRA', 'DA', 'Bonus', 'Deductions', 'Net Pay', 'CTC'],
    defaultFilters: [], popularity: 92, isFavorite: true,
  },
  {
    id: 'T004', name: 'Attendance Summary', category: 'Attendance',
    description: 'Daily attendance rate, late arrivals, and absenteeism across the organization.',
    columns: ['Employee ID', 'Name', 'Department', 'Present Days', 'Absent Days', 'Late Days', 'Avg Hours'],
    defaultFilters: [], popularity: 85, isFavorite: false,
  },
  {
    id: 'T005', name: 'Leave Balance Report', category: 'Leave',
    description: 'Leave balances, utilization rates, and upcoming leave for all employees.',
    columns: ['Employee ID', 'Name', 'Department', 'Earned Leave', 'Sick Leave', 'Casual Leave', 'Used', 'Balance'],
    defaultFilters: [], popularity: 78, isFavorite: false,
  },
  {
    id: 'T006', name: 'Performance Rating Distribution', category: 'Performance',
    description: 'Performance ratings distribution by department, bell curve analysis.',
    columns: ['Employee ID', 'Name', 'Department', 'Rating', 'Manager Rating', 'Self Rating', 'Goals Met %'],
    defaultFilters: [], popularity: 82, isFavorite: true,
  },
  {
    id: 'T007', name: 'Statutory Compliance', category: 'Compliance',
    description: 'PF, ESI, PT, and TDS compliance status for all employees.',
    columns: ['Employee ID', 'Name', 'PF Number', 'ESI Number', 'PF Status', 'ESI Status', 'PT Status'],
    defaultFilters: [], popularity: 70, isFavorite: false,
  },
  {
    id: 'T008', name: 'Recruitment Funnel', category: 'Recruitment',
    description: 'Hiring funnel metrics: applications, screening, interviews, offers, and joins.',
    columns: ['Job Title', 'Department', 'Applications', 'Screened', 'Interviewed', 'Offered', 'Joined', 'Time to Hire'],
    defaultFilters: [], popularity: 80, isFavorite: false,
  },
  {
    id: 'T009', name: 'Expense Reimbursement', category: 'Expense',
    description: 'Expense claims by category, department, and approval status.',
    columns: ['Employee ID', 'Name', 'Category', 'Amount', 'Status', 'Submitted Date', 'Approved Date'],
    defaultFilters: [], popularity: 65, isFavorite: false,
  },
  {
    id: 'T010', name: 'Overtime Analysis', category: 'Attendance',
    description: 'Overtime hours, cost impact, and department-wise trends.',
    columns: ['Employee ID', 'Name', 'Department', 'Regular Hours', 'OT Hours', 'OT Rate', 'OT Cost'],
    defaultFilters: [], popularity: 60, isFavorite: false,
  },
];

const mockSavedReports: SavedReport[] = [
  {
    id: 'SR001', name: 'Q1 Headcount Analysis', type: 'HR',
    filters: [{ field: 'Quarter', operator: 'equals', value: 'Q1 2026' }],
    columns: ['Employee ID', 'Name', 'Department', 'Location', 'Status'],
    lastRun: '2026-03-28', schedule: 'monthly', createdBy: 'Admin', createdDate: '2026-01-05',
  },
  {
    id: 'SR002', name: 'March Payroll Audit', type: 'Payroll',
    filters: [{ field: 'Month', operator: 'equals', value: 'March 2026' }],
    columns: ['Employee ID', 'Name', 'Basic', 'HRA', 'Deductions', 'Net Pay'],
    lastRun: '2026-03-31', schedule: 'none', createdBy: 'HR Manager', createdDate: '2026-03-15',
  },
  {
    id: 'SR003', name: 'Engineering Leave Tracker', type: 'Leave',
    filters: [{ field: 'Department', operator: 'equals', value: 'Engineering' }],
    columns: ['Employee ID', 'Name', 'Leave Type', 'From', 'To', 'Status'],
    lastRun: '2026-03-25', schedule: 'weekly', createdBy: 'Team Lead', createdDate: '2026-02-10',
  },
];

const mockScheduledReports: ScheduledReport[] = [
  {
    id: 'SCH001', reportId: 'SR001', reportName: 'Q1 Headcount Analysis',
    frequency: 'monthly', recipients: ['hr@company.com', 'ceo@company.com'],
    nextRun: '2026-04-05', lastSent: '2026-03-05', format: 'PDF', status: 'Active', day: '5', time: '09:00',
  },
  {
    id: 'SCH002', reportId: 'SR003', reportName: 'Engineering Leave Tracker',
    frequency: 'weekly', recipients: ['eng-lead@company.com'],
    nextRun: '2026-04-07', lastSent: '2026-03-31', format: 'Excel', status: 'Active', day: 'Monday', time: '08:00',
  },
];

const mockRecentRuns: ReportRun[] = [
  { id: 'RR001', reportName: 'Headcount Report', type: 'HR', ranBy: 'Admin', ranDate: '2026-04-01', rowCount: 245, format: 'PDF' },
  { id: 'RR002', reportName: 'March Payroll Audit', type: 'Payroll', ranBy: 'HR Manager', ranDate: '2026-03-31', rowCount: 230, format: 'Excel' },
  { id: 'RR003', reportName: 'Attendance Summary', type: 'Attendance', ranBy: 'Admin', ranDate: '2026-03-30', rowCount: 245, format: 'CSV' },
  { id: 'RR004', reportName: 'Leave Balance Report', type: 'Leave', ranBy: 'HR Manager', ranDate: '2026-03-29', rowCount: 245, format: 'PDF' },
  { id: 'RR005', reportName: 'Performance Rating Distribution', type: 'Performance', ranBy: 'Admin', ranDate: '2026-03-28', rowCount: 200, format: 'Excel' },
];

const mockScheduleHistory: ScheduleHistory[] = [
  { id: 'SH001', scheduleId: 'SCH001', reportName: 'Q1 Headcount Analysis', sentDate: '2026-03-05', recipients: ['hr@company.com', 'ceo@company.com'], status: 'Sent', format: 'PDF' },
  { id: 'SH002', scheduleId: 'SCH002', reportName: 'Engineering Leave Tracker', sentDate: '2026-03-31', recipients: ['eng-lead@company.com'], status: 'Sent', format: 'Excel' },
  { id: 'SH003', scheduleId: 'SCH001', reportName: 'Q1 Headcount Analysis', sentDate: '2026-02-05', recipients: ['hr@company.com', 'ceo@company.com'], status: 'Sent', format: 'PDF' },
  { id: 'SH004', scheduleId: 'SCH002', reportName: 'Engineering Leave Tracker', sentDate: '2026-03-24', recipients: ['eng-lead@company.com'], status: 'Failed', format: 'Excel' },
];

// --- Store ---
interface ReportsState {
  templates: ReportTemplate[];
  savedReports: SavedReport[];
  scheduledReports: ScheduledReport[];
  recentRuns: ReportRun[];
  scheduleHistory: ScheduleHistory[];

  toggleFavorite: (templateId: string) => void;
  addSavedReport: (report: SavedReport) => void;
  deleteSavedReport: (id: string) => void;
  addScheduledReport: (schedule: ScheduledReport) => void;
  updateScheduledReport: (id: string, updates: Partial<ScheduledReport>) => void;
  deleteScheduledReport: (id: string) => void;
  addReportRun: (run: ReportRun) => void;
  addScheduleHistory: (entry: ScheduleHistory) => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      templates: mockTemplates,
      savedReports: mockSavedReports,
      scheduledReports: mockScheduledReports,
      recentRuns: mockRecentRuns,
      scheduleHistory: mockScheduleHistory,

      toggleFavorite: (templateId) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
          ),
        })),

      addSavedReport: (report) =>
        set((state) => ({ savedReports: [report, ...state.savedReports] })),

      deleteSavedReport: (id) =>
        set((state) => ({ savedReports: state.savedReports.filter((r) => r.id !== id) })),

      addScheduledReport: (schedule) =>
        set((state) => ({ scheduledReports: [schedule, ...state.scheduledReports] })),

      updateScheduledReport: (id, updates) =>
        set((state) => ({
          scheduledReports: state.scheduledReports.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteScheduledReport: (id) =>
        set((state) => ({ scheduledReports: state.scheduledReports.filter((s) => s.id !== id) })),

      addReportRun: (run) =>
        set((state) => ({ recentRuns: [run, ...state.recentRuns].slice(0, 20) })),

      addScheduleHistory: (entry) =>
        set((state) => ({ scheduleHistory: [entry, ...state.scheduleHistory] })),
    }),
    { name: 'reports-store' }
  )
);
