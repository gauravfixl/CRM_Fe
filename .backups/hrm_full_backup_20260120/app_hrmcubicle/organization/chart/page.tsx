"use client"

import React from "react";
import { motion } from "framer-motion";
import { Users, ChevronDown } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useOrganizationStore } from "@/shared/data/organization-store";

const OrgChartPage = () => {
    const { employees } = useOrganizationStore();

    const ceo = { id: 'CEO', name: 'Rajesh Mehta', avatar: 'RM', designation: 'CEO' };
    const managers = employees.filter(e => e.designation.includes('Manager') || e.designation.includes('Head'));
    const teamMembers = employees.filter(e => !e.designation.includes('Manager') && !e.designation.includes('Head'));

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Organization Chart</h1>
                <p className="text-slate-500 font-medium">Visual representation of organizational hierarchy.</p>
            </div>

            <div className="flex flex-col items-center space-y-8">
                {/* CEO */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="border-none shadow-xl rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 w-80">
                        <div className="flex flex-col items-center">
                            <Avatar className="h-20 w-20 bg-white text-indigo-600 font-black text-2xl mb-4">
                                <AvatarFallback>{ceo.avatar}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-black text-2xl mb-1">{ceo.name}</h3>
                            <p className="text-white/80 font-bold">{ceo.designation}</p>
                        </div>
                    </Card>
                </motion.div>

                <ChevronDown className="text-slate-300" size={32} />

                {/* Managers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {managers.map((manager, i) => (
                        <motion.div
                            key={manager.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-none shadow-lg rounded-[2rem] bg-white p-6 hover:shadow-xl transition-all">
                                <div className="flex flex-col items-center">
                                    <Avatar className="h-16 w-16 bg-indigo-100 text-indigo-700 font-bold text-xl mb-3">
                                        <AvatarFallback>{manager.avatar}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-black text-lg text-slate-900 text-center">{manager.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium text-center">{manager.designation}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase mt-2">{manager.department}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <ChevronDown className="text-slate-300" size={32} />

                {/* Team Members Summary */}
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-50 p-8 w-full max-w-4xl">
                    <div className="flex items-center justify-center gap-6">
                        <div className="h-20 w-20 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <Users className="text-emerald-600" size={36} />
                        </div>
                        <div>
                            <p className="font-black text-4xl text-slate-900">{teamMembers.length}</p>
                            <p className="text-slate-500 font-bold text-lg">Team Members</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default OrgChartPage;
