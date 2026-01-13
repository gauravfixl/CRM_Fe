"use client"

import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import { CustomButton } from "@/components/custom/CustomButton"
import { Building2, BarChart3, Clock, AlertCircle, Plus, Download, Upload, Settings } from "lucide-react"

export default function OrganizationDashboard() {
  return (
    <div className="h-[85vh] overflow-y-auto hide-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-500" />
          <h6 className="text-xl font-semibold text-primary">Organization Dashboard</h6>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: "12", icon: BarChart3, color: "text-muted-foreground" },
          { label: "Active", value: "8", dot: "bg-green-500" },
          { label: "Pending", value: "4", icon: Clock, color: "text-yellow-500" },
          { label: "Issues", value: "1", icon: AlertCircle, color: "text-red-500" },
        ].map((stat, i) => (
          <SmallCard key={i} className="border-border/50">
            <SmallCardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-lg font-semibold ${stat.dot ? stat.dot.replace('bg-', 'text-') : ''}`}>{stat.value}</p>
                </div>
                {stat.icon && <stat.icon className={`h-4 w-4 ${stat.color}`} />}
                {stat.dot && <div className={`h-2 w-2 ${stat.dot} rounded-full`} />}
              </div>
            </SmallCardContent>
          </SmallCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SmallCard className="lg:col-span-2 border-border/50">
          <SmallCardHeader className="pb-3">
            <SmallCardTitle className="text-sm font-medium">Recent Activity</SmallCardTitle>
          </SmallCardHeader>
          <SmallCardContent className="p-3 pt-0">
            <div className="space-y-2">
              {[
                { text: "New department created: Marketing", time: "2 minutes ago", color: "bg-blue-500" },
                { text: "Organization structure updated", time: "15 minutes ago", color: "bg-green-500" },
                { text: "Budget allocation pending approval", time: "1 hour ago", color: "bg-yellow-500" },
                { text: "Policy document updated", time: "3 hours ago", color: "bg-purple-500" },
                { text: "Compliance review required", time: "5 hours ago", color: "bg-red-500" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                  <div className={`h-2 w-2 ${activity.color} rounded-full`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="border-border/50">
          <SmallCardHeader className="pb-3">
            <SmallCardTitle className="text-sm font-medium">Quick Actions</SmallCardTitle>
          </SmallCardHeader>
          <SmallCardContent className="p-3 pt-0">
            <div className="space-y-2">
              <CustomButton size="sm" className="w-full justify-start text-xs h-8"><Plus className="h-3 w-3 mr-2" /> Add Department</CustomButton>
              <CustomButton size="sm" variant="outline" className="w-full justify-start text-xs h-8 bg-transparent"><Upload className="h-3 w-3 mr-2" /> Import Structure</CustomButton>
              <CustomButton size="sm" variant="outline" className="w-full justify-start text-xs h-8 bg-transparent"><Download className="h-3 w-3 mr-2" /> Export Report</CustomButton>
              <CustomButton size="sm" variant="outline" className="w-full justify-start text-xs h-8 bg-transparent"><Settings className="h-3 w-3 mr-2" /> Settings</CustomButton>
            </div>
          </SmallCardContent>
        </SmallCard>
      </div>
    </div>
  )
}
