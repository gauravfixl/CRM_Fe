import { FlatCard, FlatCardContent, FlatCardHeader, FlatCardTitle, FlatCardDescription } from "@/components/custom/FlatCard"
import { BarChart, Activity, Users } from "lucide-react"

export default function ReportsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-6">Reports & Insights</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FlatCard className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <FlatCardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                        </div>
                        <FlatCardTitle>Usage & Insights</FlatCardTitle>
                        <FlatCardDescription>User implementation and activity trends.</FlatCardDescription>
                    </FlatCardHeader>
                </FlatCard>

                <FlatCard className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <FlatCardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md">
                                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                            </div>
                        </div>
                        <FlatCardTitle>Sign-ins</FlatCardTitle>
                        <FlatCardDescription>Monitor sign-in health and errors.</FlatCardDescription>
                    </FlatCardHeader>
                </FlatCard>

                <FlatCard className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <FlatCardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-md">
                                <BarChart className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                            </div>
                        </div>
                        <FlatCardTitle>Workflows</FlatCardTitle>
                        <FlatCardDescription>Lifecycle reporting metrics.</FlatCardDescription>
                    </FlatCardHeader>
                </FlatCard>
            </div>
        </div>
    )
}
