"use client"

import * as React from "react"
import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Boxes,
    Warehouse,
    ShoppingCart,
    Users,
    ClipboardList,
    Truck,
    TrendingUp,
    RotateCcw,
    BarChart3,
    Bell,
    Settings,
    ChevronRight,
} from "lucide-react"

import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

type ScmNavLeaf = { title: string; url: string }
type ScmNavGroup = {
    title: string
    url: string
    icon: React.ReactNode
    accent: string
    items: ScmNavLeaf[]
}

const scmNavigation: ScmNavGroup[] = [
    {
        title: "Dashboard",
        url: "/scm/dashboard",
        icon: <LayoutDashboard size={16} />,
        accent: "#2563eb",
        items: [],
    },
    {
        title: "Inventory Management",
        url: "#",
        icon: <Boxes size={16} />,
        accent: "#0ea5e9",
        items: [
            { title: "Products", url: "/scm/inventory/products" },
            { title: "Stock Overview", url: "/scm/inventory/stock-overview" },
            { title: "Stock In", url: "/scm/inventory/stock-in" },
            { title: "Stock Out", url: "/scm/inventory/stock-out" },
            { title: "Stock Adjustment", url: "/scm/inventory/stock-adjustment" },
            { title: "Low Stock Alerts", url: "/scm/inventory/low-stock-alerts" },
            { title: "Inventory Transactions", url: "/scm/inventory/transactions" },
            { title: "Batch / Serial Tracking", url: "/scm/inventory/batch-serial-tracking" },
        ],
    },
    {
        title: "Warehouse Management",
        url: "#",
        icon: <Warehouse size={16} />,
        accent: "#14b8a6",
        items: [
            { title: "Warehouses", url: "/scm/warehouses/list" },
            { title: "Bin / Rack Management", url: "/scm/warehouses/bin-rack" },
            { title: "Receiving", url: "/scm/warehouses/receiving" },
            { title: "Picking & Packing", url: "/scm/warehouses/picking-packing" },
            { title: "Warehouse Transfers", url: "/scm/warehouses/transfers" },
            { title: "Warehouse Activity Logs", url: "/scm/warehouses/activity-logs" },
        ],
    },
    {
        title: "Procurement",
        url: "#",
        icon: <ShoppingCart size={16} />,
        accent: "#10b981",
        items: [
            { title: "Purchase Requests", url: "/scm/procurement/purchase-requests" },
            { title: "Purchase Orders", url: "/scm/procurement/purchase-orders" },
            { title: "Purchase Approvals", url: "/scm/procurement/approvals" },
            { title: "Vendor Quotations", url: "/scm/procurement/vendor-quotations" },
            { title: "Goods Received Notes", url: "/scm/procurement/goods-received-notes" },
            { title: "Purchase Returns", url: "/scm/procurement/purchase-returns" },
        ],
    },
    {
        title: "Suppliers / Vendors",
        url: "#",
        icon: <Users size={16} />,
        accent: "#8b5cf6",
        items: [
            { title: "Vendor List", url: "/scm/vendors/list" },
            { title: "Vendor Categories", url: "/scm/vendors/categories" },
            { title: "Vendor Contracts", url: "/scm/vendors/contracts" },
            { title: "Vendor Ratings", url: "/scm/vendors/ratings" },
            { title: "Vendor Payment History", url: "/scm/vendors/payment-history" },
        ],
    },
    {
        title: "Orders",
        url: "#",
        icon: <ClipboardList size={16} />,
        accent: "#f59e0b",
        items: [
            { title: "Sales Orders", url: "/scm/orders/sales-orders" },
            { title: "Pending Orders", url: "/scm/orders/pending" },
            { title: "Fulfilled Orders", url: "/scm/orders/fulfilled" },
            { title: "Backorders", url: "/scm/orders/backorders" },
            { title: "Return Orders", url: "/scm/orders/return-orders" },
            { title: "Order Tracking", url: "/scm/orders/tracking" },
        ],
    },
    {
        title: "Logistics & Shipments",
        url: "#",
        icon: <Truck size={16} />,
        accent: "#6366f1",
        items: [
            { title: "Shipment List", url: "/scm/shipments/list" },
            { title: "In-Transit Shipments", url: "/scm/shipments/in-transit" },
            { title: "Delivered Shipments", url: "/scm/shipments/delivered" },
            { title: "Delayed Shipments", url: "/scm/shipments/delayed" },
            { title: "Delivery Proof", url: "/scm/shipments/delivery-proof" },
            { title: "Courier Partners", url: "/scm/shipments/courier-partners" },
        ],
    },
    {
        title: "Demand Forecasting",
        url: "#",
        icon: <TrendingUp size={16} />,
        accent: "#d946ef",
        items: [
            { title: "Forecast Dashboard", url: "/scm/forecasting/dashboard" },
            { title: "Product Demand", url: "/scm/forecasting/product-demand" },
            { title: "Seasonal Trends", url: "/scm/forecasting/seasonal-trends" },
            { title: "Reorder Suggestions", url: "/scm/forecasting/reorder-suggestions" },
            { title: "Forecast Reports", url: "/scm/forecasting/reports" },
        ],
    },
    {
        title: "Returns Management",
        url: "#",
        icon: <RotateCcw size={16} />,
        accent: "#f97316",
        items: [
            { title: "Customer Returns", url: "/scm/returns/customer-returns" },
            { title: "Supplier Returns", url: "/scm/returns/supplier-returns" },
            { title: "Return Approvals", url: "/scm/returns/approvals" },
            { title: "Damaged Goods", url: "/scm/returns/damaged-goods" },
            { title: "Refund / Replacement Status", url: "/scm/returns/refund-replacement-status" },
        ],
    },
    {
        title: "Reports & Analytics",
        url: "#",
        icon: <BarChart3 size={16} />,
        accent: "#06b6d4",
        items: [
            { title: "Inventory Report", url: "/scm/reports/inventory" },
            { title: "Procurement Report", url: "/scm/reports/procurement" },
            { title: "Vendor Report", url: "/scm/reports/vendors" },
            { title: "Warehouse Report", url: "/scm/reports/warehouses" },
            { title: "Order Fulfillment Report", url: "/scm/reports/order-fulfillment" },
            { title: "Shipment Report", url: "/scm/reports/shipments" },
            { title: "Cost Analysis", url: "/scm/reports/cost-analysis" },
        ],
    },
    {
        title: "Alerts & Notifications",
        url: "#",
        icon: <Bell size={16} />,
        accent: "#ef4444",
        items: [
            { title: "Low Stock Alerts", url: "/scm/alerts/low-stock" },
            { title: "Delayed Shipment Alerts", url: "/scm/alerts/delayed-shipments" },
            { title: "Pending Approval Alerts", url: "/scm/alerts/pending-approvals" },
            { title: "Vendor Delay Alerts", url: "/scm/alerts/vendor-delays" },
            { title: "Expiring Contract Alerts", url: "/scm/alerts/expiring-contracts" },
            { title: "Payment Reminder Alerts", url: "/scm/alerts/payment-reminders" },
        ],
    },
    {
        title: "Settings",
        url: "#",
        icon: <Settings size={16} />,
        accent: "#64748b",
        items: [
            { title: "Product Categories", url: "/scm/settings/product-categories" },
            { title: "Warehouse Settings", url: "/scm/settings/warehouse-settings" },
            { title: "Unit Management", url: "/scm/settings/unit-management" },
            { title: "Tax Settings", url: "/scm/settings/tax-settings" },
            { title: "Approval Workflow", url: "/scm/settings/approval-workflow" },
            { title: "User Permissions", url: "/scm/settings/user-permissions" },
            { title: "Integration Settings", url: "/scm/settings/integration-settings" },
        ],
    },
]

export function ScmSidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
    const pathname = usePathname()

    const isBranchActive = (node: ScmNavGroup | ScmNavLeaf): boolean => {
        if ("url" in node && node.url !== "#" && pathname === node.url) return true
        if ("items" in node && Array.isArray(node.items) && node.items.length > 0) {
            return node.items.some((child) => isBranchActive(child))
        }
        return false
    }

    const navWithActive = useMemo(
        () => scmNavigation.map((g) => ({ ...g, isActive: isBranchActive(g) })),
        [pathname]
    )

    return (
        <ShadcnSidebar
            collapsible="icon"
            className="top-[63px] h-[calc(100vh-63px)] border-r bg-white"
            {...props}
        >
            <SidebarContent className="py-2 text-[13px]">
                <SidebarGroup>
                    <SidebarMenu className="gap-1">
                        {navWithActive.map((item) => {
                            const hasSub = item.items.length > 0
                            const accent = item.accent

                            // Active state styling — light tint + colored text
                            const buttonStyle: React.CSSProperties = item.isActive
                                ? {
                                    backgroundColor: `${accent}14`,
                                    color: accent,
                                }
                                : {}

                            // Icon container — colored background tint
                            const iconStyle: React.CSSProperties = {
                                color: accent,
                                backgroundColor: item.isActive ? `${accent}1f` : `${accent}10`,
                            }

                            if (!hasSub) {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={item.isActive}
                                            style={buttonStyle}
                                            className="font-medium h-9 text-[13px] group-data-[collapsible=icon]:justify-center transition-colors"
                                            data-accent="true"
                                        >
                                            <Link
                                                href={item.url}
                                                prefetch={true}
                                                className="flex w-full items-center group/nav-link"
                                            >
                                                <span
                                                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors"
                                                    style={iconStyle}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span
                                                    className="ml-2 truncate group-data-[collapsible=icon]:hidden"
                                                    style={{ color: item.isActive ? accent : "#475569" }}
                                                >
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            }

                            return (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={item.isActive}
                                                style={buttonStyle}
                                                className="font-medium h-9 text-[13px] group-data-[collapsible=icon]:justify-center transition-colors"
                                            >
                                                <span
                                                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors"
                                                    style={iconStyle}
                                                >
                                                    {item.icon}
                                                </span>
                                                <span
                                                    className="ml-2 truncate group-data-[collapsible=icon]:hidden"
                                                    style={{ color: item.isActive ? accent : "#475569" }}
                                                >
                                                    {item.title}
                                                </span>
                                                <ChevronRight
                                                    className="ml-auto w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden"
                                                    style={{ color: item.isActive ? accent : "#94a3b8" }}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="transition-all duration-300 ease-in-out">
                                            <SidebarMenuSub
                                                className="ml-2"
                                                style={{ borderLeftColor: `${accent}33` }}
                                            >
                                                {item.items.map((sub) => {
                                                    const isSubActive = pathname === sub.url
                                                    return (
                                                        <SidebarMenuSubItem key={sub.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={isSubActive}
                                                                style={
                                                                    isSubActive
                                                                        ? {
                                                                            backgroundColor: `${accent}14`,
                                                                            color: accent,
                                                                        }
                                                                        : undefined
                                                                }
                                                                className="h-8 text-[12.5px] rounded-md transition-colors"
                                                            >
                                                                <Link
                                                                    href={sub.url}
                                                                    prefetch={true}
                                                                    className="flex w-full items-center"
                                                                >
                                                                    <span
                                                                        className="w-1 h-1 rounded-full mr-2 shrink-0 transition-colors"
                                                                        style={{
                                                                            backgroundColor: isSubActive ? accent : "#cbd5e1",
                                                                        }}
                                                                    />
                                                                    <span
                                                                        className="truncate"
                                                                        style={{
                                                                            color: isSubActive ? accent : "#64748b",
                                                                            fontWeight: isSubActive ? 600 : 400,
                                                                        }}
                                                                    >
                                                                        {sub.title}
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </ShadcnSidebar>
    )
}

export default ScmSidebar
