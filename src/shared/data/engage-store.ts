import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TargetAudience {
    departments: string[];
    locations: string[];
    roles: string[];
}

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
    targetAudience: TargetAudience;
    scheduledDate?: string;
    acknowledgementRequired: boolean;
    acknowledgedBy: string[]; // employee IDs
    type: "News" | "Policy" | "Event" | "Celebration";
}

export interface SurveyQuestion {
    id: string;
    type: 'MCQ' | 'Rating' | 'Text' | 'Boolean';
    question: string;
    options?: string[];
    required: boolean;
}

export interface Survey {
    id: string;
    title: string;
    description: string;
    responses: number;
    status: "Active" | "Draft" | "Closed";
    endDate: string;
    targetAudience: TargetAudience;
    questions: SurveyQuestion[];
    anonymous: boolean;
    category: "Pulse" | "Engagement" | "Wellness" | "Custom";
}

export interface Feedback {
    id: string;
    employeeId: string;
    subject: string;
    department: string;
    category: "General" | "Work Environment" | "Management" | "Policies";
    content: string;
    date: string;
    isAnonymous: boolean;
    status: "Open" | "Reviewed" | "Resolved";
    moderationStatus: "Pending" | "Approved" | "Rejected" | "Resolved";
    priority: "Low" | "Medium" | "High";
    sentiment?: "Positive" | "Neutral" | "Negative";
    assignedTo?: string;
    adminResponse?: string;
}

export interface Recognition {
    id: string;
    sender: string;
    recipient: string;
    reason: string;
    awardType: string;
    date: string;
    points: number;
    status: "Approved" | "Pending";
    category: "Peer" | "Manager" | "Company";
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
    eventType: "Virtual" | "In-Person" | "Hybrid";
    budget?: number;
    description?: string;
}

export interface EmployeeCelebration {
    id: string;
    employeeName: string;
    type: "Birthday" | "Work Anniversary";
    date: string; // MM-DD format
    department: string;
    years?: number;
    avatar?: string;
}

interface EngageState {
    announcements: Announcement[];
    surveys: Survey[];
    feedbacks: Feedback[];
    recognitions: Recognition[];
    events: Event[];
    celebrations: EmployeeCelebration[];
    userPoints: number;

    // Announcement Actions
    addAnnouncement: (ann: Omit<Announcement, 'id' | 'views' | 'date' | 'acknowledgedBy'>) => void;
    updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
    deleteAnnouncement: (id: string) => void;
    acknowledgeAnnouncement: (announcementId: string, userId: string) => void;

    // Survey Actions
    addSurvey: (survey: Omit<Survey, 'id' | 'responses'>) => void;
    updateSurvey: (id: string, updates: Partial<Survey>) => void;
    deleteSurvey: (id: string) => void;

    // Feedback Actions
    addFeedback: (feedback: Omit<Feedback, 'id' | 'date' | 'status' | 'moderationStatus'>) => void;
    updateFeedback: (id: string, updates: Partial<Feedback>) => void;
    deleteFeedback: (id: string) => void;

    // Recognition Actions
    addRecognition: (rec: Omit<Recognition, 'id' | 'date' | 'status'>) => void;
    updateRecognition: (id: string, updates: Partial<Recognition>) => void;
    deleteRecognition: (id: string) => void;
    addPoints: (amount: number) => void;

    // Event Actions
    addEvent: (event: Omit<Event, 'id' | 'attendees' | 'registered'>) => void;
    updateEvent: (id: string, updates: Partial<Event>) => void;
    toggleRegistration: (id: string) => void;
    deleteEvent: (id: string) => void;
}

export const useEngageStore = create<EngageState>()(
    persist(
        (set) => ({
            announcements: [
                {
                    id: "ANN01",
                    title: "Annual Town Hall 2024",
                    content: "Join us for the annual town hall meeting to discuss our roadmap for the upcoming year.",
                    date: "2024-01-20",
                    author: "HR Department",
                    priority: "High",
                    pinned: true,
                    views: 245,
                    status: "Active",
                    type: "News",
                    acknowledgementRequired: true,
                    acknowledgedBy: ["EMP001", "EMP002"],
                    targetAudience: { departments: ["All"], locations: ["All"], roles: ["All"] }
                },
                {
                    id: "ANN02",
                    title: "New Health Insurance Provider",
                    content: "We are switching to a new health insurance provider effective next month. Please check your emails.",
                    date: "2024-01-18",
                    author: "Benefits Team",
                    priority: "Medium",
                    pinned: false,
                    views: 180,
                    status: "Active",
                    type: "Policy",
                    acknowledgementRequired: false,
                    acknowledgedBy: [],
                    targetAudience: { departments: ["All"], locations: ["India"], roles: ["All"] }
                },
            ],
            surveys: [
                {
                    id: "SRV01",
                    title: "Employee Wellness Survey",
                    description: "Help us understand how we can support your mental and physical health better.",
                    responses: 45,
                    status: "Active",
                    endDate: "2024-02-28",
                    targetAudience: { departments: ["All"], locations: ["All"], roles: ["All"] },
                    anonymous: true,
                    category: "Wellness",
                    questions: [
                        { id: "q1", type: "Rating", question: "How would you rate your current work-life balance?", required: true },
                        { id: "q2", type: "Text", question: "What is the biggest stressor at work right now?", required: false }
                    ]
                },
                {
                    id: "SRV02",
                    title: "Remote Work Feedback",
                    description: "Share your thoughts on the current remote work policy and tools.",
                    responses: 112,
                    status: "Closed",
                    endDate: "2024-01-15",
                    targetAudience: { departments: ["All"], locations: ["All"], roles: ["All"] },
                    anonymous: false,
                    category: "Pulse",
                    questions: []
                }
            ],
            feedbacks: [
                { id: "FDB01", employeeId: "Anonymous", subject: "Coffee Machine Maintenance", department: "Operations", category: "Work Environment", content: "The coffee machine in the break room needs frequent maintenance.", date: "2024-01-22", isAnonymous: true, status: "Open", moderationStatus: "Pending", priority: "Low", sentiment: "Neutral" },
                { id: "FDB02", employeeId: "EMP-442", subject: "Mentorship Program Appreciation", department: "Engineering", category: "Management", content: "Appreciation for the new mentorship program initiative.", date: "2024-01-21", isAnonymous: false, status: "Reviewed", moderationStatus: "Approved", priority: "Medium", sentiment: "Positive" }
            ],
            recognitions: [
                { id: "REC01", sender: "Rajesh Kumar", recipient: "Aman Gupta", reason: "Exceptional ownership during the migration crisis last weekend.", awardType: "Values Hero", date: "2024-01-19", points: 50, status: "Approved", category: "Peer" },
                { id: "REC02", sender: "HR Dept", recipient: "Sneha Reddy", reason: "Top contributor to the health & wellness initiative.", awardType: "Star Performer", date: "2024-01-18", points: 100, status: "Approved", category: "Company" }
            ],
            events: [
                { id: "EV01", title: "Tech Summit 2024", category: "Training", date: "2024-01-25", time: "10:00 AM - 04:00 PM", location: "Main Auditorium / Zoom", attendees: 156, registered: true, eventType: "Hybrid", budget: 5000 },
                { id: "EV02", title: "Annual Office Picnic", category: "Social", date: "2024-02-05", time: "09:00 AM onwards", location: "Lakeview Resort", attendees: 320, registered: false, eventType: "In-Person", budget: 15000 },
                { id: "EV03", title: "Project Management Workshop", category: "Professional", date: "2024-01-22", time: "02:00 PM - 05:00 PM", location: "Meeting Room A", attendees: 45, registered: true, eventType: "In-Person", budget: 1000 }
            ],
            celebrations: [
                { id: "CEL01", employeeName: "Rahul Sharma", type: "Birthday", date: "01-20", department: "Engineering" },
                { id: "CEL02", employeeName: "Aditi Iyer", type: "Work Anniversary", date: "01-22", department: "Finance", years: 3 },
                { id: "CEL03", employeeName: "Kevin Varga", type: "Birthday", date: "01-25", department: "Sales" },
                { id: "CEL04", employeeName: "Sneha Reddy", type: "Work Anniversary", date: "01-28", department: "HR", years: 5 },
            ],
            userPoints: 450,

            addAnnouncement: (ann) => set((state) => ({
                announcements: [
                    {
                        ...ann,
                        id: `ANN-${String(state.announcements.length + 1).padStart(3, '0')}`,
                        views: 0,
                        date: new Date().toISOString().split('T')[0],
                        acknowledgedBy: []
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
            acknowledgeAnnouncement: (announcementId, userId) => set((state) => ({
                announcements: state.announcements.map(a =>
                    a.id === announcementId
                        ? { ...a, acknowledgedBy: [...(a.acknowledgedBy || []), userId] }
                        : a
                )
            })),

            addSurvey: (survey) => set((state) => ({
                surveys: [
                    {
                        ...survey,
                        id: `SRV-${String(state.surveys.length + 1).padStart(3, '0')}`,
                        responses: 0
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
                        status: "Open",
                        moderationStatus: "Pending"
                    },
                    ...state.feedbacks
                ]
            })),
            updateFeedback: (id, updates) => set((state) => ({
                feedbacks: state.feedbacks.map(f => f.id === id ? { ...f, ...updates } : f)
            })),
            deleteFeedback: (id) => set((state) => ({
                feedbacks: state.feedbacks.filter(f => f.id !== id)
            })),

            addRecognition: (rec) => set((state) => ({
                recognitions: [
                    {
                        ...rec,
                        id: `REC-${String(state.recognitions.length + 1).padStart(3, '0')}`,
                        date: new Date().toISOString().split('T')[0],
                        status: "Approved"
                    },
                    ...state.recognitions
                ]
            })),
            updateRecognition: (id, updates) => set((state) => ({
                recognitions: state.recognitions.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteRecognition: (id) => set((state) => ({
                recognitions: state.recognitions.filter(r => r.id !== id)
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
            updateEvent: (id, updates) => set((state) => ({
                events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
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
