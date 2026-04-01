"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Shield,
  BookOpen,
  TrendingUp,
  BarChart3,
  Lock,
  Brain,
  Users,
  Zap,
  Target,
  FileText,
} from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

const newsCards = [
  {
    tag: "Product Update",
    tagColor: "bg-blue-500",
    title: "Introducing AI-Powered Lead Scoring",
    description:
      "Cubicle now uses machine learning to automatically score and prioritize your leads based on engagement patterns.",
    cta: "Learn more",
    href: "/news/ai-powered-lead-scoring",
    gradient: "from-[#0067B8] via-[#0078D4] to-[#2B88D8]",
    overlayIcons: [Brain, Target, TrendingUp],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80",
    date: "Mar 28, 2026",
  },
  {
    tag: "Case Study",
    tagColor: "bg-emerald-500",
    title: "How Agencies Use Cubicle to Scale Operations",
    description:
      "Discover how digital agencies manage clients, projects, and teams using our all-in-one platform.",
    cta: "Read the blog",
    href: "/news/agencies-scale-operations",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    overlayIcons: [Users, BarChart3, Zap],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&q=80",
    date: "Mar 22, 2026",
  },
  {
    tag: "Security",
    tagColor: "bg-purple-500",
    title: "Enterprise Security Features Now Available",
    description:
      "SOC2 compliance, advanced RBAC, and comprehensive audit logs — enterprise-grade security for every plan.",
    cta: "Learn more",
    href: "/news/enterprise-security-features",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    overlayIcons: [Shield, Lock, FileText],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop&q=80",
    date: "Mar 15, 2026",
  },
  {
    tag: "Guide",
    tagColor: "bg-amber-500",
    title: "Cubicle vs Traditional CRM: A Complete Guide",
    description:
      "Why modern businesses are choosing unified ERP platforms over standalone CRM tools.",
    cta: "Read the guide",
    href: "/news/cubicle-vs-traditional-crm",
    gradient: "from-amber-500 via-orange-500 to-red-400",
    overlayIcons: [BookOpen, Sparkles, Building2],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80",
    date: "Mar 10, 2026",
  },
]

export default function LP2FeaturedNews() {
  const [sectionRef, inView] = useIntersection("-100px")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)

    // Calculate active card index
    const cardWidth = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? 360
    const gap = 24
    const index = Math.round(el.scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(index, newsCards.length - 1))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth =
      el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? 360
    const gap = 24
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    })
  }

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth =
      el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? 360
    const gap = 24
    el.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    })
  }

  return (
    <section id="featured-news" className="relative bg-gradient-to-b from-[#FAFBFC] to-white py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#0067B8]/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div ref={sectionRef} className="relative max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="h-px w-8 bg-[#0067B8]" />
              <span className="text-xs tracking-[0.2em] text-[#0067B8] font-semibold uppercase">
                Featured News
              </span>
            </motion.div>
            <h2 className="text-3xl lg:text-[2.75rem] font-bold text-[#1A1A1A] leading-tight">
              What&apos;s new and{" "}
              <span className="bg-gradient-to-r from-[#0067B8] to-[#5C2D91] bg-clip-text text-transparent">
                notable
              </span>
            </h2>
            <p className="text-[#6B7280] text-[15px] mt-3 max-w-lg">
              Stay updated with the latest product releases, insights, and stories from CubicleERP.
            </p>
          </div>

          {/* Navigation arrows - desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous"
              className="w-11 h-11 rounded-full border border-[#E5E7EB] flex items-center justify-center transition-all hover:bg-[#0067B8] hover:border-[#0067B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#E5E7EB] disabled:hover:text-[#1A1A1A] text-[#1A1A1A]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next"
              className="w-11 h-11 rounded-full border border-[#E5E7EB] flex items-center justify-center transition-all hover:bg-[#0067B8] hover:border-[#0067B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#E5E7EB] disabled:hover:text-[#1A1A1A] text-[#1A1A1A]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Cards Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {newsCards.map((card, i) => (
            <Link key={card.tag} href={card.href} className="min-w-[300px] w-[calc(33.333%-12px)] max-w-[420px] flex-shrink-0 snap-start">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={
                inView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : {}
              }
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="h-full bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500 border border-[#F0F0F0] hover:border-[#0067B8]/20"
            >
              {/* Image section */}
              <div className="relative h-[220px] overflow-hidden">
                {/* Real image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-70 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-50`} />

                {/* Dark bottom gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating icons */}
                <AnimatePresence>
                  {hoveredIndex === i && card.overlayIcons.map((Icon, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.08 }}
                      className="absolute w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      style={{
                        top: `${30 + idx * 25}%`,
                        right: `${10 + idx * 15}%`,
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Tag badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full ${card.tagColor} text-white shadow-lg`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                    {card.tag}
                  </span>
                </div>

                {/* Date */}
                <div className="absolute bottom-4 left-4">
                  <span className="text-[11px] text-white/90 font-medium">
                    {card.date}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-[17px] font-bold text-[#1A1A1A] leading-snug group-hover:text-[#0067B8] transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-[13.5px] text-[#6B7280] mt-3 leading-relaxed line-clamp-2">
                  {card.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#F3F4F6]">
                  <motion.span
                    className="w-9 h-9 rounded-full bg-[#0067B8] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0067B8]/25"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </motion.span>
                  <span className="text-[#1A1A1A] font-semibold text-[14px] group-hover:text-[#0067B8] transition-colors">
                    {card.cta}
                  </span>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>

        {/* Progress dots + mobile arrows */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {newsCards.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative group/dot"
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-8 bg-[#0067B8]"
                      : "w-2 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Mobile arrows */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous"
              className="w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center transition-all hover:bg-[#0067B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[#1A1A1A]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next"
              className="w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center transition-all hover:bg-[#0067B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[#1A1A1A]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
