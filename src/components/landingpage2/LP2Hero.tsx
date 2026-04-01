"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import {
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  HeadphonesIcon,
  BarChart3,
  Play,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

const heroBackgrounds = [
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80",
    alt: "Modern office workspace with team collaboration",
  },
  {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80",
    alt: "Team working on business analytics dashboard",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
    alt: "Business data analytics and charts on screen",
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80",
    alt: "Professional business meeting with digital tools",
  },
]

const modules = [
  { icon: Users, label: "CRM", color: "#0078D4", angle: 0 },
  { icon: UserCheck, label: "HRM", color: "#107C10", angle: 60 },
  { icon: Briefcase, label: "Projects", color: "#5C2D91", angle: 120 },
  { icon: DollarSign, label: "Finance", color: "#D83B01", angle: 180 },
  { icon: HeadphonesIcon, label: "Helpdesk", color: "#008575", angle: 240 },
  { icon: BarChart3, label: "Analytics", color: "#C30052", angle: 300 },
]

const rotatingWords = ["CRM", "HRM", "Finance", "Projects", "Helpdesk", "Analytics"]

const features = [
  "AI-powered automation",
  "Real-time analytics",
  "Seamless integrations",
  "Enterprise-grade security",
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 },
  },
}

export default function LP2Hero() {
  const radius = 150
  const [displayText, setDisplayText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  const typeSpeed = 100
  const deleteSpeed = 60
  const pauseAfterType = 1800
  const pauseAfterDelete = 300

  // Background image slideshow - change every 5 seconds
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length)
    }, 5000)
    return () => clearInterval(bgTimer)
  }, [])

  const tick = useCallback(() => {
    const currentWord = rotatingWords[currentWordIndex]

    if (!isDeleting) {
      // Typing
      const next = currentWord.slice(0, displayText.length + 1)
      setDisplayText(next)
      if (next === currentWord) {
        // Finished typing — pause then start deleting
        setTimeout(() => setIsDeleting(true), pauseAfterType)
        return
      }
    } else {
      // Deleting
      const next = currentWord.slice(0, displayText.length - 1)
      setDisplayText(next)
      if (next === "") {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
        // Small pause before typing next word
        setTimeout(() => {}, pauseAfterDelete)
        return
      }
    }
  }, [displayText, currentWordIndex, isDeleting])

  useEffect(() => {
    const delay = isDeleting ? deleteSpeed : typeSpeed
    const timer = setTimeout(tick, delay)
    return () => clearTimeout(timer)
  }, [tick, isDeleting])

  return (
    <section
      className="relative overflow-hidden pt-32 pb-28"
      style={{
        background:
          "linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 25%, #E8F5E9 50%, #FFF8E1 75%, #FFF3E0 100%)",
      }}
    >
      {/* Sliding background images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentBgIndex}
            className="absolute inset-0"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Image
              src={heroBackgrounds[currentBgIndex].src}
              alt={heroBackgrounds[currentBgIndex].alt}
              fill
              className="object-cover"
              priority={currentBgIndex === 0}
              sizes="100vw"
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft dark overlay for contrast and depth */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.4) 40%, rgba(15,23,42,0.25) 65%, rgba(15,23,42,0.15) 100%)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(15,23,42,0.3) 0%, transparent 25%)",
          }}
        />
      </div>

      <div className="relative z-[3] max-w-[1320px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10">
          {/* Left Content — 55% */}
          <motion.div
            className="w-full lg:w-[55%] flex-shrink-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Cubicle ERP Platform
              </span>
            </motion.div>

            {/* Main heading with rotating word */}
            <motion.div variants={itemVariants} className="mt-6">
              <h1
                className="text-[2.75rem] lg:text-[3.5rem] xl:text-[3.75rem] font-bold text-white leading-[1.15] tracking-tight"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
              >
                The new era of
                <br />
                <span className="bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#818CF8] bg-clip-text text-transparent">
                  AI&#8209;powered
                </span>{" "}
                business
              </h1>
            </motion.div>

            {/* Typewriter rotating text */}
            <motion.div variants={itemVariants} className="mt-4 h-9 flex items-center gap-2">
              <span className="text-lg text-white/80 font-medium" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>Built for</span>
              <span
                className="text-lg font-bold min-w-[6ch]"
                style={{ color: modules[currentWordIndex % modules.length].color, filter: "brightness(1.3)", textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
              >
                {displayText}
                <motion.span
                  className="inline-block w-[2px] h-5 ml-0.5 align-middle rounded-full"
                  style={{ backgroundColor: modules[currentWordIndex % modules.length].color }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              </span>
              <span className="text-lg text-white/80 font-medium" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>and beyond</span>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-5 text-lg text-white/75 max-w-xl leading-relaxed"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
            >
              Adapt and innovate with intelligent CRM, HRM, and ERP business
              applications&nbsp;&mdash; all in one unified platform that scales with
              your&nbsp;ambition.
            </motion.p>

            {/* Feature pills */}
            <motion.div variants={itemVariants} className="mt-6 flex flex-wrap gap-2.5">
              {features.map((feature, i) => (
                <motion.span
                  key={feature}
                  className="inline-flex items-center gap-1.5 text-sm text-white/90 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {feature}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/pricing"
                className="group inline-flex items-center justify-center gap-2 bg-[#0067B8] text-white px-7 py-3.5 rounded-lg text-[15px] font-semibold transition-all duration-300 hover:bg-[#005DA6] hover:shadow-lg hover:shadow-[#0067B8]/25 hover:-translate-y-0.5"
              >
                See plans and pricing
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center border-2 border-white/70 text-white px-7 py-3.5 rounded-lg text-[15px] font-semibold transition-all duration-300 hover:bg-white hover:text-[#1A1A1A] hover:-translate-y-0.5"
              >
                Try for free
              </Link>
            </motion.div>

          </motion.div>

          {/* Right Content — 45% Platform Visualization */}
          <motion.div
            className="w-full lg:w-[45%] flex items-center justify-center"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="relative w-[380px] h-[380px] sm:w-[440px] sm:h-[440px]">
              {/* Glow effect behind the visualization */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#0067B8]/8 blur-3xl" />

              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 440 440"
                  fill="none"
                >
                  <circle
                    cx="220"
                    cy="220"
                    r="210"
                    stroke="url(#outerGrad)"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                    fill="none"
                    opacity={0.3}
                  />
                  <defs>
                    <linearGradient id="outerGrad" x1="0" y1="0" x2="440" y2="440">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Connecting arcs via SVG */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 440 440"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="220"
                  cy="220"
                  r={radius}
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  fill="none"
                  opacity={0.5}
                />
                {/* Animated pulse ring */}
                <motion.circle
                  cx="220"
                  cy="220"
                  r={radius}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ opacity: 0.5, r: radius - 5 }}
                  animate={{ opacity: [0.4, 0, 0.4], r: [radius - 5, radius + 20, radius - 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Lines from center to each module */}
                {modules.map((mod, i) => {
                  const angleRad = (mod.angle - 90) * (Math.PI / 180)
                  const x = 220 + radius * Math.cos(angleRad)
                  const y = 220 + radius * Math.sin(angleRad)
                  return (
                    <motion.line
                      key={i}
                      x1="220"
                      y1="220"
                      x2={x}
                      y2={y}
                      stroke={mod.color}
                      strokeWidth="1"
                      strokeDasharray="4 3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4,
                      }}
                    />
                  )
                })}
              </svg>

              {/* Center circle with pulse */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                {/* Pulse rings */}
                <motion.div
                  className="absolute -inset-4 rounded-full border-2 border-white/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -inset-8 rounded-full border border-white/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <div className="w-[130px] h-[130px] rounded-full bg-white shadow-xl border border-white/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <motion.img
                    src="/images/cubicleweb.png"
                    alt="Cubicle ERP Logo"
                    className="w-14 h-14 object-contain"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="text-[10px] text-[#505050] font-semibold text-center leading-tight px-2">
                    Across one
                    <br />
                    connected platform
                  </span>
                </div>
              </div>

              {/* Module icons with enhanced animations */}
              {modules.map((mod, i) => {
                const angleRad = (mod.angle - 90) * (Math.PI / 180)
                const x = radius * Math.cos(angleRad)
                const y = radius * Math.sin(angleRad)
                const Icon = mod.icon

                return (
                  <motion.div
                    key={mod.label}
                    className="absolute top-1/2 left-1/2 z-10"
                    style={{
                      x: x - 28,
                      y: y - 28,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: [y - 28, y - 36, y - 28],
                    }}
                    transition={{
                      opacity: { duration: 0.5, delay: 0.8 + i * 0.15 },
                      scale: { duration: 0.5, delay: 0.8 + i * 0.15, type: "spring", stiffness: 200 },
                      y: { duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 },
                    }}
                  >
                    <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                      <div
                        className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                        style={{ backgroundColor: mod.color }}
                      >
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                        {/* Subtle glow */}
                        <div
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md"
                          style={{ backgroundColor: mod.color }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-white whitespace-nowrap" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                        {mod.label}
                      </span>
                    </div>
                  </motion.div>
                )
              })}

              {/* Small floating particles around the visualization */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: modules[i].color,
                    top: `${20 + i * 12}%`,
                    left: `${10 + i * 15}%`,
                    opacity: 0.4,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    x: [0, 8, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.7,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
