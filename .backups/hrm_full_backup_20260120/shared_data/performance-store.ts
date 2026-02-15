import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Goal {
    id: string;
    title: string;
    progress: number;
    status: "On Track" | "Ahead" | "At Risk" | "Behind" | "Completed";
    dueDate: string;
    description?: string;
}

export interface Appraisal {
    id: string;
    employeeName: string;
    cycle: string;
    status: "Draft" | "Self Review" | "Manager Review" | "Completed";
    rating?: number;
    lastUpdated: string;
}

export interface Review {
    id: string;
    reviewerName: string;
    revieweeName: string;
    type: "Peer" | "Manager" | "Direct Report";
    status: "Pending" | "Completed";
    dueDate: string;
}

interface PerformanceState {
    goals: Goal[];
    appraisals: Appraisal[];
    reviews: Review[];

    // Goal Actions
    addGoal: (goal: Omit<Goal, 'id'>) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;

    // Appraisal Actions
    addAppraisal: (appraisal: Omit<Appraisal, 'id' | 'status' | 'lastUpdated'>) => void;
    updateAppraisal: (id: string, updates: Partial<Appraisal>) => void;

    // Review Actions
    addReview: (review: Omit<Review, 'id' | 'status'>) => void;
    updateReview: (id: string, updates: Partial<Review>) => void;
}

export const usePerformanceStore = create<PerformanceState>()(
    persist(
        (set) => ({
            goals: [
                { id: "G-001", title: "Increase Revenue by 20%", progress: 75, status: "On Track", dueDate: "2024-03-31" },
                { id: "G-002", title: "Launch New Product Feature", progress: 45, status: "At Risk", dueDate: "2024-02-28" },
                { id: "G-003", title: "Improve Customer Satisfaction", progress: 90, status: "Ahead", dueDate: "2024-04-15" }
            ],
            appraisals: [
                { id: "APR-001", employeeName: "Arjun Mehta", cycle: "Annual 2023", status: "Manager Review", rating: 4.2, lastUpdated: "2024-01-15" },
                { id: "APR-002", employeeName: "Priya Sharma", cycle: "Q1 2024", status: "Self Review", lastUpdated: "2024-01-20" }
            ],
            reviews: [
                { id: "REV-001", reviewerName: "Rajesh Kumar", revieweeName: "Arjun Mehta", type: "Peer", status: "Pending", dueDate: "2024-01-30" },
                { id: "REV-002", reviewerName: "Amit Patel", revieweeName: "Arjun Mehta", type: "Manager", status: "Completed", dueDate: "2024-01-22" }
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

            addAppraisal: (appraisal) => set((state) => ({
                appraisals: [
                    {
                        ...appraisal,
                        id: `APR-${String(state.appraisals.length + 1).padStart(3, '0')}`,
                        status: "Draft",
                        lastUpdated: new Date().toISOString().split('T')[0]
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
            }))
        }),
        {
            name: 'performance-storage',
        }
    )
);
