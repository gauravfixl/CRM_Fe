"use client"

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md transition-all">
            <div className="relative">
                {/* Outer Orbit */}
                <motion.div
                    className="w-24 h-24 rounded-full border-2 border-indigo-100 border-t-indigo-600"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Orbit */}
                <motion.div
                    className="absolute inset-2 rounded-full border-2 border-emerald-100 border-b-emerald-500"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Pulse */}
                <motion.div
                    className="absolute inset-0 m-auto w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-4 h-4 rounded-full bg-white/20 animate-ping" />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-center space-y-2"
            >
                <h2 className="text-sm font-bold text-slate-900 tracking-widest uppercase">Synchronizing Data</h2>
                <div className="flex items-center gap-1 justify-center">
                    <span className="h-1 w-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1 w-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1 w-1 bg-indigo-600 rounded-full animate-bounce"></span>
                </div>
            </motion.div>
        </div>
    );
}
