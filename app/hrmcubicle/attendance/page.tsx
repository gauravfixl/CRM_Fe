"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Attendance</h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Avg Hrs / Day</div>
              <div className="font-medium">5h 52m</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">On Time Arrival</div>
              <div className="font-medium">0%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">Today (9:15 AM - 6:15 PM)</div>
            <Progress value={78} className="h-2 bg-muted" />
            <div className="text-xs text-muted-foreground">Duration: 9h 0m</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch id="fmt" />
              <Label htmlFor="fmt" className="text-sm">
                24 hour format
              </Label>
            </div>
            <div className="text-sm text-muted-foreground">3h:21m Since Last Login</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Logs & Requests</h2>
        <Tabs defaultValue="log" className="w-full">
          <TabsList>
            <TabsTrigger value="log">Attendance Log</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="requests">Attendance Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="log" className="text-sm text-muted-foreground">
            No records to display.
          </TabsContent>
          <TabsContent value="calendar" className="text-sm text-muted-foreground">
            Calendar view coming soon.
          </TabsContent>
          <TabsContent value="requests" className="text-sm text-muted-foreground">
            No pending requests.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
