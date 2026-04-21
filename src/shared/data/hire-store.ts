import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    getAllJobs,
    createJobPosting,
    updateJobPosting,
    closeJobPosting,
    getAllCandidates,
    createCandidate as apiCreateCandidate,
    updateCandidate as apiUpdateCandidate,
    updateCandidateStatus as apiUpdateCandidateStatus,
    deleteCandidate as apiDeleteCandidate,
    getAllInterviews,
    createInterview as apiCreateInterview,
    updateInterviewStatus as apiUpdateInterviewStatus,
    submitInterviewFeedback as apiSubmitInterviewFeedback,
    deleteInterview as apiDeleteInterview,
    getAllOffers,
    createOffer as apiCreateOffer,
    updateOffer as apiUpdateOffer,
    updateOfferStatus as apiUpdateOfferStatus,
    deleteOffer as apiDeleteOffer,
} from "@/modules/hrm/hooks/hrmHooks";
import {
    mapJobFromApi,
    mapJobToCreatePayload,
    mapJobToUpdatePayload,
    mapCandidateFromApi,
    mapCandidateToCreatePayload,
    mapCandidateToUpdatePayload,
    mapInterviewFromApi,
    mapInterviewToCreatePayload,
    mapOfferFromApi,
    mapOfferToCreatePayload,
    mapOfferToUpdatePayload,
    candidateStageFeToBe,
    interviewStatusFeToBe,
    offerStatusFeToBe,
} from "./hire-store-mappers";
import { showSuccess, showError } from "@/utils/toast";

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
export type InterviewRound = 'HR Screening' | 'Technical' | 'Managerial' | 'Final' | 'Culture Fit' | 'Custom';

export interface InterviewPanelMember {
    employeeId: string;
    name: string;
    email?: string;
    role?: string;
}

export interface Interview {
    id: string;
    candidateId: string;
    jobId: string;
    title: string; // e.g. "Technical Round 1"

    // Details
    interviewers: string[]; // Legacy: list of Employee IDs (preserved for backward compat)
    panel?: InterviewPanelMember[]; // Round 2: Full panel with names
    date: string;
    time: string;
    duration: string;
    mode: "In-person" | "Video" | "Phone";
    meetingLink?: string;
    location?: string;

    status: "Scheduled" | "Completed" | "Cancelled" | "No Show" | "Rescheduled";

    // Round 2 additions
    round?: InterviewRound;
    roundOrder?: number;
    preparationNotes?: string;
    reminderSentAt?: string;
    reminderScheduledFor?: string;
    outcome?: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire' | 'Hold';
    timeZone?: string;
    rescheduleCount?: number;

    // Feedback
    scorecards: {
        interviewerId: string;
        interviewerName?: string;
        skillsRating: { skill: string; score: number }[]; // 1-5
        overallScore: number;
        feedback: string;
        recommendation?: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire';
        submittedAt: string;
    }[];
}

// --- Resume Parser ---
export type ResumeParseStatus = 'Processing' | 'Parsed' | 'Failed' | 'Converted' | 'Duplicate';

export interface ParsedResume {
    id: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: string;
    uploadedBy: string;
    parseDurationMs?: number;

    // Parsed core
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    linkedIn?: string;
    portfolio?: string;

    // Parsed deep
    summary?: string;
    skills: string[];
    experience: { company: string; title: string; duration: string; description?: string }[];
    education: { institution: string; degree: string; year: string }[];
    certifications: string[];
    languages?: string[];
    totalYearsOfExperience?: number;

    // Scoring
    qualityScore: number;  // 0-100
    matchScores: { jobId: string; jobTitle: string; score: number }[];

    // Lifecycle
    status: ResumeParseStatus;
    addedToPipelineAs?: string;  // candidate ID if converted
    duplicateOf?: string;        // existing candidate ID if duplicate
    tags?: string[];
}

// --- Career Page Builder ---
export type CareerPageTheme = 'Modern' | 'Classic' | 'Minimal';
export type CareerPageFieldType = 'text' | 'email' | 'phone' | 'url' | 'textarea' | 'select' | 'file' | 'checkbox';

export interface CareerPageField {
    id: string;
    label: string;
    type: CareerPageFieldType;
    placeholder?: string;
    required: boolean;
    enabled: boolean;
    order: number;
    options?: string[];  // for select
    helperText?: string;
}

export interface CareerPageSubmission {
    id: string;
    jobId?: string;
    jobTitle?: string;
    submittedAt: string;
    data: Record<string, string>;  // field id -> value
    status: 'New' | 'Reviewed' | 'Moved to Pipeline' | 'Rejected';
    candidateId?: string;
}

export interface CareerPageConfig {
    // Branding
    logoUrl?: string;
    logoName?: string;
    bannerUrl?: string;
    bannerName?: string;
    brandColor: string;
    theme: CareerPageTheme;

    // Content
    tagline: string;
    about: string;
    companyImage?: string;
    perks?: { icon: string; title: string; description: string }[];

    // URL
    slug: string;
    publicUrl: string;

    // Form Fields
    formFields: CareerPageField[];

    // Social Sharing
    socialEnabled: { linkedin: boolean; twitter: boolean; facebook: boolean; whatsapp: boolean };

    // SEO
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];

    // Publishing
    isPublished: boolean;
    publishedAt?: string;
    lastModifiedAt: string;

    // Analytics (mock — recalculated from submissions + view count)
    views: number;
    applications: number;

    // Job visibility overrides (jobId -> visible)
    jobVisibility: Record<string, boolean>;
}

// --- Offer Management ---
export type OfferSignatureStatus = 'Not Sent' | 'Sent' | 'Signed' | 'Declined' | 'Expired';
export type OfferTemplateType = 'Permanent' | 'Contract' | 'Internship' | 'Part-Time' | 'Remote' | 'Custom';

export interface OfferTemplate {
    id: string;
    name: string;
    type: OfferTemplateType;
    description?: string;
    salaryStructure: { component: string; percentOfCtc?: number; fixedAmount?: number; isTaxable: boolean }[];
    defaultBenefits: string[];
    defaultClauses: { title: string; body: string }[];
    isDefault: boolean;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
}

export interface OfferCounter {
    id: string;
    offerId: string;
    requestedBy: 'Candidate' | 'HR';
    requestedCtc?: number;
    requestedJoiningDate?: string;
    notes: string;
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
    createdAt: string;
    respondedAt?: string;
}

export interface OfferVersion {
    version: number;
    createdAt: string;
    createdBy: string;
    changes: string;
    totalCtc: number;
    joiningDate: string;
}

export interface Offer {
    id: string;
    candidateId: string;
    jobId: string;
    candidateName: string;
    candidateEmail?: string;
    role: string;
    department: string;
    ctc: string; // Display CTC e.g. "₹ 1,20,000"

    // Components
    salaryBreakdown: { component: string; amount: number; isTaxable?: boolean }[];
    totalCtc: number;
    joiningDate: string;
    expiryDate: string;

    // Workflow
    templateId: string;
    approvalStatus: "Draft" | "Pending Approval" | "Approved" | "Sent" | "Accepted" | "Rejected";
    approverId?: string; // Manager who needs to approve

    // Round 2 additions
    version: number;
    versions?: OfferVersion[];
    benefits?: string[];
    customClauses?: { title: string; body: string }[];
    joiningBonus?: number;
    variablePay?: number;
    stockOptions?: number;
    noticePeriod?: string;

    // E-signature
    signatureStatus?: OfferSignatureStatus;
    signatureSentAt?: string;
    signedAt?: string;
    signedIp?: string;
    acceptanceLink?: string;

    // Counter offers
    counterOffers?: OfferCounter[];

    // Email
    emailedAt?: string;
    emailStatus?: 'Not Sent' | 'Sent' | 'Delivered' | 'Opened' | 'Bounced';

    history: ActivityLog[];
    createdAt: string;
}

interface HireState {
    jobs: Job[];
    candidates: Candidate[];
    interviews: Interview[];
    offers: Offer[];
    // Round 2 slices
    parsedResumes: ParsedResume[];
    careerPageConfig: CareerPageConfig;
    careerSubmissions: CareerPageSubmission[];
    offerTemplates: OfferTemplate[];

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

    // Round 2 — Interview advanced
    rescheduleInterview: (id: string, newDate: string, newTime: string, reason?: string) => void;
    markInterviewOutcome: (id: string, outcome: NonNullable<Interview['outcome']>, notes?: string) => void;
    sendInterviewReminder: (id: string) => void;
    bulkRescheduleInterviews: (ids: string[], newDate: string) => { updated: number };
    detectInterviewConflicts: (interviewerIds: string[], date: string, time: string, duration: string, excludeId?: string) => { employeeId: string; conflictingTitle: string; conflictingTime: string }[];

    // Offer
    addOffer: (offer: Omit<Offer, 'id' | 'approvalStatus' | 'history' | 'createdAt' | 'version'>) => void;
    updateOffer: (id: string, updates: Partial<Offer>) => void;
    deleteOffer: (id: string) => void;
    submitOfferForApproval: (id: string) => void;

    // Round 2 — Offer advanced
    createOfferVersion: (id: string, changes: string, createdBy: string) => void;
    sendOfferForSignature: (id: string) => { acceptanceLink: string };
    markOfferSigned: (id: string, signedIp?: string) => void;
    markOfferDeclined: (id: string, reason?: string) => void;
    submitCounterOffer: (offerId: string, counter: Omit<OfferCounter, 'id' | 'offerId' | 'status' | 'createdAt'>) => void;
    respondToCounterOffer: (counterId: string, accept: boolean, notes?: string) => void;
    sendOfferEmail: (id: string) => { success: boolean };
    bulkSendOffers: (ids: string[]) => { sent: number; failed: number };

    // Offer templates
    addOfferTemplate: (template: Omit<OfferTemplate, 'id' | 'createdAt'>) => void;
    updateOfferTemplate: (id: string, updates: Partial<OfferTemplate>) => void;
    deleteOfferTemplate: (id: string) => void;

    // Round 2 — Resume Parser
    uploadResume: (file: { fileName: string; fileSize: number; fileType: string }, uploadedBy: string) => Promise<ParsedResume>;
    bulkUploadResumes: (files: { fileName: string; fileSize: number; fileType: string }[], uploadedBy: string) => Promise<{ parsed: number; duplicates: number; failed: number }>;
    deleteParsedResume: (id: string) => void;
    convertResumeToCandidate: (resumeId: string, jobId: string) => { candidateId: string };
    bulkConvertResumesToPipeline: (resumeIds: string[], jobId: string) => { converted: number };
    recomputeResumeMatchScores: () => void;
    clearAllResumes: () => void;

    // Round 2 — Career Page Builder
    updateCareerPageConfig: (updates: Partial<CareerPageConfig>) => void;
    addCareerPageField: (field: Omit<CareerPageField, 'id' | 'order'>) => void;
    updateCareerPageField: (id: string, updates: Partial<CareerPageField>) => void;
    deleteCareerPageField: (id: string) => void;
    reorderCareerPageFields: (orderedIds: string[]) => void;
    publishCareerPage: () => void;
    unpublishCareerPage: () => void;
    submitCareerApplication: (submission: Omit<CareerPageSubmission, 'id' | 'submittedAt' | 'status'>) => CareerPageSubmission;
    moveCareerSubmissionToPipeline: (submissionId: string, jobId: string) => { candidateId: string };
    setJobVisibilityOnCareerPage: (jobId: string, visible: boolean) => void;
    incrementCareerPageViews: () => void;

    // === API INTEGRATION ===
    // Loading flags
    loading: {
        jobs: boolean;
        candidates: boolean;
        interviews: boolean;
        offers: boolean;
    };
    hasLoaded: {
        jobs: boolean;
        candidates: boolean;
        interviews: boolean;
        offers: boolean;
    };

    // Load (GET)
    loadJobsFromApi: () => Promise<void>;
    loadCandidatesFromApi: () => Promise<void>;
    loadInterviewsFromApi: () => Promise<void>;
    loadOffersFromApi: () => Promise<void>;
    loadAllRecruitment: () => Promise<void>;

    // Jobs (full CRUD)
    addJobApi: (input: {
        title: string;
        description: string;
        department: string;   // ObjectId
        position: string;     // ObjectId
        location: string;
        type: Job['type'];
        skills?: string[];
        experience?: string;
        salaryRange?: string;
        closingDate?: string;
        openingCount?: number;
    }) => Promise<Job | null>;
    updateJobApi: (id: string, updates: Partial<Job>) => Promise<void>;
    closeJobApi: (id: string) => Promise<void>;

    // Candidates (full CRUD + stage transitions)
    addCandidateApi: (input: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        jobId: string;
        source?: string;
        stage?: Candidate['stage'];
        location?: string;
        linkedInProfile?: string;
        portfolio?: string;
        resumeUrl?: string;
        skills?: string[];
        experience?: number;
        education?: string;
        expectedSalary?: number;
        currentSalary?: number;
        noticePeriod?: string;
        tags?: string[];
    }) => Promise<Candidate | null>;
    updateCandidateApi: (id: string, updates: Partial<Candidate>) => Promise<void>;
    deleteCandidateApi: (id: string) => Promise<void>;
    moveCandidateStageApi: (id: string, stage: Candidate['stage']) => Promise<void>;

    // Interviews (full CRUD + feedback + status)
    scheduleInterviewApi: (input: {
        candidateId: string;
        jobId: string;
        interviewerId: string;
        date: string;
        time: string;
        mode: Interview['mode'];
        panel?: string[];
        followUp?: string;
    }) => Promise<Interview | null>;
    updateInterviewStatusApi: (id: string, status: Interview['status']) => Promise<void>;
    submitInterviewFeedbackApi: (id: string, data: {
        interviewerId: string;
        comments: string;
        rating: number;
    }) => Promise<void>;
    deleteInterviewApi: (id: string) => Promise<void>;

    // Offers (full CRUD + status)
    addOfferApi: (input: {
        candidateId: string;
        jobId: string;
        offerDate: string;
        baseSalary: number;
        bonus?: number;
        currency?: string;
        payFrequency?: 'Monthly' | 'Annually';
        benefits?: string[];
        jobTitle?: string;
        location?: string;
    }) => Promise<Offer | null>;
    updateOfferApi: (id: string, updates: Partial<Offer>) => Promise<void>;
    updateOfferStatusApi: (id: string, status: 'Pending' | 'Accepted' | 'Rejected', acceptedDate?: string) => Promise<void>;
    deleteOfferApi: (id: string) => Promise<void>;
}

export const useHireStore = create<HireState>()(
    persist(
        (set, get) => ({
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

            // Round 2 slices — seeds
            parsedResumes: [
                {
                    id: 'PR-001',
                    fileName: 'aarav_patel_resume.pdf',
                    fileSize: 284672,
                    fileType: 'application/pdf',
                    uploadedAt: '2026-04-10T09:30:00Z',
                    uploadedBy: 'HR Manager',
                    parseDurationMs: 1420,
                    fullName: 'Aarav Patel',
                    email: 'aarav.patel@gmail.com',
                    phone: '+91 98765 43210',
                    location: 'Mumbai, India',
                    linkedIn: 'linkedin.com/in/aaravpatel',
                    summary: 'Senior Product Designer with 6+ years shipping design systems.',
                    skills: ['Figma', 'Design Systems', 'Prototyping', 'UX Research', 'Webflow'],
                    experience: [
                        { company: 'Swiggy', title: 'Senior Product Designer', duration: '2022 - Present', description: 'Led design system revamp' },
                        { company: 'Razorpay', title: 'Product Designer', duration: '2019 - 2022' },
                    ],
                    education: [{ institution: 'NID Ahmedabad', degree: 'B.Des Product Design', year: '2019' }],
                    certifications: ['Google UX Design Professional'],
                    languages: ['English', 'Hindi', 'Gujarati'],
                    totalYearsOfExperience: 6,
                    qualityScore: 92,
                    matchScores: [
                        { jobId: 'JOB-101', jobTitle: 'Senior Product Designer', score: 94 },
                    ],
                    status: 'Parsed',
                    tags: ['Shortlist'],
                },
                {
                    id: 'PR-002',
                    fileName: 'priya_sharma.docx',
                    fileSize: 92160,
                    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    uploadedAt: '2026-04-12T14:15:00Z',
                    uploadedBy: 'HR Manager',
                    parseDurationMs: 980,
                    fullName: 'Priya Sharma',
                    email: 'priya.sharma@outlook.com',
                    phone: '+91 87654 32109',
                    location: 'Bangalore, India',
                    linkedIn: 'linkedin.com/in/priyasharma',
                    summary: 'Backend engineer specialising in Go and distributed systems.',
                    skills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka'],
                    experience: [
                        { company: 'Flipkart', title: 'SDE II', duration: '2023 - Present' },
                        { company: 'Freshworks', title: 'SDE I', duration: '2020 - 2023' },
                    ],
                    education: [{ institution: 'IIIT Hyderabad', degree: 'B.Tech CSE', year: '2020' }],
                    certifications: ['CKAD'],
                    languages: ['English', 'Hindi', 'Telugu'],
                    totalYearsOfExperience: 4,
                    qualityScore: 88,
                    matchScores: [
                        { jobId: 'JOB-102', jobTitle: 'Backend Engineer (Go)', score: 91 },
                    ],
                    status: 'Parsed',
                },
            ],
            careerPageConfig: {
                logoUrl: undefined,
                logoName: undefined,
                bannerUrl: undefined,
                bannerName: undefined,
                brandColor: '#8B5CF6',
                theme: 'Modern',
                tagline: 'Build with us. Grow with us.',
                about: 'Fixl Solutions is building the next-gen CRM for growing teams. We hire for curiosity, clarity, and craft.',
                perks: [
                    { icon: 'Heart', title: 'Health & Wellness', description: 'Premium health cover + mental health support.' },
                    { icon: 'Plane', title: 'Work from anywhere', description: 'Fully remote + annual offsites.' },
                    { icon: 'GraduationCap', title: 'Learning budget', description: '₹50,000/year for courses, books, conferences.' },
                ],
                slug: 'fixl-solutions',
                publicUrl: 'https://careers.fixlsolutions.com',
                formFields: [
                    { id: 'F-1', label: 'Full Name', type: 'text', required: true, enabled: true, order: 0, placeholder: 'Jane Doe' },
                    { id: 'F-2', label: 'Email', type: 'email', required: true, enabled: true, order: 1, placeholder: 'jane@example.com' },
                    { id: 'F-3', label: 'Phone', type: 'phone', required: true, enabled: true, order: 2, placeholder: '+91 …' },
                    { id: 'F-4', label: 'Resume', type: 'file', required: true, enabled: true, order: 3, helperText: 'PDF or DOCX, max 10MB' },
                    { id: 'F-5', label: 'LinkedIn', type: 'url', required: false, enabled: true, order: 4, placeholder: 'https://linkedin.com/in/…' },
                    { id: 'F-6', label: 'Portfolio / GitHub', type: 'url', required: false, enabled: true, order: 5 },
                    { id: 'F-7', label: 'Cover Letter', type: 'textarea', required: false, enabled: true, order: 6, placeholder: 'Why do you want to join us?' },
                    { id: 'F-8', label: 'Referral (optional)', type: 'text', required: false, enabled: false, order: 7 },
                ],
                socialEnabled: { linkedin: true, twitter: true, facebook: false, whatsapp: true },
                seoTitle: 'Careers at Fixl Solutions',
                seoDescription: 'Join Fixl — building the future of CRM.',
                seoKeywords: ['careers', 'jobs', 'fixl', 'crm', 'hiring'],
                isPublished: true,
                publishedAt: '2026-01-02T10:00:00Z',
                lastModifiedAt: '2026-04-15T08:30:00Z',
                views: 3245,
                applications: 187,
                jobVisibility: { 'JOB-101': true, 'JOB-102': true },
            },
            careerSubmissions: [
                { id: 'SUB-1', jobId: 'JOB-101', jobTitle: 'Senior Product Designer', submittedAt: '2026-04-14T11:30:00Z', data: { 'F-1': 'Rohan Kapoor', 'F-2': 'rohan@example.com', 'F-3': '+91 99887 66554', 'F-5': 'linkedin.com/in/rohank' }, status: 'New' },
                { id: 'SUB-2', jobId: 'JOB-102', jobTitle: 'Backend Engineer (Go)', submittedAt: '2026-04-12T16:00:00Z', data: { 'F-1': 'Sneha Iyer', 'F-2': 'sneha.iyer@example.com', 'F-3': '+91 90887 66123' }, status: 'Moved to Pipeline', candidateId: 'CAN-502' },
            ] as CareerPageSubmission[],
            offerTemplates: [
                {
                    id: 'OT-1', name: 'Standard Permanent', type: 'Permanent',
                    description: 'Default full-time permanent offer with standard breakdown.',
                    salaryStructure: [
                        { component: 'Basic', percentOfCtc: 40, isTaxable: true },
                        { component: 'HRA', percentOfCtc: 20, isTaxable: true },
                        { component: 'Special Allowance', percentOfCtc: 30, isTaxable: true },
                        { component: 'Provident Fund (Employer)', percentOfCtc: 5, isTaxable: false },
                        { component: 'Performance Bonus', percentOfCtc: 5, isTaxable: true },
                    ],
                    defaultBenefits: ['Health Insurance (Self + Family)', 'Annual Leave: 24 days', 'Learning Budget: ₹50,000/yr', 'Team Offsite'],
                    defaultClauses: [
                        { title: 'Confidentiality', body: 'You agree to maintain confidentiality of proprietary information...' },
                        { title: 'Non-Compete', body: 'For 12 months post-exit, you will not join a direct competitor...' },
                    ],
                    isDefault: true, isActive: true, createdBy: 'HR Manager', createdAt: '2025-04-01T00:00:00Z',
                },
                {
                    id: 'OT-2', name: 'Contract 6mo', type: 'Contract',
                    description: 'Fixed-term contract — 6 months.',
                    salaryStructure: [
                        { component: 'Consultancy Fee', percentOfCtc: 100, isTaxable: true },
                    ],
                    defaultBenefits: ['Pro-rata leave'],
                    defaultClauses: [
                        { title: 'Term', body: 'This contract is valid for 6 months from joining date...' },
                    ],
                    isDefault: false, isActive: true, createdBy: 'HR Manager', createdAt: '2025-06-01T00:00:00Z',
                },
                {
                    id: 'OT-3', name: 'Internship', type: 'Internship',
                    description: 'Paid internship — 3 to 6 months.',
                    salaryStructure: [
                        { component: 'Stipend', percentOfCtc: 100, isTaxable: false },
                    ],
                    defaultBenefits: ['Mentorship', 'Learning budget ₹10,000'],
                    defaultClauses: [
                        { title: 'Duration', body: 'Internship duration is 3 months with possible extension to 6 months...' },
                    ],
                    isDefault: false, isActive: true, createdBy: 'HR Manager', createdAt: '2025-06-01T00:00:00Z',
                },
                {
                    id: 'OT-4', name: 'Part-Time', type: 'Part-Time',
                    description: 'Part-time hourly engagement.',
                    salaryStructure: [
                        { component: 'Hourly Rate', percentOfCtc: 100, isTaxable: true },
                    ],
                    defaultBenefits: ['Flexible hours'],
                    defaultClauses: [],
                    isDefault: false, isActive: true, createdBy: 'HR Manager', createdAt: '2025-06-01T00:00:00Z',
                },
                {
                    id: 'OT-5', name: 'Fully Remote', type: 'Remote',
                    description: 'Permanent fully-remote role.',
                    salaryStructure: [
                        { component: 'Basic', percentOfCtc: 50, isTaxable: true },
                        { component: 'Remote Allowance', percentOfCtc: 20, isTaxable: true },
                        { component: 'Special Allowance', percentOfCtc: 25, isTaxable: true },
                        { component: 'Performance Bonus', percentOfCtc: 5, isTaxable: true },
                    ],
                    defaultBenefits: ['Home office setup ₹75,000', 'Co-working reimbursement', 'Annual offsite'],
                    defaultClauses: [
                        { title: 'Work Location', body: 'This is a fully remote role. You may work from anywhere in India...' },
                    ],
                    isDefault: false, isActive: true, createdBy: 'HR Manager', createdAt: '2025-06-01T00:00:00Z',
                },
            ],

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

            // --- Offer Actions (Round 2 version is below with version field) ---
            updateOffer: (id, updates) => set((state) => ({
                offers: state.offers.map(o => o.id === id ? { ...o, ...updates } : o)
            })),
            deleteOffer: (id) => set((state) => ({
                offers: state.offers.filter(o => o.id !== id)
            })),
            submitOfferForApproval: (id) => set((state) => ({
                offers: state.offers.map(o => o.id === id ? { ...o, approvalStatus: 'Pending Approval' } : o)
            })),

            // ==================== ROUND 2 ACTIONS ====================

            // ── Interview advanced ──
            rescheduleInterview: (id, newDate, newTime, reason) => set((state) => ({
                interviews: state.interviews.map(i => i.id === id ? {
                    ...i,
                    date: newDate,
                    time: newTime,
                    status: 'Rescheduled' as const,
                    rescheduleCount: (i.rescheduleCount ?? 0) + 1,
                } : i)
            })),

            markInterviewOutcome: (id, outcome, notes) => set((state) => ({
                interviews: state.interviews.map(i => i.id === id ? {
                    ...i,
                    outcome,
                    status: 'Completed' as const,
                    preparationNotes: notes ?? i.preparationNotes,
                } : i)
            })),

            sendInterviewReminder: (id) => set((state) => ({
                interviews: state.interviews.map(i => i.id === id ? {
                    ...i,
                    reminderSentAt: new Date().toISOString(),
                } : i)
            })),

            bulkRescheduleInterviews: (ids, newDate) => {
                let updated = 0;
                set((state) => ({
                    interviews: state.interviews.map(i => {
                        if (!ids.includes(i.id)) return i;
                        updated++;
                        return { ...i, date: newDate, status: 'Rescheduled' as const, rescheduleCount: (i.rescheduleCount ?? 0) + 1 };
                    })
                }));
                return { updated };
            },

            detectInterviewConflicts: (interviewerIds, date, time, duration, excludeId) => {
                const state = get();
                const conflicts: { employeeId: string; conflictingTitle: string; conflictingTime: string }[] = [];
                // Parse time to minutes
                const toMinutes = (t: string) => {
                    const [h, m] = t.split(':').map(Number);
                    return (h || 0) * 60 + (m || 0);
                };
                const durationMin = duration?.includes('30') ? 30 : duration?.includes('1.5') ? 90 : 60;
                const newStart = toMinutes(time);
                const newEnd = newStart + durationMin;
                state.interviews.forEach(i => {
                    if (i.id === excludeId) return;
                    if (i.date !== date) return;
                    if (i.status === 'Cancelled' || i.status === 'Completed') return;
                    const iStart = toMinutes(i.time);
                    const iEnd = iStart + (i.duration?.includes('30') ? 30 : i.duration?.includes('1.5') ? 90 : 60);
                    const overlap = !(newEnd <= iStart || newStart >= iEnd);
                    if (!overlap) return;
                    // Check interviewer overlap
                    const iInterviewers = i.panel?.map(p => p.employeeId) ?? i.interviewers ?? [];
                    const clashed = iInterviewers.filter(e => interviewerIds.includes(e));
                    clashed.forEach(emp => conflicts.push({
                        employeeId: emp,
                        conflictingTitle: i.title,
                        conflictingTime: `${i.date} ${i.time}`,
                    }));
                });
                return conflicts;
            },

            // ── Offer advanced ──
            addOffer: (offer) => set((state) => ({
                offers: [{
                    ...offer,
                    id: `OFF-${Math.floor(Math.random() * 10000)}`,
                    approvalStatus: 'Draft',
                    version: 1,
                    history: [{ id: `LOG-${Date.now()}`, action: 'Drafted', details: 'Offer draft created', timestamp: new Date().toISOString(), performer: 'User' }],
                    createdAt: new Date().toISOString()
                }, ...state.offers]
            })),

            createOfferVersion: (id, changes, createdBy) => set((state) => ({
                offers: state.offers.map(o => {
                    if (o.id !== id) return o;
                    const newVersion = (o.version ?? 1) + 1;
                    const versionEntry: OfferVersion = {
                        version: newVersion,
                        createdAt: new Date().toISOString(),
                        createdBy,
                        changes,
                        totalCtc: o.totalCtc,
                        joiningDate: o.joiningDate,
                    };
                    return {
                        ...o,
                        version: newVersion,
                        versions: [...(o.versions ?? []), versionEntry],
                        history: [...o.history, { id: `LOG-${Date.now()}`, action: 'Version Created', details: `v${newVersion}: ${changes}`, timestamp: new Date().toISOString(), performer: createdBy }],
                    };
                })
            })),

            sendOfferForSignature: (id) => {
                const acceptanceLink = `/offer/accept/${id}?token=${Math.random().toString(36).slice(2, 10)}`;
                set((state) => ({
                    offers: state.offers.map(o => o.id === id ? {
                        ...o,
                        signatureStatus: 'Sent' as const,
                        signatureSentAt: new Date().toISOString(),
                        acceptanceLink,
                        approvalStatus: 'Sent' as const,
                        history: [...o.history, { id: `LOG-${Date.now()}`, action: 'Sent for signature', details: 'Candidate notified via email', timestamp: new Date().toISOString(), performer: 'HR' }],
                    } : o)
                }));
                return { acceptanceLink };
            },

            markOfferSigned: (id, signedIp) => set((state) => ({
                offers: state.offers.map(o => o.id === id ? {
                    ...o,
                    signatureStatus: 'Signed' as const,
                    signedAt: new Date().toISOString(),
                    signedIp,
                    approvalStatus: 'Accepted' as const,
                    history: [...o.history, { id: `LOG-${Date.now()}`, action: 'Signed', details: 'Candidate signed the offer', timestamp: new Date().toISOString(), performer: 'Candidate' }],
                } : o)
            })),

            markOfferDeclined: (id, reason) => set((state) => ({
                offers: state.offers.map(o => o.id === id ? {
                    ...o,
                    signatureStatus: 'Declined' as const,
                    approvalStatus: 'Rejected' as const,
                    history: [...o.history, { id: `LOG-${Date.now()}`, action: 'Declined', details: reason ?? 'Candidate declined the offer', timestamp: new Date().toISOString(), performer: 'Candidate' }],
                } : o)
            })),

            submitCounterOffer: (offerId, counter) => set((state) => ({
                offers: state.offers.map(o => o.id === offerId ? {
                    ...o,
                    counterOffers: [...(o.counterOffers ?? []), {
                        id: `CTR-${Date.now()}`,
                        offerId,
                        status: 'Pending' as const,
                        createdAt: new Date().toISOString(),
                        ...counter,
                    }],
                    history: [...o.history, { id: `LOG-${Date.now()}`, action: 'Counter Offer', details: `Counter offer requested by ${counter.requestedBy}`, timestamp: new Date().toISOString(), performer: counter.requestedBy }],
                } : o)
            })),

            respondToCounterOffer: (counterId, accept, notes) => set((state) => ({
                offers: state.offers.map(o => {
                    if (!o.counterOffers?.some(c => c.id === counterId)) return o;
                    return {
                        ...o,
                        counterOffers: o.counterOffers.map(c => c.id === counterId ? {
                            ...c,
                            status: accept ? 'Accepted' as const : 'Rejected' as const,
                            respondedAt: new Date().toISOString(),
                            notes: notes ? `${c.notes}\n→ ${notes}` : c.notes,
                        } : c),
                        history: [...o.history, { id: `LOG-${Date.now()}`, action: accept ? 'Counter Accepted' : 'Counter Rejected', details: notes ?? '', timestamp: new Date().toISOString(), performer: 'HR' }],
                    };
                })
            })),

            sendOfferEmail: (id) => {
                const offer = get().offers.find(o => o.id === id);
                if (!offer) return { success: false };
                // Deterministic "success" 90% of time based on id
                const success = id.charCodeAt(id.length - 1) % 10 !== 0;
                set((state) => ({
                    offers: state.offers.map(o => o.id === id ? {
                        ...o,
                        emailedAt: new Date().toISOString(),
                        emailStatus: success ? 'Sent' as const : 'Bounced' as const,
                        history: [...o.history, { id: `LOG-${Date.now()}`, action: success ? 'Emailed' : 'Email Bounced', details: `To ${o.candidateEmail ?? o.candidateName}`, timestamp: new Date().toISOString(), performer: 'System' }],
                    } : o)
                }));
                return { success };
            },

            bulkSendOffers: (ids) => {
                let sent = 0, failed = 0;
                ids.forEach(id => {
                    const r = get().sendOfferEmail(id);
                    if (r.success) sent++; else failed++;
                });
                return { sent, failed };
            },

            addOfferTemplate: (template) => set((state) => ({
                offerTemplates: [...state.offerTemplates, { ...template, id: `OT-${Date.now()}`, createdAt: new Date().toISOString() }]
            })),

            updateOfferTemplate: (id, updates) => set((state) => ({
                offerTemplates: state.offerTemplates.map(t => t.id === id ? { ...t, ...updates } : t)
            })),

            deleteOfferTemplate: (id) => set((state) => ({
                offerTemplates: state.offerTemplates.filter(t => t.id !== id)
            })),

            // ── Resume Parser ──
            uploadResume: async (file, uploadedBy) => {
                const t0 = Date.now();
                // Mock parsing: deterministic based on filename hash
                const hashCode = (s: string) => s.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
                const h = Math.abs(hashCode(file.fileName));
                const FIRST = ['Aarav', 'Priya', 'Vikram', 'Ananya', 'Rohan', 'Sneha', 'Karan', 'Meera', 'Arjun', 'Kavya'];
                const LAST = ['Patel', 'Sharma', 'Singh', 'Iyer', 'Kapoor', 'Reddy', 'Nair', 'Joshi', 'Gupta', 'Rao'];
                const SKILLS_PARAGRAPH = [
                    ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL'],
                    ['Figma', 'Design Systems', 'Prototyping', 'UX Research'],
                    ['Python', 'Django', 'Celery', 'Redis', 'Docker'],
                    ['Go', 'Kubernetes', 'gRPC', 'Kafka', 'PostgreSQL'],
                    ['Java', 'Spring Boot', 'Kafka', 'AWS', 'MySQL'],
                    ['Product Management', 'User Research', 'Agile', 'Jira'],
                ];
                const firstName = FIRST[h % FIRST.length];
                const lastName = LAST[(h >> 3) % LAST.length];
                const skills = SKILLS_PARAGRAPH[h % SKILLS_PARAGRAPH.length];

                // Check duplicate by email
                const mockEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${h % 100}@gmail.com`;
                const existingResume = get().parsedResumes.find(r => r.email === mockEmail);
                const existingCandidate = get().candidates.find(c => c.email === mockEmail);
                const isDuplicate = !!(existingResume || existingCandidate);

                await new Promise((resolve) => setTimeout(resolve, 400));  // Simulate parse time

                const yearsExp = 2 + (h % 8);
                const jobs = get().jobs;
                const matchScores = jobs.map(j => {
                    const intersection = skills.filter(s => j.skills.map(x => x.toLowerCase()).includes(s.toLowerCase())).length;
                    const score = Math.min(98, 55 + intersection * 10 + ((h % 20) - 10));
                    return { jobId: j.id, jobTitle: j.title, score: Math.max(35, score) };
                }).sort((a, b) => b.score - a.score).slice(0, 3);

                const resume: ParsedResume = {
                    id: `PR-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    fileName: file.fileName,
                    fileSize: file.fileSize,
                    fileType: file.fileType,
                    uploadedAt: new Date().toISOString(),
                    uploadedBy,
                    parseDurationMs: Date.now() - t0,
                    fullName: `${firstName} ${lastName}`,
                    email: mockEmail,
                    phone: `+91 ${90000 + (h % 9000)} ${10000 + (h % 90000)}`.slice(0, 15),
                    location: ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'][h % 6] + ', India',
                    linkedIn: `linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
                    summary: `${yearsExp}+ years of experience in ${skills.slice(0, 2).join(' and ')}.`,
                    skills,
                    experience: [
                        { company: 'Current Company', title: skills[0] + ' Engineer', duration: `${2026 - Math.floor(yearsExp / 2)} - Present` },
                        { company: 'Previous Company', title: 'Engineer', duration: `${2026 - yearsExp} - ${2026 - Math.floor(yearsExp / 2)}` },
                    ],
                    education: [{ institution: ['IIT Bombay', 'IIIT Hyderabad', 'NIT Trichy', 'BITS Pilani'][h % 4], degree: 'B.Tech', year: String(2026 - yearsExp) }],
                    certifications: skills.length > 3 ? [`${skills[0]} Professional`] : [],
                    languages: ['English', 'Hindi'],
                    totalYearsOfExperience: yearsExp,
                    qualityScore: 65 + (h % 35),
                    matchScores,
                    status: isDuplicate ? 'Duplicate' : 'Parsed',
                    duplicateOf: existingCandidate?.id ?? existingResume?.id,
                };
                set((state) => ({ parsedResumes: [resume, ...state.parsedResumes] }));
                return resume;
            },

            bulkUploadResumes: async (files, uploadedBy) => {
                let parsed = 0, duplicates = 0, failed = 0;
                for (const f of files) {
                    try {
                        const r = await get().uploadResume(f, uploadedBy);
                        if (r.status === 'Duplicate') duplicates++; else parsed++;
                    } catch {
                        failed++;
                    }
                }
                return { parsed, duplicates, failed };
            },

            deleteParsedResume: (id) => set((state) => ({
                parsedResumes: state.parsedResumes.filter(r => r.id !== id)
            })),

            convertResumeToCandidate: (resumeId, jobId) => {
                const state = get();
                const resume = state.parsedResumes.find(r => r.id === resumeId);
                if (!resume) return { candidateId: '' };
                const [firstName, ...rest] = resume.fullName.split(' ');
                const lastName = rest.join(' ');
                const candidateId = `CAN-${Math.floor(Math.random() * 10000)}`;
                const newCandidate: Candidate = {
                    id: candidateId,
                    jobId,
                    firstName,
                    lastName,
                    email: resume.email,
                    phone: resume.phone,
                    location: resume.location ?? '',
                    source: 'Resume Parser',
                    resumeUrl: undefined,
                    parsedSkills: resume.skills,
                    tags: resume.tags ?? [],
                    stage: 'New',
                    stageEnteredDate: new Date().toISOString(),
                    rating: 0,
                    communicationLog: [{ id: `LOG-${Date.now()}`, action: 'Added to Pipeline', details: `From parsed resume ${resume.fileName}`, timestamp: new Date().toISOString(), performer: 'HR' }],
                    notes: [],
                    appliedDate: new Date().toLocaleDateString(),
                };
                set((s) => ({
                    candidates: [newCandidate, ...s.candidates],
                    parsedResumes: s.parsedResumes.map(r => r.id === resumeId ? { ...r, status: 'Converted' as const, addedToPipelineAs: candidateId } : r),
                }));
                return { candidateId };
            },

            bulkConvertResumesToPipeline: (resumeIds, jobId) => {
                let converted = 0;
                resumeIds.forEach(id => {
                    const resume = get().parsedResumes.find(r => r.id === id);
                    if (resume && resume.status === 'Parsed') {
                        get().convertResumeToCandidate(id, jobId);
                        converted++;
                    }
                });
                return { converted };
            },

            recomputeResumeMatchScores: () => {
                const jobs = get().jobs;
                set((state) => ({
                    parsedResumes: state.parsedResumes.map(r => {
                        const matchScores = jobs.map(j => {
                            const intersection = r.skills.filter(s => j.skills.map(x => x.toLowerCase()).includes(s.toLowerCase())).length;
                            const score = Math.min(98, 55 + intersection * 10);
                            return { jobId: j.id, jobTitle: j.title, score: Math.max(35, score) };
                        }).sort((a, b) => b.score - a.score).slice(0, 3);
                        return { ...r, matchScores };
                    })
                }));
            },

            clearAllResumes: () => set({ parsedResumes: [] }),

            // ── Career Page Builder ──
            updateCareerPageConfig: (updates) => set((state) => ({
                careerPageConfig: {
                    ...state.careerPageConfig,
                    ...updates,
                    lastModifiedAt: new Date().toISOString(),
                }
            })),

            addCareerPageField: (field) => set((state) => ({
                careerPageConfig: {
                    ...state.careerPageConfig,
                    formFields: [
                        ...state.careerPageConfig.formFields,
                        { ...field, id: `F-${Date.now()}`, order: state.careerPageConfig.formFields.length },
                    ],
                    lastModifiedAt: new Date().toISOString(),
                }
            })),

            updateCareerPageField: (id, updates) => set((state) => ({
                careerPageConfig: {
                    ...state.careerPageConfig,
                    formFields: state.careerPageConfig.formFields.map(f => f.id === id ? { ...f, ...updates } : f),
                    lastModifiedAt: new Date().toISOString(),
                }
            })),

            deleteCareerPageField: (id) => set((state) => ({
                careerPageConfig: {
                    ...state.careerPageConfig,
                    formFields: state.careerPageConfig.formFields.filter(f => f.id !== id),
                    lastModifiedAt: new Date().toISOString(),
                }
            })),

            reorderCareerPageFields: (orderedIds) => set((state) => ({
                careerPageConfig: {
                    ...state.careerPageConfig,
                    formFields: state.careerPageConfig.formFields.map(f => {
                        const newOrder = orderedIds.indexOf(f.id);
                        return newOrder === -1 ? f : { ...f, order: newOrder };
                    }),
                    lastModifiedAt: new Date().toISOString(),
                }
            })),

            publishCareerPage: () => set((state) => ({
                careerPageConfig: {
                    ...state.careerPageConfig,
                    isPublished: true,
                    publishedAt: new Date().toISOString(),
                    lastModifiedAt: new Date().toISOString(),
                }
            })),

            unpublishCareerPage: () => set((state) => ({
                careerPageConfig: {
                    ...state.careerPageConfig,
                    isPublished: false,
                    lastModifiedAt: new Date().toISOString(),
                }
            })),

            submitCareerApplication: (submission) => {
                const sub: CareerPageSubmission = {
                    ...submission,
                    id: `SUB-${Date.now()}`,
                    submittedAt: new Date().toISOString(),
                    status: 'New',
                };
                set((state) => ({
                    careerSubmissions: [sub, ...state.careerSubmissions],
                    careerPageConfig: {
                        ...state.careerPageConfig,
                        applications: state.careerPageConfig.applications + 1,
                        lastModifiedAt: new Date().toISOString(),
                    },
                }));
                return sub;
            },

            moveCareerSubmissionToPipeline: (submissionId, jobId) => {
                const state = get();
                const sub = state.careerSubmissions.find(s => s.id === submissionId);
                if (!sub) return { candidateId: '' };
                const fullName = sub.data['F-1'] ?? 'Unknown Candidate';
                const [firstName, ...rest] = fullName.split(' ');
                const candidateId = `CAN-${Math.floor(Math.random() * 10000)}`;
                const newCandidate: Candidate = {
                    id: candidateId,
                    jobId,
                    firstName: firstName ?? 'Unknown',
                    lastName: rest.join(' '),
                    email: sub.data['F-2'] ?? '',
                    phone: sub.data['F-3'] ?? '',
                    location: '',
                    source: 'Career Page',
                    parsedSkills: [],
                    tags: [],
                    stage: 'New',
                    stageEnteredDate: new Date().toISOString(),
                    rating: 0,
                    communicationLog: [{ id: `LOG-${Date.now()}`, action: 'Applied via Career Page', details: `Via ${sub.jobTitle ?? 'direct'}`, timestamp: sub.submittedAt, performer: 'Candidate' }],
                    notes: [],
                    appliedDate: new Date(sub.submittedAt).toLocaleDateString(),
                };
                set((s) => ({
                    candidates: [newCandidate, ...s.candidates],
                    careerSubmissions: s.careerSubmissions.map(x => x.id === submissionId ? { ...x, status: 'Moved to Pipeline' as const, candidateId } : x),
                }));
                return { candidateId };
            },

            setJobVisibilityOnCareerPage: (jobId, visible) => set((state) => ({
                careerPageConfig: {
                    ...state.careerPageConfig,
                    jobVisibility: { ...state.careerPageConfig.jobVisibility, [jobId]: visible },
                    lastModifiedAt: new Date().toISOString(),
                }
            })),

            incrementCareerPageViews: () => set((state) => ({
                careerPageConfig: { ...state.careerPageConfig, views: state.careerPageConfig.views + 1 }
            })),

            // ==================== API INTEGRATION ====================
            loading: { jobs: false, candidates: false, interviews: false, offers: false },
            hasLoaded: { jobs: false, candidates: false, interviews: false, offers: false },

            // ---------- LOAD (GET) ----------
            loadJobsFromApi: async () => {
                set((s) => ({ loading: { ...s.loading, jobs: true } }));
                try {
                    const res = await getAllJobs();
                    const data = res?.data?.jobs ?? res?.data?.data ?? res?.data ?? [];
                    if (Array.isArray(data)) {
                        const mapped = data.map(mapJobFromApi);
                        set({ jobs: mapped });
                    }
                    set((s) => ({ hasLoaded: { ...s.hasLoaded, jobs: true } }));
                } catch (err) {
                    console.error("Failed to load jobs:", err);
                } finally {
                    set((s) => ({ loading: { ...s.loading, jobs: false } }));
                }
            },

            loadCandidatesFromApi: async () => {
                set((s) => ({ loading: { ...s.loading, candidates: true } }));
                try {
                    const res = await getAllCandidates();
                    const data = res?.data?.candidates ?? res?.data?.data ?? res?.data ?? [];
                    if (Array.isArray(data)) {
                        const mapped = data.map(mapCandidateFromApi);
                        set({ candidates: mapped });
                    }
                    set((s) => ({ hasLoaded: { ...s.hasLoaded, candidates: true } }));
                } catch (err) {
                    console.error("Failed to load candidates:", err);
                } finally {
                    set((s) => ({ loading: { ...s.loading, candidates: false } }));
                }
            },

            loadInterviewsFromApi: async () => {
                set((s) => ({ loading: { ...s.loading, interviews: true } }));
                try {
                    const res = await getAllInterviews();
                    const data = res?.data?.interviews ?? res?.data?.data ?? res?.data ?? [];
                    if (Array.isArray(data)) {
                        const mapped = data.map(mapInterviewFromApi);
                        set({ interviews: mapped });
                    }
                    set((s) => ({ hasLoaded: { ...s.hasLoaded, interviews: true } }));
                } catch (err) {
                    console.error("Failed to load interviews:", err);
                } finally {
                    set((s) => ({ loading: { ...s.loading, interviews: false } }));
                }
            },

            loadOffersFromApi: async () => {
                set((s) => ({ loading: { ...s.loading, offers: true } }));
                try {
                    const res = await getAllOffers();
                    const data = res?.data?.offers ?? res?.data?.data ?? res?.data ?? [];
                    if (Array.isArray(data)) {
                        const mapped = data.map(mapOfferFromApi);
                        set({ offers: mapped });
                    }
                    set((s) => ({ hasLoaded: { ...s.hasLoaded, offers: true } }));
                } catch (err) {
                    console.error("Failed to load offers:", err);
                } finally {
                    set((s) => ({ loading: { ...s.loading, offers: false } }));
                }
            },

            loadAllRecruitment: async () => {
                await Promise.all([
                    (get() as HireState).loadJobsFromApi(),
                    (get() as HireState).loadCandidatesFromApi(),
                    (get() as HireState).loadInterviewsFromApi(),
                    (get() as HireState).loadOffersFromApi(),
                ]);
            },

            // ---------- JOBS (CRUD) ----------
            addJobApi: async (input) => {
                try {
                    const payload = mapJobToCreatePayload(input);
                    const res = await createJobPosting(payload);
                    const created = res?.data?.job ?? res?.data ?? null;
                    if (!created) {
                        showError("Job created but no data returned");
                        return null;
                    }
                    const job = mapJobFromApi(created);
                    set((s) => ({ jobs: [job, ...s.jobs] }));
                    showSuccess("Job posted successfully");
                    return job;
                } catch {
                    return null;
                }
            },

            updateJobApi: async (id, updates) => {
                try {
                    const payload = mapJobToUpdatePayload(updates);
                    const res = await updateJobPosting(id, payload);
                    const updated = res?.data?.job ?? res?.data ?? null;
                    if (updated) {
                        const job = mapJobFromApi(updated);
                        set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? job : j)) }));
                    } else {
                        set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)) }));
                    }
                    showSuccess("Job updated");
                } catch {
                    /* toast already fired in hook */
                }
            },

            closeJobApi: async (id) => {
                try {
                    await closeJobPosting(id);
                    set((s) => ({
                        jobs: s.jobs.map((j) =>
                            j.id === id ? { ...j, workflowStatus: "Closed" as Job["workflowStatus"] } : j
                        ),
                    }));
                    showSuccess("Job closed");
                } catch {
                    /* */
                }
            },

            // ---------- CANDIDATES (CRUD + stage) ----------
            addCandidateApi: async (input) => {
                try {
                    const payload = mapCandidateToCreatePayload(input);
                    const res = await apiCreateCandidate(payload as any);
                    const created = res?.data?.candidate ?? res?.data ?? null;
                    if (!created) {
                        showError("Candidate created but no data returned");
                        return null;
                    }
                    const cand = mapCandidateFromApi(created);
                    if (input.tags && input.tags.length) cand.tags = input.tags;
                    set((s) => ({ candidates: [cand, ...s.candidates] }));
                    showSuccess("Candidate added");
                    return cand;
                } catch {
                    return null;
                }
            },

            updateCandidateApi: async (id, updates) => {
                try {
                    const payload = mapCandidateToUpdatePayload(updates);
                    const res = await apiUpdateCandidate(id, payload);
                    const updated = res?.data?.candidate ?? res?.data ?? null;
                    if (updated) {
                        const cand = mapCandidateFromApi(updated);
                        set((s) => ({
                            candidates: s.candidates.map((c) => (c.id === id ? cand : c)),
                        }));
                    } else {
                        set((s) => ({
                            candidates: s.candidates.map((c) =>
                                c.id === id ? { ...c, ...updates } : c
                            ),
                        }));
                    }
                    showSuccess("Candidate updated");
                } catch {
                    /* */
                }
            },

            deleteCandidateApi: async (id) => {
                try {
                    await apiDeleteCandidate(id);
                    set((s) => ({ candidates: s.candidates.filter((c) => c.id !== id) }));
                    showSuccess("Candidate deleted");
                } catch {
                    /* */
                }
            },

            moveCandidateStageApi: async (id, stage) => {
                try {
                    const beStatus = candidateStageFeToBe(stage);
                    await apiUpdateCandidateStatus(id, beStatus);
                    set((s) => ({
                        candidates: s.candidates.map((c) =>
                            c.id === id
                                ? {
                                      ...c,
                                      stage,
                                      stageEnteredDate: new Date().toISOString(),
                                      communicationLog: [
                                          ...c.communicationLog,
                                          {
                                              id: `LOG-${Date.now()}`,
                                              action: "Stage Changed",
                                              details: `Moved to ${stage}`,
                                              timestamp: new Date().toISOString(),
                                              performer: "User",
                                          },
                                      ],
                                  }
                                : c
                        ),
                    }));
                    showSuccess(`Moved to ${stage}`);
                } catch {
                    /* */
                }
            },

            // ---------- INTERVIEWS (CRUD + feedback + status) ----------
            scheduleInterviewApi: async (input) => {
                try {
                    const payload = mapInterviewToCreatePayload(input);
                    const res = await apiCreateInterview(payload);
                    const created = res?.data?.interview ?? res?.data ?? null;
                    if (!created) {
                        showError("Interview created but no data returned");
                        return null;
                    }
                    const iv = mapInterviewFromApi(created);
                    set((s) => ({ interviews: [iv, ...s.interviews] }));
                    showSuccess("Interview scheduled");
                    return iv;
                } catch {
                    return null;
                }
            },

            updateInterviewStatusApi: async (id, status) => {
                try {
                    const beStatus = interviewStatusFeToBe(status);
                    await apiUpdateInterviewStatus(id, beStatus);
                    set((s) => ({
                        interviews: s.interviews.map((i) =>
                            i.id === id ? { ...i, status } : i
                        ),
                    }));
                    showSuccess(`Status updated to ${status}`);
                } catch {
                    /* */
                }
            },

            submitInterviewFeedbackApi: async (id, data) => {
                try {
                    const res = await apiSubmitInterviewFeedback(id, data);
                    const updated = res?.data?.interview ?? null;
                    if (updated) {
                        const iv = mapInterviewFromApi(updated);
                        set((s) => ({
                            interviews: s.interviews.map((i) => (i.id === id ? iv : i)),
                        }));
                    } else {
                        set((s) => ({
                            interviews: s.interviews.map((i) =>
                                i.id === id
                                    ? {
                                          ...i,
                                          status: "Completed",
                                          scorecards: [
                                              ...i.scorecards,
                                              {
                                                  interviewerId: data.interviewerId,
                                                  skillsRating: [],
                                                  overallScore: data.rating,
                                                  feedback: data.comments,
                                                  submittedAt: new Date().toISOString(),
                                              },
                                          ],
                                      }
                                    : i
                            ),
                        }));
                    }
                    showSuccess("Feedback submitted");
                } catch {
                    /* */
                }
            },

            deleteInterviewApi: async (id) => {
                try {
                    await apiDeleteInterview(id);
                    set((s) => ({ interviews: s.interviews.filter((i) => i.id !== id) }));
                    showSuccess("Interview deleted");
                } catch {
                    /* */
                }
            },

            // ---------- OFFERS (CRUD + status) ----------
            addOfferApi: async (input) => {
                try {
                    const payload = mapOfferToCreatePayload(input);
                    const res = await apiCreateOffer(payload);
                    const created = res?.data?.offer ?? res?.data ?? null;
                    if (!created) {
                        showError("Offer created but no data returned");
                        return null;
                    }
                    const offer = mapOfferFromApi(created);
                    set((s) => ({ offers: [offer, ...s.offers] }));
                    showSuccess("Offer created");
                    return offer;
                } catch {
                    return null;
                }
            },

            updateOfferApi: async (id, updates) => {
                try {
                    const payload = mapOfferToUpdatePayload(updates);
                    const res = await apiUpdateOffer(id, payload);
                    const updated = res?.data?.offer ?? res?.data ?? null;
                    if (updated) {
                        const offer = mapOfferFromApi(updated);
                        set((s) => ({ offers: s.offers.map((o) => (o.id === id ? offer : o)) }));
                    } else {
                        set((s) => ({ offers: s.offers.map((o) => (o.id === id ? { ...o, ...updates } : o)) }));
                    }
                    showSuccess("Offer updated");
                } catch {
                    /* */
                }
            },

            updateOfferStatusApi: async (id, status, acceptedDate) => {
                try {
                    await apiUpdateOfferStatus(id, status, acceptedDate ?? new Date().toISOString());
                    const feStatus = status === "Accepted" ? "Accepted" : status === "Rejected" ? "Rejected" : "Sent";
                    set((s) => ({
                        offers: s.offers.map((o) =>
                            o.id === id
                                ? { ...o, approvalStatus: feStatus as Offer["approvalStatus"] }
                                : o
                        ),
                    }));
                    showSuccess(`Offer ${status.toLowerCase()}`);
                } catch {
                    /* */
                }
            },

            deleteOfferApi: async (id) => {
                try {
                    await apiDeleteOffer(id);
                    set((s) => ({ offers: s.offers.filter((o) => o.id !== id) }));
                    showSuccess("Offer deleted");
                } catch {
                    /* */
                }
            },
        }),
        {
            name: 'hire-storage-v3',
        }
    )
);
