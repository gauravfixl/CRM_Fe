/**
 * Refactor Summary:
 * - Improved naming consistency for internal context
 * - Fixed error message in useSupportAccess hook
 * - Maintained existing exports (SupportAccessProvider, useSupportAccess)
 * - Preserved UI & functionality
 */

import React, { createContext, useContext, useState, type ReactNode } from "react"

interface AuthContextType {
  role: string | null
  setRole: React.Dispatch<React.SetStateAction<string | null>>
  accessibleModules: string[]
  setAccessibleModules: React.Dispatch<React.SetStateAction<string[]>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider for managing role-based access and accessible modules.
 */
export const SupportAccessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null)
  const [accessibleModules, setAccessibleModules] = useState<string[]>([])

  return (
    <AuthContext.Provider value={{ role, setRole, accessibleModules, setAccessibleModules }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access the support access context.
 * Must be used within a SupportAccessProvider.
 */
export const useSupportAccess = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useSupportAccess must be used within a SupportAccessProvider")
  }
  return context
}
