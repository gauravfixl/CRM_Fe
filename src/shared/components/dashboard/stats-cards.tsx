"use client"

import { DollarSign, CreditCard, Activity } from 'lucide-react'
import { SmallCard, SmallCardContent, SmallCardHeader } from "../custom/SmallCard"

interface StatsCardsProps {
  revenue: number
  sales: number
  activeNow: number
}

function formatCurrency(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "+0"
  return `+${Math.round(value).toLocaleString()}`
}

function formatCount(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "+0"
  return `+${value.toLocaleString()}`
}

export function StatsCards({ revenue, sales, activeNow }: StatsCardsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <SmallCard className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
          <p className="text-xs text-gray-600">Revenue</p>
          <DollarSign className="w-4 h-4 text-gray-400" />
        </SmallCardHeader>
        <SmallCardContent className="pt-0">
          <p className="text-lg font-semibold">{formatCurrency(revenue)}</p>
          <p className="text-[11px] text-gray-500">+180.1% from last month</p>
        </SmallCardContent>
      </SmallCard>

      <SmallCard className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
          <p className="text-xs text-gray-600">Sales</p>
          <CreditCard className="w-4 h-4 text-gray-400" />
        </SmallCardHeader>
        <SmallCardContent className="pt-0">
          <p className="text-lg font-semibold">{formatCount(sales)}</p>
          <p className="text-[11px] text-gray-500">+19% from last month</p>
        </SmallCardContent>
      </SmallCard>

      <SmallCard className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
          <p className="text-xs text-gray-600">Active Now</p>
          <Activity className="w-4 h-4 text-gray-400" />
        </SmallCardHeader>
        <SmallCardContent className="pt-0">
          <p className="text-lg font-semibold">{formatCount(activeNow)}</p>
          <p className="text-[11px] text-gray-500">+201 since last hour</p>
        </SmallCardContent>
      </SmallCard>
    </div>
  )
}
