"use client"

import { useState, useEffect } from 'react'

export interface PipelineLead {
    id: string
    name: string
    company: string
    value: string
    score: number
    owner: string
    ownerAvatar?: string
    lastActivity: string
    stageTime: string
    tags: string[]
    priority: 'low' | 'medium' | 'high'
    email: string
    source: string
    stage: string
    lastPulse?: string
}

const STORAGE_KEY = 'fixl_pipeline_leads'

const INITIAL_LEADS: PipelineLead[] = [
    { id: "1", name: "Aarav Mehta", company: "TechFlow Systems", value: "$12,400", score: 88, owner: "Rajesh K.", lastActivity: "12m ago", stageTime: "1d", tags: ["Enterprise"], priority: 'high', email: 'aarav@techflow.com', source: 'LinkedIn', stage: 'new' },
    { id: "7", name: "Olivia Taylor", company: "Taylor Retail", value: "$8,500", score: 78, owner: "Anita S.", lastActivity: "15m ago", stageTime: "1d", tags: ["Retail"], priority: 'medium', email: 'olivia@taylor.com', source: 'Website', stage: 'contacted' },
    { id: "5", name: "Emma Wilson", company: "Creative Solutions", value: "$15,200", score: 67, owner: "Rajesh K.", lastActivity: "3h ago", stageTime: "4d", tags: ["Design"], priority: 'medium', email: 'emma@creative.com', source: 'Referral', stage: 'engaged' },
    { id: "8", name: "James Anderson", company: "Anderson Finance", value: "$32,000", score: 55, owner: "Rajesh K.", lastActivity: "1d ago", stageTime: "12d", tags: ["Finance"], priority: 'low', email: 'james@anderson.com', source: 'Direct', stage: 'qualified' },
    { id: "12", name: "Mia Garcia", company: "HealthCare Plus", value: "$55,000", score: 89, owner: "Rajesh K.", lastActivity: "1h ago", stageTime: "3d", tags: ["Healthcare"], priority: 'high', email: 'mia@healthcare.com', source: 'Google', stage: 'proposal' },
    { id: "14", name: "Ava Robinson", company: "Robinson Realty", value: "$95,000", score: 74, owner: "Anita S.", lastActivity: "2h ago", stageTime: "17d", tags: ["Real Estate"], priority: 'medium', email: 'ava@robinson.com', source: 'Website', stage: 'negotiation' },
    { id: "18", name: "Charlotte Walker", company: "Media Net", value: "$42,000", score: 85, owner: "Anita S.", lastActivity: "30m ago", stageTime: "14d", tags: ["Media"], priority: 'high', email: 'charlotte@media.net', source: 'LinkedIn', stage: 'pending' },
    { id: "15", name: "Ethan Clark", company: "Tech IO", value: "$150,000", score: 95, owner: "Rajesh K.", lastActivity: "1d ago", stageTime: "20d", tags: ["SaaS"], priority: 'high', email: 'ethan@tech.io', source: 'Direct', stage: 'won' },
    { id: "4", name: "Michael Chen", company: "Startups.io", value: "$5,000", score: 34, owner: "Anita S.", lastActivity: "1w ago", stageTime: "15d", tags: ["SME"], priority: 'low', email: 'michael@startups.io', source: 'Google', stage: 'lost' },
]

export function usePipelineData() {
    const [leads, setLeads] = useState<PipelineLead[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                setLeads(JSON.parse(saved))
            } catch (e) {
                setLeads(INITIAL_LEADS)
            }
        } else {
            setLeads(INITIAL_LEADS)
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
        }
    }, [leads, isLoaded])

    const addLead = (lead: Omit<PipelineLead, 'id'>) => {
        const newLead = { ...lead, id: Math.random().toString(36).substr(2, 9) }
        setLeads(prev => [newLead, ...prev])
        return newLead
    }

    const updateLead = (id: string, updates: Partial<PipelineLead>) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    }

    const deleteLead = (id: string) => {
        setLeads(prev => prev.filter(l => l.id !== id))
    }

    const moveLead = (id: string, newStage: string) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage, stageTime: '0d', lastActivity: 'Just now' } : l))
    }

    const pulseLead = (id: string) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, lastPulse: new Date().toISOString() } : l))
    }

    const resetData = () => {
        setLeads(INITIAL_LEADS)
    }

    return {
        leads,
        isLoaded,
        addLead,
        updateLead,
        deleteLead,
        moveLead,
        pulseLead,
        resetData
    }
}
