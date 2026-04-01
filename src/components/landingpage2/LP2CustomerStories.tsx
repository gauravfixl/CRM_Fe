"use client"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Users, UserCheck, Briefcase, DollarSign, Quote, Star, ArrowRight } from "lucide-react"
import { useIntersection } from "./hooks/useIntersection"

interface Story {
  company: string
  initials: string
  logoColor: string
  logoBg: string
  quote: string
  author: string
  role: string
  stat: string
  statLabel: string
  products: { name: string; icon: React.ReactNode }[]
  image: string
}

const stories: Story[] = [
  {
    company: "Acme Corp",
    initials: "AC",
    logoColor: "#0078D4",
    logoBg: "#E3F2FD",
    quote:
      "With Cubicle, our total cost of ownership went down by as much as 40 percent compared to our previous CRM solution.",
    author: "Sarah Mitchell",
    role: "CEO, Acme Corp",
    stat: "40%",
    statLabel: "Reduction in cost",
    products: [
      { name: "Cubicle CRM", icon: <Users className="w-3.5 h-3.5" /> },
      { name: "Cubicle Finance", icon: <DollarSign className="w-3.5 h-3.5" /> },
    ],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  },
  {
    company: "TechStart Inc",
    initials: "TS",
    logoColor: "#107C10",
    logoBg: "#E8F5E9",
    quote:
      "Having CRM, HR, and finance all in one platform is a game changer. We eliminated 4 separate tools and saved $2,000 per month.",
    author: "James Rodriguez",
    role: "Ops Director, TechStart Inc",
    stat: "$24K",
    statLabel: "Annual savings",
    products: [
      { name: "Cubicle CRM", icon: <Users className="w-3.5 h-3.5" /> },
      { name: "Cubicle HRM", icon: <UserCheck className="w-3.5 h-3.5" /> },
      { name: "Cubicle Finance", icon: <DollarSign className="w-3.5 h-3.5" /> },
    ],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
  },
  {
    company: "InnovateCo",
    initials: "IC",
    logoColor: "#5C2D91",
    logoBg: "#F3EBF9",
    quote:
      "The multi-org management feature is incredible. I oversee three companies from one dashboard with full security.",
    author: "Priya Sharma",
    role: "Founder, InnovateCo",
    stat: "3x",
    statLabel: "Operational efficiency",
    products: [
      { name: "Cubicle CRM", icon: <Users className="w-3.5 h-3.5" /> },
      { name: "Cubicle Projects", icon: <Briefcase className="w-3.5 h-3.5" /> },
    ],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
  },
  {
    company: "GlobalTrade",
    initials: "GT",
    logoColor: "#D83B01",
    logoBg: "#FFF0E8",
    quote:
      "Payroll processing used to take us 3 days. With Cubicle\u2019s HR module, it\u2019s done in under 2 hours.",
    author: "Aisha Patel",
    role: "HR Manager, GlobalTrade",
    stat: "95%",
    statLabel: "Faster payroll",
    products: [
      { name: "Cubicle HRM", icon: <UserCheck className="w-3.5 h-3.5" /> },
    ],
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
  },
]

const slideVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
}

export default function LP2CustomerStories() {
  const [sectionRef, inView] = useIntersection("-100px")
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const total = stories.length

  const goTo = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  // Auto-play: move right to left every 5 seconds
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  const story = stories[current]

  return (
    <section
      id="customer-stories"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAFBFD 0%, #F0F4F8 50%, #FAFBFD 100%)" }} />

      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Star size={12} className="text-[#0067B8] fill-[#0067B8]" />
              <span className="text-[10px] font-black text-[#0067B8] tracking-[0.2em] uppercase">
                Customer Stories
              </span>
            </motion.div>

            <h2 className="text-3xl lg:text-[2.75rem] font-bold text-[#1A1A1A] leading-tight">
              How customers{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600">
                innovate with Cubicle
              </span>
            </h2>
          </div>

          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0067B8] text-white font-semibold text-sm hover:bg-[#005DA6] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group shrink-0 self-start md:self-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Explore all stories
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center"
            >
              {/* Left column - Content */}
              <div className="flex flex-col justify-center order-2 lg:order-1">
                {/* Company badge */}
                <motion.div
                  className="inline-flex items-center gap-3 mb-8 self-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm"
                    style={{ backgroundColor: story.logoBg, color: story.logoColor }}
                  >
                    {story.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">{story.company}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={10} className="fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Quote */}
                <div className="relative">
                  <Quote size={32} className="absolute -top-2 -left-2 opacity-10" style={{ color: story.logoColor }} />
                  <motion.p
                    className="text-xl lg:text-[1.65rem] font-semibold text-[#1A1A1A] leading-relaxed pl-6"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    &ldquo;{story.quote}&rdquo;
                  </motion.p>
                </div>

                {/* Author */}
                <motion.p
                  className="text-sm text-[#6B6B6B] mt-5 pl-6 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  — {story.author}, {story.role}
                </motion.p>

                {/* Stat + Products row */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-6 mt-8 pl-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {/* Stat card */}
                  <div
                    className="flex items-center gap-4 px-5 py-4 rounded-xl border"
                    style={{ borderColor: story.logoColor + "25", backgroundColor: story.logoBg + "80" }}
                  >
                    <motion.p
                      className="text-3xl font-black"
                      style={{ color: story.logoColor }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                      {story.stat}
                    </motion.p>
                    <p className="text-sm text-[#505050] font-medium leading-tight">{story.statLabel}</p>
                  </div>

                  {/* Products */}
                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">Products used</p>
                    <div className="flex flex-wrap gap-2">
                      {story.products.map((product) => (
                        <span
                          key={product.name}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                          style={{ borderColor: story.logoColor + "25", color: story.logoColor, backgroundColor: story.logoBg }}
                        >
                          <span className="w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: story.logoColor }}>
                            {product.icon}
                          </span>
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right column - Image */}
              <motion.div
                className="flex items-center justify-center order-1 lg:order-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <div className="relative w-full max-w-[500px] group">
                  {/* Decorative ring */}
                  <motion.div
                    className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${story.logoColor}15, transparent, ${story.logoColor}10)` }}
                  />

                  {/* Top accent */}
                  <div className="absolute -top-1 left-8 right-8 h-1 rounded-full z-10" style={{ backgroundColor: story.logoColor }} />

                  {/* Image card */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500 border border-[#E5E5E5]">
                    <div className="aspect-[4/3] relative">
                      <img
                        src={story.image}
                        alt={story.author}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Floating stat badge on image */}
                    <motion.div
                      className="absolute bottom-4 right-4 px-4 py-2.5 rounded-xl backdrop-blur-md bg-white/90 border border-white/50 shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-xl font-black" style={{ color: story.logoColor }}>{story.stat}</p>
                      <p className="text-[10px] text-[#505050] font-medium">{story.statLabel}</p>
                    </motion.div>

                    {/* Company overlay badge */}
                    <motion.div
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-lg backdrop-blur-md bg-white/90 border border-white/50 shadow-sm flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: story.logoColor }}>
                        {story.initials}
                      </div>
                      <span className="text-xs font-bold text-[#1A1A1A]">{story.company}</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center gap-5 mt-12">
            {/* Prev / Next */}
            <motion.button
              onClick={prev}
              aria-label="Previous story"
              className="w-11 h-11 rounded-full border-2 border-[#E5E5E5] flex items-center justify-center text-[#1A1A1A] hover:border-[#0067B8] hover:text-[#0067B8] hover:bg-blue-50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={next}
              aria-label="Next story"
              className="w-11 h-11 rounded-full border-2 border-[#E5E5E5] flex items-center justify-center text-[#1A1A1A] hover:border-[#0067B8] hover:text-[#0067B8] hover:bg-blue-50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Progress dots */}
            <div className="flex items-center gap-2 ml-2">
              {stories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to story ${idx + 1}`}
                  className="relative"
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === current ? "bg-[#0067B8] scale-110" : "bg-[#E5E5E5] hover:bg-[#CCCCCC]"
                  }`} />
                  {/* Auto-play progress ring */}
                  {idx === current && !isPaused && (
                    <motion.div
                      className="absolute -inset-1 rounded-full border-2 border-[#0067B8]"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.4, opacity: [0.6, 0] }}
                      transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Counter */}
            <span className="text-sm text-[#6B6B6B] font-medium ml-auto">
              <span className="text-[#1A1A1A] font-bold">{current + 1}</span> / {total}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
