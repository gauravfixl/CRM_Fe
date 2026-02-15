import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ticket {
    id: string;
    subject: string;
    description: string;
    category: string;
    subCategory: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    status: "Open" | "In Progress" | "Pending Employee" | "Escalated" | "Resolved" | "Closed" | "Reopened";
    requestedBy: {
        id: string;
        name: string;
        avatar?: string;
        department: string;
    };
    assignedTo?: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    slaDeadline: string;
    slaStatus: "Healthy" | "Warning" | "Breached";
    attachments: string[];
    history: TicketHistory[];
    responses: TicketResponse[];
}

export interface TicketHistory {
    id: string;
    action: string;
    performedBy: string;
    timestamp: string;
    details?: string;
}

export interface TicketResponse {
    id: string;
    author: string;
    authorRole: "Agent" | "Employee";
    content: string;
    timestamp: string;
    isInternal: boolean;
}

export interface HelpdeskAgent {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Agent" | "Supervisor";
    status: "Active" | "Away" | "Offline";
    assignedQueues: string[];
    ticketsResolved: number;
    avgResolutionTime: string; // e.g. "4.2h"
    csatScore: number; // 0-5
}

export interface KBArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    status: "Draft" | "Published";
    author: string;
    views: number;
    helpfulCount: number;
    lastUpdated: string;
    tags: string[];
}

export interface SLARule {
    id: string;
    priority: Ticket["priority"];
    responseTimeHours: number;
    resolutionTimeHours: number;
    escalationContact?: string;
}

interface HelpdeskState {
    tickets: Ticket[];
    agents: HelpdeskAgent[];
    articles: KBArticle[];
    slaRules: SLARule[];
    categories: string[];

    // Ticket Actions
    addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'responses'>) => void;
    updateTicket: (id: string, updates: Partial<Ticket>) => void;
    deleteTicket: (id: string) => void;
    addResponse: (ticketId: string, response: Omit<TicketResponse, 'id' | 'timestamp'>) => void;

    // Agent Actions
    addAgent: (agent: Omit<HelpdeskAgent, 'id'>) => void;
    updateAgent: (id: string, updates: Partial<HelpdeskAgent>) => void;
    deleteAgent: (id: string) => void;

    // KB Actions
    addArticle: (article: Omit<KBArticle, 'id' | 'views' | 'helpfulCount' | 'lastUpdated'>) => void;
    updateArticle: (id: string, updates: Partial<KBArticle>) => void;
    deleteArticle: (id: string) => void;
}

export const useHelpdeskStore = create<HelpdeskState>()(
    persist(
        (set) => ({
            tickets: [
                {
                    id: "TKT-001",
                    subject: "Payroll Mismatch - December 2023",
                    description: "The HRA component seems to be calculated incorrectly in my last payslip.",
                    category: "Payroll",
                    subCategory: "Pay Structure",
                    priority: "High",
                    status: "Open",
                    requestedBy: { id: "EMP-101", name: "Rahul Sharma", department: "Engineering" },
                    assignedTo: { id: "AGT-001", name: "Suman Rao" },
                    createdAt: "2024-01-18T10:00:00Z",
                    updatedAt: "2024-01-18T10:00:00Z",
                    slaDeadline: "2024-01-19T10:00:00Z",
                    slaStatus: "Healthy",
                    attachments: [],
                    history: [{ id: "h1", action: "Ticket Created", performedBy: "Rahul Sharma", timestamp: "2024-01-18T10:00:00Z" }],
                    responses: []
                },
                {
                    id: "TKT-002",
                    subject: "Laptop Screen Flickering",
                    description: "My MacBook screen starts flickering after 2 hours of use.",
                    category: "IT Support",
                    subCategory: "Hardware",
                    priority: "Medium",
                    status: "In Progress",
                    requestedBy: { id: "EMP-102", name: "Ananya Iyer", department: "Product" },
                    assignedTo: { id: "AGT-002", name: "Vikram Tech" },
                    createdAt: "2024-01-17T09:00:00Z",
                    updatedAt: "2024-01-17T11:00:00Z",
                    slaDeadline: "2024-01-18T09:00:00Z",
                    slaStatus: "Warning",
                    attachments: [],
                    history: [{ id: "h2", action: "Ticket Created", performedBy: "Ananya Iyer", timestamp: "2024-01-17T09:00:00Z" }],
                    responses: [
                        { id: "r1", author: "Vikram Tech", authorRole: "Agent", content: "Checking for hardware warranty.", timestamp: "2024-01-17T11:00:00Z", isInternal: true }
                    ]
                },
                {
                    id: "TKT-003",
                    subject: "Policy Clarification on Work From Home",
                    description: "Can I extend my WFH for another month due to personal reasons?",
                    category: "HR Ops",
                    subCategory: "Policies",
                    priority: "Low",
                    status: "Escalated",
                    requestedBy: { id: "EMP-103", name: "Zaid Khan", department: "Sales" },
                    assignedTo: { id: "AGT-001", name: "Suman Rao" },
                    createdAt: "2024-01-15T14:00:00Z",
                    updatedAt: "2024-01-16T10:00:00Z",
                    slaDeadline: "2024-01-16T14:00:00Z",
                    slaStatus: "Breached",
                    attachments: [],
                    history: [{ id: "h3", action: "Ticket Created", performedBy: "Zaid Khan", timestamp: "2024-01-15T14:00:00Z" }],
                    responses: []
                }
            ],
            agents: [
                { id: "AGT-001", name: "Suman Rao", email: "suman.rao@firm.com", role: "Supervisor", status: "Active", assignedQueues: ["HR Ops", "Payroll"], ticketsResolved: 145, avgResolutionTime: "3.5h", csatScore: 4.8 },
                { id: "AGT-002", name: "Vikram Tech", email: "vikram.it@firm.com", role: "Agent", status: "Active", assignedQueues: ["IT Support"], ticketsResolved: 210, avgResolutionTime: "2.1h", csatScore: 4.5 },
                { id: "AGT-003", name: "Amit Admin", email: "amit.admin@firm.com", role: "Agent", status: "Away", assignedQueues: ["Admin"], ticketsResolved: 88, avgResolutionTime: "5.8h", csatScore: 4.2 }
            ],
            articles: [
                { id: "ART-001", title: "How to apply for Leave?", content: "Go to Me > My Leave > Request Leave...", category: "Leave", status: "Published", author: "HR Team", views: 2450, helpfulCount: 420, lastUpdated: "2024-01-10", tags: ["policy", "leave"] },
                { id: "ART-002", title: "Reimbursement Policy 2024", content: "New guidelines for gym and internet reimbursements...", category: "Policies", status: "Published", author: "Finance Team", views: 1800, helpfulCount: 310, lastUpdated: "2024-01-12", tags: ["finance", "reimbursement"] }
            ],
            slaRules: [
                { id: "SLA-1", priority: "Urgent", responseTimeHours: 1, resolutionTimeHours: 4 },
                { id: "SLA-2", priority: "High", responseTimeHours: 4, resolutionTimeHours: 24 },
                { id: "SLA-3", priority: "Medium", responseTimeHours: 12, resolutionTimeHours: 48 },
                { id: "SLA-4", priority: "Low", responseTimeHours: 24, resolutionTimeHours: 96 }
            ],
            categories: ["Payroll", "Leave", "IT Support", "Admin", "HR Ops", "Policies"],

            addTicket: (ticket) => set((state) => ({
                tickets: [
                    {
                        ...ticket,
                        id: `TKT-${String(state.tickets.length + 1).padStart(3, '0')}`,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        history: [{ id: Math.random().toString(), action: "Ticket Created", performedBy: ticket.requestedBy.name, timestamp: new Date().toISOString() }],
                        responses: []
                    },
                    ...state.tickets
                ]
            })),
            updateTicket: (id, updates) => set((state) => ({
                tickets: state.tickets.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
            })),
            deleteTicket: (id) => set((state) => ({
                tickets: state.tickets.filter(t => t.id !== id)
            })),
            addResponse: (ticketId, response) => set((state) => ({
                tickets: state.tickets.map(t => t.id === ticketId ? {
                    ...t,
                    updatedAt: new Date().toISOString(),
                    responses: [...t.responses, { ...response, id: Math.random().toString(), timestamp: new Date().toISOString() }]
                } : t)
            })),

            addAgent: (agent) => set((state) => ({
                agents: [{ ...agent, id: `AGT-${String(state.agents.length + 1).padStart(3, '0')}` }, ...state.agents]
            })),
            updateAgent: (id, updates) => set((state) => ({
                agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            deleteAgent: (id) => set((state) => ({
                agents: state.agents.filter(a => a.id !== id)
            })),

            addArticle: (article) => set((state) => ({
                articles: [
                    {
                        ...article,
                        id: `ART-${String(state.articles.length + 1).padStart(3, '0')}`,
                        views: 0,
                        helpfulCount: 0,
                        lastUpdated: new Date().toISOString().split('T')[0]
                    },
                    ...state.articles
                ]
            })),
            updateArticle: (id, updates) => set((state) => ({
                articles: state.articles.map(a => a.id === id ? { ...a, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : a)
            })),
            deleteArticle: (id) => set((state) => ({
                articles: state.articles.filter(a => a.id !== id)
            }))
        }),
        {
            name: 'helpdesk-storage',
        }
    )
);
