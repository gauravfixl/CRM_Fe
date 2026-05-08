import { create } from "zustand"

export type ShipmentStatus =
    | "Pending"
    | "Picked Up"
    | "In Transit"
    | "Reached Hub"
    | "Out for Delivery"
    | "Delivered"
    | "Delayed"
    | "Cancelled"

export interface ScmShipment {
    id: string
    shipmentId: string
    orderNumber: string
    customerName: string
    customerAddress: string
    warehouse: string
    courierPartner: string
    trackingNumber: string
    packageWeight: number
    packageDimensions: string
    shippingCharges: number
    pickupDate: string
    expectedDelivery: string
    actualDelivery?: string
    status: ShipmentStatus
    remarks: string
    createdAt: string
}

interface State {
    shipments: ScmShipment[]
    addShipment: (s: Omit<ScmShipment, "id" | "createdAt">) => ScmShipment
    updateShipment: (id: string, patch: Partial<ScmShipment>) => void
    deleteShipment: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)
const nextId = () => "sh_" + Math.random().toString(36).slice(2, 10)

const seed: ScmShipment[] = [
    {
        id: "sh_001",
        shipmentId: "SH-9043",
        orderNumber: "SO-3082",
        customerName: "Acme Corp",
        customerAddress: "Plot 22, BKC Mumbai 400051",
        warehouse: "Central Warehouse",
        courierPartner: "Delhivery",
        trackingNumber: "DLV0019283746",
        packageWeight: 2.4,
        packageDimensions: "30×20×15 cm",
        shippingCharges: 240,
        pickupDate: "2026-05-04",
        expectedDelivery: "2026-05-08",
        status: "In Transit",
        remarks: "",
        createdAt: "2026-05-04",
    },
    {
        id: "sh_002",
        shipmentId: "SH-9042",
        orderNumber: "SO-3081",
        customerName: "BlueWave Ltd",
        customerAddress: "Sector 5, Salt Lake Kolkata 700091",
        warehouse: "East Warehouse",
        courierPartner: "FedEx",
        trackingNumber: "FED7762541098",
        packageWeight: 5.6,
        packageDimensions: "45×30×20 cm",
        shippingCharges: 580,
        pickupDate: "2026-05-02",
        expectedDelivery: "2026-05-05",
        actualDelivery: "2026-05-05",
        status: "Delivered",
        remarks: "Delivered to reception",
        createdAt: "2026-05-02",
    },
    {
        id: "sh_003",
        shipmentId: "SH-9041",
        orderNumber: "SO-3080",
        customerName: "Tech Innovate",
        customerAddress: "Tower A, Cyber Hub Gurugram 122002",
        warehouse: "North Warehouse",
        courierPartner: "DHL",
        trackingNumber: "DHL3398761234",
        packageWeight: 8.2,
        packageDimensions: "60×40×25 cm",
        shippingCharges: 920,
        pickupDate: "2026-04-30",
        expectedDelivery: "2026-05-04",
        status: "Delayed",
        remarks: "Stuck at hub due to weather",
        createdAt: "2026-04-30",
    },
    {
        id: "sh_004",
        shipmentId: "SH-9040",
        orderNumber: "SO-3079",
        customerName: "GreenFields Co.",
        customerAddress: "Industrial Area Phase 2 Chandigarh 160002",
        warehouse: "Central Warehouse",
        courierPartner: "Shiprocket",
        trackingNumber: "SR9012387645",
        packageWeight: 1.1,
        packageDimensions: "25×18×10 cm",
        shippingCharges: 180,
        pickupDate: "2026-05-09",
        expectedDelivery: "2026-05-12",
        status: "Pending",
        remarks: "",
        createdAt: "2026-05-06",
    },
]

export const useScmShipmentsStore = create<State>((set) => ({
    shipments: seed,
    addShipment: (s) => {
        const shipment: ScmShipment = { id: nextId(), createdAt: today(), ...s }
        set((st) => ({ shipments: [shipment, ...st.shipments] }))
        return shipment
    },
    updateShipment: (id, patch) => set((st) => ({
        shipments: st.shipments.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })),
    deleteShipment: (id) => set((st) => ({
        shipments: st.shipments.filter((s) => s.id !== id),
    })),
}))

export const SHIPMENT_STATUSES: ShipmentStatus[] = [
    "Pending", "Picked Up", "In Transit", "Reached Hub", "Out for Delivery", "Delivered", "Delayed", "Cancelled",
]

export const COURIER_PARTNERS = [
    "Delhivery", "FedEx", "DHL", "Shiprocket", "Blue Dart", "DTDC", "Ekart", "India Post",
]
