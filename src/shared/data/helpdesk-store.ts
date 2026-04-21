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
    avgResolutionTime: string;
    csatScore: number;
    canDeleteTickets?: boolean;
    autoInvite?: boolean;
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
    escalationEnabled: boolean;
}

export interface CategoryDef {
    id: string;
    name: string;
    subCategories: string[];
}

export interface AutomationRule {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
    type: "routing" | "auto-close" | "sentiment" | "escalation" | "custom";
    condition?: string;
}

export interface NotificationTemplate {
    id: string;
    channel: "email" | "push" | "sms";
    name: string;
    subject: string;
    body: string;
    enabled: boolean;
    locked?: boolean;
}

export interface SecuritySetting {
    id: string;
    label: string;
    description: string;
    value: boolean;
}

interface HelpdeskState {
    tickets: Ticket[];
    agents: HelpdeskAgent[];
    articles: KBArticle[];
    slaRules: SLARule[];
    categories: CategoryDef[];
    automations: AutomationRule[];
    notificationTemplates: NotificationTemplate[];
    securitySettings: SecuritySetting[];

    // Ticket Actions
    addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'responses'>) => void;
    updateTicket: (id: string, updates: Partial<Ticket>, actionLabel?: string) => void;
    deleteTicket: (id: string) => void;
    addResponse: (ticketId: string, response: Omit<TicketResponse, 'id' | 'timestamp'>) => void;
    updateResponse: (ticketId: string, responseId: string, content: string) => void;
    deleteResponse: (ticketId: string, responseId: string) => void;
    assignTicket: (ticketId: string, agent: { id: string; name: string }) => void;
    unassignTicket: (ticketId: string) => void;
    escalateTicket: (ticketId: string) => void;

    // Agent Actions
    addAgent: (agent: Omit<HelpdeskAgent, 'id'>) => void;
    updateAgent: (id: string, updates: Partial<HelpdeskAgent>) => void;
    deleteAgent: (id: string) => void;

    // KB Actions
    addArticle: (article: Omit<KBArticle, 'id' | 'views' | 'helpfulCount' | 'lastUpdated'>) => void;
    updateArticle: (id: string, updates: Partial<KBArticle>) => void;
    deleteArticle: (id: string) => void;
    duplicateArticle: (id: string) => void;

    // Category Actions
    addCategory: (name: string, subCategories?: string[]) => void;
    updateCategory: (id: string, updates: Partial<CategoryDef>) => void;
    deleteCategory: (id: string) => void;
    addSubCategory: (categoryId: string, sub: string) => void;
    removeSubCategory: (categoryId: string, sub: string) => void;

    // SLA Actions
    addSLARule: (rule: Omit<SLARule, 'id'>) => void;
    updateSLARule: (id: string, updates: Partial<SLARule>) => void;
    deleteSLARule: (id: string) => void;

    // Automation Actions
    addAutomation: (rule: Omit<AutomationRule, 'id'>) => void;
    updateAutomation: (id: string, updates: Partial<AutomationRule>) => void;
    deleteAutomation: (id: string) => void;
    toggleAutomation: (id: string) => void;

    // Notification Template Actions
    addNotificationTemplate: (tpl: Omit<NotificationTemplate, 'id'>) => void;
    updateNotificationTemplate: (id: string, updates: Partial<NotificationTemplate>) => void;
    deleteNotificationTemplate: (id: string) => void;
    toggleNotificationTemplate: (id: string) => void;

    // Security Actions
    toggleSecuritySetting: (id: string) => void;
    updateSecuritySetting: (id: string, value: boolean) => void;
}

const now = () => new Date().toISOString();
const rid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const useHelpdeskStore = create<HelpdeskState>()(
    persist(
        (set, get) => ({
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
                { id: "AGT-001", name: "Suman Rao", email: "suman.rao@firm.com", role: "Supervisor", status: "Active", assignedQueues: ["HR Ops", "Payroll"], ticketsResolved: 145, avgResolutionTime: "3.5h", csatScore: 4.8, canDeleteTickets: true, autoInvite: true },
                { id: "AGT-002", name: "Vikram Tech", email: "vikram.it@firm.com", role: "Agent", status: "Active", assignedQueues: ["IT Support"], ticketsResolved: 210, avgResolutionTime: "2.1h", csatScore: 4.5, canDeleteTickets: false, autoInvite: true },
                { id: "AGT-003", name: "Amit Admin", email: "amit.admin@firm.com", role: "Agent", status: "Away", assignedQueues: ["Admin"], ticketsResolved: 88, avgResolutionTime: "5.8h", csatScore: 4.2, canDeleteTickets: false, autoInvite: false }
            ],
            articles: [
                { id: "ART-001", title: "How to apply for Leave?", content: "Go to Me > My Leave > Request Leave. Select the date range and reason. Once submitted, your manager will receive an approval request. Most standard leaves get approved within 24 hours.", category: "Leave", status: "Published", author: "HR Team", views: 2450, helpfulCount: 420, lastUpdated: "2024-01-10", tags: ["policy", "leave"] },
                { id: "ART-002", title: "Reimbursement Policy 2024", content: "New guidelines for gym and internet reimbursements apply from April 2024 onwards. Submit bills via the Expenses module within 30 days of purchase. Reimbursements are credited with the next payroll cycle.", category: "Policies", status: "Published", author: "Finance Team", views: 1800, helpfulCount: 310, lastUpdated: "2024-01-12", tags: ["finance", "reimbursement"] }
            ],
            slaRules: [
                { id: "SLA-1", priority: "Urgent", responseTimeHours: 1, resolutionTimeHours: 4, escalationEnabled: true, escalationContact: "supervisor@firm.com" },
                { id: "SLA-2", priority: "High", responseTimeHours: 4, resolutionTimeHours: 24, escalationEnabled: true, escalationContact: "supervisor@firm.com" },
                { id: "SLA-3", priority: "Medium", responseTimeHours: 12, resolutionTimeHours: 48, escalationEnabled: false },
                { id: "SLA-4", priority: "Low", responseTimeHours: 24, resolutionTimeHours: 96, escalationEnabled: false }
            ],
            categories: [
                { id: "CAT-1", name: "Payroll", subCategories: ["Pay Structure", "Tax", "Bonuses"] },
                { id: "CAT-2", name: "Leave", subCategories: ["Casual", "Sick", "Earned"] },
                { id: "CAT-3", name: "IT Support", subCategories: ["Hardware", "Software", "Network"] },
                { id: "CAT-4", name: "Admin", subCategories: ["Seating", "Stationery"] },
                { id: "CAT-5", name: "HR Ops", subCategories: ["Policies", "Onboarding", "Exit"] },
                { id: "CAT-6", name: "Policies", subCategories: ["General", "Travel", "Remote Work"] }
            ],
            automations: [
                { id: "AUT-1", title: "Smart Routing (Round Robin)", description: "Distribute tickets equally among active agents", enabled: true, type: "routing" },
                { id: "AUT-2", title: "Auto-Close Inactive", description: "Close resolved tickets after 48h of silence", enabled: false, type: "auto-close" },
                { id: "AUT-3", title: "Sentiment Triage", description: "Escalate tickets with negative sentiment automatically", enabled: false, type: "sentiment" }
            ],
            notificationTemplates: [
                { id: "NT-1", channel: "email", name: "Ticket Update", subject: "Update on your support ticket", body: "You have a new support update regarding ticket #[TicketID]. Please log in to the portal to review the latest activity.", enabled: true },
                { id: "NT-2", channel: "push", name: "Push Alerts", subject: "Critical Escalation", body: "Real-time mobile alerts for critical escalations.", enabled: false, locked: true },
                { id: "NT-3", channel: "sms", name: "SMS Alerts", subject: "SMS Notification", body: "SMS critical alerts (Enterprise plan only).", enabled: false, locked: true }
            ],
            securitySettings: [
                { id: "SEC-1", label: "Internal Notes Visibility", description: "Allow employees to see internal agent discussions", value: false },
                { id: "SEC-2", label: "Recursive Deletion", description: "Allow admins to delete tickets and history permanently", value: false },
                { id: "SEC-3", label: "IP Restriction", description: "Restrict portal access to corporate VPN ranges only", value: true },
                { id: "SEC-4", label: "GDPR Anonymization", description: "Auto-mask sensitive employee data after 1 year", value: true }
            ],

            // ===== Ticket Actions =====
            addTicket: (ticket) => set((state) => ({
                tickets: [
                    {
                        ...ticket,
                        id: `TKT-${String(state.tickets.length + 1).padStart(3, '0')}`,
                        createdAt: now(),
                        updatedAt: now(),
                        history: [{ id: rid('h'), action: "Ticket Created", performedBy: ticket.requestedBy.name, timestamp: now() }],
                        responses: []
                    },
                    ...state.tickets
                ]
            })),
            updateTicket: (id, updates, actionLabel) => set((state) => ({
                tickets: state.tickets.map(t => t.id === id ? {
                    ...t,
                    ...updates,
                    updatedAt: now(),
                    history: actionLabel
                        ? [...t.history, { id: rid('h'), action: actionLabel, performedBy: "HR Admin", timestamp: now() }]
                        : t.history
                } : t)
            })),
            deleteTicket: (id) => set((state) => ({
                tickets: state.tickets.filter(t => t.id !== id)
            })),
            addResponse: (ticketId, response) => set((state) => ({
                tickets: state.tickets.map(t => t.id === ticketId ? {
                    ...t,
                    updatedAt: now(),
                    responses: [...t.responses, { ...response, id: rid('r'), timestamp: now() }],
                    history: [...t.history, { id: rid('h'), action: response.isInternal ? "Internal Note Added" : "Reply Sent", performedBy: response.author, timestamp: now() }]
                } : t)
            })),
            updateResponse: (ticketId, responseId, content) => set((state) => ({
                tickets: state.tickets.map(t => t.id === ticketId ? {
                    ...t,
                    responses: t.responses.map(r => r.id === responseId ? { ...r, content } : r)
                } : t)
            })),
            deleteResponse: (ticketId, responseId) => set((state) => ({
                tickets: state.tickets.map(t => t.id === ticketId ? {
                    ...t,
                    responses: t.responses.filter(r => r.id !== responseId)
                } : t)
            })),
            assignTicket: (ticketId, agent) => set((state) => ({
                tickets: state.tickets.map(t => t.id === ticketId ? {
                    ...t,
                    assignedTo: agent,
                    status: t.status === "Open" ? "In Progress" : t.status,
                    updatedAt: now(),
                    history: [...t.history, { id: rid('h'), action: `Assigned to ${agent.name}`, performedBy: "HR Admin", timestamp: now() }]
                } : t)
            })),
            unassignTicket: (ticketId) => set((state) => ({
                tickets: state.tickets.map(t => t.id === ticketId ? {
                    ...t,
                    assignedTo: undefined,
                    updatedAt: now(),
                    history: [...t.history, { id: rid('h'), action: "Unassigned", performedBy: "HR Admin", timestamp: now() }]
                } : t)
            })),
            escalateTicket: (ticketId) => set((state) => ({
                tickets: state.tickets.map(t => t.id === ticketId ? {
                    ...t,
                    status: "Escalated",
                    updatedAt: now(),
                    history: [...t.history, { id: rid('h'), action: "Ticket Escalated", performedBy: "HR Admin", timestamp: now() }]
                } : t)
            })),

            // ===== Agent Actions =====
            addAgent: (agent) => set((state) => ({
                agents: [{ ...agent, id: `AGT-${String(state.agents.length + 1).padStart(3, '0')}` }, ...state.agents]
            })),
            updateAgent: (id, updates) => set((state) => ({
                agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            deleteAgent: (id) => set((state) => ({
                agents: state.agents.filter(a => a.id !== id)
            })),

            // ===== KB Actions =====
            addArticle: (article) => set((state) => ({
                articles: [
                    {
                        ...article,
                        id: `ART-${String(state.articles.length + 1).padStart(3, '0')}`,
                        views: 0,
                        helpfulCount: 0,
                        lastUpdated: now().split('T')[0]
                    },
                    ...state.articles
                ]
            })),
            updateArticle: (id, updates) => set((state) => ({
                articles: state.articles.map(a => a.id === id ? { ...a, ...updates, lastUpdated: now().split('T')[0] } : a)
            })),
            deleteArticle: (id) => set((state) => ({
                articles: state.articles.filter(a => a.id !== id)
            })),
            duplicateArticle: (id) => set((state) => {
                const src = state.articles.find(a => a.id === id);
                if (!src) return state;
                const clone: KBArticle = {
                    ...src,
                    id: `ART-${String(state.articles.length + 1).padStart(3, '0')}`,
                    title: `${src.title} (Copy)`,
                    status: "Draft",
                    views: 0,
                    helpfulCount: 0,
                    lastUpdated: now().split('T')[0]
                };
                return { articles: [clone, ...state.articles] };
            }),

            // ===== Category Actions =====
            addCategory: (name, subCategories = []) => set((state) => ({
                categories: [...state.categories, { id: rid('CAT'), name, subCategories }]
            })),
            updateCategory: (id, updates) => set((state) => ({
                categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
            })),
            deleteCategory: (id) => set((state) => ({
                categories: state.categories.filter(c => c.id !== id)
            })),
            addSubCategory: (categoryId, sub) => set((state) => ({
                categories: state.categories.map(c => c.id === categoryId ? { ...c, subCategories: [...c.subCategories, sub] } : c)
            })),
            removeSubCategory: (categoryId, sub) => set((state) => ({
                categories: state.categories.map(c => c.id === categoryId ? { ...c, subCategories: c.subCategories.filter(s => s !== sub) } : c)
            })),

            // ===== SLA Actions =====
            addSLARule: (rule) => set((state) => ({
                slaRules: [...state.slaRules, { ...rule, id: rid('SLA') }]
            })),
            updateSLARule: (id, updates) => set((state) => ({
                slaRules: state.slaRules.map(r => r.id === id ? { ...r, ...updates } : r)
            })),
            deleteSLARule: (id) => set((state) => ({
                slaRules: state.slaRules.filter(r => r.id !== id)
            })),

            // ===== Automation Actions =====
            addAutomation: (rule) => set((state) => ({
                automations: [...state.automations, { ...rule, id: rid('AUT') }]
            })),
            updateAutomation: (id, updates) => set((state) => ({
                automations: state.automations.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            deleteAutomation: (id) => set((state) => ({
                automations: state.automations.filter(a => a.id !== id)
            })),
            toggleAutomation: (id) => set((state) => ({
                automations: state.automations.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a)
            })),

            // ===== Notification Template Actions =====
            addNotificationTemplate: (tpl) => set((state) => ({
                notificationTemplates: [...state.notificationTemplates, { ...tpl, id: rid('NT') }]
            })),
            updateNotificationTemplate: (id, updates) => set((state) => ({
                notificationTemplates: state.notificationTemplates.map(t => t.id === id ? { ...t, ...updates } : t)
            })),
            deleteNotificationTemplate: (id) => set((state) => ({
                notificationTemplates: state.notificationTemplates.filter(t => t.id !== id)
            })),
            toggleNotificationTemplate: (id) => set((state) => ({
                notificationTemplates: state.notificationTemplates.map(t => t.id === id ? (t.locked ? t : { ...t, enabled: !t.enabled }) : t)
            })),

            // ===== Security Actions =====
            toggleSecuritySetting: (id) => set((state) => ({
                securitySettings: state.securitySettings.map(s => s.id === id ? { ...s, value: !s.value } : s)
            })),
            updateSecuritySetting: (id, value) => set((state) => ({
                securitySettings: state.securitySettings.map(s => s.id === id ? { ...s, value } : s)
            })),
        }),
        {
            name: 'helpdesk-storage',
            version: 2,
            migrate: (persisted: any, version) => {
                if (!persisted) return persisted;
                if (version < 2) {
                    // Migrate old shape: categories was string[], now CategoryDef[]
                    if (Array.isArray(persisted.categories) && persisted.categories.length && typeof persisted.categories[0] === 'string') {
                        persisted.categories = persisted.categories.map((name: string, i: number) => ({
                            id: `CAT-${i + 1}`,
                            name,
                            subCategories: []
                        }));
                    }
                    // Ensure new fields exist
                    if (!persisted.automations) persisted.automations = [];
                    if (!persisted.notificationTemplates) persisted.notificationTemplates = [];
                    if (!persisted.securitySettings) persisted.securitySettings = [];
                }
                return persisted;
            }
        }
    )
);
