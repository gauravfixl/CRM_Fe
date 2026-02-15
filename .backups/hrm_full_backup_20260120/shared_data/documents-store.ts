import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompanyPolicy {
    id: string;
    title: string;
    category: "General" | "Code of Conduct" | "Compliance" | "Benefits" | "IT";
    lastUpdated: string;
    status: "Active" | "Draft" | "Archived";
    documentUrl: string;
}

export interface EmployeeDocument {
    id: string;
    employeeName: string;
    documentType: "Offer Letter" | "Experience Letter" | "Relieving Letter" | "Payslip" | "Other";
    issuedDate: string;
    status: "Pending" | "Sent" | "Acknowledged";
}

interface DocumentsState {
    policies: CompanyPolicy[];
    employeeDocs: EmployeeDocument[];

    // Policy Actions
    addPolicy: (policy: Omit<CompanyPolicy, 'id' | 'lastUpdated' | 'status'>) => void;
    updatePolicy: (id: string, updates: Partial<CompanyPolicy>) => void;
    deletePolicy: (id: string) => void;

    // Employee Doc Actions
    addEmployeeDoc: (doc: Omit<EmployeeDocument, 'id' | 'issuedDate' | 'status'>) => void;
    updateEmployeeDoc: (id: string, updates: Partial<EmployeeDocument>) => void;
    deleteEmployeeDoc: (id: string) => void;
}

export const useDocumentsStore = create<DocumentsState>()(
    persist(
        (set) => ({
            policies: [
                { id: "POL01", title: "Global Leave Policy 2024", category: "Benefits", lastUpdated: "2024-01-01", status: "Active", documentUrl: "#" },
                { id: "POL02", title: "Information Security Policy", category: "IT", lastUpdated: "2023-11-15", status: "Active", documentUrl: "#" },
                { id: "POL03", title: "Remote Work Guidelines", category: "General", lastUpdated: "2024-01-10", status: "Draft", documentUrl: "#" }
            ],
            employeeDocs: [
                { id: "DOC01", employeeName: "Rahul Sharma", documentType: "Experience Letter", issuedDate: "2024-01-20", status: "Sent" },
                { id: "DOC02", employeeName: "Sneha Reddy", documentType: "Relieving Letter", issuedDate: "2024-01-18", status: "Acknowledged" }
            ],

            addPolicy: (policy) => set((state) => ({
                policies: [
                    {
                        ...policy,
                        id: `POL-${String(state.policies.length + 1).padStart(3, '0')}`,
                        lastUpdated: new Date().toISOString().split('T')[0],
                        status: "Active"
                    },
                    ...state.policies
                ]
            })),
            updatePolicy: (id, updates) => set((state) => ({
                policies: state.policies.map(p => p.id === id ? { ...p, ...updates } : p)
            })),
            deletePolicy: (id) => set((state) => ({
                policies: state.policies.filter(p => p.id !== id)
            })),

            addEmployeeDoc: (doc) => set((state) => ({
                employeeDocs: [
                    {
                        ...doc,
                        id: `DOC-${String(state.employeeDocs.length + 1).padStart(3, '0')}`,
                        issuedDate: new Date().toISOString().split('T')[0],
                        status: "Pending"
                    },
                    ...state.employeeDocs
                ]
            })),
            updateEmployeeDoc: (id, updates) => set((state) => ({
                employeeDocs: state.employeeDocs.map(d => d.id === id ? { ...d, ...updates } : d)
            })),
            deleteEmployeeDoc: (id) => set((state) => ({
                employeeDocs: state.employeeDocs.filter(d => d.id !== id)
            }))
        }),
        {
            name: 'documents-storage',
        }
    )
);
