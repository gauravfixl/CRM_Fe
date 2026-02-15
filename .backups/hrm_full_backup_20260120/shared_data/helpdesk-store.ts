import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ticket {
    id: string;
    ticketId: string; // e.g. TKT-1001
    subject: string;
    description: string;
    category: 'IT Support' | 'HR Query' | 'Admin & Facilities' | 'Finance/Payroll';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    requesterId: string;
    requesterName: string; // denormalized for simulation
    assigneeId?: string;
    assigneeName?: string;
    createdAt: string;
    updatedAt: string;
    comments: TicketComment[];
}

export interface TicketComment {
    id: string;
    text: string;
    authorName: string;
    createdAt: string;
    isSystem?: boolean;
}

interface HelpdeskState {
    tickets: Ticket[];

    // Actions
    createTicket: (ticket: Omit<Ticket, 'id' | 'ticketId' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
    updateStatus: (id: string, status: Ticket['status']) => void;
    assignTicket: (id: string, assigneeName: string) => void;
    addComment: (ticketId: string, text: string, authorName: string) => void;
    deleteTicket: (id: string) => void;
}

// Initial Mock Data
const INITIAL_TICKETS: Ticket[] = [
    {
        id: "1", ticketId: "TKT-1001", subject: "Laptop Battery Draining Fast", description: "My MacBook battery drains in 2 hours.",
        category: "IT Support", priority: "Medium", status: "Open", requesterId: "EMP001", requesterName: "Drashi Garg",
        createdAt: "2026-01-18", updatedAt: "2026-01-18", comments: []
    },
    {
        id: "2", ticketId: "TKT-1002", subject: "Salary Slip Discrepancy", description: "March output tax seems wrong.",
        category: "Finance/Payroll", priority: "High", status: "In Progress", requesterId: "EMP002", requesterName: "Aditya Singh",
        createdAt: "2026-01-15", updatedAt: "2026-01-16", comments: []
    },
    {
        id: "3", ticketId: "TKT-1003", subject: "AC not working in Cabin 4", description: "Too hot to work.",
        category: "Admin & Facilities", priority: "Low", status: "Resolved", requesterId: "EMP003", requesterName: "Rohan Gupta",
        createdAt: "2026-01-10", updatedAt: "2026-01-12", comments: []
    }
];

export const useHelpdeskStore = create<HelpdeskState>()(
    persist(
        (set) => ({
            tickets: INITIAL_TICKETS,

            createTicket: (data) => set((state) => {
                const newTicket: Ticket = {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                    ticketId: `TKT-${1000 + state.tickets.length + 1}`,
                    status: 'Open',
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                    comments: []
                };
                return { tickets: [newTicket, ...state.tickets] };
            }),

            updateStatus: (id, status) => set((state) => ({
                tickets: state.tickets.map(t => t.id === id ? { ...t, status } : t)
            })),

            assignTicket: (id, assigneeName) => set((state) => ({
                tickets: state.tickets.map(t => t.id === id ? { ...t, assigneeName } : t)
            })),

            addComment: (ticketId, text, authorName) => set((state) => ({
                tickets: state.tickets.map(t => {
                    if (t.id !== ticketId) return t;
                    return {
                        ...t,
                        comments: [...t.comments, {
                            id: Math.random().toString(),
                            text,
                            authorName,
                            createdAt: new Date().toISOString(),
                            isSystem: false
                        }]
                    };
                })
            })),

            deleteTicket: (id) => set((state) => ({ tickets: state.tickets.filter(t => t.id !== id) }))
        }),
        { name: 'helpdesk-storage' }
    )
);
