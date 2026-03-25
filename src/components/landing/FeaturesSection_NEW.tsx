"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Target, Building2, BarChart3, Users, Shield, Zap, ArrowRight, Check, ChevronDown } from "lucide-react"

const features = [
    {
        icon: Target,
        title: "Lead Management",
        description:
            "Track, score, and convert leads with intelligent pipelines. Assign, follow-up, and never miss an opportunity.",
        gradient: "from-blue-500 to-indigo-600",
        shadowColor: "shadow-blue-500/20",
        tag: "CRM",
        highlight: "2,847 leads tracked",
        stats: { value: 2847, label: "Active Leads", growth: "+12%" },
        detailedInfo: {
            overview: "Our Lead Management system helps you capture, track, and convert leads efficiently with AI-powered insights and automation.",
            keyFeatures: [
                "Intelligent lead scoring and prioritization",
                "Automated lead assignment and routing",
                "Multi-channel lead capture (web, email, social)",
                "Custom pipeline stages and workflows",
                "Real-time lead activity tracking",
                "Email integration and tracking",
                "Lead nurturing campaigns",
                "Conversion analytics and reporting"
            ],
            benefits: [
                "Increase conversion rates by 35%",
                "Reduce response time by 60%",
                "Never miss a follow-up",
                "Data-driven lead prioritization"
            ],
            useCases: [
                "Sales teams managing inbound leads",
                "Marketing teams tracking campaign performance",
                "Account executives prioritizing hot leads"
            ]
        }
    },
