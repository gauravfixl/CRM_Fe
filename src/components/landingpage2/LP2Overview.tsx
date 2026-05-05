"use client"

import { motion } from "framer-motion"
import { ArrowRight, Users, Play, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useIntersection } from "./hooks/useIntersection"

const cards = [
  {
    title: "What is Cubicle?",
    description:
      "Become more data-driven and innovative with an all-in-one platform for CRM, HRM, project management, and finance operations.",
    cta: "Explore Cubicle",
    href: "/about",
    gradient: "from-blue-50 to-indigo-100",
    Icon: Users,
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  },
  {
    title: "Take a guided tour",
    description:
      "Get a closer look at how to improve your business processes with Cubicle\u2019s powerful modules and AI-assisted tools.",
    cta: "Start your tour",
    href: "/guided-tour",
    gradient: "from-emerald-50 to-teal-100",
    Icon: Play,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    title: "Compare plans and pricing",
    description:
      "Find the right plan for your business needs by exploring the different options \u2014 from free starter to enterprise.",
    cta: "See pricing overview",
    href: "/pricing-overview",
    gradient: "from-amber-50 to-orange-100",
    Icon: CreditCard,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
}

export default function LP2Overview() {
  const [ref, inView] = useIntersection("-80px")

  return (
    <section id="overview" className="bg-white py-16">
      <div ref={ref} className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          custom={0}
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#0067B8]" />
            <span className="text-xs tracking-widest font-bold uppercase text-[#0067B8]">
              Overview
            </span>
          </span>
        </motion.div>
        <motion.h2
          custom={1}
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center text-3xl lg:text-[2.75rem] font-bold leading-tight text-[#1A1A1A]"
        >
          Transform how work gets done with AI&nbsp;agents
        </motion.h2>
        <motion.p
          custom={2}
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mt-4 max-w-3xl text-center text-base text-[#6B6B6B] leading-relaxed"
        >
          Connect teams, processes, and data across your entire organization to
          create exceptional customer experiences and operational agility.
        </motion.p>

        {/* Cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-3 max-w-[1200px] mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="group flex flex-col overflow-hidden rounded-lg border border-[#E5E5E5] bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1"
            >
              {/* Card image */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
                {/* Subtle overlay for polish */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <h3 className="mt-4 px-4 text-base font-semibold text-[#1A1A1A]">
                {card.title}
              </h3>
              <p className="mt-2 px-4 text-[13px] leading-relaxed text-[#505050]">
                {card.description}
              </p>

              {/* CTA */}
              <div className="mt-auto px-4 pb-4 pt-3">
                <Link
                  href={card.href}
                  className="group/cta inline-flex items-center gap-2 text-[13px] font-semibold text-[#0067B8]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0067B8] text-white transition-transform duration-300 group-hover/cta:translate-x-1">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="group-hover/cta:underline">{card.cta}</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
