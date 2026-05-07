import { create } from "zustand"

export type WarehouseStatus = "Active" | "Inactive"

export interface ScmWarehouse {
    id: string
    warehouseName: string
    warehouseCode: string
    address: string
    city: string
    state: string
    country: string
    pincode: string
    managerName: string
    contact: string
    storageCapacity: number
    currentUtilization: number
    status: WarehouseStatus
    createdAt: string
}

interface State {
    warehouses: ScmWarehouse[]
    addWarehouse: (w: Omit<ScmWarehouse, "id" | "createdAt" | "currentUtilization"> & { currentUtilization?: number }) => ScmWarehouse
    updateWarehouse: (id: string, patch: Partial<ScmWarehouse>) => void
    deleteWarehouse: (id: string) => void
}

const seed: ScmWarehouse[] = [
    {
        id: "w_001",
        warehouseName: "Central Warehouse",
        warehouseCode: "WH-CTL",
        address: "Plot 14, Industrial Area Phase 2",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400072",
        managerName: "Rohit Sharma",
        contact: "+919812345678",
        storageCapacity: 25000,
        currentUtilization: 17800,
        status: "Active",
        createdAt: "2026-01-12",
    },
    {
        id: "w_002",
        warehouseName: "North Warehouse",
        warehouseCode: "WH-NTH",
        address: "Sector 63, Block C",
        city: "Noida",
        state: "Uttar Pradesh",
        country: "India",
        pincode: "201301",
        managerName: "Anita Verma",
        contact: "+919823456789",
        storageCapacity: 18000,
        currentUtilization: 9400,
        status: "Active",
        createdAt: "2026-02-04",
    },
    {
        id: "w_003",
        warehouseName: "South Warehouse",
        warehouseCode: "WH-STH",
        address: "Whitefield Industrial Park",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560066",
        managerName: "Kiran Rao",
        contact: "+919934567812",
        storageCapacity: 20000,
        currentUtilization: 16200,
        status: "Active",
        createdAt: "2026-02-15",
    },
    {
        id: "w_004",
        warehouseName: "East Warehouse",
        warehouseCode: "WH-EST",
        address: "Salt Lake Sector V",
        city: "Kolkata",
        state: "West Bengal",
        country: "India",
        pincode: "700091",
        managerName: "Souvik Das",
        contact: "+919845671234",
        storageCapacity: 12000,
        currentUtilization: 4100,
        status: "Inactive",
        createdAt: "2026-03-09",
    },
    {
        id: "w_005",
        warehouseName: "West Warehouse",
        warehouseCode: "WH-WST",
        address: "GIDC Vatva, Phase 4",
        city: "Ahmedabad",
        state: "Gujarat",
        country: "India",
        pincode: "382445",
        managerName: "Manish Patel",
        contact: "+919823412345",
        storageCapacity: 15000,
        currentUtilization: 11200,
        status: "Active",
        createdAt: "2026-03-22",
    },
]

const nextId = () => "w_" + Math.random().toString(36).slice(2, 10)

export const useScmWarehousesStore = create<State>((set) => ({
    warehouses: seed,
    addWarehouse: (w) => {
        const wh: ScmWarehouse = {
            id: nextId(),
            createdAt: new Date().toISOString().slice(0, 10),
            currentUtilization: w.currentUtilization ?? 0,
            ...w,
        } as ScmWarehouse
        set((s) => ({ warehouses: [wh, ...s.warehouses] }))
        return wh
    },
    updateWarehouse: (id, patch) =>
        set((s) => ({
            warehouses: s.warehouses.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),
    deleteWarehouse: (id) =>
        set((s) => ({ warehouses: s.warehouses.filter((w) => w.id !== id) })),
}))
