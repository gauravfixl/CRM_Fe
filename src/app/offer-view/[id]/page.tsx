"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Download, Briefcase } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
import { useToast } from "@/shared/components/ui/use-toast";

// This is a PUBLIC FACING PAGE (Simulated)
// No Sidebar, No Admin Controls.
const OfferLetterPage = () => {
    const params = useParams();
    const router = useRouter();
    const { candidates, updateCandidateStatus } = useLifecycleStore();
    const { toast } = useToast();

    // Safety check for ID
    const candidateId = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
    const candidate = candidates.find(c => c.id === candidateId);

    const [status, setStatus] = useState<'Pending' | 'Accepted' | 'Rejected'>('Pending');

    // Sync with store status on load
    useEffect(() => {
        if (candidate?.status === 'Offer Accepted') setStatus('Accepted');
    }, [candidate]);

    if (!candidate) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">404: Offer Not Found</h1>
                    <p className="text-slate-500">This link may have expired or is invalid.</p>
                </div>
            </div>
        );
    }

    const handleAccept = () => {
        updateCandidateStatus(candidate.id, "Offer Accepted");
        setStatus('Accepted');
        toast({ title: "Congratulations!", description: "You have accepted the offer." });
    };

    const handleReject = () => {
        updateCandidateStatus(candidate.id, "Offer Rejected");
        setStatus('Rejected');
    };

    if (status === 'Accepted') {
        return (
            <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center">
                    <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} className="text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-black text-emerald-900 mb-2">Welcome Aboard!</h1>
                    <p className="text-emerald-700 font-medium mb-8">
                        Thank you for accepting the offer, <b>{candidate.name}</b>.
                        <br />We are thrilled to have you join the team!
                    </p>
                    <Card className="p-6 border-none shadow-xl bg-white rounded-2xl">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Next Steps</h3>
                        <p className="text-sm text-slate-600">
                            Our HR team has been notified. You will shortly receive an email regarding the Background Verification (BGV) process.
                        </p>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (status === 'Rejected') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <div className="h-24 w-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle size={48} className="text-rose-600" />
                    </div>
                    <h1 className="text-2xl font-black text-rose-900 mb-2">Offer Declined</h1>
                    <p className="text-slate-600">
                        You have declined the offer. We wish you the best in your future endeavors.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Branding Header */}
                <div className="text-center space-y-2">
                    <div className="h-12 w-12 bg-indigo-600 rounded-lg mx-auto flex items-center justify-center text-white mb-4">
                        <Briefcase />
                    </div>
                    <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Employment Offer</h2>
                    <h1 className="text-3xl font-black text-slate-900">Fixl Solutions Pvt Ltd</h1>
                </div>

                {/* Offer Letter Paper */}
                <Card className="bg-white shadow-2xl shadow-slate-200/50 border-none rounded-none sm:rounded-[2px] p-8 sm:p-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <p className="text-slate-500 font-medium">{new Date().toDateString()}</p>
                            <p className="font-bold text-slate-900 mt-1">Ref: OFF/{candidate.id}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-slate-900 text-lg">{candidate.name}</h3>
                            <p className="text-slate-500 text-sm whitespace-pre-line">
                                Candidate ID: {candidate.id}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 text-slate-700 leading-relaxed font-medium">
                        <p>Dear {candidate.name},</p>

                        <p>
                            We are pleased to extend an offer of employment for the position of
                            <span className="font-bold text-slate-900 mx-1 bg-slate-100 px-2 py-0.5 rounded">
                                {candidate.role}
                            </span>
                            in the
                            <span className="font-bold text-slate-900 mx-1">{candidate.department}</span>
                            department at Fixl Solutions.
                        </p>

                        <p>
                            This offer is contingent upon the successful completion of your Background Verification (BGV)
                            and reference checks. We are confident that you will find this new opportunity both challenging and rewarding.
                        </p>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 my-8">
                            <h4 className="font-bold text-slate-900 mb-4 border-b pb-2">Compensation & Benefits</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Annual CTC</p>
                                    <p className="font-bold text-slate-800 text-xl">₹ {candidate.salary || "Not Disclosed"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Joining Date</p>
                                    <p className="font-bold text-slate-800">{candidate.joiningDate || "Immediate"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Location</p>
                                    <p className="font-bold text-slate-800">Bangalore (Hybrid)</p>
                                </div>
                            </div>
                        </div>

                        <p>
                            Please indicate your acceptance of this offer by clicking the "Accept Offer" button below.
                            This link is valid for 48 hours.
                        </p>

                        <p className="pt-4">
                            Sincerely,<br />
                            <span className="font-bold text-slate-900">HR Team</span><br />
                            Fixl Solutions
                        </p>
                    </div>
                </Card>

                {/* Actions */}
                <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 sm:p-6 flex justify-center gap-4 z-50">
                    <Button variant="outline" className="border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl px-8 h-12 font-bold transition-all" onClick={handleReject}>
                        Decline Offer
                    </Button>
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-10 h-12 font-bold shadow-xl transition-all" onClick={handleAccept}>
                        Accept Offer
                    </Button>
                </div>
                <div className="h-20"></div> {/* Spacer for fixed footer */}
            </div>
        </div>
    );
};

export default OfferLetterPage;
