"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MostLeaveTaken from "./mostleavetaken"
import UnplannedLeaveTaken from "./unplannedleavetaken"
import LeaveBalanceAvailable from "./leavebalance"

export default function LeaveDashboard() {
  return (
    <div className="w-full  ">
   <Tabs defaultValue="most" className="w-full">
  {/* Tabs Header */}
  <TabsList className="grid grid-cols-3 w-fit mb-3 bg-transparent space-x-2">
    <TabsTrigger
      value="most"
      className="text-xs px-3 py-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md"
    >
      Most Leave Taken
    </TabsTrigger>
    <TabsTrigger
      value="unplanned"
      className="text-xs px-3 py-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md"
    >
      Unplanned Leave Taken
    </TabsTrigger>
    <TabsTrigger
      value="balance"
      className="text-xs px-3 py-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md"
    >
      Leave Balance Available
    </TabsTrigger>
  </TabsList>

  {/* Tab Content */}
  <div className="mt-2 border-t border-gray-100 pt-3">
    <TabsContent value="most">
      <MostLeaveTaken />
    </TabsContent>

    <TabsContent value="unplanned">
      <UnplannedLeaveTaken />
    </TabsContent>

    <TabsContent value="balance">
      <LeaveBalanceAvailable />
    </TabsContent>
  </div>
</Tabs>

    </div>
  )
}
