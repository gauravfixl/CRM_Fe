import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Goal {
    id: string;
    title: string;
    progress: number;
    status: "Draft" | "Awaiting Approval" | "On Track" | "Ahead" | "At Risk" | "Behind" | "Completed";
    dueDate: string;
    description?: string;
    priority: "Low" | "Medium" | "High";
    category: "Technical" | "Soft Skills" | "Leadership" | "Sales" | "Operations";
    alignment: "Company" | "Department" | "Individual";
    weightage: number; // 0-100%
    parentGoalId?: string; // For Org -> Team -> Individual alignment
}

export interface CompetencyRating {
    name: string;
    rating: number; // 1-5
    feedback?: string;
}

export interface Appraisal {
    id: string;
    employeeName: string;
    employeeId: string;
    employeeAvatar: string;
    cycle: string;
    status: "Draft" | "Self Review" | "Manager Review" | "HR Review" | "Calibration" | "Completed";
    overallRating?: number;
    competencies: CompetencyRating[];
    selfNotes?: string;
    managerNotes?: string;
    hrNotes?: string;
    proposedIncrement?: string; // Percentage or amount
    proposedPromotion?: string; // New role title
    lastUpdated: string;
}

export interface Review {
    id: string;
    reviewerName: string;
    reviewerAvatar: string;
    revieweeName: string;
    revieweeId: string;
    type: "Peer" | "Manager" | "Direct Report" | "1-on-1";
    status: "Pending" | "Completed";
    dueDate: string;
    submittedAt?: string;
    notes?: string;
    actionItems?: string[];
}

export interface Feedback {
    id: string;
    from: { name: string, avatar: string, role: string };
    to: { name: string, avatar: string };
    message: string;
    category: "Appreciation" | "Improvement" | "General";
    timestamp: string;
    isPublic: boolean;
    isAnonymous: boolean;
    moderationStatus: "Pending" | "Approved" | "Hidden";
}

interface PerformanceState {
    goals: Goal[];
    appraisals: Appraisal[];
    reviews: Review[];
    feedbacks: Feedback[];

    // Goal Actions
    addGoal: (goal: Omit<Goal, 'id'>) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;
    approveGoal: (id: string) => void;

    // Appraisal Actions
    addAppraisal: (appraisal: Omit<Appraisal, 'id' | 'status' | 'lastUpdated' | 'competencies'>) => void;
    updateAppraisal: (id: string, updates: Partial<Appraisal>) => void;

    // Review Actions
    addReview: (review: Omit<Review, 'id' | 'status'>) => void;
    updateReview: (id: string, updates: Partial<Review>) => void;

    // Feedback Actions
    addFeedback: (feedback: Omit<Feedback, 'id' | 'timestamp' | 'moderationStatus'>) => void;
    moderateFeedback: (id: string, status: Feedback['moderationStatus']) => void;
}

export const usePerformanceStore = create<PerformanceState>()(
    persist(
        (set) => ({
            goals: [
                { id: "G-001", title: "Scale CI/CD pipeline efficiency", progress: 75, status: "On Track", dueDate: "2026-03-31", priority: "High", category: "Technical", alignment: "Department", weightage: 40 },
                { id: "G-002", title: "Conduct 5 Leadership Workshops", progress: 45, status: "At Risk", dueDate: "2026-02-28", priority: "Medium", category: "Leadership", alignment: "Individual", weightage: 30 },
                { id: "G-003", title: "Achieve 95% CSAT Score", progress: 90, status: "Ahead", dueDate: "2026-04-15", priority: "High", category: "Operations", alignment: "Company", weightage: 30 }
            ],
            appraisals: [
                {
                    id: "APR-001",
                    employeeName: "Arjun Mehta",
                    employeeId: "EMP201",
                    employeeAvatar: "AM",
                    cycle: "Annual Appraisal 2025",
                    status: "Manager Review",
                    overallRating: 4.2,
                    lastUpdated: "2026-01-15",
                    competencies: [
                        { name: "Technical Depth", rating: 4, feedback: "Strong understanding of cloud architecture." },
                        { name: "Communication", rating: 3, feedback: "Needs improvement in stakeholder reporting." }
                    ],
                    proposedIncrement: "10%",
                    proposedPromotion: "Senior Engineer"
                },
                {
                    id: "APR-002",
                    employeeName: "Priya Sharma",
                    employeeId: "EMP205",
                    employeeAvatar: "PS",
                    cycle: "Q1 2026 Review",
                    status: "Self Review",
                    lastUpdated: "2026-01-20",
                    competencies: [
                        { name: "Execution", rating: 5 },
                        { name: "Teamwork", rating: 4 }
                    ]
                }
            ],
            reviews: [
                { id: "REV-001", reviewerName: "Rajesh Kumar", reviewerAvatar: "RK", revieweeName: "Arjun Mehta", revieweeId: "EMP201", type: "Peer", status: "Pending", dueDate: "2026-01-30" },
                { id: "REV-002", reviewerName: "Amit Patel", reviewerAvatar: "AP", revieweeName: "Arjun Mehta", revieweeId: "EMP201", type: "1-on-1", status: "Completed", dueDate: "2026-01-22", notes: "Discussed career path and training needs." }
            ],
            feedbacks: [
                {
                    id: "FB-001",
                    from: { name: "Sarah Connor", avatar: "SC", role: "Product Manager" },
                    to: { name: "Arjun Mehta", avatar: "AM" },
                    message: "The new dashboard interface you designed is incredible! Our users find it much more intuitive.",
                    category: "Appreciation",
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    isPublic: true,
                    isAnonymous: false,
                    moderationStatus: "Approved"
                }
            ],

            addGoal: (goal) => set((state) => ({
                goals: [
                    { ...goal, id: `G-${String(state.goals.length + 1).padStart(3, '0')}` },
                    ...state.goals
                ]
            })),
            updateGoal: (id, updates) => set((state) => ({
                goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
            })),
            deleteGoal: (id) => set((state) => ({
                goals: state.goals.filter(g => g.id !== id)
            })),
            approveGoal: (id) => set((state) => ({
                goals: state.goals.map(g => g.id === id ? { ...g, status: "On Track" } : g)
            })),

            addAppraisal: (appraisal) => set((state) => ({
                appraisals: [
                    {
                        ...appraisal,
                        id: `APR-${String(state.appraisals.length + 1).padStart(3, '0')}`,
                        status: "Draft",
                        lastUpdated: new Date().toISOString().split('T')[0],
                        competencies: []
                    },
                    ...state.appraisals
                ]
            })),
            updateAppraisal: (id, updates) => set((state) => ({
                appraisals: state.appraisals.map(a => a.id === id ? { ...a, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : a)
            })),

            addReview: (review) => set((state) => ({
                reviews: [
                    {
                        ...review,
                        id: `REV-${String(state.reviews.length + 1).padStart(3, '0')}`,
                        status: "Pending"
                    },
                    ...state.reviews
                ]
            })),
            updateReview: (id, updates) => set((state) => ({
                reviews: state.reviews.map(r => r.id === id ? { ...r, ...updates } : r)
            })),

            addFeedback: (feedback) => set((state) => ({
                feedbacks: [
                    {
                        ...feedback,
                        id: `FB-${String(state.feedbacks.length + 1).padStart(3, '0')}`,
                        timestamp: new Date().toISOString(),
                        moderationStatus: "Pending"
                    },
                    ...state.feedbacks
                ]
            })),
            moderateFeedback: (id, status) => set((state) => ({
                feedbacks: state.feedbacks.map(f => f.id === id ? { ...f, moderationStatus: status } : f)
            }))
        }),
        {
            name: 'performance-storage-v3',
        }
    )
);
