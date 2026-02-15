"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Monitor, Filter, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ActivityLogsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="User Activity"
                breadcrumbItems={[
                    { label: "Monitoring", href: "/monitoring" },
                    { label: "Activity Logs", href: "/activity-logs" }
                ]}
                rightControls={
                    <>
                        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-none border-dashed">
                            <Filter className="w-3.5 h-3.5" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-2 rounded-none border-dashed">
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </Button>
                    </>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Activity Feed</CardTitle>
                        <CardDescription>Real-time stream of user actions across the organization.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-zinc-200">
                                    <TableHead className="w-[180px]">Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Resource</TableHead>
                                    <TableHead className="text-right">IP Address</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <TableRow key={i} className="hover:bg-zinc-50 border-zinc-100">
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            {new Date().toISOString().split('T')[0]} 10:{10 + i}:00
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                                    JD
                                                </div>
                                                <span className="text-sm font-medium">John Doe</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-none border-zinc-200 bg-white font-normal">
                                                Page View
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-600">
                                            /dashboard/overview
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs text-zinc-400">
                                            192.168.1.{100 + i}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
