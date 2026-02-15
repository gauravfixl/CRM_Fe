"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Calendar, Clock, Users } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";

const ShiftsHolidaysPage = () => {
    const [activeTab, setActiveTab] = useState("shifts");
    const { toast } = useToast();

    const shifts = [
        { id: "SH-001", name: "General Shift", timing: "09:00 AM - 06:00 PM", employees: 180, type: "Regular" },
        { id: "SH-002", name: "Night Shift", timing: "10:00 PM - 07:00 AM", employees: 35, type: "Night" },
        { id: "SH-003", name: "Flexible Shift", timing: "Flexible", employees: 50, type: "Flexible" }
    ];

    const roster = [
        { employee: "Rajesh Kumar", shift: "General Shift", mon: "✓", tue: "✓", wed: "✓", thu: "✓", fri: "✓", sat: "-", sun: "-" },
        { employee: "Priya Sharma", shift: "Night Shift", mon: "✓", tue: "✓", wed: "✓", thu: "✓", fri: "✓", sat: "-", sun: "-" }
    ];

    const holidays = [
        { date: "Jan 26, 2024", name: "Republic Day", type: "National", applicable: "All" },
        { date: "Mar 08, 2024", name: "Holi", type: "Festival", applicable: "All" },
        { date: "Aug 15, 2024", name: "Independence Day", type: "National", applicable: "All" }
    ];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50 overflow-y-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Shifts & Holidays</h2>
                <p className="text-slate-500 text-sm mt-1">Manage shift schedules and holiday calendar.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full overflow-x-auto justify-start h-auto rounded-none">
                    {["Shifts", "Shift Roster", "Holiday Calendar", "Weekly Offs"].map((tab) => (
                        <TabsTrigger key={tab.toLowerCase().replace(" ", "-")} value={tab.toLowerCase().replace(" ", "-")} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap">
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Shifts */}
                <TabsContent value="shifts" className="space-y-4">
                    <div className="flex justify-end">
                        <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => toast({ title: "Create Shift", description: "Opening shift creation form..." })}>
                            Create Shift
                        </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {shifts.map(shift => (
                            <Card key={shift.id} className="shadow-sm border-slate-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{shift.name}</CardTitle>
                                        <Badge className="bg-indigo-100 text-indigo-700 border-none">{shift.type}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Clock className="h-4 w-4" />
                                        <span>{shift.timing}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Users className="h-4 w-4" />
                                        <span>{shift.employees} Employees</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => toast({ title: "Edit Shift", description: `Editing ${shift.name}` })}>
                                        Edit Shift
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Shift Roster */}
                <TabsContent value="shift-roster" className="space-y-4">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle>Weekly Shift Roster</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Shift</TableHead>
                                        <TableHead>Mon</TableHead>
                                        <TableHead>Tue</TableHead>
                                        <TableHead>Wed</TableHead>
                                        <TableHead>Thu</TableHead>
                                        <TableHead>Fri</TableHead>
                                        <TableHead>Sat</TableHead>
                                        <TableHead>Sun</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roster.map((r, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-semibold">{r.employee}</TableCell>
                                            <TableCell><Badge className="bg-blue-100 text-blue-700 border-none">{r.shift}</Badge></TableCell>
                                            <TableCell>{r.mon}</TableCell>
                                            <TableCell>{r.tue}</TableCell>
                                            <TableCell>{r.wed}</TableCell>
                                            <TableCell>{r.thu}</TableCell>
                                            <TableCell>{r.fri}</TableCell>
                                            <TableCell>{r.sat}</TableCell>
                                            <TableCell>{r.sun}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Holiday Calendar */}
                <TabsContent value="holiday-calendar" className="space-y-4">
                    <div className="flex justify-end">
                        <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => toast({ title: "Add Holiday", description: "Opening holiday form..." })}>
                            Add Holiday
                        </Button>
                    </div>
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle>2024 Holiday Calendar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Holiday Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Applicable To</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holidays.map((holiday, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-semibold">{holiday.date}</TableCell>
                                            <TableCell>{holiday.name}</TableCell>
                                            <TableCell>
                                                <Badge className={holiday.type === "National" ? "bg-red-100 text-red-700 border-none" : "bg-purple-100 text-purple-700 border-none"}>
                                                    {holiday.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-600">{holiday.applicable}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Weekly Offs */}
                <TabsContent value="weekly-offs" className="space-y-4">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle>Weekly Off Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-7 gap-2">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                                        <div key={day} className={`p-4 border-2 rounded-lg text-center cursor-pointer ${idx === 0 || idx === 6 ? 'border-[#6366f1] bg-indigo-50' : 'border-slate-200'}`}>
                                            <div className="font-semibold text-slate-900">{day}</div>
                                            {(idx === 0 || idx === 6) && <div className="text-xs text-indigo-600 mt-1">Off</div>}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500">Click on days to toggle weekly offs</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ShiftsHolidaysPage;
