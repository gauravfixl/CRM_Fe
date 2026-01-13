import { FlatCard, FlatCardContent, FlatCardHeader, FlatCardTitle, FlatCardDescription } from "@/components/custom/FlatCard"
import { ShieldAlert, ShieldCheck, Lock } from "lucide-react"

export default function SecurityOverviewPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold tracking-tight">Security Overview</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FlatCard className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <FlatCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <FlatCardTitle className="text-sm font-medium">Secure Score</FlatCardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                    </FlatCardHeader>
                    <FlatCardContent>
                        <div className="text-2xl font-bold text-green-700">85%</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last week</p>
                    </FlatCardContent>
                </FlatCard>
                <FlatCard>
                    <FlatCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <FlatCardTitle className="text-sm font-medium">Users at Risk</FlatCardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    </FlatCardHeader>
                    <FlatCardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">No critical alerts</p>
                    </FlatCardContent>
                </FlatCard>
                <FlatCard>
                    <FlatCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <FlatCardTitle className="text-sm font-medium">MFA Enabled</FlatCardTitle>
                        <Lock className="h-4 w-4 text-blue-500" />
                    </FlatCardHeader>
                    <FlatCardContent>
                        <div className="text-2xl font-bold">12/45</div>
                        <p className="text-xs text-muted-foreground">Users protected</p>
                    </FlatCardContent>
                </FlatCard>
            </div>

            <FlatCard>
                <FlatCardHeader>
                    <FlatCardTitle>Recent Activity</FlatCardTitle>
                    <FlatCardDescription>Latest security events and alerts.</FlatCardDescription>
                </FlatCardHeader>
                <FlatCardContent>
                    <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        No recent security events to display.
                    </div>
                </FlatCardContent>
            </FlatCard>
        </div>
    )
}
