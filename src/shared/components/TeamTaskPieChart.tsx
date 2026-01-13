"use client"

import { useState } from "react"
import { Pie, PieChart, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const COLORS = ["#4CAF50", "#2196F3", "#9E9E9E"] // green, blue, gray

export function TeamTaskPieChart({ analytics }: { analytics: any }) {
  const [selectedTeamId, setSelectedTeamId] = useState(
    analytics.teamWiseTaskDistribution?.[0]?.teamId
  )

  const selectedTeam = analytics.teamWiseTaskDistribution?.find(
    (team: any) => team.teamId === selectedTeamId
  )

  const pieData = [
    { name: "Completed", value: selectedTeam?.completedTasks || 0 },
    { name: "To do", value: selectedTeam?.toDoTasks || 0 },
    { name: "Active", value: selectedTeam?.activeTasks || 0 },
  ]

  const totalTasks = pieData.reduce((acc, item) => acc + item.value, 0)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-base font-semibold">Team-wise Task Distribution</CardTitle>
          <span className="text-sm text-muted-foreground mt-1">
            Total Tasks: {totalTasks}
          </span>
        </div>

        <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            {analytics.teamWiseTaskDistribution?.map((team: any) => (
              <SelectItem key={team.teamId} value={team.teamId}>
                {team.teamName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              data={pieData}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
