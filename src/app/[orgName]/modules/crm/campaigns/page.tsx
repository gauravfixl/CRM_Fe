"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Megaphone,
    Plus,
    Filter,
    Search,
    MoreVertical,
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    Target,
} from "lucide-react";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CampaignsPage() {
    const params = useParams();
    const router = useRouter();
    const orgName = params.orgName as string;

    const [searchTerm, setSearchTerm] = useState("");

    // Dummy data for campaigns
    const campaigns = [
        {
            id: "1",
            name: "Q1 Product Launch",
            type: "Email",
            status: "Active",
            startDate: "2024-01-15",
            budget: 50000,
            spent: 32000,
            leads: 450,
            conversions: 67,
        },
        {
            id: "2",
            name: "Summer Sale 2024",
            type: "Social Media",
            status: "Planned",
            startDate: "2024-06-01",
            budget: 75000,
            spent: 0,
            leads: 0,
            conversions: 0,
        },
        {
            id: "3",
            name: "Webinar Series",
            type: "Event",
            status: "Active",
            startDate: "2024-02-01",
            budget: 25000,
            spent: 18500,
            leads: 320,
            conversions: 89,
        },
        {
            id: "4",
            name: "Holiday Campaign",
            type: "Ads",
            status: "Completed",
            startDate: "2023-12-01",
            budget: 100000,
            spent: 98500,
            leads: 1250,
            conversions: 342,
        },
    ];

    const stats = [
        {
            title: "Total Campaigns",
            value: campaigns.length,
            icon: Megaphone,
            gradient: "from-blue-500 to-blue-600",
            iconBg: "bg-blue-500/20",
            shadow: "shadow-blue-500/20",
        },
        {
            title: "Active Campaigns",
            value: campaigns.filter((c) => c.status === "Active").length,
            icon: TrendingUp,
            gradient: "from-emerald-500 to-emerald-600",
            iconBg: "bg-emerald-500/20",
            shadow: "shadow-emerald-500/20",
        },
        {
            title: "Total Leads",
            value: campaigns.reduce((sum, c) => sum + c.leads, 0).toLocaleString(),
            icon: Users,
            gradient: "from-purple-500 to-purple-600",
            iconBg: "bg-purple-500/20",
            shadow: "shadow-purple-500/20",
        },
        {
            title: "Total Budget",
            value: `$${(campaigns.reduce((sum, c) => sum + c.budget, 0) / 1000).toFixed(0)}K`,
            icon: DollarSign,
            gradient: "from-orange-500 to-orange-600",
            iconBg: "bg-orange-500/20",
            shadow: "shadow-orange-500/20",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Planned":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Completed":
                return "bg-zinc-100 text-zinc-700 border-zinc-200";
            default:
                return "bg-zinc-100 text-zinc-700 border-zinc-200";
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950">
            {/* Header - Sticky */}
            <div className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white dark:bg-zinc-900 border-b px-6 py-4 shadow-sm z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Campaign Management
                        </h1>
                        <p className="text-sm text-zinc-500 font-normal">
                            Track and optimize your marketing initiatives
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-2"
                    >
                        <CustomButton
                            variant="default"
                            className="h-9 font-normal text-xs"
                            onClick={() => router.push(`/${orgName}/modules/crm/campaigns/new`)}
                        >
                            <Plus className="mr-2 h-3.5 w-3.5" /> New Campaign
                        </CustomButton>
                    </motion.div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.4, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} ${stat.shadow} border-0 flex flex-col justify-between h-32 group`}
                        >
                            {/* Animated Inner Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            <div className="flex items-center justify-between z-10">
                                <div className={`p-2.5 rounded-xl ${stat.iconBg} backdrop-blur-md shadow-inner`}>
                                    <stat.icon className="h-5 w-5 text-white" />
                                </div>
                                <stat.icon className="h-8 w-8 text-white/10 absolute right-4 top-4" />
                            </div>

                            <div className="z-10 mt-auto">
                                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{stat.title}</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                    <span className="text-[10px] text-white/60 font-medium">real-time</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border p-4 flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <CustomInput
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-9 bg-zinc-50/50"
                        />
                    </div>
                    <CustomButton variant="outline" className="h-9 font-normal text-xs">
                        <Filter className="mr-2 h-3.5 w-3.5" /> Filters
                    </CustomButton>
                </div>

                {/* Campaigns Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-zinc-50 dark:bg-zinc-800/50">
                                <TableHead className="font-semibold">Campaign Name</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Start Date</TableHead>
                                <TableHead className="font-semibold">Budget</TableHead>
                                <TableHead className="font-semibold">Leads</TableHead>
                                <TableHead className="font-semibold">Conversions</TableHead>
                                <TableHead className="font-semibold">ROI</TableHead>
                                <TableHead className="font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map((campaign) => {
                                const roi = campaign.spent > 0
                                    ? (((campaign.conversions * 1000 - campaign.spent) / campaign.spent) * 100).toFixed(1)
                                    : "0";

                                return (
                                    <TableRow key={campaign.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Megaphone className="h-4 w-4 text-zinc-400" />
                                                {campaign.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {campaign.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
                                                {campaign.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(campaign.startDate).toLocaleDateString('en-GB')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-medium">${(campaign.budget / 1000).toFixed(0)}K</span>
                                                <span className="text-xs text-zinc-500">
                                                    Spent: ${(campaign.spent / 1000).toFixed(1)}K
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">{campaign.leads}</TableCell>
                                        <TableCell className="text-sm font-medium text-emerald-600">
                                            {campaign.conversions}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-1">
                                                <Target className="h-3 w-3 text-emerald-600" />
                                                <span className={`font-medium ${parseFloat(roi) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {roi}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <CustomButton variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </CustomButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                                                    <DropdownMenuItem>View Members</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
