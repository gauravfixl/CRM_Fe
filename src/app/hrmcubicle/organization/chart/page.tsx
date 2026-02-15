"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Network,
    Users,
    Building2,
    ChevronDown,
    ChevronRight,
    Download,
    ZoomIn,
    ZoomOut,
    Maximize2,
    User,
    Crown,
    Briefcase,
    Mail,
    Phone
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useOrganisationStore } from "@/shared/data/organisation-store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

const OrgChartPage = () => {
    const { employees, departments, designations } = useOrganisationStore();
    const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
    const [zoomLevel, setZoomLevel] = useState(100);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    // Build hierarchy tree
    const buildHierarchy = () => {
        const filteredEmployees = selectedDepartment === "All"
            ? employees
            : employees.filter(e => e.departmentId === selectedDepartment);

        // Find root employees (no reporting manager or manager not in filtered set)
        const roots = filteredEmployees.filter(emp =>
            !emp.reportingManagerId ||
            !filteredEmployees.find(e => e.id === emp.reportingManagerId)
        );

        // Build tree recursively
        const buildTree = (managerId: string): any[] => {
            return filteredEmployees
                .filter(emp => emp.reportingManagerId === managerId)
                .map(emp => ({
                    ...emp,
                    children: buildTree(emp.id)
                }));
        };

        return roots.map(root => ({
            ...root,
            children: buildTree(root.id)
        }));
    };

    const hierarchy = buildHierarchy();

    const toggleNode = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const EmployeeNode = ({ employee, level = 0 }: { employee: any; level?: number }) => {
        const designation = designations.find(d => d.id === employee.designationId);
        const department = departments.find(d => d.id === employee.departmentId);
        const hasChildren = employee.children && employee.children.length > 0;
        const isExpanded = expandedNodes.has(employee.id);

        return (
            <div className="relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: level * 0.1 }}
                    className="mb-4"
                >
                    <Card className={`group border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden ring-1 ring-slate-100 max-w-sm ${level === 0 ? 'bg-indigo-50 border border-indigo-100' :
                        level === 1 ? 'bg-emerald-50 border border-emerald-100' :
                            level === 2 ? 'bg-amber-50 border border-amber-100' :
                                'bg-slate-50 border border-slate-100'
                        }`}>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <Avatar className="h-14 w-14 border-4 border-white shadow-md ring-1 ring-slate-100">
                                        <AvatarFallback className={`${level === 0 ? 'bg-indigo-600' :
                                            level === 1 ? 'bg-emerald-600' :
                                                level === 2 ? 'bg-amber-600' :
                                                    'bg-slate-600'
                                            } text-white font-bold text-lg`}>
                                            {employee.profileImage}
                                        </AvatarFallback>
                                    </Avatar>
                                    {level === 0 && (
                                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                                            <Crown size={10} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="space-y-0.5">
                                        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                                            {employee.firstName} {employee.lastName}
                                        </h3>
                                        <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">
                                            {employee.employeeCode}
                                        </p>
                                    </div>

                                    <div className="mt-2 space-y-1.5">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <Briefcase size={12} className="text-slate-400" />
                                            <span className="font-bold">{designation?.title || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                            <Building2 size={12} className="text-slate-400" />
                                            <span className="font-bold">{department?.name || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2">
                                        <Badge variant="outline" className={`${employee.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'} border-none font-bold text-[8px] h-5 px-2 rounded-lg capitalize`}>
                                            {employee.status}
                                        </Badge>
                                        {hasChildren && (
                                            <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-none font-bold text-[8px] h-5 px-2 rounded-lg">
                                                <Users size={10} className="mr-1" />
                                                {employee.children.length} Reports
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {hasChildren && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-xl"
                                        onClick={() => toggleNode(employee.id)}
                                    >
                                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </Button>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 h-8 rounded-lg font-bold text-[10px] gap-2 text-slate-600 hover:text-indigo-600 hover:bg-white/80"
                                    onClick={() => window.location.href = `mailto:${employee.email}`}
                                >
                                    <Mail size={12} /> Email
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 h-8 rounded-lg font-bold text-[10px] gap-2 text-slate-600 hover:text-emerald-600 hover:bg-white/80"
                                    onClick={() => window.location.href = `tel:${employee.phone}`}
                                >
                                    <Phone size={12} /> Call
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className="ml-12 pl-8 border-l-2 border-slate-100 space-y-4">
                        {employee.children.map((child: any) => (
                            <EmployeeNode key={child.id} employee={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20" style={{ zoom: "90%" }}>
            <header className="py-3 px-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Chart</h1>
                            <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[10px] capitalize tracking-wider h-5 px-3 italic">
                                Visual Hierarchy
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-xs font-medium">Interactive reporting structure and team visualization.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-56 h-10 rounded-xl bg-white border-slate-200 font-bold text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                <SelectItem value="All" className="rounded-lg h-10">All Departments</SelectItem>
                                {departments.map(dept => (
                                    <SelectItem key={dept.id} value={dept.id} className="rounded-lg h-10">
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 rounded-lg"
                                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                                disabled={zoomLevel <= 50}
                            >
                                <ZoomOut size={16} />
                            </Button>
                            <span className="text-[10px] font-bold text-slate-600 px-1 min-w-[45px] text-center">
                                {zoomLevel}%
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 rounded-lg"
                                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                                disabled={zoomLevel >= 150}
                            >
                                <ZoomIn size={16} />
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            className="h-10 px-6 rounded-xl font-bold border-slate-200 gap-2 text-xs"
                            onClick={() => window.print()}
                        >
                            <Download size={16} /> Export
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6 pt-4 max-w-[1440px] mx-auto w-full">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <Card className="rounded-[2rem] border-none bg-rose-100/70 text-rose-800 p-8 shadow-sm border border-rose-200">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-rose-500 capitalize tracking-widest leading-none">Total Employees</p>
                            <h3 className="text-3xl font-bold tracking-tight">{employees.length}</h3>
                        </div>
                    </Card>

                    <Card className="rounded-[2rem] bg-purple-100/70 border border-purple-200 p-8 shadow-sm">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-purple-500 capitalize tracking-widest">Department Heads</p>
                            <h3 className="text-3xl font-bold text-purple-800 tracking-tight">
                                {departments.filter(d => d.headId).length}
                            </h3>
                        </div>
                    </Card>

                    <Card className="rounded-[2rem] bg-indigo-100/70 border border-indigo-200 p-8 shadow-sm">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-indigo-500 capitalize tracking-widest">Reporting Lines</p>
                            <h3 className="text-3xl font-bold text-indigo-800 tracking-tight">
                                {employees.filter(e => e.reportingManagerId).length}
                            </h3>
                        </div>
                    </Card>

                    <Card className="rounded-[2rem] bg-emerald-100/70 border border-emerald-200 p-8 shadow-sm">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-500 capitalize tracking-widest">Hierarchy Levels</p>
                            <h3 className="text-3xl font-bold text-emerald-800 tracking-tight">
                                {Math.max(...designations.map(d => d.level))}
                            </h3>
                        </div>
                    </Card>
                </div>

                {/* Organization Chart */}
                <Card className="rounded-[3rem] border border-slate-100 shadow-sm bg-white p-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-3 capitalize">
                                    <Network className="text-rose-600" size={20} /> Reporting Structure
                                </h2>
                                <p className="text-slate-400 text-xs font-bold capitalize tracking-widest">
                                    {selectedDepartment === "All" ? "Company-wide hierarchy" : `${departments.find(d => d.id === selectedDepartment)?.name} department`}
                                </p>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 px-4 rounded-xl font-bold text-xs gap-2"
                                onClick={() => {
                                    if (expandedNodes.size === 0) {
                                        // Expand all
                                        const allIds = new Set(employees.map(e => e.id));
                                        setExpandedNodes(allIds);
                                    } else {
                                        // Collapse all
                                        setExpandedNodes(new Set());
                                    }
                                }}
                            >
                                <Maximize2 size={14} />
                                {expandedNodes.size === 0 ? 'Expand All' : 'Collapse All'}
                            </Button>
                        </div>

                        <div
                            className="overflow-auto max-h-[800px] pr-4"
                            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                        >
                            {hierarchy.length > 0 ? (
                                <div className="space-y-6">
                                    {hierarchy.map(root => (
                                        <EmployeeNode key={root.id} employee={root} level={0} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Network size={64} className="text-slate-200 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Hierarchy Found</h3>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {selectedDepartment === "All"
                                            ? "No employees with reporting structure found."
                                            : "No employees found in this department."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Legend */}
                <Card className="rounded-[2rem] border border-slate-100 shadow-sm bg-white p-4 mt-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-900 capitalize tracking-tight">Legend</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                                    <Crown size={14} className="text-amber-600" />
                                </div>
                                <span className="text-xs font-bold text-slate-700">Top Leadership</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] h-6 px-3 rounded-lg">Active</Badge>
                                <span className="text-xs font-bold text-slate-700">Active Employee</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[9px] h-6 px-3 rounded-lg">
                                    <Users size={10} className="mr-1" /> 3
                                </Badge>
                                <span className="text-xs font-bold text-slate-700">Direct Reports</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ChevronRight size={16} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">Click to Expand</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default OrgChartPage;
