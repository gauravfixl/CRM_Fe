"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, Zap, Shield, Globe, Play, Pause, Volume2, VolumeX,
  Users, UserCheck, Briefcase, DollarSign, HeadphonesIcon, BarChart3,
  Sparkles, MousePointerClick
} from "lucide-react"

/* ── module chips ── */
const moduleChips = [
  { id: "crm", icon: Users, label: "CRM", color: "#6366F1", desc: "Leads, Deals, Contacts" },
  { id: "hrm", icon: UserCheck, label: "HRM", color: "#10B981", desc: "Employees, Payroll, Leave" },
  { id: "pm", icon: Briefcase, label: "Projects", color: "#8B5CF6", desc: "Tasks, Sprints, Boards" },
  { id: "finance", icon: DollarSign, label: "Finance", color: "#F59E0B", desc: "Invoices, Expenses, Reports" },
  { id: "helpdesk", icon: HeadphonesIcon, label: "Helpdesk", color: "#06B6D4", desc: "Tickets, SLA, Knowledge Base" },
  { id: "analytics", icon: BarChart3, label: "Analytics", color: "#EC4899", desc: "Dashboards, Insights, Reports" },
]

const trustItems = [
  { icon: Shield, text: "SOC2 Compliant" },
  { icon: Zap, text: "99.9% Uptime" },
  { icon: Globe, text: "GDPR Ready" },
]

/* ── Animated counter ── */
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
        {value}
      </div>
      <div className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mt-1">
        {label}
      </div>
    </motion.div>
  )
}

/* ── Video Showcase ── */
function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showOverlay, setShowOverlay] = useState(true)

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setShowOverlay(true)
    } else {
      videoRef.current.play()
      setShowOverlay(false)
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.8, duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto max-w-[1000px] mt-16"
    >
      {/* Animated glow border */}
      <div className="absolute -inset-[2px] rounded-2xl overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_40%,#6366F1_50%,transparent_60%)]"
        />
      </div>

      {/* Static glow behind */}
      <div className="absolute -inset-8 bg-gradient-to-r from-[#6366F1]/20 via-[#8B5CF6]/15 to-[#3B82F6]/20 rounded-[40px] blur-[60px] opacity-50" />

      {/* Video container */}
      <div className="relative bg-[#0A0A2E] rounded-2xl overflow-hidden border border-white/[0.06]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
          </div>
          <div className="flex-1 mx-4 h-7 bg-white/[0.06] rounded-lg flex items-center px-3">
            <span className="text-[11px] text-white/30 font-mono">cubicle.app/dashboard</span>
          </div>
          {/* Video controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
            >
              {isMuted
                ? <VolumeX className="w-3.5 h-3.5 text-white/40" />
                : <Volume2 className="w-3.5 h-3.5 text-white/60" />
              }
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="relative aspect-video cursor-pointer group" onClick={togglePlay}>
          <video
            ref={videoRef}
            src="/videos/support.mp4"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />

          {/* Play/Pause overlay */}
          <AnimatePresence>
            {showOverlay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-[#030014]/90 via-[#030014]/50 to-[#030014]/30 flex flex-col items-center justify-center"
              >
                {/* Play button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-[#6366F1]/30"
                  />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-2xl shadow-[#6366F1]/30">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </motion.div>

                {/* Text below play */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-5 text-[14px] font-semibold text-white/60 flex items-center gap-2"
                >
                  <MousePointerClick className="w-4 h-4" />
                  Watch Cubicle in action
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pause indicator (shows briefly on pause) */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Pause className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
        className="absolute -top-4 -right-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 z-20"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative rounded-full h-1.5 w-1.5 bg-white" />
        </span>
        Platform Demo
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        className="absolute -bottom-4 -left-3 bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-2.5 z-20"
      >
        <div className="w-8 h-8 bg-[#6366F1]/20 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#818CF8]" />
        </div>
        <div>
          <div className="text-white text-[12px] font-bold">AI-Powered</div>
          <div className="text-white/30 text-[10px]">Smart Automation</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Particle stars ── */
function Particles() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      dur: Math.random() * 3 + 2,
    })), []
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.05, 0.5, 0.05] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

/* ── Main Hero ── */
export default function LP1Hero() {
  const [selected, setSelected] = useState<string[]>([])
  const [hoveredChip, setHoveredChip] = useState<string | null>(null)
  const [pulse, setPulse] = useState(false)

  const toggle = (id: string) => {
    setSelected((p) => p.includes(id) ? p.filter((m) => m !== id) : [...p, id])
    setPulse(true)
    setTimeout(() => setPulse(false), 3000)
  }

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#030014]">
      {/* === LAYERED BACKGROUND === */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_50%,rgba(139,92,246,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(59,130,246,0.08),transparent_60%)]" />

      <Particles />

      {/* Aurora rotation */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] opacity-[0.03]"
        style={{
          background: "conic-gradient(from 0deg, transparent, #6366F1, transparent, #8B5CF6, transparent, #3B82F6, transparent)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[10%] w-80 h-80 rounded-full bg-[#6366F1]/[0.07] blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -25, 0], scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[20%] left-[5%] w-96 h-96 rounded-full bg-[#3B82F6]/[0.06] blur-[100px]"
      />

      {/* === CONTENT === */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-32 pb-16">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[13px] font-medium text-white/60">
              Enterprise ERP Platform — Now with AI
            </span>
            <ArrowRight className="w-3 h-3 text-white/30" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-black text-white leading-[1.05] tracking-[-0.04em] mb-6"
          >
            Run your entire
            <br />
            business from{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#60A5FA]">
                one place
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6366F1] via-[#A78BFA] to-[#3B82F6] rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-[clamp(1rem,2vw,1.25rem)] text-white/40 max-w-[620px] mx-auto leading-relaxed mb-10 font-light"
          >
            CRM, HRM, Project Management, Finance, and Helpdesk — unified
            with intelligent automation and real-time analytics.
          </motion.p>

          {/* Module chips with tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-10"
          >
            <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.25em] mb-4">
              Select the modules you need
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {moduleChips.map((mod) => {
                const active = selected.includes(mod.id)
                const hovered = hoveredChip === mod.id
                return (
                  <div key={mod.id} className="relative">
                    <motion.button
                      whileHover={{ scale: 1.06, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggle(mod.id)}
                      onMouseEnter={() => setHoveredChip(mod.id)}
                      onMouseLeave={() => setHoveredChip(null)}
                      className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 border overflow-hidden"
                      style={{
                        borderColor: active ? `${mod.color}60` : "rgba(255,255,255,0.08)",
                        backgroundColor: active ? `${mod.color}15` : "rgba(255,255,255,0.03)",
                        color: active ? mod.color : "rgba(255,255,255,0.5)",
                        boxShadow: active ? `0 0 25px ${mod.color}20` : "none",
                      }}
                    >
                      {active && (
                        <motion.div
                          layoutId="chip-active"
                          className="absolute inset-0 opacity-20 rounded-xl"
                          style={{ background: `radial-gradient(circle at center, ${mod.color}, transparent 70%)` }}
                        />
                      )}
                      <mod.icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{mod.label}</span>
                      {active && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative z-10 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                          style={{ backgroundColor: `${mod.color}30` }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {hovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 text-[10px] text-white/60 font-medium z-30"
                        >
                          {mod.desc}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Selected count */}
            <AnimatePresence>
              {selected.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-[#818CF8] font-medium mt-3"
                >
                  {selected.length} module{selected.length > 1 ? "s" : ""} selected — Get your custom workspace →
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <motion.div animate={pulse ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 1.5, repeat: 1 }}>
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 text-[15px] font-bold text-white rounded-xl overflow-hidden transition-shadow duration-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Zap className="relative z-10 w-4 h-4" />
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <Link
              href="#modules"
              className="inline-flex items-center gap-2 px-7 py-4 text-[15px] font-semibold text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              See how it works
            </Link>
          </motion.div>

          {/* Trust items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mb-4"
          >
            {trustItems.map((t) => (
              <div key={t.text} className="flex items-center gap-2 text-[12px] text-white/25 font-medium">
                <t.icon className="w-3.5 h-3.5 text-white/20" />
                {t.text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Video Showcase ── */}
        <VideoShowcase />

        {/* Stats bar below video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8 sm:gap-14"
        >
          <AnimatedStat value="500+" label="Organizations" delay={1.6} />
          <div className="w-px h-8 bg-white/[0.06]" />
          <AnimatedStat value="50K+" label="Active Users" delay={1.7} />
          <div className="w-px h-8 bg-white/[0.06]" />
          <AnimatedStat value="99.9%" label="Uptime" delay={1.8} />
          <div className="w-px h-8 bg-white/[0.06] hidden sm:block" />
          <div className="hidden sm:block">
            <AnimatedStat value="4.9/5" label="Rating" delay={1.9} />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030014] via-[#030014]/80 to-transparent pointer-events-none" />
    </section>
  )
}
