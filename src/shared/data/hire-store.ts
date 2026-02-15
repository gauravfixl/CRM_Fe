import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Shared Types ---
export interface ActivityLog {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    performer: string; // User who performed the action
}

export interface Comment {
    id: string;
    text: string;
    author: string;
    timestamp: string;
}

// --- Job Management ---
export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Internship";
    experience: string;
    salaryRange: string;
    description: string;
    skills: string[];

    // Advanced Fields
    hiringManagerId: string;
    recruiters: string[]; // List of recruiters assigned
    workflowStatus: "Draft" | "Pending Approval" | "Approved" | "Active" | "On Hold" | "Closed";
    approvalChain: { step: number; approver: string; status: "Pending" | "Approved" | "Rejected" }[];

    applicantsCount: number;
    postedDate: string;
    views: number;
    logs: ActivityLog[];
}

// --- Candidate Management ---
export interface Candidate {
    id: string;
    jobId: string; // Linked Job
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;

    // Deep Profile
    source: string;
    resumeUrl?: string;
    parsedSkills: string[]; // AI Parsing capability placeholder
    tags: string[];

    // Pipeline
    stage: "New" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
    stageEnteredDate: string;

    rating: number; // Average of all feedback
    communicationLog: ActivityLog[]; // Email/Call history
    notes: Comment[];

    appliedDate: string;
}

// --- Interview Management ---
export interface Interview {
    id: string;
    candidateId: string;
    jobId: string;
    title: string; // e.g. "Technical Round 1"

    // Details
    interviewers: string[]; // List of Employee IDs
    date: string;
    time: string;
    duration: string;
    mode: "In-person" | "Video" | "Phone";
    meetingLink?: string;
    location?: string;

    status: "Scheduled" | "Completed" | "Cancelled" | "No Show";

    // Feedback
    scorecards: {
        interviewerId: string;
        skillsRating: { skill: string; score: number }[]; // 1-5
        overallScore: number;
        feedback: string;
        submittedAt: string;
    }[];
}

// --- Offer Management ---
export interface Offer {
    id: string;
    candidateId: string;
    jobId: string;
    candidateName: string;
    role: string;
    department: string;
    ctc: string; // Display CTC e.g. "₹ 1,20,000"

    // Components
    salaryBreakdown: { component: string; amount: number }[];
    totalCtc: number;
    joiningDate: string;
    expiryDate: string;

    // Workflow
    templateId: string;
    approvalStatus: "Draft" | "Pending Approval" | "Approved" | "Sent" | "Accepted" | "Rejected";
    approverId?: string; // Manager who needs to approve

    history: ActivityLog[];
    createdAt: string;
}

interface HireState {
    jobs: Job[];
    candidates: Candidate[];
    interviews: Interview[];
    offers: Offer[];

    // --- Actions ---

    // Job
    addJob: (job: Omit<Job, 'id' | 'postedDate' | 'applicantsCount' | 'views' | 'logs' | 'workflowStatus' | 'approvalChain'>) => void;
    updateJob: (id: string, updates: Partial<Job>) => void;
    deleteJob: (id: string) => void;
    submitJobForApproval: (id: string) => void;

    // Candidate
    addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedDate' | 'stage' | 'rating' | 'communicationLog' | 'notes' | 'parsedSkills' | 'stageEnteredDate'>) => void;
    updateCandidate: (id: string, updates: Partial<Candidate>) => void;
    deleteCandidate: (id: string) => void;
    moveCandidateStage: (id: string, stage: Candidate['stage']) => void;
    addCandidateNote: (id: string, note: string) => void;

    // Interview
    scheduleInterview: (interview: Omit<Interview, 'id' | 'status' | 'scorecards'>) => void;
    updateInterview: (id: string, updates: Partial<Interview>) => void;
    deleteInterview: (id: string) => void;
    submitFeedback: (interviewId: string, feedback: Interview['scorecards'][0]) => void;

    // Offer
    addOffer: (offer: Omit<Offer, 'id' | 'approvalStatus' | 'history' | 'createdAt'>) => void;
    updateOffer: (id: string, updates: Partial<Offer>) => void;
    deleteOffer: (id: string) => void;
    submitOfferForApproval: (id: string) => void;
}

export const useHireStore = create<HireState>()(
    persist(
        (set) => ({
            jobs: [
                {
                    id: "JOB-101",
                    title: "Senior Product Designer",
                    department: "Design",
                    location: "Remote",
                    type: "Full-time",
                    experience: "5+ Years",
                    salaryRange: "₹25L - ₹40L",
                    description: "Looking for an experienced designer...",
                    skills: ["Figma", "Design Systems", "Prototyping"],
                    hiringManagerId: "EMP-005",
                    recruiters: ["EMP-021"],
                    workflowStatus: "Active",
                    approvalChain: [{ step: 1, approver: "EMP-002", status: "Approved" }],
                    applicantsCount: 12,
                    postedDate: "2024-03-15",
                    views: 145,
                    logs: []
                },
                {
                    id: "JOB-102",
                    title: "Backend Engineer (Go)",
                    department: "Engineering",
                    location: "Bangalore",
                    type: "Full-time",
                    experience: "3-5 Years",
                    salaryRange: "₹20L - ₹35L",
                    description: "Building scalable microservices...",
                    skills: ["Go", "Kubernetes", "gRPC"],
                    hiringManagerId: "EMP-008",
                    recruiters: ["EMP-021"],
                    workflowStatus: "Draft",
                    approvalChain: [],
                    applicantsCount: 0,
                    postedDate: "2024-03-20",
                    views: 12,
                    logs: []
                }
            ],
            candidates: [
                {
                    id: "CAN-501",
                    jobId: "JOB-101",
                    firstName: "Aarav",
                    lastName: "Patel",
                    email: "aarav.p@example.com",
                    phone: "+91 9876543210",
                    location: "Mumbai",
                    source: "LinkedIn",
                    parsedSkills: ["Figma", "Sketch", "UI/UX"],
                    tags: ["Top Choice", "Immediate Joiner"],
                    stage: "Interview",
                    stageEnteredDate: "2024-03-18",
                    rating: 4.5,
                    communicationLog: [
                        { id: "LOG-1", action: "Email Sent", details: "Interview Invitation", timestamp: "2024-03-18", performer: "System" }
                    ],
                    notes: [],
                    appliedDate: "2024-03-16"
                }
            ],
            interviews: [],
            offers: [],

            // --- Job Actions ---
            addJob: (job) => set((state) => ({
                jobs: [{
                    ...job,
                    id: `JOB-${Math.floor(Math.random() * 10000)}`,
                    workflowStatus: 'Draft',
                    approvalChain: [],
                    applicantsCount: 0,
                    postedDate: new Date().toLocaleDateString(),
                    views: 0,
                    logs: [{ id: `LOG-${Date.now()}`, action: 'Created', details: 'Job requisition created', timestamp: new Date().toISOString(), performer: 'Current User' }]
                }, ...state.jobs]
            })),
            updateJob: (id, updates) => set((state) => ({
                jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
            })),
            deleteJob: (id) => set((state) => ({
                jobs: state.jobs.filter(j => j.id !== id)
            })),
            submitJobForApproval: (id) => set((state) => ({
                jobs: state.jobs.map(j => j.id === id ? { ...j, workflowStatus: 'Pending Approval' } : j)
            })),

            // --- Candidate Actions ---
            addCandidate: (candidate) => set((state) => ({
                candidates: [{
                    ...candidate,
                    id: `CAN-${Math.floor(Math.random() * 10000)}`,
                    stage: 'New',
                    stageEnteredDate: new Date().toISOString(),
                    rating: 0,
                    communicationLog: [],
                    notes: [],
                    parsedSkills: [],
                    tags: candidate.tags || [], // Use provided tags or default to empty
                    appliedDate: new Date().toLocaleDateString()
                }, ...state.candidates]
            })),
            updateCandidate: (id, updates) => set((state) => ({
                candidates: state.candidates.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteCandidate: (id) => set((state) => ({
                candidates: state.candidates.filter(c => c.id !== id)
            })),
            moveCandidateStage: (id, stage) => set((state) => ({
                candidates: state.candidates.map(c => c.id === id ? {
                    ...c,
                    stage,
                    stageEnteredDate: new Date().toISOString(),
                    communicationLog: [...c.communicationLog, { id: `LOG-${Date.now()}`, action: 'Stage Changed', details: `Moved to ${stage}`, timestamp: new Date().toISOString(), performer: 'User' }]
                } : c)
            })),
            addCandidateNote: (id, note) => set((state) => ({
                candidates: state.candidates.map(c => c.id === id ? {
                    ...c,
                    notes: [...c.notes, { id: `NOTE-${Date.now()}`, text: note, author: 'Me', timestamp: new Date().toISOString() }]
                } : c)
            })),

            // --- Interview Actions ---
            scheduleInterview: (interview) => set((state) => ({
                interviews: [{
                    ...interview,
                    id: `INT-${Math.floor(Math.random() * 10000)}`,
                    status: 'Scheduled',
                    scorecards: []
                }, ...state.interviews]
            })),
            updateInterview: (id, updates) => set((state) => ({
                interviews: state.interviews.map(i => i.id === id ? { ...i, ...updates } : i)
            })),
            deleteInterview: (id) => set((state) => ({
                interviews: state.interviews.filter(i => i.id !== id)
            })),
            submitFeedback: (interviewId, feedback) => set((state) => ({
                interviews: state.interviews.map(i => i.id === interviewId ? {
                    ...i,
                    status: 'Completed',
                    scorecards: [...i.scorecards, feedback]
                } : i)
            })),

            // --- Offer Actions ---
            addOffer: (offer) => set((state) => ({
                offers: [{
                    ...offer,
                    id: `OFF-${Math.floor(Math.random() * 10000)}`,
                    approvalStatus: 'Draft',
                    history: [{ id: `LOG-${Date.now()}`, action: 'Drafted', details: 'Offer draft allocated', timestamp: new Date().toISOString(), performer: 'User' }],
                    createdAt: new Date().toISOString()
                }, ...state.offers]
            })),
            updateOffer: (id, updates) => set((state) => ({
                offers: state.offers.map(o => o.id === id ? { ...o, ...updates } : o)
            })),
            deleteOffer: (id) => set((state) => ({
                offers: state.offers.filter(o => o.id !== id)
            })),
            submitOfferForApproval: (id) => set((state) => ({
                offers: state.offers.map(o => o.id === id ? { ...o, approvalStatus: 'Pending Approval' } : o)
            }))
        }),
        {
            name: 'hire-storage-v2', // Versioned to avoid conflict
        }
    )
);
