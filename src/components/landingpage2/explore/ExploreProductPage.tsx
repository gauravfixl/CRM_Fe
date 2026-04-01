"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import LP2Navbar from "../LP2Navbar"
import LP2CTA from "../LP2CTA"
import LP2Footer from "../LP2Footer"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface Benefit {
  title: string
  description: string
}

interface Step {
  step: string
  title: string
  description: string
}

interface FAQ {
  question: string
  answer: string
}

interface UseCase {
  title: string
  description: string
  highlights: string[]
}

export interface ProductPageData {
  name: string
  tagline: string
  description: string
  icon: LucideIcon
  color: string
  lightColor: string
  heroImage?: string
  variant?: 1 | 2 | 3 | 4
  features: Feature[]
  benefits: Benefit[]
  steps: Step[]
  useCases: UseCase[]
  faqs: FAQ[]
  stats: { value: string; label: string }[]
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
}

// Darken color utility
function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount)
  const b = Math.max(0, (num & 0x0000ff) - amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`
}

export default function ExploreProductPage({ data }: { data: ProductPageData }) {
  const v = data.variant || 1
  const Icon = data.icon
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main
      className="relative antialiased bg-white overflow-hidden"
      style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <LP2Navbar />

      {/* ===================== HERO (unified for all variants) ===================== */}
      <section className="relative overflow-hidden pt-28 pb-24">
        {/* Background image */}
        {data.heroImage && (
          <div className="absolute inset-0">
            <Image src={data.heroImage} alt="" fill className="object-cover" priority unoptimized />
          </div>
        )}
        {/* Subtle dark overlay — no product color, just dark for readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,15,30,0.55) 0%, rgba(10,15,30,0.45) 50%, rgba(10,15,30,0.35) 100%)" }} />
        {/* Bottom fade */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)" }} />

        <div className="relative z-[2] max-w-[1200px] mx-auto px-6">
          <div className={`flex flex-col ${v === 2 || v === 4 ? "lg:flex-row items-center gap-14" : ""}`}>
            <motion.div variants={stagger} initial="hidden" animate="visible" className={v === 2 || v === 4 ? "flex-1" : "max-w-3xl"}>
              {/* Badge */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-semibold tracking-wider text-white/80">CubicleERP {data.name}</span>
              </motion.div>

              {/* Tagline */}
              <motion.h1 variants={fadeUp} className="text-4xl lg:text-[3.25rem] font-bold text-white leading-tight" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>{data.tagline}</motion.h1>

              {/* Description */}
              <motion.p variants={fadeUp} className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}>{data.description}</motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
                <Link href="/auth/signup" className="group inline-flex items-center gap-2 bg-white px-7 py-3.5 rounded-lg text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" style={{ color: data.color }}>
                  Start free trial <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center px-7 py-3.5 rounded-lg text-[15px] font-semibold border-2 border-white/50 text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 backdrop-blur-sm">View pricing</Link>
              </motion.div>
            </motion.div>

            {/* Right side stats grid for v2 and v4 */}
            {(v === 2 || v === 4) && (
              <motion.div variants={scaleIn} initial="hidden" animate="visible" className="flex-shrink-0">
                <div className="grid grid-cols-2 gap-4">
                  {data.stats.map((s, i) => (
                    <motion.div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 text-center min-w-[140px]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}>
                      <div className="text-2xl font-bold text-white">{s.value}</div>
                      <div className="text-xs text-white/60 mt-1">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ===================== STATS BAR (v1, v3 only) ===================== */}
      {(v === 1 || v === 3) && (
        <section className="relative border-b border-[#E5E5E5] overflow-hidden" style={{ backgroundColor: v === 1 ? data.lightColor : "#FAFAFA" }}>
          {/* Decorative gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, ${data.color}, ${darken(data.color, 30)}, ${data.color})` }} />
          <div className="max-w-[1200px] mx-auto px-6 py-12">
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              {data.stats.map((stat, i) => (
                <motion.div key={stat.label} variants={fadeUp} className="text-center group">
                  <motion.div className="text-3xl lg:text-4xl font-bold" style={{ color: data.color }} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}>
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-[#737373] mt-1.5 font-medium">{stat.label}</div>
                  <motion.div className="mx-auto mt-3 h-0.5 w-0 rounded-full group-hover:w-12 transition-all duration-500" style={{ backgroundColor: `${data.color}40` }} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ===================== FEATURES ===================== */}
      {v === 1 && (
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: `${data.color}05` }}>
          {/* Decorative background elements */}
          <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: `radial-gradient(circle, ${data.color}, transparent)` }} />
          <div className="absolute bottom-20 left-0 w-[300px] h-[300px] rounded-full opacity-[0.05]" style={{ background: `radial-gradient(circle, ${data.color}, transparent)` }} />
          <div className="max-w-[1200px] mx-auto px-6 relative">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-14">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>
                <Sparkles className="w-3.5 h-3.5" /> Powerful Features
              </motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Everything you need in one place</motion.h2>
              <motion.div variants={fadeUp} className="mx-auto mt-4 h-1 w-16 rounded-full" style={{ backgroundColor: data.color }} />
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              {data.features.map((f, i) => {
                const FIcon = f.icon
                return (
                  <motion.div key={f.title} variants={fadeUp} className="group relative p-7 rounded-2xl border hover:border-transparent transition-all duration-400 hover:-translate-y-2" style={{ backgroundColor: `${data.color}08`, borderColor: `${data.color}20` }} whileHover={{ boxShadow: `0 20px 40px ${data.color}15` }}>
                    <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to right, ${data.color}, ${darken(data.color, 30)})` }} />
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: `linear-gradient(135deg, ${data.color}20, ${data.color}10)` }}>
                      <FIcon className="w-7 h-7" style={{ color: data.color }} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{f.title}</h3>
                    <p className="text-sm text-[#505050] leading-relaxed">{f.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      {v === 2 && (
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: data.lightColor }}>
          <div className="absolute top-0 left-0 w-full h-full opacity-50" style={{ background: `radial-gradient(ellipse at top right, ${data.color}08, transparent 60%)` }} />
          <div className="max-w-[1200px] mx-auto px-6 relative">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-14">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}12` }}>Core Features</motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Built for modern teams</motion.h2>
            </motion.div>
            <div className="space-y-6">
              {data.features.map((f, i) => {
                const FIcon = f.icon
                const isEven = i % 2 === 0
                return (
                  <motion.div key={f.title} variants={isEven ? fadeLeft : fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                    className={`flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50 ${!isEven ? "md:flex-row-reverse" : ""}`}
                    style={{ borderLeft: isEven ? `4px solid ${data.color}` : undefined, borderRight: !isEven ? `4px solid ${data.color}` : undefined }}>
                    <motion.div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-md" style={{ background: `linear-gradient(135deg, ${data.color}, ${darken(data.color, 30)})` }} whileHover={{ scale: 1.1, rotate: 5 }}>
                      <FIcon className="w-9 h-9 text-white" />
                    </motion.div>
                    <div className={`flex-1 ${!isEven ? "md:text-right" : ""}`}>
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{f.title}</h3>
                      <p className="text-[15px] text-[#505050] leading-relaxed">{f.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {v === 3 && (
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: `${data.color}05` }}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.06] rounded-full" style={{ background: `radial-gradient(circle, ${data.color}, transparent)` }} />
          <div className="max-w-[1200px] mx-auto px-6 relative">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-14">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>Features</motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Designed for productivity</motion.h2>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-1 rounded-2xl overflow-hidden" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {data.features.map((f) => {
                const FIcon = f.icon
                return (
                  <motion.div key={f.title} variants={fadeUp} className="group flex items-start gap-4 p-7 hover:bg-gradient-to-br transition-all duration-300 border" style={{ backgroundColor: `${data.color}06`, borderColor: `${data.color}15` }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg" style={{ backgroundColor: `${data.color}18`, color: data.color }}>
                      <FIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-1">{f.title}</h3>
                      <p className="text-sm text-[#505050] leading-relaxed">{f.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      {v === 4 && (
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
          <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: `linear-gradient(to right, transparent, ${data.color}20, transparent)` }} />
          <div className="max-w-[1200px] mx-auto px-6 relative">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center mb-14">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>Key Features</motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Packed with powerful tools</motion.h2>
            </motion.div>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {data.features.map((f) => {
                const FIcon = f.icon
                return (
                  <motion.div key={f.title} variants={scaleIn} className="group relative p-6 rounded-xl border hover:border-transparent transition-all duration-300" style={{ backgroundColor: `${data.color}08`, borderColor: `${data.color}20` }} whileHover={{ y: -6, boxShadow: `0 20px 40px ${data.color}18` }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to right, ${data.color}, ${darken(data.color, 20)})` }} />
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${data.color}25, ${data.color}12)` }} whileHover={{ scale: 1.15 }}>
                        <FIcon className="w-5 h-5" style={{ color: data.color }} />
                      </motion.div>
                      <h3 className="text-[15px] font-bold text-[#1A1A1A]">{f.title}</h3>
                    </div>
                    <p className="text-sm text-[#505050] leading-relaxed pl-[52px]">{f.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* ===================== BENEFITS ===================== */}
      {v === 1 && (
        <section className="py-20 relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${data.lightColor} 0%, ${data.lightColor}40 100%)` }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${data.color}, transparent)` }} />
          <div className="max-w-[1200px] mx-auto px-6 relative">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="text-center mb-14">
                <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}15` }}>Why {data.name}?</motion.span>
                <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Benefits that drive real results</motion.h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.benefits.map((b, i) => (
                  <motion.div key={b.title} variants={fadeUp} className="group p-6 rounded-xl backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 border hover:-translate-y-1" style={{ backgroundColor: `${data.color}10`, borderColor: `${data.color}20` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md" style={{ background: `linear-gradient(135deg, ${data.color}, ${darken(data.color, 25)})` }} whileHover={{ scale: 1.1, rotate: 10 }}>{i + 1}</motion.div>
                      <h3 className="text-[15px] font-bold text-[#1A1A1A]">{b.title}</h3>
                    </div>
                    <p className="text-sm text-[#505050] leading-relaxed">{b.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {v === 2 && (
        <section className="py-20 relative" style={{ backgroundColor: `${data.color}04` }}>
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${data.color}30, transparent)` }} />
          <div className="max-w-[1000px] mx-auto px-6">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="text-center mb-14">
                <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>Benefits</motion.span>
                <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Why choose CubicleERP {data.name}?</motion.h2>
              </div>
              <div className="space-y-4">
                {data.benefits.map((b, i) => (
                  <motion.div key={b.title} variants={fadeUp} className="flex items-start gap-5 p-5 rounded-xl transition-all duration-300 group border hover:shadow-md" style={{ backgroundColor: `${data.color}06`, borderColor: `${data.color}15` }}>
                    <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-md" style={{ backgroundColor: `${data.color}10`, color: data.color }} whileHover={{ rotate: 5 }}>{String(i + 1).padStart(2, "0")}</motion.div>
                    <div className="pt-1">
                      <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-1">{b.title}</h3>
                      <p className="text-sm text-[#505050] leading-relaxed">{b.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {v === 3 && (
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: `${data.color}08` }}>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${data.color}, transparent)` }} />
          <div className="max-w-[1200px] mx-auto px-6 relative">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="text-center mb-14">
                <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}12` }}>Advantages</motion.span>
                <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">The CubicleERP difference</motion.h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.benefits.map((b) => (
                  <motion.div key={b.title} variants={fadeUp} className="group flex gap-4 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border hover:-translate-y-1" style={{ backgroundColor: `${data.color}08`, borderColor: `${data.color}18` }}>
                    <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5 transition-transform group-hover:scale-110" style={{ color: data.color }} />
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-1.5">{b.title}</h3>
                      <p className="text-sm text-[#505050] leading-relaxed">{b.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {v === 4 && (
        <section className="py-20 relative" style={{ backgroundColor: `${data.color}04` }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="flex flex-col lg:flex-row gap-14">
                <motion.div variants={fadeLeft} className="lg:w-[40%]">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>Benefits</span>
                  <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Why teams love {data.name}</h2>
                  <p className="mt-4 text-[#505050] leading-relaxed">Transform how your team works with features designed to drive real, measurable results.</p>
                  <div className="mt-6 h-1 w-16 rounded-full" style={{ background: `linear-gradient(to right, ${data.color}, ${darken(data.color, 20)})` }} />
                </motion.div>
                <div className="lg:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.benefits.map((b, i) => (
                    <motion.div key={b.title} variants={fadeUp} className="group p-5 rounded-xl border hover:border-transparent hover:shadow-xl transition-all duration-300" style={{ backgroundColor: `${data.color}08`, borderColor: `${data.color}20` }} whileHover={{ y: -4 }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-xs font-bold text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${data.color}, ${darken(data.color, 20)})` }}>{i + 1}</div>
                      <h3 className="text-[15px] font-semibold text-[#1A1A1A] mb-1">{b.title}</h3>
                      <p className="text-xs text-[#505050] leading-relaxed">{b.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ===================== HOW IT WORKS ===================== */}
      {(v === 1 || v === 3) && (
        <section className="py-20 relative overflow-hidden" style={{ backgroundColor: v === 1 ? "white" : `${data.color}04` }}>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[200px] h-[400px] opacity-[0.03] rounded-full" style={{ background: `radial-gradient(circle, ${data.color}, transparent)` }} />
          <div className="max-w-[1000px] mx-auto px-6 relative">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="text-center mb-14">
                <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>How It Works</motion.span>
                <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Get started in minutes</motion.h2>
              </div>
              <div className="relative">
                <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[3px] rounded-full" style={{ background: `linear-gradient(to right, ${data.color}30, ${data.color}, ${data.color}30)` }} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {data.steps.map((step) => (
                    <motion.div key={step.title} variants={fadeUp} className="relative text-center group">
                      <motion.div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl font-bold text-white shadow-lg relative z-10 group-hover:shadow-xl" style={{ background: `linear-gradient(135deg, ${data.color}, ${darken(data.color, 25)})` }}
                        whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        {step.step}
                      </motion.div>
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{step.title}</h3>
                      <p className="text-sm text-[#505050] leading-relaxed max-w-xs mx-auto">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {v === 2 && (
        <section className="py-20 relative" style={{ backgroundColor: data.lightColor }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="text-center mb-14">
                <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}12` }}>Getting Started</motion.span>
                <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Three simple steps</motion.h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.steps.map((step) => (
                  <motion.div key={step.title} variants={scaleIn} className="relative p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 text-center border border-white/50 hover:-translate-y-1">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md" style={{ background: `linear-gradient(135deg, ${data.color}, ${darken(data.color, 20)})` }}>{step.step}</div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 mt-3">{step.title}</h3>
                    <p className="text-sm text-[#505050] leading-relaxed">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {v === 4 && (
        <section className="py-20 relative" style={{ background: `linear-gradient(180deg, ${data.lightColor}80 0%, white 100%)` }}>
          <div className="max-w-[800px] mx-auto px-6">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="text-center mb-14">
                <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>Quick Setup</motion.span>
                <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Up and running fast</motion.h2>
              </div>
              <div className="space-y-0">
                {data.steps.map((step, i) => (
                  <motion.div key={step.title} variants={fadeLeft} className="flex gap-6 relative group">
                    <div className="flex flex-col items-center">
                      <motion.div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-lg z-10 group-hover:shadow-xl transition-shadow" style={{ background: `linear-gradient(135deg, ${data.color}, ${darken(data.color, 20)})` }} whileHover={{ scale: 1.1 }}>{step.step}</motion.div>
                      {i < data.steps.length - 1 && <div className="w-0.5 flex-1 my-2" style={{ background: `linear-gradient(to bottom, ${data.color}40, ${data.color}10)` }} />}
                    </div>
                    <div className="pb-10">
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{step.title}</h3>
                      <p className="text-sm text-[#505050] leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ===================== USE CASES ===================== */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: v === 2 ? `${data.color}04` : v === 4 ? `${data.color}05` : v === 1 ? `${data.color}06` : `${data.color}05` }}>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${data.color}20, transparent)` }} />
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <div className="text-center mb-14">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>Use Cases</motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl lg:text-4xl font-bold text-[#1A1A1A]">Built for every team</motion.h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {data.useCases.map((uc) => (
                <motion.div key={uc.title} variants={fadeUp} className="group p-7 rounded-2xl border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden" style={{ backgroundColor: `${data.color}06`, borderColor: `${data.color}18` }} whileHover={{ boxShadow: `0 20px 40px ${data.color}12` }}>
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${data.color}, ${darken(data.color, 30)})` }} />
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{uc.title}</h3>
                  <p className="text-sm text-[#505050] leading-relaxed mb-5">{uc.description}</p>
                  <ul className="space-y-2.5">
                    {uc.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-[#505050]">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: data.color }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== FAQs ===================== */}
      <section className="py-20 relative" style={{ backgroundColor: v === 1 ? data.lightColor : `${data.color}04` }}>
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <div className="text-center mb-14">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ color: data.color, backgroundColor: `${data.color}10` }}>FAQs</motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl font-bold text-[#1A1A1A]">Common questions</motion.h2>
            </div>
            <div className="space-y-3">
              {data.faqs.map((faq, i) => (
                <motion.div key={faq.question} variants={fadeUp} className="rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-md" style={openFaq === i ? { borderColor: `${data.color}40`, boxShadow: `0 4px 20px ${data.color}10`, backgroundColor: `${data.color}08` } : { borderColor: `${data.color}15`, backgroundColor: `${data.color}05` }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="text-[15px] font-semibold text-[#1A1A1A] pr-4">{faq.question}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="w-5 h-5 shrink-0" style={{ color: data.color }} />
                    </motion.div>
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-[#505050] leading-relaxed">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-20 relative overflow-hidden">
        {/* Background image for CTA */}
        {data.heroImage && (
          <div className="absolute inset-0">
            <Image src={data.heroImage} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,15,30,0.6) 0%, rgba(10,15,30,0.5) 100%)" }} />
        <div className="relative max-w-[800px] mx-auto px-6 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>Ready to transform your {data.name.toLowerCase()}?</motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-white/80 max-w-xl mx-auto">Join thousands of businesses using CubicleERP {data.name} to streamline operations and drive growth.</motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/auth/signup" className="group inline-flex items-center gap-2 bg-white px-8 py-3.5 rounded-lg text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl" style={{ color: data.color }}>
                Start free trial <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="inline-flex items-center px-8 py-3.5 rounded-lg text-[15px] font-semibold border-2 border-white/40 text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 backdrop-blur-sm">Contact sales</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <LP2CTA />
      <LP2Footer />
    </main>
  )
}
