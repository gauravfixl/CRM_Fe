"use client"

import { motion } from "framer-motion"
import { Zap, Sparkles, GitBranch, UserPlus, Mail, Bell, ArrowDown, CheckCircle2 } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const steps = [
  {
    icon: Zap,
    color: "#107C10",
    bg: "#E8F5E9",
    title: "When a new lead is created",
    type: "Trigger",
    annotation: "Set the event that kicks off the workflow",
    side: "right" as const,
  },
  {
    icon: Sparkles,
    color: "#5C2D91",
    bg: "#F3EBF9",
    title: "AI scores and qualifies the lead",
    type: "AI Action",
    annotation: "Let AI run the logic, conditions and what needs to happen next",
    side: "left" as const,
  },
  {
    icon: GitBranch,
    color: "#0067B8",
    bg: "#EBF3FB",
    title: "Check qualification status",
    type: "Condition",
    annotation: "Route the workflow based on conditions",
    side: "right" as const,
  },
]

const branches = {
  yes: {
    icon: UserPlus,
    color: "#0067B8",
    bg: "#EBF3FB",
    title: "Assign to sales rep & create deal",
    label: "Qualified",
  },
  no: {
    icon: Mail,
    color: "#D83B01",
    bg: "#FFF0E8",
    title: "Add to nurture email campaign",
    label: "Not Qualified",
  },
}

const finalStep = {
  icon: Bell,
  color: "#008575",
  bg: "#E0F2F1",
  title: "Notify team via Slack & Email",
  type: "Notification",
  annotation: "Keep everyone aligned with conditional notifications",
}

function StepCard({
  icon: Icon,
  color,
  bg,
  title,
  type,
  delay,
  isVisible,
  index,
}: {
  icon: typeof Zap
  color: string
  bg: string
  title: string
  type: string
  delay: number
  isVisible: boolean
  index: number
}) {
  return (
    <motion.div
      className="relative bg-white rounded-2xl border-2 shadow-sm px-6 py-5 flex items-center gap-4 max-w-md group cursor-default"
      style={{ borderColor: color + "30" }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, boxShadow: `0 12px 30px ${color}20`, borderColor: color + "50" }}
    >
      {/* Step number badge */}
      <motion.div
        className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md z-10"
        style={{ backgroundColor: color }}
        initial={{ scale: 0 }}
        animate={isVisible ? { scale: 1 } : {}}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 400, damping: 15 }}
      >
        {index}
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at center, ${color}08, transparent)` }}
      />

      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative"
        style={{ backgroundColor: bg }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon size={22} style={{ color }} />
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ border: `2px solid ${color}` }}
          initial={{ opacity: 0, scale: 1 }}
          animate={isVisible ? { opacity: [0, 0.4, 0], scale: [1, 1.4, 1.4] } : {}}
          transition={{ delay: delay + 0.3, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
        />
      </motion.div>

      <div className="relative">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
          {type}
        </span>
        <p className="text-[15px] text-[#1A1A1A] font-semibold mt-0.5">{title}</p>
      </div>
    </motion.div>
  )
}

function AnimatedConnector({ isVisible, delay, color = "#0067B8" }: { isVisible: boolean; delay: number; color?: string }) {
  return (
    <div className="flex justify-center py-2">
      <div className="relative flex flex-col items-center">
        {/* Animated line */}
        <motion.div
          className="w-0.5 h-12 rounded-full"
          style={{ backgroundColor: color + "30" }}
          initial={{ scaleY: 0 }}
          animate={isVisible ? { scaleY: 1 } : {}}
          transition={{ duration: 0.4, delay }}
        />
        {/* Animated dot traveling down */}
        <motion.div
          className="absolute top-0 w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0, y: 0 }}
          animate={isVisible ? { opacity: [0, 1, 1, 0], y: [0, 20, 40, 48] } : {}}
          transition={{ delay: delay + 0.3, duration: 1, repeat: Infinity, repeatDelay: 4 }}
        />
        {/* Arrow at bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 300 }}
        >
          <ArrowDown size={14} style={{ color: color + "60" }} />
        </motion.div>
      </div>
    </div>
  )
}

function AnnotationLabel({
  text,
  color,
  side,
  delay,
  isVisible,
}: {
  text: string
  color: string
  side: "left" | "right"
  delay: number
  isVisible: boolean
}) {
  return (
    <motion.div
      className={`hidden lg:flex items-center gap-3 ${side === "left" ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="w-16 h-px"
        style={{ backgroundColor: color + "40" }}
        initial={{ scaleX: 0 }}
        animate={isVisible ? { scaleX: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
      />
      <p className={`text-xs text-[#6B6B6B] max-w-[200px] leading-relaxed ${side === "left" ? "text-right" : "text-left"}`}>
        {text}
      </p>
    </motion.div>
  )
}

export default function LP2Workflow() {
  const [ref, isVisible] = useIntersection("-80px")

  return (
    <section id="automation" className="relative py-24 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #F0F4F8 0%, #E8EDF3 50%, #F0F4F8 100%)" }} />

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green-500/[0.03] blur-[120px]" />
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div ref={ref as any} className="relative max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-[#0067B8]"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] font-black text-[#0067B8] tracking-[0.2em] uppercase">
              Automation
            </span>
          </motion.div>

          <h2 className="text-[32px] lg:text-[44px] font-bold text-[#1A1A1A] leading-tight">
            Automate workflows that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
              run end to end
            </span>
          </h2>
          <p className="mt-5 text-[#505050] text-lg max-w-2xl mx-auto leading-relaxed">
            Visually build, automate, and manage complex cross-functional processes with AI — no coding required.
          </p>
        </motion.div>

        {/* Workflow visualization - Zigzag Layout */}
        <div className="max-w-6xl mx-auto">

          {/* Step 1: Trigger - Right Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-4">
            <div className="lg:text-right order-2 lg:order-1">
              <AnnotationLabel text={steps[0].annotation} color={steps[0].color} side="left" delay={0.3} isVisible={isVisible} />
            </div>
            <div className="order-1 lg:order-2">
              <StepCard {...steps[0]} type={steps[0].type} delay={0.15} isVisible={isVisible} index={1} />
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center -my-2 relative z-10">
            <div className="relative">
              <AnimatedConnector isVisible={isVisible} delay={0.4} color="#107C10" />
              {/* Floating particle */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-green-400"
                initial={{ opacity: 0, x: -8, y: 0 }}
                animate={isVisible ? {
                  opacity: [0, 1, 1, 0],
                  x: [-8, -4, 4, 8],
                  y: [0, 8, 16, 24]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </div>
          </div>

          {/* Step 2: AI Action - Left Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-4">
            <div className="order-1">
              <StepCard {...steps[1]} type={steps[1].type} delay={0.5} isVisible={isVisible} index={2} />
            </div>
            <div className="lg:text-left order-2">
              <AnnotationLabel text={steps[1].annotation} color={steps[1].color} side="right" delay={0.6} isVisible={isVisible} />
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center -my-2 relative z-10">
            <div className="relative">
              <AnimatedConnector isVisible={isVisible} delay={0.7} color="#5C2D91" />
              {/* Floating particle */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-purple-400"
                initial={{ opacity: 0, x: 8, y: 0 }}
                animate={isVisible ? {
                  opacity: [0, 1, 1, 0],
                  x: [8, 4, -4, -8],
                  y: [0, 8, 16, 24]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2 }}
              />
            </div>
          </div>

          {/* Step 3: Condition - Right Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-4">
            <div className="lg:text-right order-2 lg:order-1">
              <AnnotationLabel text={steps[2].annotation} color={steps[2].color} side="left" delay={0.85} isVisible={isVisible} />
            </div>
            <div className="order-1 lg:order-2">
              <StepCard {...steps[2]} type={steps[2].type} delay={0.75} isVisible={isVisible} index={3} />
            </div>
          </div>

          {/* Branch connector - Center */}
          <div className="flex justify-center py-2">
            <motion.div
              className="relative w-0.5 h-10 rounded-full bg-[#0067B8]/20"
              initial={{ scaleY: 0 }}
              animate={isVisible ? { scaleY: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              {/* Branching indicator with pulse */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#0067B8] flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : {}}
                transition={{ delay: 1.0, type: "spring", stiffness: 300 }}
              >
                <GitBranch size={11} className="text-white" />
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#0067B8]"
                  animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Yes / No branches - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            {/* Yes branch - Left */}
            <motion.div
              className="flex flex-col items-center lg:items-end"
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.95 }}
            >
              <motion.span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#107C10] border border-[#107C10]/20 mb-3"
                whileHover={{ scale: 1.05 }}
                animate={isVisible ? {
                  boxShadow: ["0 0 0 0 rgba(16,124,16,0)", "0 0 0 8px rgba(16,124,16,0.1)", "0 0 0 0 rgba(16,124,16,0)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <CheckCircle2 size={12} />
                Yes — Qualified
              </motion.span>
              <motion.div
                className="w-0.5 h-8 rounded-full bg-[#107C10]/20 mb-3"
                initial={{ scaleY: 0 }}
                animate={isVisible ? { scaleY: 1 } : {}}
                transition={{ delay: 1.0 }}
              />
              <motion.div
                className="bg-white rounded-2xl border-2 border-[#107C10]/20 shadow-sm px-6 py-5 flex items-center gap-4 w-full max-w-md group cursor-default"
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(16,124,16,0.12)", borderColor: "#107C10" + "50" }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: branches.yes.bg }}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <branches.yes.icon size={22} style={{ color: branches.yes.color }} />
                </motion.div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#107C10]">Action</span>
                  <p className="text-[15px] text-[#1A1A1A] font-semibold mt-0.5">{branches.yes.title}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* No branch - Right */}
            <motion.div
              className="flex flex-col items-center lg:items-start"
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.05 }}
            >
              <motion.span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FFF0E8] text-[#D83B01] border border-[#D83B01]/20 mb-3"
                whileHover={{ scale: 1.05 }}
                animate={isVisible ? {
                  boxShadow: ["0 0 0 0 rgba(216,59,1,0)", "0 0 0 8px rgba(216,59,1,0.1)", "0 0 0 0 rgba(216,59,1,0)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5 }}
              >
                No — Not Qualified
              </motion.span>
              <motion.div
                className="w-0.5 h-8 rounded-full bg-[#D83B01]/20 mb-3"
                initial={{ scaleY: 0 }}
                animate={isVisible ? { scaleY: 1 } : {}}
                transition={{ delay: 1.1 }}
              />
              <motion.div
                className="bg-white rounded-2xl border-2 border-[#D83B01]/20 shadow-sm px-6 py-5 flex items-center gap-4 w-full max-w-md group cursor-default"
                whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(216,59,1,0.12)", borderColor: "#D83B01" + "50" }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: branches.no.bg }}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <branches.no.icon size={22} style={{ color: branches.no.color }} />
                </motion.div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D83B01]">Nurture</span>
                  <p className="text-[15px] text-[#1A1A1A] font-semibold mt-0.5">{branches.no.title}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Merge connector - Simplified */}
          <div className="flex justify-center py-2">
            <motion.div
              className="w-0.5 h-8 rounded-full bg-[#008575]/20"
              initial={{ scaleY: 0 }}
              animate={isVisible ? { scaleY: 1 } : {}}
              transition={{ delay: 1.15 }}
            />
          </div>

          {/* Final step: Notification - Left Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="order-1">
              <StepCard {...finalStep} type={finalStep.type} delay={1.2} isVisible={isVisible} index={4} />
            </div>
            <div className="lg:text-left order-2">
              <AnnotationLabel text={finalStep.annotation} color={finalStep.color} side="right" delay={1.3} isVisible={isVisible} />
            </div>
          </div>

          {/* Completion badge */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm relative overflow-hidden"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(16,124,16,0.1)" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 1.6, repeat: Infinity, repeatDelay: 5 }}
                className="relative z-10"
              >
                <CheckCircle2 size={18} className="text-green-600" />
              </motion.div>
              <span className="text-sm font-bold text-green-700 relative z-10">Workflow Complete</span>
              <span className="text-xs text-green-500 relative z-10">— Fully automated</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
