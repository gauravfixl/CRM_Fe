

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import MostHoursWorked from "./mosthoursworked"
import OvertimeHours
 from "./overtimehours"
 import MostBreaksTaken from "./mostbreakstaken"
 import WorkHoursShortage from "./workhoursshortage"
export default function WorkHoursLeaderboard() {
  const [activeTab, setActiveTab] = useState("mostHours")

  return (
    <Card className="w-full p-2 rounded-xl shadow-sm">
      {/* Tabs Header */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-fit  mb-3 bg-transparent space-x-2">
          <TabsTrigger
            value="mostHours"
            className="text-xs px-3 py-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md"
          >
            Most Hours Worked
          </TabsTrigger>
          <TabsTrigger
            value="overtime"
            className="text-xs px-3 py-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md"
          >
            Overtime Hours
          </TabsTrigger>
          <TabsTrigger
            value="shortage"
            className="text-xs px-3 py-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md"
          >
            Work Hours Shortage
          </TabsTrigger>
          <TabsTrigger
            value="breaks"
            className="text-xs px-3 py-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md"
          >
            Most Breaks Taken
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="mt-2 border-t border-gray-100 pt-3">
          <TabsContent value="mostHours">
            <MostHoursWorked />
          </TabsContent>
          <TabsContent value="overtime">
            <OvertimeHours />
          </TabsContent>
          <TabsContent value="shortage">
            <WorkHoursShortage />
          </TabsContent>
          <TabsContent value="breaks">
            <MostBreaksTaken />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  )
}
