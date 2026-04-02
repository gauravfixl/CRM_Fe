"use client"

import { SidebarAccessConfig, type SidebarSection, type SidebarVisibilityConfig } from "@/shared/components/custom/SidebarAccessConfig"

const PM_SIDEBAR_SECTIONS: SidebarSection[] = [
    { id: "home", title: "Home", icon: "\u{1F3E0}", children: [] },
    { id: "my-work", title: "My Work", icon: "\u{26A1}", children: [] },
    { id: "recent", title: "Recent", icon: "\u{1F552}", children: [] },
    {
        id: "projects", title: "Projects", icon: "\u{1F4CB}",
        children: [
            { id: "all-projects", title: "All Projects" },
            { id: "archived", title: "Archived" },
        ]
    },
    { id: "teams", title: "Teams", icon: "\u{1F465}", children: [] },
    { id: "people", title: "People", icon: "\u{1F464}", children: [] },
    { id: "templates", title: "Templates", icon: "\u{1F4C4}", children: [] },
    {
        id: "tasks", title: "Tasks", icon: "\u{1F4DD}",
        children: [
            { id: "my-tasks", title: "My Tasks" },
            { id: "team-tasks", title: "Team Tasks" },
            { id: "all-tasks", title: "All Tasks" },
            { id: "board-view", title: "Board View" },
            { id: "list-view", title: "List View" },
            { id: "calendar-view", title: "Calendar View" },
        ]
    },
    {
        id: "documents", title: "Documents", icon: "\u{1F4C2}",
        children: [
            { id: "my-docs", title: "My Documents" },
            { id: "project-docs", title: "Project Documents" },
            { id: "workspace-assets", title: "Workspace Assets" },
        ]
    },
    { id: "calendar", title: "Calendar", icon: "\u{1F4C5}", children: [] },
    { id: "dashboards", title: "Dashboards", icon: "\u{1F4CA}", children: [] },
    {
        id: "reports", title: "Reports", icon: "\u{1F4C8}",
        children: [
            { id: "sprint-progress", title: "Sprint / Progress" },
            { id: "workload", title: "Workload" },
            { id: "performance", title: "Performance" },
        ]
    },
    { id: "settings", title: "Settings", icon: "\u{2699}\uFE0F", children: [] },
    { id: "help", title: "Help & Docs", icon: "\u{2753}", children: [] },
]

function allVisible(): SidebarVisibilityConfig {
    const config: SidebarVisibilityConfig = {}
    PM_SIDEBAR_SECTIONS.forEach(section => {
        config[section.id] = { visible: true, children: {} }
        section.children.forEach(child => { config[section.id].children[child.id] = true })
    })
    return config
}

function allHidden(): SidebarVisibilityConfig {
    const config: SidebarVisibilityConfig = {}
    PM_SIDEBAR_SECTIONS.forEach(section => {
        config[section.id] = { visible: false, children: {} }
        section.children.forEach(child => { config[section.id].children[child.id] = false })
    })
    return config
}

const DEFAULT_CONFIGS: Record<string, SidebarVisibilityConfig> = {
    "Project Manager": (() => {
        const c = allVisible()
        return c
    })(),
    "Developer": (() => {
        const c = allHidden()
        c["home"] = { visible: true, children: {} }
        c["my-work"] = { visible: true, children: {} }
        c["projects"] = { visible: true, children: {} }
        PM_SIDEBAR_SECTIONS.find(s => s.id === "projects")?.children.forEach(child => {
            c["projects"].children[child.id] = true
        })
        c["teams"] = { visible: true, children: {} }
        c["tasks"] = { visible: true, children: {} }
        PM_SIDEBAR_SECTIONS.find(s => s.id === "tasks")?.children.forEach(child => {
            c["tasks"].children[child.id] = true
        })
        c["documents"] = { visible: true, children: {} }
        PM_SIDEBAR_SECTIONS.find(s => s.id === "documents")?.children.forEach(child => {
            c["documents"].children[child.id] = true
        })
        c["calendar"] = { visible: true, children: {} }
        c["help"] = { visible: true, children: {} }
        return c
    })(),
    "Viewer": (() => {
        const c = allHidden()
        c["home"] = { visible: true, children: {} }
        c["projects"] = { visible: true, children: {} }
        c["projects"].children["all-projects"] = true
        c["tasks"] = { visible: true, children: {} }
        c["tasks"].children["my-tasks"] = true
        c["tasks"].children["board-view"] = true
        c["documents"] = { visible: true, children: {} }
        c["documents"].children["project-docs"] = true
        c["calendar"] = { visible: true, children: {} }
        return c
    })(),
    "default": allVisible(),
}

export default function ProjectSidebarAccessPage() {
    return (
        <SidebarAccessConfig
            moduleName="Project Management"
            moduleDescription="Control which Project Management sidebar sections and items are visible for each role."
            accentColor="violet"
            sections={PM_SIDEBAR_SECTIONS}
            defaultConfigs={DEFAULT_CONFIGS}
        />
    )
}
