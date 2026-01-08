"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"
import { usePathname } from "next/navigation"
import { useState } from "react"
import LoaderWrapper from "./LoaderWrapper"
import { SupportAccessProvider } from "@/contexts/AuthContext"

interface SecondaryLayoutProps {
  leftPanel?: React.ReactNode  // optional
  mainContent: React.ReactNode
}

export default function SecondaryLayout({ leftPanel, mainContent }: SecondaryLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mock data
  const recentActivities = [
    "User John updated the project status",
    "New invoice #1234 created",
    "Task 'Design Landing Page' assigned to Sarah",
    "Server backup completed successfully",
    "Meeting scheduled with client ABC Corp",
  ]

  const dropdownOptions = [
    { label: "Create Invoice", value: "invoice" },
    { label: "Add Task", value: "task" },
    { label: "Add Project", value: "project" },
    { label: "Invite User", value: "invite" },
  ]

  const handleSelect = (value: string) => console.log("Selected:", value)

  return (
    <SupportAccessProvider>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="flex w-full h-screen overflow-hidden">
          {/* Sidebar */}
          <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* Main content area */}
          <SidebarInset
            className={`flex flex-1 transition-all duration-300 ${
              sidebarOpen
                ? "ml-[var(--sidebar-width)]"
                : "ml-[var(--sidebar-width-icon)]"
            }`}
          >
            <LoaderWrapper />

            {/* Layout: Left? | Middle | Right */}
            <div className="flex flex-1 flex-row gap-4 p-4 overflow-hidden">
              
              {/* Left Panel (optional) */}
              {leftPanel && (
                <div className="flex-none w-[320px] bg-white rounded-lg shadow-sm overflow-auto">
                  {leftPanel}
                </div>
              )}

              {/* Middle Content */}
              <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm">
                {mainContent}
              </div>

              {/* Right Panel */}
              <div className="flex-none w-[300px] flex flex-col gap-4">
                <CustomOptionsDropdown
                  title="Quick Actions"
                  options={dropdownOptions}
                  onSelect={handleSelect}
                />
                <RecentActivityPanel title="Recent Activity">
                  <ul className="space-y-2">
                    {recentActivities.map((activity, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        {activity}
                      </li>
                    ))}
                  </ul>
                </RecentActivityPanel>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SupportAccessProvider>
  )
}
