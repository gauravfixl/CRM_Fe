import { Shield, Activity, Key, Zap, CheckCircle, AlertTriangle } from 'lucide-react'
import { SmallCard, SmallCardContent, SmallCardHeader } from "../custom/SmallCard"

export function GovernanceStatsCards() {
    return (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <SmallCard>
                <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
                    <p className="text-xs text-gray-600">Login Success Rate</p>
                    <Key className="w-4 h-4 text-blue-500" />
                </SmallCardHeader>
                <SmallCardContent className="pt-0">
                    <p className="text-lg font-semibold">99.4%</p>
                    <p className="text-[11px] text-green-600">Normal operating range</p>
                </SmallCardContent>
            </SmallCard>

            <SmallCard>
                <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
                    <p className="text-xs text-gray-600">Identity Risks</p>
                    <Shield className="w-4 h-4 text-orange-500" />
                </SmallCardHeader>
                <SmallCardContent className="pt-0">
                    <p className="text-lg font-semibold">0 Low</p>
                    <p className="text-[11px] text-gray-500">No new risks detected</p>
                </SmallCardContent>
            </SmallCard>

            <SmallCard>
                <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
                    <p className="text-xs text-gray-600">API Latency</p>
                    <Activity className="w-4 h-4 text-purple-500" />
                </SmallCardHeader>
                <SmallCardContent className="pt-0">
                    <p className="text-lg font-semibold">124ms</p>
                    <p className="text-[11px] text-gray-500">-5ms from last hour</p>
                </SmallCardContent>
            </SmallCard>

            <SmallCard>
                <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
                    <p className="text-xs text-gray-600">Automation Health</p>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                </SmallCardHeader>
                <SmallCardContent className="pt-0">
                    <p className="text-lg font-semibold">100%</p>
                    <p className="text-[11px] text-gray-500">All workflows successful</p>
                </SmallCardContent>
            </SmallCard>
        </div>
    )
}
