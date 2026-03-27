"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import {
    ArrowRight,
    Play,
    ChevronDown,
    Shield,
    Zap,
    Globe,
    Star,
    Users,
    TrendingUp,
    BarChart3,
    CheckCircle,
    Sparkles,
} from "lucide-react"

// Particle component for background
const Particle = ({ index }: { index: number }) => {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const duration = 20 + Math.random() * 20
    const delay = Math.random() * 5

    return (
        <motion.div
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    )
}

const floatVariants = {
    animate: {
        y: [0, -20, 0],
        rotateX: [0, 5, 0],
        rotateY: [0, 5, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
}

const trustBadges = [
    { icon: Shield, label: "SOC2 Compliant" },
    { icon: Zap, label: "99.9% Uptime" },
    { icon: Globe, label: "GDPR Ready" },
]

const dashboardModules = [
    { icon: Users, label: "Lead Management", value: "2,847", change: "+12%", color: "bg-blue-500", trend: "up" },
    { icon: TrendingUp, label: "Pipeline Value", value: "$147K", change: "+8%", color: "bg-emerald-500", trend: "up" },
    { icon: BarChart3, label: "Win Rate", value: "68.4%", change: "+5%", color: "bg-purple-500", trend: "up" },
]

export default function HeroSectionEnhanced() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const dashboardRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
    const y = useTransform(scrollYProgress, [0, 1], [0, 150])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    // Smooth spring animation for mouse tracking
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springConfig = { damping: 25, stiffness: 150 }
    const smoothMouseX = useSpring(mouseX, springConfig)
    const smoothMouseY = useSpring(mouseY, springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (dashboardRef.current && isHovering) {
                const rect = dashboardRef.current.getBoundingClientRect()
                const x = (e.clientX - rect.left - rect.width / 2) / 20
                const y = (e.clientY - rect.top - rect.height / 2) / 20
                mouseX.set(x)
                mouseY.set(y)
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [isHovering, mouseX, mouseY])

    const handleScrollDown = () => {
        const el = document.querySelector("#features")
        if (el) el.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950"
            style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
        >

            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated gradient orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-gradient-to-br from-blue-600/30 to-indigo-600/30 rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-violet-600/30 to-purple-600/30 rounded-full blur-[140px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-[120px]"
                />

                {/* Particle system */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <Particle key={i} index={i} />
                ))}

                {/* Grid overlay with animation */}
                <motion.div
                    animate={{ opacity: [0.03, 0.06, 0.03] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            </div>

            <motion.div
                style={{ y, opacity }}
                className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24"
            >
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

                    {/* Left: Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* Enhanced Badge with shimmer effect */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border bord
                                    )}
                                </motion.span>
                            ))}
                        </h1>
   className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 opacity-50 blur-sm"
                                                style={{ backgroundSize: "200% 200%" }}
                                            >
                                                {word}
                                            </motion.span>
                                        </>
                                    ) : (
                                        wor                          {word}
                                            </span>
                                            <motion.span
                                                animate={{
                                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                                }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                                                                    ? "relative"
                                            : ""
                                    }`}
                                >
                                    {i >= 2 ? (
                                        <>
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 animate-gradient">
                      nView={{ opacity: 1, y: 0, rotateX: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.1 + (i * 0.1),
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    className={`inline-block mr-[0.25em] last:mr-0 ${
                                        i >= 2
                      <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tighter mb-6 flex flex-wrap justify-center lg:justify-start">
                            {["Transform", "Your", "Business", "Operations"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 60, rotateX: -90 }}
                                    whileI             <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-300 tracking-widest uppercase">
                                Enterprise CRM Platform
                            </span>
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                        </motion.div>

                        {/* Enhanced Headline with gradient animation */}
       radient-to-r from-transparent via-white/20 to-transparent"
                            />
                            
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-lg shadow-blue-500/50" />
                            </span>
               der-blue-500/40 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 backdrop-blur-md mb-8 group cursor-default relative overflow-hidden"
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                className="absolute inset-0 bg-g