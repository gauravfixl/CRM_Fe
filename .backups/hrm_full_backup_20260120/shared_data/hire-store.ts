import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Internship";
    status: "Active" | "Draft" | "Closed";
    applicants: number;
    postedDate: string;
    experience: string;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    status: "New" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
    appliedDate: string;
    source: string;
    rating: number;
    resumeUrl?: string;
}

export interface Interview {
    id: string;
    candidateId: string;
    candidateName: string;
    position: string;
    interviewer: string;
    date: string;
    time: string;
    duration: string;
    mode: "In-person" | "Video" | "Phone";
    type: "Technical" | "HR" | "Cultural" | "Final";
    status: "Scheduled" | "Completed" | "Cancelled";
    location?: string;
    feedback?: string;
}

export interface Offer {
    id: string;
    candidateName: string;
    role: string;
    department: string;
    ctc: string;
    joiningDate: string;
    status: "Draft" | "Sent" | "Accepted" | "Declined";
    sentDate?: string;
}

interface HireState {
    jobs: Job[];
    candidates: Candidate[];
    interviews: Interview[];
    offers: Offer[];

    // Job Actions
    addJob: (job: Omit<Job, 'id' | 'applicants' | 'postedDate' | 'status'>) => void;
    updateJob: (id: string, updates: Partial<Job>) => void;
    deleteJob: (id: string) => void;

    // Candidate Actions
    addCandidate: (candidate: Omit<Candidate, 'id' | 'appliedDate' | 'status' | 'rating'>) => void;
    updateCandidate: (id: string, updates: Partial<Candidate>) => void;
    deleteCandidate: (id: string) => void;

    // Interview Actions
    scheduleInterview: (interview: Omit<Interview, 'id' | 'status'>) => void;
    updateInterview: (id: string, updates: Partial<Interview>) => void;
    cancelInterview: (id: string) => void;
    deleteInterview: (id: string) => void;

    // Offer Actions
    addOffer: (offer: Omit<Offer, 'id' | 'status'>) => void;
    updateOffer: (id: string, updates: Partial<Offer>) => void;
    deleteOffer: (id: string) => void;
}

export const useHireStore = create<HireState>()(
    persist(
        (set) => ({
            jobs: [
                {
                    id: "JOB-001",
                    title: "Senior Frontend Engineer",
                    department: "Engineering",
                    location: "Bengaluru, India (Remote)",
                    type: "Full-time",
                    status: "Active",
                    applicants: 45,
                    postedDate: "2 days ago",
                    experience: "3-5 Years"
                },
                {
                    id: "JOB-002",
                    title: "Product Designer",
                    department: "Design",
                    location: "Mumbai, India",
                    type: "Full-time",
                    status: "Active",
                    applicants: 12,
                    postedDate: "1 week ago",
                    experience: "1-3 Years"
                },
                {
                    id: "JOB-003",
                    title: "Marketing Manager",
                    department: "Marketing",
                    location: "Delhi, India",
                    type: "Full-time",
                    status: "Draft",
                    applicants: 0,
                    postedDate: "Just now",
                    experience: "5+ Years"
                }
            ],
            candidates: [
                {
                    id: "CAN-001",
                    name: "Rahul Sharma",
                    email: "rahul.s@example.com",
                    phone: "+91 98765 43210",
                    position: "Senior Frontend Engineer",
                    status: "Interview",
                    appliedDate: "2 days ago",
                    source: "LinkedIn",
                    rating: 4.5
                },
                {
                    id: "CAN-002",
                    name: "Priya Patel",
                    email: "priya.p@example.com",
                    phone: "+91 98765 43211",
                    position: "Product Designer",
                    status: "New",
                    appliedDate: "1 day ago",
                    source: "Referral",
                    rating: 0
                }
            ],
            interviews: [
                {
                    id: "INT-001",
                    candidateId: "CAN-001",
                    candidateName: "Rahul Sharma",
                    position: "Senior Frontend Engineer",
                    interviewer: "Amit Verma",
                    date: "2024-05-20",
                    time: "10:00 AM",
                    duration: "1 hour",
                    mode: "Video",
                    type: "Technical",
                    status: "Scheduled"
                }
            ],
            offers: [
                {
                    id: "OFF-001",
                    candidateName: "Rahul Sharma",
                    role: "Senior Frontend Engineer",
                    department: "Engineering",
                    ctc: "₹ 24,00,000",
                    joiningDate: "2024-06-01",
                    status: "Sent",
                    sentDate: "2024-05-21"
                }
            ],

            addJob: (job) => set((state) => ({
                jobs: [
                    {
                        ...job,
                        id: `JOB-${String(state.jobs.length + 1).padStart(3, '0')}`,
                        applicants: 0,
                        postedDate: "Just now",
                        status: "Active"
                    },
                    ...state.jobs
                ]
            })),
            updateJob: (id, updates) => set((state) => ({
                jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
            })),
            deleteJob: (id) => set((state) => ({
                jobs: state.jobs.filter(j => j.id !== id)
            })),

            addCandidate: (candidate) => set((state) => ({
                candidates: [
                    {
                        ...candidate,
                        id: `CAN-${String(state.candidates.length + 1).padStart(3, '0')}`,
                        appliedDate: "Just now",
                        status: "New",
                        rating: 0
                    },
                    ...state.candidates
                ]
            })),
            updateCandidate: (id, updates) => set((state) => ({
                candidates: state.candidates.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteCandidate: (id) => set((state) => ({
                candidates: state.candidates.filter(c => c.id !== id)
            })),

            scheduleInterview: (interview) => set((state) => ({
                interviews: [
                    {
                        ...interview,
                        id: `INT-${String(state.interviews.length + 1).padStart(3, '0')}`,
                        status: "Scheduled"
                    },
                    ...state.interviews
                ]
            })),
            updateInterview: (id, updates) => set((state) => ({
                interviews: state.interviews.map(i => i.id === id ? { ...i, ...updates } : i)
            })),
            cancelInterview: (id) => set((state) => ({
                interviews: state.interviews.map(i => i.id === id ? { ...i, status: 'Cancelled' as const } : i)
            })),
            deleteInterview: (id) => set((state) => ({
                interviews: state.interviews.filter(i => i.id !== id)
            })),
            addOffer: (offer) => set((state) => ({
                offers: [
                    {
                        ...offer,
                        id: `OFF-${String(state.offers.length + 1).padStart(3, '0')}`,
                        status: "Draft"
                    },
                    ...state.offers
                ]
            })),
            updateOffer: (id, updates) => set((state) => ({
                offers: state.offers.map(o => o.id === id ? { ...o, ...updates } : o)
            })),
            deleteOffer: (id) => set((state) => ({
                offers: state.offers.filter(o => o.id !== id)
            }))
        }),
        {
            name: 'hire-storage',
        }
    )
);
