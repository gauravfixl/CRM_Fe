import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DocumentVersion {
    id: string;
    version: string;
    updatedBy: string;
    updatedAt: string;
    changeLog: string;
    fileUrl: string;
}

export interface CompanyPolicy {
    id: string;
    title: string;
    category: "General" | "Code of Conduct" | "Compliance" | "Benefits" | "IT" | "Payroll" | "Leave";
    description: string;
    status: "Active" | "Draft" | "Archived";
    audience: string[]; // ['All Employees'] or specific department IDs
    effectiveDate: string;
    lastUpdated: string;
    currentVersion: string;
    versions: DocumentVersion[];
    documentUrl: string;
}

export interface HRDocument {
    id: string;
    name: string;
    category: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
    status: "Published" | "Internal" | "Archived" | "Confidential";
    fileUrl: string;
    expiryDate?: string;
    auditLog: {
        action: string;
        user: string;
        timestamp: string;
    }[];
}

export interface LetterTemplate {
    id: string;
    name: string;
    type: "Offer Letter" | "Experience Letter" | "Relieving Letter" | "Appointment Letter" | "Custom";
    content: string; // HTML or Markdown
    placeholders: string[];
    createdAt: string;
    updatedAt: string;
}

export interface IssuedLetter {
    id: string;
    templateId: string;
    employeeId: string;
    employeeName: string;
    letterType: string;
    issuedDate: string;
    issuedBy: string;
    status: "Draft" | "Sent" | "Signed";
    fileUrl: string;
}

export interface Acknowledgement {
    id: string;
    documentId: string;
    documentTitle: string;
    employeeId: string;
    employeeName: string;
    status: "Pending" | "Viewed" | "Signed";
    notifiedAt: string;
    signedAt?: string;
    dueDate?: string;
    comments?: string;
}

interface DocumentsState {
    policies: CompanyPolicy[];
    hrDocuments: HRDocument[];
    letterTemplates: LetterTemplate[];
    issuedLetters: IssuedLetter[];
    acknowledgements: Acknowledgement[];

    // Policy Actions
    addPolicy: (policy: Omit<CompanyPolicy, 'id' | 'lastUpdated' | 'versions'>) => void;
    updatePolicy: (id: string, updates: Partial<CompanyPolicy>) => void;
    deletePolicy: (id: string) => void;
    addPolicyVersion: (id: string, version: Omit<DocumentVersion, 'id' | 'updatedAt'>) => void;

    // HR Document Actions
    addHRDocument: (doc: Omit<HRDocument, 'id' | 'uploadedAt' | 'auditLog'>) => void;
    updateHRDocument: (id: string, updates: Partial<HRDocument>) => void;
    deleteHRDocument: (id: string) => void;
    bulkDeleteHRDocuments: (ids: string[]) => void;

    // Template Actions
    addTemplate: (template: Omit<LetterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTemplate: (id: string, updates: Partial<LetterTemplate>) => void;
    deleteTemplate: (id: string) => void;

    // Letter Actions
    issueLetter: (letter: Omit<IssuedLetter, 'id' | 'issuedDate'>) => void;
    updateLetterStatus: (id: string, status: IssuedLetter['status']) => void;
    deleteLetter: (id: string) => void;

    // Acknowledgement Actions
    requestAcknowledgement: (ack: Omit<Acknowledgement, 'id' | 'notifiedAt' | 'status'>) => void;
    updateAcknowledgement: (id: string, status: Acknowledgement['status'], comments?: string) => void;
    deleteAcknowledgement: (id: string) => void;
}

export const useDocumentsStore = create<DocumentsState>()(
    persist(
        (set) => ({
            policies: [
                {
                    id: "POL-001",
                    title: "Hybrid Work Policy",
                    category: "General",
                    description: "Guidelines for remote and in-office work arrangements.",
                    status: "Active",
                    audience: ["All Employees"],
                    effectiveDate: "2024-01-01",
                    lastUpdated: "2024-01-01",
                    currentVersion: "1.0.0",
                    versions: [
                        { id: "V1", version: "1.0.0", updatedAt: "2024-01-01", updatedBy: "HR Admin", changeLog: "Initial release", fileUrl: "#" }
                    ],
                    documentUrl: "#"
                },
                {
                    id: "POL-002",
                    title: "Code of Conduct",
                    category: "Code of Conduct",
                    description: "Standard of behavior expected from all employees.",
                    status: "Active",
                    audience: ["All Employees"],
                    effectiveDate: "2023-01-01",
                    lastUpdated: "2023-01-01",
                    currentVersion: "2.1.0",
                    versions: [
                        { id: "V2", version: "2.1.0", updatedAt: "2023-01-01", updatedBy: "HR Admin", changeLog: "Updated ethics clause", fileUrl: "#" }
                    ],
                    documentUrl: "#"
                }
            ],
            hrDocuments: [
                { id: "DOC-001", name: "Company Profile.pdf", category: "General", size: "2.4 MB", uploadedBy: "Admin", uploadedAt: "2024-01-10", status: "Published", fileUrl: "#", auditLog: [{ action: "Uploaded", user: "Admin", timestamp: "2024-01-10" }] }
            ],
            letterTemplates: [
                { id: "TMP-001", name: "Standard Offer Letter", type: "Offer Letter", content: "Dear {{name}}, We are pleased to offer...", placeholders: ["name", "position", "salary"], createdAt: "2024-01-01", updatedAt: "2024-01-01" }
            ],
            issuedLetters: [
                { id: "LTR-001", templateId: "TMP-001", employeeId: "EMP001", employeeName: "John Doe", letterType: "Offer Letter", issuedDate: "2024-01-15", issuedBy: "HR Admin", status: "Signed", fileUrl: "#" }
            ],
            acknowledgements: [
                { id: "ACK-001", documentId: "POL-001", documentTitle: "Hybrid Work Policy", employeeId: "EMP001", employeeName: "John Doe", status: "Signed", notifiedAt: "2024-01-02", signedAt: "2024-01-03", dueDate: "2024-01-10" }
            ],

            addPolicy: (policy) => set((state) => ({
                policies: [
                    {
                        ...policy,
                        id: `POL-${String(state.policies.length + 1).padStart(3, '0')}`,
                        lastUpdated: new Date().toISOString().split('T')[0],
                        versions: [{ id: "V1", version: policy.currentVersion, updatedAt: new Date().toISOString().split('T')[0], updatedBy: "HR Admin", changeLog: "Initial version", fileUrl: policy.documentUrl }]
                    },
                    ...state.policies
                ]
            })),
            updatePolicy: (id, updates) => set((state) => ({
                policies: state.policies.map(p => p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : p)
            })),
            deletePolicy: (id) => set((state) => ({
                policies: state.policies.filter(p => p.id !== id)
            })),
            addPolicyVersion: (id, version) => set((state) => ({
                policies: state.policies.map(p => p.id === id ? {
                    ...p,
                    currentVersion: version.version,
                    lastUpdated: new Date().toISOString().split('T')[0],
                    versions: [{ ...version, id: `V${p.versions.length + 1}`, updatedAt: new Date().toISOString().split('T')[0] }, ...p.versions]
                } : p)
            })),

            addHRDocument: (doc) => set((state) => ({
                hrDocuments: [{ ...doc, id: `DOC-${String(state.hrDocuments.length + 1).padStart(3, '0')}`, uploadedAt: new Date().toISOString().split('T')[0], auditLog: [{ action: "Uploaded", user: "Admin", timestamp: new Date().toISOString() }] }, ...state.hrDocuments]
            })),
            updateHRDocument: (id, updates) => set((state) => ({
                hrDocuments: state.hrDocuments.map(d => d.id === id ? { ...d, ...updates } : d)
            })),
            deleteHRDocument: (id) => set((state) => ({
                hrDocuments: state.hrDocuments.filter(d => d.id !== id)
            })),
            bulkDeleteHRDocuments: (ids) => set((state) => ({
                hrDocuments: state.hrDocuments.filter(d => !ids.includes(d.id))
            })),

            addTemplate: (template) => set((state) => ({
                letterTemplates: [{ ...template, id: `TMP-${String(state.letterTemplates.length + 1).padStart(3, '0')}`, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] }, ...state.letterTemplates]
            })),
            updateTemplate: (id, updates) => set((state) => ({
                letterTemplates: state.letterTemplates.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : t)
            })),
            deleteTemplate: (id) => set((state) => ({
                letterTemplates: state.letterTemplates.filter(t => t.id !== id)
            })),

            issueLetter: (letter) => set((state) => ({
                issuedLetters: [{ ...letter, id: `LTR-${String(state.issuedLetters.length + 1).padStart(3, '0')}`, issuedDate: new Date().toISOString().split('T')[0] }, ...state.issuedLetters]
            })),
            updateLetterStatus: (id, status) => set((state) => ({
                issuedLetters: state.issuedLetters.map(l => l.id === id ? { ...l, status } : l)
            })),
            deleteLetter: (id) => set((state) => ({
                issuedLetters: state.issuedLetters.filter(l => l.id !== id)
            })),

            requestAcknowledgement: (ack) => set((state) => ({
                acknowledgements: [{
                    ...ack,
                    id: `ACK-${String(state.acknowledgements.length + 1).padStart(3, '0')}`,
                    status: "Pending",
                    notifiedAt: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 7 days
                }, ...state.acknowledgements]
            })),
            updateAcknowledgement: (id, status, comments) => set((state) => ({
                acknowledgements: state.acknowledgements.map(a => a.id === id ? { ...a, status, comments, signedAt: status === 'Signed' ? new Date().toISOString().split('T')[0] : a.signedAt } : a)
            })),
            deleteAcknowledgement: (id) => set((state) => ({
                acknowledgements: state.acknowledgements.filter(a => a.id !== id)
            }))
        }),
        {
            name: 'documents-storage',
        }
    )
);
