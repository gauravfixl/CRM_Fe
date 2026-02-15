import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react'
import { SmallCard,SmallCardContent,SmallCardHeader } from "../custom/SmallCard"

export function StatsCards() {
  return (
 <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <SmallCard>
        <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
          <p className="text-xs text-gray-600">Revenue</p>
          <DollarSign className="w-4 h-4 text-gray-400" />
        </SmallCardHeader>
        <SmallCardContent className="pt-0">
          <p className="text-lg font-semibold">+2,350</p>
          <p className="text-[11px] text-gray-500">+180.1% from last month</p>
        </SmallCardContent>
      </SmallCard>

      <SmallCard>
        <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
          <p className="text-xs text-gray-600">Sales</p>
          <CreditCard className="w-4 h-4 text-gray-400" />
        </SmallCardHeader>
        <SmallCardContent className="pt-0">
          <p className="text-lg font-semibold">+12,234</p>
          <p className="text-[11px] text-gray-500">+19% from last month</p>
        </SmallCardContent>
      </SmallCard>

      <SmallCard>
        <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
          <p className="text-xs text-gray-600">Active Now</p>
          <Activity className="w-4 h-4 text-gray-400" />
        </SmallCardHeader>
        <SmallCardContent className="pt-0">
          <p className="text-lg font-semibold">+573</p>
          <p className="text-[11px] text-gray-500">+201 since last hour</p>
        </SmallCardContent>
      </SmallCard>
    </div>
  )
}
