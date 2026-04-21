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
    status: "Draft" | "Sent" | "Signed" | "Archived";
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
    priority?: boolean;
}

export interface ESignatureRequest {
    id: string;
    name: string;
    type: "Offer Letter" | "Contract" | "Policy" | "NDA" | "Amendment";
    sentTo: string;
    sentToEmail: string;
    sentDate: string;
    status: "Pending" | "Viewed" | "Signed" | "Expired" | "Declined";
    signedDate?: string;
    viewedDate?: string;
    expiryDate: string;
    signingOrder?: number;
    message?: string;
}

export interface BulkLetterRecord {
    id: string;
    employee: string;
    employeeId: string;
    department: string;
    designation?: string;
    letterType: string;
    generatedDate: string;
    status: "Draft" | "Generated" | "Sent" | "Signed";
    batchId?: string;
}

interface DocumentsState {
    policies: CompanyPolicy[];
    hrDocuments: HRDocument[];
    letterTemplates: LetterTemplate[];
    issuedLetters: IssuedLetter[];
    acknowledgements: Acknowledgement[];
    eSignatures: ESignatureRequest[];
    bulkLetters: BulkLetterRecord[];

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
    duplicateTemplate: (id: string) => void;

    // Letter Actions
    issueLetter: (letter: Omit<IssuedLetter, 'id' | 'issuedDate'>) => void;
    updateLetter: (id: string, updates: Partial<IssuedLetter>) => void;
    updateLetterStatus: (id: string, status: IssuedLetter['status']) => void;
    deleteLetter: (id: string) => void;

    // Acknowledgement Actions
    requestAcknowledgement: (ack: Omit<Acknowledgement, 'id' | 'notifiedAt' | 'status'>) => void;
    updateAcknowledgement: (id: string, status: Acknowledgement['status'], comments?: string) => void;
    updateAcknowledgementDetails: (id: string, updates: Partial<Acknowledgement>) => void;
    deleteAcknowledgement: (id: string) => void;

    // E-Signature Actions
    sendESignature: (req: Omit<ESignatureRequest, 'id' | 'sentDate' | 'status'>) => void;
    updateESignature: (id: string, updates: Partial<ESignatureRequest>) => void;
    setESignatureStatus: (id: string, status: ESignatureRequest['status']) => void;
    deleteESignature: (id: string) => void;
    bulkDeleteESignatures: (ids: string[]) => void;

    // Bulk Letter Actions
    addBulkLetters: (letters: Omit<BulkLetterRecord, 'id' | 'generatedDate'>[]) => void;
    updateBulkLetter: (id: string, updates: Partial<BulkLetterRecord>) => void;
    deleteBulkLetter: (id: string) => void;
    bulkDeleteBulkLetters: (ids: string[]) => void;
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
            eSignatures: [
                { id: "SIG-001", name: "Offer Letter - Senior Developer", type: "Offer Letter", sentTo: "Amit Joshi", sentToEmail: "amit@email.com", sentDate: "2026-03-28", status: "Signed", signedDate: "2026-03-29", viewedDate: "2026-03-28", expiryDate: "2026-04-15" },
                { id: "SIG-002", name: "NDA - Project Phoenix", type: "NDA", sentTo: "Priya Sharma", sentToEmail: "priya@email.com", sentDate: "2026-03-30", status: "Viewed", viewedDate: "2026-03-31", expiryDate: "2026-04-10" },
                { id: "SIG-003", name: "Employment Contract - Full Time", type: "Contract", sentTo: "Rahul Verma", sentToEmail: "rahul@email.com", sentDate: "2026-03-25", status: "Pending", expiryDate: "2026-04-08" },
                { id: "SIG-004", name: "Remote Work Policy Acknowledgement", type: "Policy", sentTo: "Sneha Rao", sentToEmail: "sneha@email.com", sentDate: "2026-03-20", status: "Signed", signedDate: "2026-03-21", viewedDate: "2026-03-20", expiryDate: "2026-04-05" },
                { id: "SIG-005", name: "Salary Revision Amendment", type: "Amendment", sentTo: "Vikram Singh", sentToEmail: "vikram@email.com", sentDate: "2026-03-15", status: "Expired", expiryDate: "2026-03-30" },
                { id: "SIG-006", name: "NDA - Client Alpha", type: "NDA", sentTo: "Kavita Patel", sentToEmail: "kavita@email.com", sentDate: "2026-03-29", status: "Declined", expiryDate: "2026-04-12" },
            ],
            bulkLetters: [
                { id: "BLK-001", employee: "Priya Sharma", employeeId: "E001", department: "Engineering", designation: "Senior Developer", letterType: "Appraisal", generatedDate: "2026-03-30", status: "Sent" },
                { id: "BLK-002", employee: "Rajesh Kumar", employeeId: "E002", department: "Sales", designation: "Sales Manager", letterType: "Appraisal", generatedDate: "2026-03-30", status: "Sent" },
                { id: "BLK-003", employee: "Sneha Rao", employeeId: "E003", department: "Design", designation: "UI Designer", letterType: "Confirmation", generatedDate: "2026-03-28", status: "Signed" },
                { id: "BLK-004", employee: "Vikram Singh", employeeId: "E004", department: "Marketing", designation: "Marketing Lead", letterType: "Experience", generatedDate: "2026-03-25", status: "Generated" },
                { id: "BLK-005", employee: "Amit Joshi", employeeId: "E005", department: "Engineering", designation: "Tech Lead", letterType: "Offer", generatedDate: "2026-03-22", status: "Signed" },
                { id: "BLK-006", employee: "Kavita Patel", employeeId: "E006", department: "HR", designation: "HR Executive", letterType: "Appointment", generatedDate: "2026-04-01", status: "Draft" },
                { id: "BLK-007", employee: "Deepak Nair", employeeId: "E007", department: "Finance", designation: "Finance Analyst", letterType: "Relieving", generatedDate: "2026-04-01", status: "Generated" },
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
            duplicateTemplate: (id) => set((state) => {
                const original = state.letterTemplates.find(t => t.id === id);
                if (!original) return state;
                const clone: LetterTemplate = {
                    ...original,
                    id: `TMP-${String(state.letterTemplates.length + 1).padStart(3, '0')}`,
                    name: `${original.name} (Copy)`,
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                };
                return { letterTemplates: [clone, ...state.letterTemplates] };
            }),

            issueLetter: (letter) => set((state) => ({
                issuedLetters: [{ ...letter, id: `LTR-${String(state.issuedLetters.length + 1).padStart(3, '0')}`, issuedDate: new Date().toISOString().split('T')[0] }, ...state.issuedLetters]
            })),
            updateLetter: (id, updates) => set((state) => ({
                issuedLetters: state.issuedLetters.map(l => l.id === id ? { ...l, ...updates } : l)
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
                    dueDate: ack.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }, ...state.acknowledgements]
            })),
            updateAcknowledgement: (id, status, comments) => set((state) => ({
                acknowledgements: state.acknowledgements.map(a => a.id === id ? { ...a, status, comments, signedAt: status === 'Signed' ? new Date().toISOString().split('T')[0] : a.signedAt } : a)
            })),
            updateAcknowledgementDetails: (id, updates) => set((state) => ({
                acknowledgements: state.acknowledgements.map(a => a.id === id ? { ...a, ...updates } : a)
            })),
            deleteAcknowledgement: (id) => set((state) => ({
                acknowledgements: state.acknowledgements.filter(a => a.id !== id)
            })),

            sendESignature: (req) => set((state) => ({
                eSignatures: [{
                    ...req,
                    id: `SIG-${String(state.eSignatures.length + 1).padStart(3, '0')}`,
                    sentDate: new Date().toISOString().split('T')[0],
                    status: "Pending",
                }, ...state.eSignatures]
            })),
            updateESignature: (id, updates) => set((state) => ({
                eSignatures: state.eSignatures.map(s => s.id === id ? { ...s, ...updates } : s)
            })),
            setESignatureStatus: (id, status) => set((state) => ({
                eSignatures: state.eSignatures.map(s => s.id === id ? {
                    ...s,
                    status,
                    viewedDate: status === 'Viewed' && !s.viewedDate ? new Date().toISOString().split('T')[0] : s.viewedDate,
                    signedDate: status === 'Signed' ? new Date().toISOString().split('T')[0] : s.signedDate,
                } : s)
            })),
            deleteESignature: (id) => set((state) => ({
                eSignatures: state.eSignatures.filter(s => s.id !== id)
            })),
            bulkDeleteESignatures: (ids) => set((state) => ({
                eSignatures: state.eSignatures.filter(s => !ids.includes(s.id))
            })),

            addBulkLetters: (letters) => set((state) => {
                const baseIdx = state.bulkLetters.length;
                const batchId = `BATCH-${Date.now()}`;
                const date = new Date().toISOString().split('T')[0];
                const created: BulkLetterRecord[] = letters.map((l, i) => ({
                    ...l,
                    id: `BLK-${String(baseIdx + i + 1).padStart(3, '0')}`,
                    generatedDate: date,
                    batchId,
                }));
                return { bulkLetters: [...created, ...state.bulkLetters] };
            }),
            updateBulkLetter: (id, updates) => set((state) => ({
                bulkLetters: state.bulkLetters.map(l => l.id === id ? { ...l, ...updates } : l)
            })),
            deleteBulkLetter: (id) => set((state) => ({
                bulkLetters: state.bulkLetters.filter(l => l.id !== id)
            })),
            bulkDeleteBulkLetters: (ids) => set((state) => ({
                bulkLetters: state.bulkLetters.filter(l => !ids.includes(l.id))
            })),
        }),
        {
            name: 'documents-storage',
            version: 2,
            migrate: (persistedState: any, version) => {
                if (!persistedState) return persistedState;
                if (version < 2) {
                    if (!Array.isArray(persistedState.eSignatures)) persistedState.eSignatures = [];
                    if (!Array.isArray(persistedState.bulkLetters)) persistedState.bulkLetters = [];
                }
                return persistedState;
            },
        }
    )
);
