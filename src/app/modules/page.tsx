"use client"

import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import ModulesShowcase from "@/components/landing/ModulesShowcase"

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

                    <Footer />
                </div>
            </div>
        </main>
    )
}
