"use client"

import { useState, ReactNode } from "react"
import { X } from "lucide-react"

interface SettingsLayoutProps {
  title: string
  menuItems: (string | { title: string; children: string[] })[]
  renderContent: (selectedTab: string) => ReactNode
}

export default function SettingsLayout({
  title,
  menuItems,
  renderContent,
}: SettingsLayoutProps) {
  const [selectedTab, setSelectedTab] = useState("Details")
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSubmenu = (title: string) => {
    setOpenSection(openSection === title ? null : title)
  }

  const isSelected = (key: string) => selectedTab === key

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 border-r p-4 overflow-auto bg-white transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h3 className="font-semibold text-lg">{title} Settings</h3>
          <button onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) =>
            typeof item === "string" ? (
              <li key={item}>
                <button
                  onClick={() => {
                    setSelectedTab(item)
                    setSidebarOpen(false)
                  }}
                  className={`text-sm w-full text-left ${isSelected(item)
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                    } hover:underline`}
                >
                  {item}
                </button>
              </li>
            ) : (
              <li key={item.title}>
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={`text-sm w-full text-left ${openSection === item.title
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                    } hover:underline`}
                >
                  {item.title}
                </button>
                {openSection === item.title && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const fullKey = `${item.title} > ${child}`
                      return (
                        <li key={fullKey}>
                          <button
                            onClick={() => {
                              setSelectedTab(fullKey)
                              setSidebarOpen(false)
                            }}
                            className={`text-sm w-full text-left ${isSelected(fullKey)
                                ? "text-blue-500 font-medium"
                                : "text-gray-600"
                              } hover:underline`}
                          >
                            {child}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          )}
        </ul>
      </aside>

      {/* Mobile menu button */}
      <button
        className="absolute top-4 left-4 z-20 md:hidden p-2 bg-white border rounded"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Content */}
      <div className="flex-1 overflow-auto py-8 px-4 max-h-[70vh] hide-scrollbar ">
        {renderContent(selectedTab)}
      </div>
    </div>
  )
}
