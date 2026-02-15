import { create } from 'zustand'

export interface AIRecommendation {
    id: string
    type: "PLANNING" | "WORKFLOW" | "SUMMARY"
    title: string
    description: string
    confidence: number
    suggestedAction: string
}

interface AIStore {
    recommendations: AIRecommendation[]
    isAnalyzing: boolean
    getRecommendationsForProject: (projectId: string) => Promise<void>
    generateSummary: (issueId: string) => Promise<string>
}

export const useAIStore = create<AIStore>((set) => ({
    recommendations: [],
    isAnalyzing: false,

    getRecommendationsForProject: async (projectId) => {
        set({ isAnalyzing: true })
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        set({
            recommendations: [
                {
                    id: "rec-01",
                    type: "PLANNING",
                    title: "Optimize Sprint 1 Capacity",
                    description: "Based on team velocity, you have over-committed in Sprint 1. We suggest moving 'API Architecture' to Sprint 2.",
                    confidence: 0.92,
                    suggestedAction: "MOVETO_SPRINT2"
                },
                {
                    id: "rec-02",
                    type: "WORKFLOW",
                    title: "Bottleneck Detected",
                    description: "Issues in 'In Review' are taking 40% longer than average. Consider assigning more reviewers to the Security EPIC.",
                    confidence: 0.85,
                    suggestedAction: "NOTIFY_LEAD"
                }
            ],
            isAnalyzing: false
        })
    },

    generateSummary: async (issueId) => {
        return "This issue involves implementing JWT-based authentication across all microservices. The team has discussed using Redis for session management to support scaling. Current blockers include finalizing the role hierarchy schema."
    }
}))
