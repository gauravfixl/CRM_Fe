import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Firm = {
  id: string
  name: string
  registrationNumber: string
  industry: string
  status: string
  employeeCount: number
  location: string
  establishedDate: string
  contactPerson: string
  email: string
  phone: string
  revenue: string
  description: string
}

type FirmStore = {
  firms: Firm[]
  addFirm: (firm: Firm) => void
  updateFirm: (firm: Firm) => void
  deleteFirm: (id: string) => void
}

export const useFirmStore = create<FirmStore>()(
  persist(
    (set) => ({
      firms: [],
      addFirm: (firm) =>
        set((state) => ({
          firms: [...state.firms, firm],
        })),

      updateFirm: (updatedFirm) =>
        set((state) => ({
          firms: state.firms.map((firm) =>
            firm.id === updatedFirm.id ? updatedFirm : firm
          ),
        })),

      deleteFirm: (id) =>
        set((state) => ({
          firms: state.firms.filter((firm) => firm.id !== id),
        })),
    }),
    {
      name: 'firm-storage', // localStorage key
    }
  )
)
