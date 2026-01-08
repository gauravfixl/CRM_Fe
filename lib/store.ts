
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Lead {
  id: string
  name: string
  email: string
  company: string
  status: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'
  value: number
  source: string
  phone?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  isDeleted?: boolean
  stageHistory?: StageHistoryEntry[]
  activities?: ActivityEntry[]
}

export interface StageHistoryEntry {
  id: string
  fromStatus: string
  toStatus: string
  changedBy: string
  changedAt: string
  notes?: string
}

export interface ActivityEntry {
  id: string

  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'created' | 'updated' | 'deleted' | 'restored'

  title: string
  description: string
  performedBy: string
  performedAt: string
}

export interface Client {
  _id?: string
  id?: string
  clientFirmName?: string
  firstName?: string
  lastName?: string
  name?: string
  website?: string
  email: string
  phone: string
  address?: any
  contactPerson?: any
  status?: string
  totalValue?: number
  projectsCount?: number
  lastContact?: string
  gst?: string
  notes?: string
  taxId?: string
  tinNo?: string
  cinNo?: string
  firmId?: string
  deleted?: boolean
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
  activities?: ActivityEntry[]
}


// export interface InvoiceItem {
//   id: string
//   description: string
//   quantity: number
//   rate: number
//    hsn?: string
//   sac?: string
//   tax?: number
//   discount?: number

// }
export interface Invoice {
  id: string
  orgId: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  subTotal: number
  total: number
  status: 'Draft' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled'
  amountPaid: number
  dueAmount: number
  roundOff: number
  delete: boolean
  cancel: boolean
  draft: boolean
  incluTax: boolean
  partialPay: boolean
  allowTip: boolean
  recurringInvoice: boolean
  items: InvoiceItem[]
  tax: string[]
  taxAmt: number[]
  notes?: string
  remark?: string
  gstn?: string
  termsNcondition?: string[]
  currency: string
  curConvert?: string
  client: ClientInfo
  firm: FirmInfo
  payment?: PaymentInfo[]
  recurringInvoiceObj?: {
    start_date: string | null
    end_date: string | null
  }
  createdAt?: string
  updatedAt?: string
  isDeleted?: boolean
  activities?: ActivityEntry[]
  paidAmount?: number
  reminders?: Reminder[]
  amount?: number
  cancelledDate?: string
  __v?: number
}

export interface InvoiceItem {
  id?: string
  itemName: string
  unitPrice: number
  quantity: number
  amount: number
  rate?: number
  hsn?: string
  sac?: string
  taxRate?: number
  desc?: string
  description?: string
  discount?: number
  taxId?: string
}

export interface Reminder {
  text: string
  date: string
  time: string
}

export interface ClientInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  taxId?: string
  clientFirmName?: string
  address: Address
  client_id: string
}

export interface FirmInfo {
  name: string
  phone: string | number
  taxId?: string
  email?: string
  address: Address
  firmId: string
}

export interface Address {
  address1: string
  address2?: string
  city: string
  state: string
  country: string
  pinCode: number
}

export interface PaymentInfo {
  amountPaid: number
  datePaid: string
  paymentMethod: string
  transId?: string
  notes?: string
  chequeNo?: number
}


export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  manager: string
  salary: string
  status: 'Active' | 'On Leave' | 'Inactive'
  joinDate: string
  location: string
  employeeType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern'
  createdAt: string
  updatedAt: string
  isDeleted?: boolean
}



export interface ContactPerson {
  name: string
  email: string
  phone?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
}

export interface FirmAddress {
  address1: string
  address2?: string
  city: string
  state: string
  country: string
  pinCode: number
}



export interface Firm {
  _id: string
  FirmName: string
  registrationNumber: string
  industry: string
  status: 'Active' | 'Inactive' | 'Pending'




  employeeCount?: number
  location?: string
  establishedDate: string
  contactPerson: ContactPerson
  add: FirmAddress
  email: string
  phone: string
  revenue?: string
  description?: string
  website?: string
  gst_no?: string
  tinNo?: string
  cinNo?: string
  uin?: string
  logo?: string
  id?: string

  createdAt: string
  updatedAt: string
  isDeleted?: boolean
}


export interface Project {
  id: string
  name: string
  description: string
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold'
  progress: number
  dueDate: string
  team: string[]
  priority: 'Low' | 'Medium' | 'High'
  createdAt: string
  updatedAt: string
  isDeleted?: boolean
}

// Store interface
interface AppStore {
  // Leads
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  updateLeadStatus: (id: string, newStatus: Lead['status'], changedBy: string, notes?: string) => void
  deleteLead: (id: string) => void
  bulkDeleteLeads: (ids: string[]) => void
  restoreLead: (id: string) => void
  getLeadById: (id: string) => Lead | undefined
  addLeadActivity: (leadId: string, activity: Omit<ActivityEntry, 'id' | 'performedAt'>) => void

  // Clients
  clients: Client[]
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void
  setClients: (updater: Client[] | ((prev: Client[]) => Client[])) => void;

  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
  restoreClient: (id: string) => void
  getClientById: (id: string) => Client | undefined

  addClientActivity: (clientId: string, activity: Omit<ActivityEntry, 'id' | 'performedAt'>) => void

  // Invoices
  invoices: Invoice[]
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'>) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  restoreInvoice: (id: string) => void
  cancelInvoice: (id: string) => void
  convertDraftToInvoice: (id: string) => void
  getInvoiceById: (id: string) => Invoice | undefined
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[]
  addInvoiceActivity: (invoiceId: string, activity: Omit<ActivityEntry, 'id' | 'performedAt'>) => void
  recordPayment: (invoiceId: string, amount: number) => void
  copiedInvoice: Invoice | null
  setCopiedInvoice: (invoice: Invoice | null) => void



  // Employees
  employees: Employee[]
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  restoreEmployee: (id: string) => void
  getEmployeeById: (id: string) => Employee | undefined

  // Firms
  firms: Firm[]
  addFirm: (firm: Omit<Firm, 'id' | 'createdAt' | 'updatedAt'>) => void
  setFirms: (firms: Firm[]) => void;
  updateFirm: (id: string, updates: Partial<Firm>) => void
  deleteFirm: (id: string) => void
  restoreFirm: (id: string) => void
  getFirmById: (id: string) => Firm | undefined

  // Projects
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  restoreProject: (id: string) => void
  getProjectById: (id: string) => Project | undefined

}

// Initial data
const initialLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    company: "Tech Corp",
    status: "New",
    value: 5000,
    source: "Website",
    phone: "+1 (555) 123-4567",
    assignedTo: "Sarah Johnson",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    stageHistory: [
      {
        id: "sh1",
        fromStatus: "",
        toStatus: "New",
        changedBy: "System",
        changedAt: "2024-01-10T00:00:00Z",
        notes: "Lead created"
      }
    ],
    activities: [
      {
        id: "act1",
        type: "created",
        title: "Lead Created",
        description: "New lead created from website form",
        performedBy: "System",
        performedAt: "2024-01-10T00:00:00Z"


      },
      {
        id: "act2",
        type: "email",
        title: "Welcome Email Sent",
        description: "Automated welcome email sent to lead",
        performedBy: "System",
        performedAt: "2024-01-10T01:00:00Z"
      }
    ]
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    company: "Design Studio",
    status: "Qualified",
    value: 12000,
    source: "Referral",
    phone: "+1 (555) 234-5678",
    assignedTo: "Mike Wilson",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
    stageHistory: [
      {
        id: "sh2",
        fromStatus: "",
        toStatus: "New",
        changedBy: "System",
        changedAt: "2024-01-12T00:00:00Z",
        notes: "Lead created"
      },
      {
        id: "sh3",
        fromStatus: "New",
        toStatus: "Qualified",
        changedBy: "Mike Wilson",
        changedAt: "2024-01-16T00:00:00Z",
        notes: "Qualified after discovery call"
      }
    ],
    activities: [
      {
        id: "act3",
        type: "created",
        title: "Lead Created",
        description: "New lead created from referral",
        performedBy: "System",
        performedAt: "2024-01-12T00:00:00Z"
      },
      {
        id: "act4",
        type: "call",
        title: "Discovery Call",
        description: "30-minute discovery call completed",
        performedBy: "Mike Wilson",
        performedAt: "2024-01-16T00:00:00Z"
      }
    ]
  },

]

const initialClients: Client[] = [
  //  {
  //       _id: "1",
  //       clientFirmName: "Acme Corporation",
  //       firstName: "John",
  //       lastName: "Smith",
  //       website: "https://acme.com",
  //       email: "john@acme.com",
  //       phone: "+1 (555) 123-4567",
  //       address: {
  //         address1: "123 Business St",
  //         address2: "",
  //         city: "NY",
  //         state: "NY",
  //         pinCode: "10001",
  //         country: "USA",
  //         _id: "1a"
  //       },
  //       contactPerson: {
  //         name: "John Smith",
  //         email: "john@acme.com",
  //         address1: "123 Business St",
  //         address2: "",
  //         city: "NY",
  //         state: "NY",
  //         pinCode: "10001",
  //         country: "USA",
  //         phone: "+1 (555) 123-4567",
  //         mobile: "",
  //         altPhone: "",
  //         altMobile: "",
  //         _id: "1b"
  //       },
  //       taxId: "",
  //       tinNo: "TIN123456789",
  //       cinNo: "CIN1234567890XYZ",
  //       orgId: {
  //         _id: "org1",
  //         name: "Acme Org",
  //         OrgLogo: {
  //           url: "https://dummyimage.com/100x100/000/fff&text=Acme",
  //           public_id: "org/acme"
  //         },
  //         contactEmail: "contact@acme.com"
  //       },
  //       firmId: {
  //         _id: "firm1",
  //         email: "info@acme.com",
  //         FirmLogo: {
  //           url: "https://dummyimage.com/100x100/000/fff&text=Firm",
  //           public_id: null
  //         }
  //       },
  //       deleted: false,
  //       createdAt: "2024-01-01T00:00:00Z",
  //       updatedAt: "2024-01-15T00:00:00Z",
  //       __v: 0
  //     },
  // {
  //   id: "2",
  //   name: "Global Solutions Inc",
  //   contactPerson: "Sarah Johnson",
  //   email: "sarah@globalsolutions.com",
  //   phone: "+1 (555) 234-5678",
  //   address: "456 Corporate Ave, CA 90210",
  //   industry: "Consulting",
  //   status: "Active",
  //   totalValue: 89500,
  //   projectsCount: 2,
  //   lastContact: "2024-01-12",
  //   createdAt: "2024-01-02T00:00:00Z",
  //   updatedAt: "2024-01-12T00:00:00Z",
  //   gst: "GST987654321",
  //   activities: [
  //     {
  //       id: "act2",
  //       type: "created",
  //       title: "Client Created",
  //       description: "New client added to system",
  //       performedBy: "System",
  //       performedAt: "2024-01-02T00:00:00Z"
  //     }
  //   ]
  // }



]

const initialInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    orgId: "org-1",
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2024-01-15",
    dueDate: "2024-02-14",
    subTotal: 15000.00,
    total: 15750.00,
    amount: 15750.00,
    status: "Paid",
    amountPaid: 15750.00,
    dueAmount: 0,
    roundOff: 0,
    delete: false,
    cancel: false,
    draft: false,
    incluTax: true,
    partialPay: false,
    allowTip: false,
    recurringInvoice: false,
    currency: "USD",
    client: {
      firstName: "Acme",
      lastName: "Corporation",
      email: "billing@acme.com",
      phone: "+1-555-0123",
      address: {
        address1: "123 Business Way",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        pinCode: 94107
      },
      client_id: "client-1"
    },
    firm: {
      name: "My Business",
      phone: 1234567890,
      firmId: "firm-1",
      address: {
        address1: "456 Office St",
        city: "New York",
        state: "NY",
        country: "USA",
        pinCode: 10001
      }
    },
    items: [
      {
        id: "item1",
        itemName: "Frontend Development",
        description: "Frontend Development",
        quantity: 40,
        unitPrice: 125.00,
        rate: 125.00,
        amount: 5000.00
      },
      {
        id: "item2",
        itemName: "Backend API Development",
        description: "Backend API Development",
        quantity: 60,
        unitPrice: 150.00,
        rate: 150.00,
        amount: 9000.00
      },
      {
        id: "item3",
        itemName: "Database Setup",
        description: "Database Setup",
        quantity: 10,
        unitPrice: 100.00,
        rate: 100.00,
        amount: 1000.00
      }
    ],
    tax: ["VAT"],
    taxAmt: [750],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
    activities: [
      {
        id: "act1",
        type: "created",
        title: "Invoice Created",
        description: "New invoice created",
        performedBy: "System",
        performedAt: "2024-01-15T00:00:00Z"
      }
    ]
  },
  {
    id: "INV-2024-002",
    orgId: "org-1",
    invoiceNumber: "INV-2024-002",
    invoiceDate: "2024-01-20",
    dueDate: "2024-02-19",
    subTotal: 8000.00,
    total: 8500.00,
    amount: 8500.00,
    status: "Pending",
    amountPaid: 0,
    dueAmount: 8500.00,
    roundOff: 0,
    delete: false,
    cancel: false,
    draft: false,
    incluTax: true,
    partialPay: false,
    allowTip: false,
    recurringInvoice: false,
    currency: "USD",
    client: {
      firstName: "Global",
      lastName: "Solutions",
      email: "accounts@globalsolutions.com",
      phone: "+1-555-9876",
      address: {
        address1: "456 Corporate Ave",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        pinCode: 90210
      },
      client_id: "client-2"
    },
    firm: {
      name: "My Business",
      phone: 1234567890,
      firmId: "firm-1",
      address: {
        address1: "456 Office St",
        city: "New York",
        state: "NY",
        country: "USA",
        pinCode: 10001
      }
    },
    items: [
      {
        id: "item4",
        itemName: "UI/UX Design",
        description: "UI/UX Design",
        quantity: 25,
        unitPrice: 120.00,
        rate: 120.00,
        amount: 3000.00
      },
      {
        id: "item5",
        itemName: "Mobile Development",
        description: "Mobile Development",
        quantity: 50,
        unitPrice: 100.00,
        rate: 100.00,
        amount: 5000.00
      }
    ],
    tax: ["Sales Tax"],
    taxAmt: [500],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
    activities: [
      {
        id: "act2",
        type: "created",
        title: "Invoice Created",
        description: "New invoice created",
        performedBy: "System",
        performedAt: "2024-01-20T00:00:00Z"
      }
    ]
  }
]

const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Software Engineer",
    department: "Engineering",
    manager: "David Kim",
    salary: "$95,000",
    status: "Active",
    joinDate: "2023-01-15",
    location: "New York, NY",
    employeeType: "Full-time",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

const initialFirms: Firm[] = [

]

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    status: "In Progress",
    progress: 65,
    dueDate: "2024-02-15",
    team: ["JD", "SM", "AB"],
    priority: "High",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

// Store implementation
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Leads
      leads: initialLeads,
      addLead: (leadData) => {
        const newLead: Lead = {
          ...leadData,
          id: `lead-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stageHistory: [
            {
              id: `sh-${Date.now()}`,
              fromStatus: "",
              toStatus: leadData.status,
              changedBy: "System",
              changedAt: new Date().toISOString(),
              notes: "Lead created"
            }
          ],
          activities: [
            {
              id: `act-${Date.now()}`,
              type: "created",
              title: "Lead Created",
              description: `New lead created from ${leadData.source}`,
              performedBy: "System",
              performedAt: new Date().toISOString()
            }
          ]
        }
        set((state) => ({ leads: [...state.leads, newLead] }))
      },
      updateLead: (id, updates) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id
              ? {
                ...lead,
                ...updates,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(lead.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "updated" as const,
                    title: "Lead Updated",
                    description: "Lead information updated",
                    performedBy: updates.assignedTo || "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }
              : lead
          ),
        }))
      },
      updateLeadStatus: (id, newStatus, changedBy, notes) => {
        set((state) => ({
          leads: state.leads.map((lead) => {
            if (lead.id === id) {
              const oldStatus = lead.status
              return {
                ...lead,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                stageHistory: [
                  ...(lead.stageHistory || []),
                  {
                    id: `sh-${Date.now()}`,
                    fromStatus: oldStatus,
                    toStatus: newStatus,
                    changedBy,
                    changedAt: new Date().toISOString(),
                    notes
                  }
                ],
                activities: [
                  ...(lead.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "status_change" as const,
                    title: "Status Changed",
                    description: `Status changed from ${oldStatus} to ${newStatus}`,
                    performedBy: changedBy,
                    performedAt: new Date().toISOString()
                  }
                ]
              }
            }
            return lead
          }),
        }))
      },
      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id
              ? {
                ...lead,
                isDeleted: true,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(lead.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "deleted" as const,
                    title: "Lead Deleted",
                    description: "Lead moved to deleted items",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }
              : lead
          ),
        }))
      },
      bulkDeleteLeads: (ids) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            ids.includes(lead.id)
              ? {
                ...lead,
                isDeleted: true,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(lead.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "deleted" as const,
                    title: "Lead Deleted (Bulk)",
                    description: "Lead deleted in bulk operation",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }
              : lead
          ),
        }))
      },
      restoreLead: (id) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id
              ? {
                ...lead,
                isDeleted: false,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(lead.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "restored" as const,
                    title: "Lead Restored",
                    description: "Lead restored from deleted items",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }
              : lead
          ),
        }))
      },
      getLeadById: (id) => get().leads.find((lead) => lead.id === id),
      addLeadActivity: (leadId, activity) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === leadId
              ? {
                ...lead,
                activities: [
                  ...(lead.activities || []),
                  {
                    ...activity,
                    id: `act-${Date.now()}`,
                    performedAt: new Date().toISOString()
                  }
                ],
                updatedAt: new Date().toISOString()
              }
              : lead
          ),
        }))
      },

      // Clients
      clients: initialClients,
      setClients: (updater: Client[] | ((prev: Client[]) => Client[])) =>
        set(state => ({
          clients: typeof updater === "function" ? updater(state.clients) : updater
        })),


      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: `client-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),

          activities: [
            {
              id: `act-${Date.now()}`,
              type: "created" as const,
              title: "Client Created",
              description: "New client added to system",
              performedBy: "System",
              performedAt: new Date().toISOString()
            }
          ]

        }
        set((state) => ({ clients: [...state.clients, newClient] }))
      },
      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id

              ? {
                ...client,
                ...updates,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(client.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "updated" as const,
                    title: "Client Updated",
                    description: "Client information updated",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }

              : client
          ),
        }))
      },
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id

              ? {
                ...client,
                deleted: true,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(client.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "deleted" as const,
                    title: "Client Deleted",
                    description: "Client moved to deleted items",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }

              : client
          ),
        }))
      },
      restoreClient: (id) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client._id === id

              ? {
                ...client,
                isDeleted: false,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(client.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "restored" as const,
                    title: "Client Restored",
                    description: "Client restored from deleted items",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }

              : client
          ),
        }))
      },
      getClientById: (id) => get().clients.find((client) => client.id === id),

      addClientActivity: (clientId, activity) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                ...client,
                activities: [
                  ...(client.activities || []),
                  {
                    ...activity,
                    id: `act-${Date.now()}`,
                    performedAt: new Date().toISOString()
                  }
                ],
                updatedAt: new Date().toISOString()
              }
              : client
          ),
        }))
      },


      // Invoices
      invoices: initialInvoices,
      addInvoice: (invoiceData) => {

        const invoiceNumber = `INV-${Date.now()}`
        const newInvoice: Invoice = {
          ...invoiceData,
          id: `invoice-${Date.now()}`,
          invoiceNumber,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          activities: [
            {
              id: `act-${Date.now()}`,
              type: "created" as const,
              title: "Invoice Created",
              description: `Invoice ${invoiceNumber} created`,
              performedBy: "System",
              performedAt: new Date().toISOString()
            }
          ]

        }
        set((state) => ({ invoices: [...state.invoices, newInvoice] }))
      },
      // Copy Invoice Support
      copiedInvoice: null,
      setCopiedInvoice: (invoice: Invoice | null) => set(() => ({ copiedInvoice: invoice })),

      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id

              ? {
                ...invoice,
                ...updates,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(invoice.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "updated" as const,
                    title: "Invoice Updated",
                    description: "Invoice information updated",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }

              : invoice
          ),
        }))
      },
      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id

              ? {
                ...invoice,
                isDeleted: true,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(invoice.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "deleted" as const,
                    title: "Invoice Deleted",
                    description: "Invoice moved to deleted items",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }

              : invoice
          ),
        }))
      },
      restoreInvoice: (id) => {
        set((state) => {


          const updatedInvoices = state.invoices.map((invoice) =>
            invoice.id === id
              ? {
                ...invoice,
                isDeleted: false,
                status: "Pending" as const, // <-- update status here
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(invoice.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "restored" as const,
                    title: "Invoice Restored",
                    description: "Invoice restored from deleted items",
                    performedBy: "System",
                    performedAt: new Date().toISOString()
                  }
                ]
              }
              : invoice
          )

          return { invoices: updatedInvoices }
        })
      },


      // cancelInvoice: (id) => {
      //   set((state) => ({
      //     invoices: state.invoices.map((invoice) =>
      //       invoice.id === id
      //         ? { 
      //             ...invoice, 
      //             status: "Cancelled" as const,
      //             cancelledDate: new Date().toISOString(),
      //             updatedAt: new Date().toISOString(),
      //             activities: [
      //               ...(invoice.activities || []),
      //               {
      //                 id: `act-${Date.now()}`,
      //                 type: "status_change",
      //                 title: "Invoice Cancelled",
      //                 description: "Invoice status changed to cancelled",
      //                 performedBy: "System",
      //                 performedAt: new Date().toISOString()
      //               }
      //             ]
      //           }
      //         : invoice
      //     ),
      //   }))
      // },
      cancelInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id
              ? {
                ...invoice,
                status: "Cancelled" as const,
                cancelledDate: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(invoice.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "status_change" as const,
                    title: "Invoice Cancelled",
                    description: `Invoice ${invoice.invoiceNumber} was cancelled`,
                    performedBy: "System",
                    performedAt: new Date().toISOString(),
                  },
                ],
              }
              : invoice
          ),
        }));
      },

      // convertDraftToInvoice: (id) => {
      //   set((state) => ({
      //     invoices: state.invoices.map((invoice) =>
      //       invoice.id === id && invoice.status === "Draft"
      //         ? { 
      //             ...invoice, 
      //             status: "Pending" as const,
      //             updatedAt: new Date().toISOString(),
      //             activities: [
      //               ...(invoice.activities || []),
      //               {
      //                 id: `act-${Date.now()}`,
      //                 type: "status_change",
      //                 title: "Draft Converted to Invoice",
      //                 description: "Draft invoice converted to pending invoice",
      //                 performedBy: "System",
      //                 performedAt: new Date().toISOString()
      //               }
      //             ]
      //           }

      //         : invoice
      //     ),
      //   }))
      // },
      convertDraftToInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id && invoice.status === "Draft"
              ? {
                ...invoice,
                status: "Pending" as const,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(invoice.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "status_change" as const,
                    title: "Draft Converted",
                    description: `Draft invoice ${invoice.invoiceNumber} converted to Pending`,
                    performedBy: "System",
                    performedAt: new Date().toISOString(),
                  },
                ],
              }
              : invoice
          ),
        }));
      },

      getInvoiceById: (id) => get().invoices.find((invoice) => invoice.id === id),

      getInvoicesByStatus: (status) => get().invoices.filter((invoice) => invoice.status === status && !invoice.isDeleted),
      addInvoiceActivity: (invoiceId, activity) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === invoiceId
              ? {
                ...invoice,
                activities: [
                  ...(invoice.activities || []),
                  {
                    ...activity,
                    id: `act-${Date.now()}`,
                    performedAt: new Date().toISOString()
                  }
                ],
                updatedAt: new Date().toISOString()
              }
              : invoice
          ),
        }))
      },

      // In your useAppStore (store)
      recordPayment: (invoiceId: string, amount: number) =>
        set((state) => {
          const invoices = state.invoices.map((inv) => {
            if (inv.id === invoiceId) {
              const paidAmount = (inv.paidAmount || 0) + amount
              const totalDue = (inv.amount || 0) - paidAmount
              return {
                ...inv,
                paidAmount,
                status: (totalDue <= 0 ? "Paid" : inv.status) as any,
                updatedAt: new Date().toISOString(),
                activities: [
                  ...(inv.activities || []),
                  {
                    id: `act-${Date.now()}`,
                    type: "status_change" as const,
                    title: "Payment Recorded",
                    description: `Recorded payment of INR ${amount.toFixed(2)}`,
                    performedBy: "System",
                    performedAt: new Date().toISOString(),
                  },
                ],
              }
            }
            return inv
          })
          return { invoices }
        }),
      //new call for recording paymeent



      // Employees
      employees: initialEmployees,
      addEmployee: (employeeData) => {
        const newEmployee: Employee = {
          ...employeeData,
          id: `EMP-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ employees: [...state.employees, newEmployee] }))
      },
      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((employee) =>
            employee.id === id
              ? { ...employee, ...updates, updatedAt: new Date().toISOString() }
              : employee
          ),
        }))
      },
      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.map((employee) =>
            employee.id === id
              ? { ...employee, isDeleted: true, updatedAt: new Date().toISOString() }
              : employee
          ),
        }))
      },
      restoreEmployee: (id) => {
        set((state) => ({
          employees: state.employees.map((employee) =>
            employee.id === id
              ? { ...employee, isDeleted: false, updatedAt: new Date().toISOString() }
              : employee
          ),
        }))
      },
      getEmployeeById: (id) => get().employees.find((employee) => employee.id === id),

      // Firms
      firms: initialFirms,
      setFirms: (firms: Firm[]) =>
        set((state) => ({ ...state, firms })),

      addFirm: (firmData) => {
        const newFirm: Firm = {
          ...firmData,
          id: `FIRM-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ firms: [...state.firms, newFirm] }))
      },
      updateFirm: (id, updates) => {
        set((state) => ({
          firms: state.firms.map((firm) =>
            firm.id === id
              ? { ...firm, ...updates, updatedAt: new Date().toISOString() }
              : firm
          ),
        }))
      },
      deleteFirm: (id) => {
        set((state) => ({
          firms: state.firms.map((firm) =>
            firm.id === id
              ? { ...firm, isDeleted: true, updatedAt: new Date().toISOString() }
              : firm
          ),
        }))
      },
      restoreFirm: (id) => {
        set((state) => ({
          firms: state.firms.map((firm) =>
            firm.id === id
              ? { ...firm, isDeleted: false, updatedAt: new Date().toISOString() }
              : firm
          ),
        }))
      },
      getFirmById: (id) => get().firms.find((firm) => firm.id === id),

      // Projects
      projects: initialProjects,
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `project-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({ projects: [...state.projects, newProject] }))
      },
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          ),
        }))
      },
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, isDeleted: true, updatedAt: new Date().toISOString() }
              : project
          ),
        }))
      },
      restoreProject: (id) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, isDeleted: false, updatedAt: new Date().toISOString() }
              : project
          ),
        }))
      },
      getProjectById: (id) => get().projects.find((project) => project.id === id),
    }),
    {
      name: 'crm-storage',
    }
  )
)
