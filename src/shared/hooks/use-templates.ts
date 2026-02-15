import { useState, useEffect, useCallback } from 'react'
import { useTemplateStore, ProjectTemplate } from '@/shared/data/template-store'

/**
 * MOCK API HOOK: useTemplates
 * Follows the Backend API contract for Version Control and Filters
 */
export function useTemplates() {
    const {
        templates,
        isLoading,
        error,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        setLoading,
        setError
    } = useTemplateStore()

    // Mock API: Fetch Templates
    const fetchTemplates = useCallback(async (filters?: { category?: string, recommended?: boolean }) => {
        setLoading(true)
        try {
            // Simulate API Network Latency
            await new Promise(resolve => setTimeout(resolve, 800))

            let filtered = [...templates]
            if (filters?.category) {
                filtered = filtered.filter(t => t.category === filters.category)
            }
            if (filters?.recommended !== undefined) {
                filtered = filtered.filter(t => t.recommended === filters.recommended)
            }

            setLoading(false)
            return filtered
        } catch (err) {
            setError("Failed to fetch templates")
            setLoading(false)
            return []
        }
    }, [templates, setLoading, setError])

    // Mock API: Create Template
    const createTemplate = async (data: Partial<ProjectTemplate>) => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            const newTemplate: ProjectTemplate = {
                id: `tmpl-${Math.random().toString(36).substr(2, 9)}`,
                name: data.name || "Untitled Template",
                description: data.description || "",
                category: data.category || "Software",
                boardType: data.boardType || "KANBAN",
                previewImage: data.previewImage || "https://images.unsplash.com/photo-1454165833767-027eeef1596e?q=80&w=400&auto=format&fit=crop",
                recommended: false,
                isSystem: false,
                version: 1,
                createdBy: "u1",
                createdAt: new Date().toISOString()
            }

            addTemplate(newTemplate)
            setLoading(false)
            return { success: true, data: newTemplate }
        } catch (err) {
            setError("Failed to create template")
            setLoading(false)
            return { success: false }
        }
    }

    // Mock API: Update Template (with Version Control simulated)
    const mutateTemplate = async (id: string, updates: Partial<ProjectTemplate>) => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            updateTemplate(id, updates)
            setLoading(false)
            return { success: true }
        } catch (err) {
            setError("Failed to update template")
            setLoading(false)
            return { success: false }
        }
    }

    // Mock API: Delete Template
    const removeTemplate = async (id: string) => {
        const template = templates.find(t => t.id === id)
        if (template?.isSystem) {
            alert("System templates cannot be deleted.")
            return { success: false }
        }

        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 600))
            deleteTemplate(id)
            setLoading(false)
            return { success: true }
        } catch (err) {
            setError("Failed to delete template")
            setLoading(false)
            return { success: false }
        }
    }

    return {
        templates,
        isLoading,
        error,
        fetchTemplates,
        createTemplate,
        mutateTemplate,
        removeTemplate
    }
}
