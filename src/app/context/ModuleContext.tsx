/**
 * Refactor Summary:
 * - Added safety checks for localStorage to prevent SSR issues
 * - Improved naming and added documentation
 * - Preserved existing API and functionality
 */

"use client"

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface ModuleContextType {
  selectedModule: string
  setSelectedModule: (module: string) => void
  leftPanel?: ReactNode
  setLeftPanel: (panel: ReactNode) => void
  rightPanel?: ReactNode
  setRightPanel: (panel: ReactNode) => void
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined)

/**
 * Provides context for the currently selected module across the application.
 * Persists selection to localStorage.
 */
export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedModule, setSelectedModuleState] = useState<string>("Home")

  // Sync with localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModule = localStorage.getItem("selectedModule")
      if (savedModule) {
        setSelectedModuleState(savedModule)
      }
    }
  }, [])

  const [leftPanel, setLeftPanel] = useState<ReactNode>(undefined)
  const [rightPanel, setRightPanel] = useState<ReactNode>(undefined)

  /**
   * Updates both state and localStorage.
   */
  const setSelectedModule = (module: string) => {
    setSelectedModuleState(module)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedModule", module)
    }
  }

  return (
    <ModuleContext.Provider value={{
      selectedModule,
      setSelectedModule,
      leftPanel,
      setLeftPanel,
      rightPanel,
      setRightPanel
    }}>
      {children}
    </ModuleContext.Provider>
  )
}

/**
 * Hook to access module context.
 */
export const useModule = () => {
  const context = useContext(ModuleContext)
  if (!context) {
    throw new Error("useModule must be used within a ModuleProvider")
  }
  return context
}
