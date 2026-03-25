"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import ModulesShowcase from "@/components/landing/ModulesShowcase"
import { Rocket } from "lucide-react"

export default function ModulesPage() {
    return (
        <main className="h-screen flex flex-col bg-white dark:bg-slate-950 overflow-hidden font-inter transition-colors duration-500">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@300;400;600&display=swap');
                h1, h2, h3, h4, .font-outfit { font-family: 'Outfit', sans-serif; }
                
                /* Custom Scrollbar Styling */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>

            {/* Header is outside the scrollable container */}
            <div className="flex-none">
                <Navbar solid />
            </div>

            {/* Scrollbar starts from here (under the header) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-16 lg:pt-20 custom-scrollbar">
                <div className="min-h-full flex flex-col">
                    <div className="flex-1">
                        <ModulesShowcase isPage />
                    </div>

                    {/* Bottom Section - Integration Promo */}
                    <section className="py-24 bg-slate-900 relative overflow-hidden flex-none">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/5 backdrop-blur-xl border border-white/10 p-12 lg:p-16 rounded-[48px] shadow-2xl">
                                <div className="max-w-xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                                            <Rocket className="w-6 h-6 text-white" />
                                        </div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Next Level Power</h4>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-none">
                                        All Modules. <br /> One Integrated Core.
                                    </h2>
                                    <p className="text-slate-400 text-lg font-light leading-relaxed">
                                        Don't just manage. Scale with a platform that shares data across every module instantly. Your Finance team sees what Sales closes, and HR knows which projects need more hands.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/auth/signup"
                                        className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl text-center"
                                    >
                                        Start Your Trial
                                    </Link>
                                    <Link
                                        href="/features"
                                        className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-center"
                                    >
                                        Browse Features
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Footer />
                </div>
            </div>
        </main>
    )
}
