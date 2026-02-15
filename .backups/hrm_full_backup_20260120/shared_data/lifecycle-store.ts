import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingTask {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed";
}

export interface NewHire {
    id: string;
    name: string;
    position: string;
    department: string;
    startDate: string;
    progress: number; // 0 to 100
    status: "Pre-boarding" | "Onboarding" | "Completed";
    mentor: string;
    tasks: OnboardingTask[];
}

interface LifecycleState {
    newHires: NewHire[];

    // Actions
    addNewHire: (hire: Omit<NewHire, 'id' | 'progress' | 'status' | 'tasks'>) => void;
    updateNewHire: (id: string, updates: Partial<NewHire>) => void;
    deleteNewHire: (id: string) => void;

    // Task Actions
    addTaskToHire: (hireId: string, task: Omit<OnboardingTask, 'id' | 'status'>) => void;
    updateTaskStatus: (hireId: string, taskId: string, status: OnboardingTask['status']) => void;
}

export const useLifecycleStore = create<LifecycleState>()(
    persist(
        (set) => ({
            newHires: [
                {
                    id: "HR001",
                    name: "Arjun Mehta",
                    position: "Senior UI Designer",
                    department: "Design",
                    startDate: "2024-02-01",
                    progress: 35,
                    status: "Onboarding",
                    mentor: "Sarah Chen",
                    tasks: [
                        { id: "T1", title: "IT Setup", description: "Laptop and email configuration", assignedTo: "IT Team", dueDate: "2024-02-01", status: "Completed" },
                        { id: "T2", title: "HR Induction", description: "Company policies and benefits", assignedTo: "HR Team", dueDate: "2024-02-02", status: "In Progress" },
                        { id: "T3", title: "Team Lunch", description: "Introduction to the product team", assignedTo: "Design Team", dueDate: "2024-02-05", status: "Pending" }
                    ]
                },
                {
                    id: "HR002",
                    name: "Priya Singh",
                    position: "Full Stack Developer",
                    department: "Engineering",
                    startDate: "2024-02-15",
                    progress: 10,
                    status: "Pre-boarding",
                    mentor: "Vikram Malhotra",
                    tasks: [
                        { id: "T1", title: "Documentation Sign-off", description: "Offer letter and NDA", assignedTo: "Candidate", dueDate: "2024-02-01", status: "Completed" }
                    ]
                }
            ],

            addNewHire: (hire) => set((state) => ({
                newHires: [
                    {
                        ...hire,
                        id: `HR${String(state.newHires.length + 1).padStart(3, '0')}`,
                        progress: 0,
                        status: "Pre-boarding",
                        tasks: []
                    },
                    ...state.newHires
                ]
            })),

            updateNewHire: (id, updates) => set((state) => ({
                newHires: state.newHires.map(h => h.id === id ? { ...h, ...updates } : h)
            })),

            deleteNewHire: (id) => set((state) => ({
                newHires: state.newHires.filter(h => h.id !== id)
            })),

            addTaskToHire: (hireId, task) => set((state) => ({
                newHires: state.newHires.map(h => {
                    if (h.id === hireId) {
                        const newTasks = [
                            ...h.tasks,
                            { ...task, id: `T${h.tasks.length + 1}`, status: "Pending" as const }
                        ];
                        // Recalculate progress
                        const completed = newTasks.filter(t => t.status === "Completed").length;
                        const progress = Math.round((completed / newTasks.length) * 100);
                        return { ...h, tasks: newTasks, progress };
                    }
                    return h;
                })
            })),

            updateTaskStatus: (hireId, taskId, status) => set((state) => ({
                newHires: state.newHires.map(h => {
                    if (h.id === hireId) {
                        const newTasks = h.tasks.map(t => t.id === taskId ? { ...t, status } : t);
                        const completed = newTasks.filter(t => t.status === "Completed").length;
                        const progress = Math.round((completed / newTasks.length) * 100);
                        return { ...h, tasks: newTasks, progress };
                    }
                    return h;
                })
            }))
        }),
        {
            name: 'lifecycle-storage',
        }
    )
);
