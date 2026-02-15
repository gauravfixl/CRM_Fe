"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, Search, Settings, Plus, Filter, Download, MoreVertical, Building2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger, useSidebar } from "@/shared/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ToggleOverlayPanel from "../toggleOverlayPanel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/lib/useAuthStore"
import { useBrandingStore } from "@/lib/useBrandingStore"
import { logoutUser } from "@/hooks/authHooks"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { Trash2 } from "lucide-react"

// Preserving original modals from GlobalTopBar for future wiring
import { CreateIssueModal } from "./create-issue-modal"
import CreateProjectModal from "./create-project-modal"
import CreateWorkspaceModal from "./create-workspace-modal"
import QuickCreateModal from "./quick-create-modal"
import GlobalSearch from "./global-search"
import NotificationsPanel from "./notifications-panel"

// Helper function to get first two letters of email (uppercase)
const getEmailInitials = (email?: string) => {
    if (!email) return "U"
    return email.slice(0, 2).toUpperCase()
}

// Module-specific actions based on current route
const getModuleActions = (pathname: string) => {
    if (pathname.includes('/crm/leads') || pathname.includes('/lead-management')) {
        return {
            title: "Lead Management",
            actions: [
                { label: "Add Lead", icon: Plus, action: "add-lead" },
                { label: "Import Leads", icon: Download, action: "import-leads" },
                { label: "Lead Sources", icon: Filter, action: "lead-sources" },
                { label: "Bulk Actions", icon: MoreVertical, action: "bulk-actions" },
            ]
        }
    }

    if (pathname.includes('/crm/clients') || pathname.includes('/client-management')) {
        return {
            title: "Client Management",
            actions: [
                { label: "Add Client", icon: Plus, action: "add-client" },
                { label: "Import Clients", icon: Download, action: "import-clients" },
                { label: "Client Reports", icon: Filter, action: "client-reports" },
                { label: "Export Data", icon: Download, action: "export-data" },
            ]
        }
    }

    if (pathname.includes('/invoice')) {
        return {
            title: "Invoice Management",
            actions: [
                { label: "Create Invoice", icon: Plus, action: "create-invoice" },
                { label: "Recurring Invoices", icon: Settings, action: "recurring-invoices" },
                { label: "Payment Reminders", icon: Bell, action: "payment-reminders" },
                { label: "Export Invoices", icon: Download, action: "export-invoices" },
            ]
        }
    }

    if (pathname.includes('/hrms') || pathname.includes('/attendance')) {
        return {
            title: "HR Management",
            actions: [
                { label: "Add Employee", icon: Plus, action: "add-employee" },
                { label: "Attendance Report", icon: Filter, action: "attendance-report" },
                { label: "Payroll Settings", icon: Settings, action: "payroll-settings" },
                { label: "Export Data", icon: Download, action: "export-hr-data" },
            ]
        }
    }

    if (pathname.includes('/firm-management')) {
        return {
            title: "Legal Case Management",
            actions: [
                { label: "New Case", icon: Plus, action: "new-case" },
                { label: "Court Calendar", icon: Filter, action: "court-calendar" },
                { label: "Document Templates", icon: Settings, action: "document-templates" },
                { label: "Case Reports", icon: Download, action: "case-reports" },
            ]
        }
    }

    if (pathname.includes('/projectmanagement') || pathname.includes('/project-management')) {
        return {
            title: "Project Management",
            actions: [
                { label: "New Project", icon: Plus, action: "new-project" },
                { label: "Project Templates", icon: Settings, action: "project-templates" },
                { label: "Resource Planning", icon: Filter, action: "resource-planning" },
                { label: "Export Projects", icon: Download, action: "export-projects" },
            ]
        }
    }

    if (pathname.includes('/performance')) {
        return {
            title: "Performance Analytics",
            actions: [
                { label: "Custom Report", icon: Plus, action: "custom-report" },
                { label: "KPI Settings", icon: Settings, action: "kpi-settings" },
                { label: "Data Filters", icon: Filter, action: "data-filters" },
                { label: "Export Analytics", icon: Download, action: "export-analytics" },
            ]
        }
    }

    return {
        title: "Dashboard",
        actions: [
            { label: "Quick Add", icon: Plus, action: "quick-add" },
            { label: "Settings", icon: Settings, action: "settings" },
            { label: "Export Data", icon: Download, action: "export-data" },
        ]
    }
}

export function GlobalTopBar({ setSidebarOpen }: { setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { toggleSidebar } = useSidebar()
    const pathname = usePathname()
    const [isModulePanelOpen, setIsModulePanelOpen] = useState(false)
    const moduleActions = getModuleActions(pathname)
    const [twoFAEnabled, setTwoFAEnabled] = useState(false)
    const router = useRouter()
    // inside AppHeader component
    const { user } = useAuthStore()
    const { logoUrl } = useBrandingStore()
    const { deleteWorkspace, activeWorkspaceId, workspaces } = useWorkspaceStore()

    // Original GlobalTopBar states
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false)
    const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false)
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)


    const handleLogout = async () => {
        await logoutUser();
        // Optional: you can do extra cleanup or tracking here if needed
    };
    const viewOrgInvites = () => {
        // Clear any auth-related data
        // Optionally remove tokens
        // cookies().delete("authToken") // if you're using cookies
        // Redirect to login
        router.push("/org-invites")
    }
    const viewBillingPlans = () => {
        router.push("/BillingPlans")
    }
    const handleViewProfile = () => {
        router.push("/user-profile")
    }
    const enableSupportAgent = () => {
        router.push("/SupportAgent")
    }
    const handleModuleAction = (action: string) => {
        console.log(`Executing action: ${action}`)
        setIsModulePanelOpen(false)
        // Implement specific actions here
        if (action === "new-project") {
            // Example wiring
            setIsCreateIssueOpen(true)
        }
    }

    const handleToggle2FA = (value: boolean) => {
        setTwoFAEnabled(value)
        if (value) {
            router.push("/2fa-setup") // Navigate to scanner/setup page
        }
    }

    return (
        <header className="flex h-[63px] shrink-0 items-center gap-2 border-b px-4 top-0 fixed w-full z-50 shadow-md bg-background transition-colors duration-200">

            <button
                onClick={() => {
                    console.log("Header button clicked — toggling sidebar")
                    if (setSidebarOpen) {
                        setSidebarOpen(prev => !prev)
                    } else {
                        toggleSidebar()
                    }
                }}
                className="flex items-center gap-2 cursor-pointer"
            >
                <img src={logoUrl || "/images/cubicleweb.png"} alt="Logo" className="h-12 w-12 object-contain" />
            </button>


            <ToggleOverlayPanel
            // onSelectModule={(selected) => {
            //   dispatch({ type: "SET_CURRENT_MODULE", payload: selected })
            // }}
            />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center gap-2 px-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search across all modules..."
                        className="pl-8"
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {/* Module Actions Panel */}
                    {/* <Sheet open={isModulePanelOpen} onOpenChange={setIsModulePanelOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4 mr-2" />
                Module Actions
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>{moduleActions.title}</SheetTitle>
                <SheetDescription>
                  Quick actions for the current module
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {moduleActions.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleModuleAction(action.action)}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-xs text-muted-foreground">Active Items</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet> */}



                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-4 w-4" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                    3
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="p-2">
                                <h4 className="font-medium mb-2">Notifications</h4>
                                <div className="space-y-2">
                                    <div className="p-2 border rounded-lg">
                                        <p className="text-sm font-medium">New lead assigned</p>
                                        <p className="text-xs text-muted-foreground">John Smith - Tech Startup Inc</p>
                                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                    </div>
                                    <div className="p-2 border rounded-lg">
                                        <p className="text-sm font-medium">Invoice payment received</p>
                                        <p className="text-xs text-muted-foreground">$15,750 from Acme Corp</p>
                                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                                    </div>
                                    <div className="p-2 border rounded-lg">
                                        <p className="text-sm font-medium">Court hearing reminder</p>
                                        <p className="text-xs text-muted-foreground">Smith vs. Johnson - Tomorrow 10:00 AM</p>
                                        <p className="text-xs text-muted-foreground">3 hours ago</p>
                                    </div>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center">
                                View all notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* 2fa */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="flex items-center justify-between px-2 py-2">
                                <span className="text-sm">Enable 2FA</span>
                                <Switch checked={twoFAEnabled} onCheckedChange={handleToggle2FA} />

                            </div>
                            <div className="flex items-center justify-between px-2 py-2">
                                <span className="text-sm cursor-pointer" onClick={() => viewOrgInvites()}>All organisation invites </span>


                            </div>
                            <div className="flex items-center justify-between px-2 py-2">
                                <span className="text-sm cursor-pointer" onClick={() => enableSupportAgent()}>Enable Support Access</span>
                                {/* <Switch checked={twoFAEnabled} onCheckedChange={handleToggle2FA} /> */}

                            </div>
                            <div className="flex items-center justify-between px-2 py-2">
                                <span className="text-sm cursor-pointer" onClick={() => viewBillingPlans()}>Plans and Pricing</span>
                                {/* <Switch checked={twoFAEnabled} onCheckedChange={handleToggle2FA} /> */}

                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                onClick={() => {
                                    if (activeWorkspaceId && confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
                                        deleteWorkspace(activeWorkspaceId);
                                    }
                                }}
                                disabled={workspaces && workspaces.length <= 1}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Workspace
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>



                    {/* User Avatar Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/user.png" alt="User" />
                                    <AvatarFallback>{getEmailInitials(user?.email)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile()}>
                                View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleLogout()}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Shared Modals - Preserved but currently inactive pending wiring */}
            <CreateIssueModal
                isOpen={isCreateIssueOpen}
                onClose={() => setIsCreateIssueOpen(false)}
            />
            <CreateWorkspaceModal
                isOpen={isCreateWorkspaceOpen}
                onClose={() => setIsCreateWorkspaceOpen(false)}
            />
            <QuickCreateModal
                isOpen={isQuickCreateOpen}
                onOpenChange={setIsQuickCreateOpen}
            />
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <NotificationsPanel
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                userId="u1"
            />

        </header>
    )
}
