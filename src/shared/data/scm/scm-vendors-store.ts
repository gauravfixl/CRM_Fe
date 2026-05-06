import { create } from "zustand"

export type VendorStatus = "Active" | "Inactive"

export interface ScmVendor {
    id: string
    vendorName: string
    vendorCode: string
    category: string
    contactPerson: string
    phone: string
    email: string
    website: string
    gstin: string
    address: string
    city: string
    state: string
    country: string
    pincode: string
    bankName: string
    accountNumber: string
    ifsc: string
    paymentTerms: string
    rating: number
    status: VendorStatus
    createdAt: string
}

interface State {
    vendors: ScmVendor[]
    addVendor: (v: Omit<ScmVendor, "id" | "createdAt" | "rating"> & { rating?: number }) => ScmVendor
    updateVendor: (id: string, patch: Partial<ScmVendor>) => void
    deleteVendor: (id: string) => void
}

const seed: ScmVendor[] = [
    {
        id: "v_001",
        vendorName: "PaperCo Industries",
        vendorCode: "VND-PC01",
        category: "Raw Material Supplier",
        contactPerson: "Suresh Mehta",
        phone: "+919812340001",
        email: "sales@paperco.in",
        website: "https://paperco.in",
        gstin: "27AABCP1234F1Z5",
        address: "Plot 42, MIDC Andheri",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400093",
        bankName: "HDFC Bank",
        accountNumber: "501023456789",
        ifsc: "HDFC0001234",
        paymentTerms: "Net 30",
        rating: 4.6,
        status: "Active",
        createdAt: "2026-01-08",
    },
    {
        id: "v_002",
        vendorName: "ClickPro Devices",
        vendorCode: "VND-CP02",
        category: "Technology Vendor",
        contactPerson: "Priya Nair",
        phone: "+919823450002",
        email: "orders@clickpro.com",
        website: "https://clickpro.com",
        gstin: "29ABCCC4567G1Z2",
        address: "Tower B, Manyata Tech Park",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560045",
        bankName: "ICICI Bank",
        accountNumber: "602033987654",
        ifsc: "ICIC0004567",
        paymentTerms: "Net 45",
        rating: 4.2,
        status: "Active",
        createdAt: "2026-01-22",
    },
    {
        id: "v_003",
        vendorName: "BoxIt Pvt Ltd",
        vendorCode: "VND-BX03",
        category: "Packaging Supplier",
        contactPerson: "Ravi Kapoor",
        phone: "+919833456003",
        email: "supply@boxit.in",
        website: "https://boxit.in",
        gstin: "07AAACB5678H2Z9",
        address: "Sector 7, Industrial Area",
        city: "Faridabad",
        state: "Haryana",
        country: "India",
        pincode: "121006",
        bankName: "Axis Bank",
        accountNumber: "703045123456",
        ifsc: "UTIB0007890",
        paymentTerms: "Net 15",
        rating: 3.9,
        status: "Active",
        createdAt: "2026-02-10",
    },
    {
        id: "v_004",
        vendorName: "HydroX Manufacturing",
        vendorCode: "VND-HX04",
        category: "Raw Material Supplier",
        contactPerson: "Neha Iyer",
        phone: "+919844560004",
        email: "ops@hydrox.com",
        website: "https://hydrox.com",
        gstin: "33AABCH9876K1Z1",
        address: "SIPCOT Industrial Park",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        pincode: "603103",
        bankName: "SBI",
        accountNumber: "804056789012",
        ifsc: "SBIN0009876",
        paymentTerms: "Net 60",
        rating: 4.4,
        status: "Active",
        createdAt: "2026-03-04",
    },
    {
        id: "v_005",
        vendorName: "QuickShip Logistics",
        vendorCode: "VND-QS05",
        category: "Transport Vendor",
        contactPerson: "Arjun Bhatia",
        phone: "+919855670005",
        email: "fleet@quickship.in",
        website: "https://quickship.in",
        gstin: "06AABCQ3456L2Z3",
        address: "NH-8 Industrial Belt",
        city: "Gurugram",
        state: "Haryana",
        country: "India",
        pincode: "122016",
        bankName: "Kotak Mahindra Bank",
        accountNumber: "905067890123",
        ifsc: "KKBK0001122",
        paymentTerms: "Net 7",
        rating: 4.0,
        status: "Inactive",
        createdAt: "2026-03-20",
    },
]

const nextId = () => "v_" + Math.random().toString(36).slice(2, 10)

export const useScmVendorsStore = create<State>((set) => ({
    vendors: seed,
    addVendor: (v) => {
        const vendor: ScmVendor = {
            id: nextId(),
            createdAt: new Date().toISOString().slice(0, 10),
            rating: v.rating ?? 0,
            ...v,
        } as ScmVendor
        set((s) => ({ vendors: [vendor, ...s.vendors] }))
        return vendor
    },
    updateVendor: (id, patch) =>
        set((s) => ({ vendors: s.vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
    deleteVendor: (id) => set((s) => ({ vendors: s.vendors.filter((v) => v.id !== id) })),
}))

export const VENDOR_CATEGORIES = [
    "Raw Material Supplier",
    "Packaging Supplier",
    "Transport Vendor",
    "Technology Vendor",
    "Maintenance Vendor",
    "Service Provider",
]

export const PAYMENT_TERMS = ["Net 7", "Net 15", "Net 30", "Net 45", "Net 60", "Advance", "On Delivery"]
