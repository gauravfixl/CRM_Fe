import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
    priority: "Low" | "Medium" | "High";
    pinned: boolean;
    views: number;
    status: "Active" | "Scheduled" | "Archived";
}

export interface Survey {
    id: string;
    title: string;
    description: string;
    responses: number;
    status: "Active" | "Draft" | "Closed";
    endDate: string;
}

export interface Feedback {
    id: string;
    employeeName: string;
    category: "General" | "Work Environment" | "Management" | "Policies";
    content: string;
    date: string;
    anonymous: boolean;
    status: "Open" | "Reviewed" | "Resolved";
}

export interface Recognition {
    id: string;
    from: string;
    to: string;
    reason: string;
    award: string;
    date: string;
}

export interface Event {
    id: string;
    title: string;
    category: string;
    date: string;
    time: string;
    location: string;
    attendees: number;
    registered: boolean;
}

interface EngageState {
    announcements: Announcement[];
    surveys: Survey[];
    feedbacks: Feedback[];
    recognitions: Recognition[];
    events: Event[];
    userPoints: number;

    // Announcement Actions
    addAnnouncement: (ann: Omit<Announcement, 'id' | 'views' | 'date' | 'status'>) => void;
    updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
    deleteAnnouncement: (id: string) => void;

    // Survey Actions
    addSurvey: (survey: Omit<Survey, 'id' | 'responses' | 'status'>) => void;
    updateSurvey: (id: string, updates: Partial<Survey>) => void;
    deleteSurvey: (id: string) => void;

    // Feedback Actions
    addFeedback: (feedback: Omit<Feedback, 'id' | 'date' | 'status'>) => void;
    updateFeedback: (id: string, updates: Partial<Feedback>) => void;

    // Recognition Actions
    addRecognition: (rec: Omit<Recognition, 'id' | 'date'>) => void;
    addPoints: (amount: number) => void;

    // Event Actions
    addEvent: (event: Omit<Event, 'id' | 'attendees' | 'registered'>) => void;
    toggleRegistration: (id: string) => void;
    deleteEvent: (id: string) => void;
}

export const useEngageStore = create<EngageState>()(
    persist(
        (set) => ({
            announcements: [
                { id: "ANN01", title: "Annual Town Hall 2024", content: "Join us for the annual town hall meeting to discuss our roadmap for the upcoming year.", date: "2024-01-20", author: "HR Department", priority: "High", pinned: true, views: 245, status: "Active" },
                { id: "ANN02", title: "New Health Insurance Provider", content: "We are switching to a new health insurance provider effective next month. Please check your emails.", date: "2024-01-18", author: "Benefits Team", priority: "Medium", pinned: false, views: 180, status: "Active" },
            ],
            surveys: [
                { id: "SRV01", title: "Employee Wellness Survey", description: "Help us understand how we can support your mental and physical health better.", responses: 45, status: "Active", endDate: "2024-02-28" },
                { id: "SRV02", title: "Remote Work Feedback", description: "Share your thoughts on the current remote work policy and tools.", responses: 112, status: "Closed", endDate: "2024-01-15" }
            ],
            feedbacks: [
                { id: "FDB01", employeeName: "Anonymous", category: "Work Environment", content: "The coffee machine in the break room needs frequent maintenance.", date: "2024-01-22", anonymous: true, status: "Open" },
                { id: "FDB02", employeeName: "Rahul Sharma", category: "Management", content: "Appreciation for the new mentorship program initiative.", date: "2024-01-21", anonymous: false, status: "Reviewed" }
            ],
            recognitions: [
                { id: "REC01", from: "Rajesh Kumar", to: "Aman Gupta", reason: "Exceptional ownership during the migration crisis last weekend.", award: "Values Hero", date: "2024-01-19" },
                { id: "REC02", from: "HR Dept", to: "Sneha Reddy", reason: "Top contributor to the health & wellness initiative.", award: "Star Performer", date: "2024-01-18" }
            ],
            events: [
                { id: "EV01", title: "Tech Summit 2024", category: "Training", date: "2024-01-25", time: "10:00 AM - 04:00 PM", location: "Main Auditorium / Zoom", attendees: 156, registered: true },
                { id: "EV02", title: "Annual Office Picnic", category: "Social", date: "2024-02-05", time: "09:00 AM onwards", location: "Lakeview Resort", attendees: 320, registered: false },
                { id: "EV03", title: "Project Management Workshop", category: "Professional", date: "2024-01-22", time: "02:00 PM - 05:00 PM", location: "Meeting Room A", attendees: 45, registered: true }
            ],
            userPoints: 450,

            addAnnouncement: (ann) => set((state) => ({
                announcements: [
                    {
                        ...ann,
                        id: `ANN-${String(state.announcements.length + 1).padStart(3, '0')}`,
                        views: 0,
                        date: new Date().toISOString().split('T')[0],
                        status: "Active"
                    },
                    ...state.announcements
                ]
            })),
            updateAnnouncement: (id, updates) => set((state) => ({
                announcements: state.announcements.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            deleteAnnouncement: (id) => set((state) => ({
                announcements: state.announcements.filter(a => a.id !== id)
            })),

            addSurvey: (survey) => set((state) => ({
                surveys: [
                    {
                        ...survey,
                        id: `SRV-${String(state.surveys.length + 1).padStart(3, '0')}`,
                        responses: 0,
                        status: "Active"
                    },
                    ...state.surveys
                ]
            })),
            updateSurvey: (id, updates) => set((state) => ({
                surveys: state.surveys.map(s => s.id === id ? { ...s, ...updates } : s)
            })),
            deleteSurvey: (id) => set((state) => ({
                surveys: state.surveys.filter(s => s.id !== id)
            })),

            addFeedback: (feedback) => set((state) => ({
                feedbacks: [
                    {
                        ...feedback,
                        id: `FDB-${String(state.feedbacks.length + 1).padStart(3, '0')}`,
                        date: new Date().toISOString().split('T')[0],
                        status: "Open"
                    },
                    ...state.feedbacks
                ]
            })),
            updateFeedback: (id, updates) => set((state) => ({
                feedbacks: state.feedbacks.map(f => f.id === id ? { ...f, ...updates } : f)
            })),

            addRecognition: (rec) => set((state) => ({
                recognitions: [
                    {
                        ...rec,
                        id: `REC-${String(state.recognitions.length + 1).padStart(3, '0')}`,
                        date: new Date().toISOString().split('T')[0]
                    },
                    ...state.recognitions
                ]
            })),
            addPoints: (amount) => set((state) => ({
                userPoints: state.userPoints + amount
            })),

            addEvent: (event) => set((state) => ({
                events: [
                    {
                        ...event,
                        id: `EV-${String(state.events.length + 1).padStart(3, '0')}`,
                        attendees: 0,
                        registered: false
                    },
                    ...state.events
                ]
            })),
            toggleRegistration: (id) => set((state) => ({
                events: state.events.map(e => e.id === id ? { ...e, registered: !e.registered, attendees: e.registered ? e.attendees - 1 : e.attendees + 1 } : e)
            })),
            deleteEvent: (id) => set((state) => ({
                events: state.events.filter(e => e.id !== id)
            }))
        }),
        {
            name: 'engage-storage',
        }
    )
);
