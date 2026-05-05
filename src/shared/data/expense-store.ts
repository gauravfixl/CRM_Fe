import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ExpenseCategory = 'Travel' | 'Food' | 'Accommodation' | 'Transport' | 'Communication' | 'Medical' | 'Other';
export type ClaimStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Paid';
export type TravelStatus = 'Pending' | 'Approved' | 'InProgress' | 'Completed' | 'Settled';

export interface ExpenseClaim {
    id: string;
    employeeId: string;
    employeeName: string;
    category: ExpenseCategory;
    amount: number;
    currency: string;
    date: string;
    description: string;
    receiptUrl: string;
    receiptName?: string;
    status: ClaimStatus;
    approvedBy: string;
    approvedDate: string;
    paidDate: string;
    project: string;
    reviewNotes?: string;
}

export interface ItineraryItem {
    id: string;
    from: string;
    to: string;
    date: string;
    mode: string;
    cost: number;
}

export interface TravelRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    purpose: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    estimatedBudget: number;
    actualSpent: number;
    advanceRequested: number;
    advanceApproved: number;
    status: TravelStatus;
    itinerary: ItineraryItem[];
    expenses: string[];
}

export interface ExpensePolicy {
    id: string;
    category: ExpenseCategory;
    maxAmount: number;
    requiresReceipt: boolean;
    approvalLevel: string;
    perDiem: number;
    mileageRate: number;
    isActive: boolean;
}

export interface CardTransaction {
    id: string;
    date: string;
    merchant: string;
    amount: number;
    category: ExpenseCategory;
    description: string;
}

export interface CorporateCard {
    id: string;
    employeeId: string;
    employeeName: string;
    cardNumber: string;
    limit: number;
    spent: number;
    balance: number;
    transactions: CardTransaction[];
}

// Mock data
const mockClaims: ExpenseClaim[] = [
    { id: 'EC001', employeeId: 'E001', employeeName: 'Rahul Sharma', category: 'Travel', amount: 12500, currency: 'INR', date: '2026-03-28', description: 'Client visit to Mumbai office - cab and flight', receiptUrl: '/receipts/ec001.pdf', status: 'Submitted', approvedBy: '', approvedDate: '', paidDate: '', project: 'Project Alpha' },
    { id: 'EC002', employeeId: 'E002', employeeName: 'Priya Patel', category: 'Food', amount: 2800, currency: 'INR', date: '2026-03-27', description: 'Team dinner for sprint completion celebration', receiptUrl: '/receipts/ec002.pdf', status: 'Approved', approvedBy: 'Vikram Singh', approvedDate: '2026-03-29', paidDate: '', project: 'Project Beta' },
    { id: 'EC003', employeeId: 'E003', employeeName: 'Amit Kumar', category: 'Accommodation', amount: 8500, currency: 'INR', date: '2026-03-25', description: 'Hotel stay for 2 nights - Bangalore conference', receiptUrl: '/receipts/ec003.pdf', status: 'Paid', approvedBy: 'Vikram Singh', approvedDate: '2026-03-26', paidDate: '2026-03-30', project: 'Conference 2026' },
    { id: 'EC004', employeeId: 'E004', employeeName: 'Sneha Reddy', category: 'Transport', amount: 3200, currency: 'INR', date: '2026-03-26', description: 'Uber rides for client meetings - 5 trips', receiptUrl: '', status: 'Rejected', approvedBy: 'Vikram Singh', approvedDate: '2026-03-28', paidDate: '', project: 'Project Alpha' },
    { id: 'EC005', employeeId: 'E001', employeeName: 'Rahul Sharma', category: 'Communication', amount: 1500, currency: 'INR', date: '2026-03-20', description: 'International calling charges for client calls', receiptUrl: '/receipts/ec005.pdf', status: 'Paid', approvedBy: 'Vikram Singh', approvedDate: '2026-03-22', paidDate: '2026-03-25', project: 'Project Alpha' },
    { id: 'EC006', employeeId: 'E005', employeeName: 'Vikram Singh', category: 'Medical', amount: 4500, currency: 'INR', date: '2026-03-18', description: 'Annual health checkup as per company policy', receiptUrl: '/receipts/ec006.pdf', status: 'Approved', approvedBy: 'HR Admin', approvedDate: '2026-03-20', paidDate: '', project: '' },
    { id: 'EC007', employeeId: 'E002', employeeName: 'Priya Patel', category: 'Other', amount: 6000, currency: 'INR', date: '2026-03-15', description: 'Software license purchase for design tool', receiptUrl: '/receipts/ec007.pdf', status: 'Draft', approvedBy: '', approvedDate: '', paidDate: '', project: 'Project Beta' },
    { id: 'EC008', employeeId: 'E003', employeeName: 'Amit Kumar', category: 'Travel', amount: 18000, currency: 'INR', date: '2026-04-01', description: 'Flight booking for Delhi client meeting', receiptUrl: '/receipts/ec008.pdf', status: 'Submitted', approvedBy: '', approvedDate: '', paidDate: '', project: 'Project Gamma' },
];

const mockTravelRequests: TravelRequest[] = [
    {
        id: 'TR001', employeeId: 'E001', employeeName: 'Rahul Sharma', purpose: 'Client onboarding workshop in Mumbai', destination: 'Mumbai', departureDate: '2026-04-05', returnDate: '2026-04-08', estimatedBudget: 35000, actualSpent: 0, advanceRequested: 20000, advanceApproved: 15000, status: 'Approved',
        itinerary: [
            { id: 'IT001', from: 'Delhi', to: 'Mumbai', date: '2026-04-05', mode: 'Flight', cost: 8000 },
            { id: 'IT002', from: 'Mumbai', to: 'Delhi', date: '2026-04-08', mode: 'Flight', cost: 8500 },
        ],
        expenses: ['EC001'],
    },
    {
        id: 'TR002', employeeId: 'E003', employeeName: 'Amit Kumar', purpose: 'Annual tech conference and networking event', destination: 'Bangalore', departureDate: '2026-03-24', returnDate: '2026-03-26', estimatedBudget: 25000, actualSpent: 22000, advanceRequested: 15000, advanceApproved: 15000, status: 'Completed',
        itinerary: [
            { id: 'IT003', from: 'Hyderabad', to: 'Bangalore', date: '2026-03-24', mode: 'Train', cost: 2500 },
            { id: 'IT004', from: 'Bangalore', to: 'Hyderabad', date: '2026-03-26', mode: 'Train', cost: 2500 },
        ],
        expenses: ['EC003'],
    },
    {
        id: 'TR003', employeeId: 'E005', employeeName: 'Vikram Singh', purpose: 'Branch office audit and review', destination: 'Chennai', departureDate: '2026-04-10', returnDate: '2026-04-12', estimatedBudget: 28000, actualSpent: 0, advanceRequested: 18000, advanceApproved: 0, status: 'Pending',
        itinerary: [
            { id: 'IT005', from: 'Delhi', to: 'Chennai', date: '2026-04-10', mode: 'Flight', cost: 9000 },
            { id: 'IT006', from: 'Chennai', to: 'Delhi', date: '2026-04-12', mode: 'Flight', cost: 9500 },
        ],
        expenses: [],
    },
];

const mockPolicies: ExpensePolicy[] = [
    { id: 'EP001', category: 'Travel', maxAmount: 50000, requiresReceipt: true, approvalLevel: 'Manager', perDiem: 2500, mileageRate: 12, isActive: true },
    { id: 'EP002', category: 'Food', maxAmount: 5000, requiresReceipt: true, approvalLevel: 'Manager', perDiem: 800, mileageRate: 0, isActive: true },
    { id: 'EP003', category: 'Accommodation', maxAmount: 8000, requiresReceipt: true, approvalLevel: 'Manager', perDiem: 5000, mileageRate: 0, isActive: true },
    { id: 'EP004', category: 'Transport', maxAmount: 3000, requiresReceipt: false, approvalLevel: 'Manager', perDiem: 0, mileageRate: 12, isActive: true },
    { id: 'EP005', category: 'Medical', maxAmount: 15000, requiresReceipt: true, approvalLevel: 'HR', perDiem: 0, mileageRate: 0, isActive: true },
];

const mockCards: CorporateCard[] = [
    {
        id: 'CC001', employeeId: 'E001', employeeName: 'Rahul Sharma', cardNumber: '**** **** **** 4521', limit: 100000, spent: 32500, balance: 67500,
        transactions: [
            { id: 'CT001', date: '2026-03-28', merchant: 'Indigo Airlines', amount: 8000, category: 'Travel', description: 'Flight DEL-BOM' },
            { id: 'CT002', date: '2026-03-27', merchant: 'Uber India', amount: 1200, category: 'Transport', description: 'Airport transfer' },
            { id: 'CT003', date: '2026-03-25', merchant: 'Marriott Hotels', amount: 12500, category: 'Accommodation', description: '2 night stay' },
            { id: 'CT004', date: '2026-03-20', merchant: 'Zomato', amount: 2800, category: 'Food', description: 'Team lunch' },
        ],
    },
    {
        id: 'CC002', employeeId: 'E005', employeeName: 'Vikram Singh', cardNumber: '**** **** **** 7892', limit: 200000, spent: 45000, balance: 155000,
        transactions: [
            { id: 'CT005', date: '2026-03-30', merchant: 'Air India', amount: 18000, category: 'Travel', description: 'Flight DEL-CHN return' },
            { id: 'CT006', date: '2026-03-28', merchant: 'Hilton Hotels', amount: 15000, category: 'Accommodation', description: '3 night stay Chennai' },
            { id: 'CT007', date: '2026-03-15', merchant: 'Vodafone', amount: 2000, category: 'Communication', description: 'Intl roaming plan' },
        ],
    },
];

interface ExpenseStore {
    claims: ExpenseClaim[];
    travelRequests: TravelRequest[];
    policies: ExpensePolicy[];
    corporateCards: CorporateCard[];

    // Claims CRUD
    addClaim: (claim: ExpenseClaim) => void;
    updateClaim: (id: string, data: Partial<ExpenseClaim>) => void;
    deleteClaim: (id: string) => void;

    // Travel CRUD
    addTravelRequest: (req: TravelRequest) => void;
    updateTravelRequest: (id: string, data: Partial<TravelRequest>) => void;
    deleteTravelRequest: (id: string) => void;

    // Policy CRUD
    addPolicy: (policy: ExpensePolicy) => void;
    updatePolicy: (id: string, data: Partial<ExpensePolicy>) => void;
    deletePolicy: (id: string) => void;

    // Card CRUD
    addCorporateCard: (card: CorporateCard) => void;
    updateCorporateCard: (id: string, data: Partial<CorporateCard>) => void;
    deleteCorporateCard: (id: string) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
    persist(
        (set) => ({
            claims: mockClaims,
            travelRequests: mockTravelRequests,
            policies: mockPolicies,
            corporateCards: mockCards,

            addClaim: (claim) => set((s) => ({ claims: [...s.claims, claim] })),
            updateClaim: (id, data) => set((s) => ({ claims: s.claims.map(c => c.id === id ? { ...c, ...data } : c) })),
            deleteClaim: (id) => set((s) => ({ claims: s.claims.filter(c => c.id !== id) })),

            addTravelRequest: (req) => set((s) => ({ travelRequests: [...s.travelRequests, req] })),
            updateTravelRequest: (id, data) => set((s) => ({ travelRequests: s.travelRequests.map(t => t.id === id ? { ...t, ...data } : t) })),
            deleteTravelRequest: (id) => set((s) => ({ travelRequests: s.travelRequests.filter(t => t.id !== id) })),

            addPolicy: (policy) => set((s) => ({ policies: [...s.policies, policy] })),
            updatePolicy: (id, data) => set((s) => ({ policies: s.policies.map(p => p.id === id ? { ...p, ...data } : p) })),
            deletePolicy: (id) => set((s) => ({ policies: s.policies.filter(p => p.id !== id) })),

            addCorporateCard: (card) => set((s) => ({ corporateCards: [...s.corporateCards, card] })),
            updateCorporateCard: (id, data) => set((s) => ({ corporateCards: s.corporateCards.map(c => c.id === id ? { ...c, ...data } : c) })),
            deleteCorporateCard: (id) => set((s) => ({ corporateCards: s.corporateCards.filter(c => c.id !== id) })),
        }),
        { name: 'expense-store' }
    )
);
