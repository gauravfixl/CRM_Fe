import { create } from "zustand"

export interface ScmCourier {
    id: string
    courierName: string
    contactPerson: string
    phone: string
    email: string
    serviceAreas: string
    rateCard: string
    trackingApiUrl: string
    status: "Active" | "Inactive"
    createdAt: string
}

interface State {
    couriers: ScmCourier[]
    addCourier: (c: Omit<ScmCourier, "id" | "createdAt">) => void
    updateCourier: (id: string, p: Partial<ScmCourier>) => void
    deleteCourier: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const id = () => "cr_" + Math.random().toString(36).slice(2, 10)

export const useScmCouriersStore = create<State>((set) => ({
    couriers: [
        { id: "cr_01", courierName: "Delhivery", contactPerson: "Manish Gupta", phone: "+919811120001", email: "support@delhivery.com", serviceAreas: "Pan-India", rateCard: "₹40 base + ₹10/kg", trackingApiUrl: "https://track.delhivery.com/api", status: "Active", createdAt: "2026-01-10" },
        { id: "cr_02", courierName: "FedEx", contactPerson: "Priya Singh", phone: "+919822230001", email: "ops.in@fedex.com", serviceAreas: "International + Metro", rateCard: "₹120 base + ₹35/kg", trackingApiUrl: "https://api.fedex.com/track", status: "Active", createdAt: "2026-01-15" },
        { id: "cr_03", courierName: "DHL", contactPerson: "Aakash Mehta", phone: "+919833340002", email: "express@dhl.in", serviceAreas: "International + Tier-1", rateCard: "₹150 base + ₹40/kg", trackingApiUrl: "https://api.dhl.com/track", status: "Active", createdAt: "2026-02-02" },
        { id: "cr_04", courierName: "Shiprocket", contactPerson: "Sneha Patel", phone: "+919844456001", email: "support@shiprocket.in", serviceAreas: "Pan-India", rateCard: "Aggregator pricing", trackingApiUrl: "https://api.shiprocket.in/v1/track", status: "Active", createdAt: "2026-02-08" },
        { id: "cr_05", courierName: "Blue Dart", contactPerson: "Rahul Verma", phone: "+919855670002", email: "customer@bluedart.com", serviceAreas: "Pan-India + Air", rateCard: "₹80 base + ₹20/kg", trackingApiUrl: "https://bluedart.com/api/track", status: "Active", createdAt: "2026-03-01" },
        { id: "cr_06", courierName: "DTDC", contactPerson: "Pooja Shah", phone: "+919866780003", email: "info@dtdc.in", serviceAreas: "Pan-India", rateCard: "₹50 base + ₹12/kg", trackingApiUrl: "https://dtdc.in/api/track", status: "Inactive", createdAt: "2026-03-12" },
    ],
    addCourier: (c) => set((s) => ({ couriers: [{ id: id(), createdAt: today(), ...c }, ...s.couriers] })),
    updateCourier: (id, p) => set((s) => ({ couriers: s.couriers.map((c) => (c.id === id ? { ...c, ...p } : c)) })),
    deleteCourier: (id) => set((s) => ({ couriers: s.couriers.filter((c) => c.id !== id) })),
}))
