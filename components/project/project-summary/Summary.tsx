// components/ProjectSummary/Summary.tsx
"use client"

import IssueTypes from "./IssueTypes"
import Priorities from "./Priorities"
import Workflows from "./Workflows"
import Screens from "./Screens"
import Fields from "./Fields"
import Versions from "./Versions"
import ComponentsBlock from "./Components"
import Roles from "./Roles"
import Permissions from "./Permissions"
import Notifications from "./Notifications"
import DevTools from "./DevTools"
import Settings from "./Settings"

export default function Summary() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Project Summary</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <IssueTypes />
          <Priorities />
          <Workflows />
          <Screens />
          <Fields />
          <Settings />
        </div>
        <div className="space-y-6">
          <Versions />
          <ComponentsBlock />
          <Roles />
          <Permissions />
          <Notifications />
          <DevTools />
        </div>
      </div>
    </div>
  )
}

// Export this component to a Next.js page
// Example: app/projects/[projectId]/settings/page.tsx

// app/projects/[projectId]/settings/page.tsx
// import Summary from "@/components/ProjectSummary/Summary"
// export default function ProjectSettingsPage() {
//   return <Summary />
// }
