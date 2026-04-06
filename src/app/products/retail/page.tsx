"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    ShoppingCart,
    Barcode,
    Users,
    TrendingUp,
    Package,
    Store,
    RotateCcw,
    LayoutGrid,
    CreditCard,
    Truck,
    Heart,
    BarChart3,
} from "lucide-react"

const data = {
    name: "Retail",
    tagline: "All-in-one commerce platform built for modern retail success",
    description:
        "CubicleERP Retail empowers retailers with a unified platform to manage point-of-sale operations, real-time inventory, omnichannel sales, and customer loyalty programs from a single dashboard. Whether you run a single boutique or a chain of stores, streamline every aspect of your retail business — from barcode scanning and supplier management to returns processing and multi-store analytics — and deliver exceptional shopping experiences that keep customers coming back.",
    icon: ShoppingCart,
    color: "#D97706",
    lightColor: "#FEF3C7",
    heroImage:
        "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1920&q=80",
    variant: 3 as const,
    features: [
        {
            icon: CreditCard,
            title: "Integrated POS System",
            description:
                "Process transactions seamlessly with a fully integrated point-of-sale system that supports credit cards, digital wallets, UPI, and buy-now-pay-later options. Every sale automatically updates inventory counts, triggers accounting entries, and feeds into your analytics dashboards in real time. Configure custom tax rules, discounts, and promotional pricing that cashiers can apply with a single tap at checkout.",
        },
        {
            icon: Package,
            title: "Real-Time Inventory Management",
            description:
                "Maintain complete visibility of stock levels across every store, warehouse, and fulfillment center with live inventory tracking down to the SKU level. Automated reorder points, safety stock calculations, and demand-driven replenishment ensure you never face unexpected stockouts or costly overstock situations. Track product variants, serial numbers, batch lots, and expiry dates with full traceability from receiving dock to customer hands.",
        },
        {
            icon: LayoutGrid,
            title: "Omnichannel Sales Management",
            description:
                "Unify your in-store, e-commerce, mobile app, and marketplace sales channels into a single order management hub that provides a consistent shopping experience everywhere. Enable buy-online-pick-up-in-store, ship-from-store, and endless aisle capabilities so customers can shop however they prefer. Inventory is allocated intelligently across channels to maximize sell-through rates and minimize fulfillment costs.",
        },
        {
            icon: Heart,
            title: "Customer Loyalty & Engagement",
            description:
                "Build rich customer profiles that capture purchase history, preferences, wish lists, and engagement across every touchpoint to power personalized marketing. Design tiered loyalty programs with points, rewards, exclusive offers, and birthday perks that drive repeat visits and increase average order value. Segment your customer base for targeted campaigns and measure the ROI of every promotion in real time.",
        },
        {
            icon: Barcode,
            title: "Barcode & Label Management",
            description:
                "Generate, print, and scan barcodes and QR codes for rapid product identification, stock receiving, cycle counts, and checkout processing. Support all major barcode formats including UPC, EAN, Code 128, and custom internal SKU schemes with batch label printing for new arrivals. Mobile barcode scanning turns any smartphone or tablet into a portable inventory tool for stocktakes and price checks on the shop floor.",
        },
        {
            icon: Truck,
            title: "Supplier & Procurement Management",
            description:
                "Manage your entire supplier network with vendor scorecards, lead time tracking, and automated purchase order generation based on real-time inventory needs. Compare supplier pricing, negotiate volume discounts, and track delivery performance to ensure you always source products at the best cost and reliability. Receive goods with barcode verification, manage partial shipments, and automatically reconcile supplier invoices against purchase orders.",
        },
    ],
    benefits: [
        {
            title: "Cut Inventory Carrying Costs by 30%",
            description:
                "Demand forecasting and intelligent reorder algorithms keep stock levels optimized, reducing excess inventory, minimizing storage costs, and freeing up working capital for growth.",
        },
        {
            title: "Boost Customer Retention & Lifetime Value",
            description:
                "Personalized loyalty programs, targeted promotions, and unified customer profiles across all channels drive repeat purchases and increase average order value by up to 25%.",
        },
        {
            title: "Eliminate Manual Errors & Shrinkage",
            description:
                "Automated stock reconciliation, barcode-verified receiving, and real-time audit trails reduce inventory discrepancies and shrinkage, protecting your margins at every step.",
        },
        {
            title: "Accelerate Checkout & Reduce Wait Times",
            description:
                "Fast POS processing with integrated payment methods, quick barcode scanning, and pre-configured discount rules let cashiers handle more customers with fewer errors during peak hours.",
        },
        {
            title: "Make Data-Driven Merchandising Decisions",
            description:
                "Real-time sales analytics, product performance dashboards, and margin analysis empower store managers to optimize product placement, pricing strategies, and promotional calendars.",
        },
        {
            title: "Scale Seamlessly Across Locations & Channels",
            description:
                "Add new stores, launch e-commerce channels, or expand to marketplaces without system constraints. CubicleERP grows with your business while keeping operations centralized and consistent.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Retail Operations Audit & Setup",
            description:
                "We assess your current retail workflows, POS systems, inventory processes, and sales channels. A tailored implementation plan is created to migrate your product catalog, customer data, and historical transactions with zero disruption to daily store operations.",
        },
        {
            step: "2",
            title: "Configuration, Integration & Testing",
            description:
                "We configure CubicleERP for your store layouts, pricing rules, tax structures, and loyalty programs. Integrations with your POS hardware, e-commerce platforms, payment gateways, and supplier portals are set up and rigorously tested with real transaction scenarios.",
        },
        {
            step: "3",
            title: "Staff Training & Phased Go-Live",
            description:
                "Your store managers, cashiers, warehouse staff, and back-office teams receive hands-on training tailored to their roles. We execute a phased rollout starting with pilot locations, followed by full deployment with dedicated support during the critical launch window.",
        },
    ],
    useCases: [
        {
            title: "Multi-Store Retail Chains",
            description:
                "Retail chains with multiple locations rely on CubicleERP to centralize inventory control, standardize pricing and promotions, and benchmark store performance — all while allowing regional managers the flexibility to adapt to local market conditions.",
            highlights: [
                "Centralized stock allocation with inter-store transfer workflows",
                "Standardized pricing with location-specific promotion overrides",
                "Comparative store performance dashboards and regional analytics",
            ],
        },
        {
            title: "Omnichannel & E-Commerce Retailers",
            description:
                "Retailers selling across physical stores, websites, mobile apps, and marketplaces use CubicleERP to maintain a single source of truth for inventory, orders, and customers — enabling seamless experiences like BOPIS and ship-from-store.",
            highlights: [
                "Unified inventory pool shared across online and offline channels",
                "Buy-online-pick-up-in-store and ship-from-store fulfillment",
                "Consolidated customer profiles with cross-channel purchase history",
            ],
        },
        {
            title: "Specialty & Boutique Retailers",
            description:
                "Specialty shops and boutiques leverage CubicleERP to manage complex product hierarchies, seasonal collections, and high-touch customer relationships that differentiate them from mass-market competitors.",
            highlights: [
                "Advanced variant management for size, color, material, and custom attributes",
                "Seasonal collection planning with pre-order and made-to-order workflows",
                "VIP customer tracking with personalized recommendations and wish lists",
            ],
        },
    ],
    faqs: [
        {
            question:
                "How does CubicleERP integrate with my existing POS hardware and software?",
            answer: "CubicleERP connects with all major POS systems including Square, Shopify POS, Lightspeed, Clover, and Vend through pre-built API connectors. Sales transactions, refunds, and payment data sync in real time to your inventory and accounting modules. For custom or legacy POS terminals, our integration team builds tailored connectors using our open REST API, ensuring barcode scanners, receipt printers, and card terminals work seamlessly from day one.",
        },
        {
            question:
                "Can I manage returns, exchanges, and refunds through the system?",
            answer: "Absolutely. CubicleERP includes a comprehensive returns and exchanges module that handles in-store returns, online return requests, cross-channel returns (buy online, return in store), and warranty claims. Each return automatically adjusts inventory levels, triggers accounting reversals, and updates the customer profile. You can configure return policies by product category, set approval workflows for high-value returns, and track return reasons to identify quality or sizing issues.",
        },
        {
            question:
                "How does inventory forecasting and automatic reordering work?",
            answer: "The system analyzes historical sales data, seasonal patterns, current stock levels, and supplier lead times to generate demand forecasts for every product at every location. When projected stock falls below your configured safety thresholds, CubicleERP automatically creates draft purchase orders with recommended quantities and preferred suppliers. You can review and approve orders in bulk, adjust forecasts for upcoming promotions or market shifts, and track forecast accuracy over time to continuously improve planning.",
        },
        {
            question:
                "What sales analytics and reporting capabilities are included?",
            answer: "CubicleERP provides real-time dashboards covering sales by product, category, location, channel, and time period, along with gross margin analysis, inventory turnover rates, and customer acquisition metrics. You can drill down into individual store performance, compare periods, and identify your top and bottom performers. Custom report builder lets you create tailored reports, schedule automated email distribution, and export data to Excel or BI tools for deeper analysis.",
        },
        {
            question:
                "How do you handle data migration and onboarding for existing retail businesses?",
            answer: "Our implementation team manages the complete migration of your product catalog, inventory levels, pricing rules, customer records, supplier information, and historical transaction data from your current system. We run data validation checks, reconcile discrepancies, and execute parallel operations during the transition period so your stores continue operating without interruption. Most single-store retailers are fully operational within two weeks, while multi-store chains typically complete rollout within four to eight weeks depending on complexity.",
        },
    ],
    stats: [
        { value: "3,500+", label: "Retail locations powered" },
        { value: "30%", label: "Reduction in inventory costs" },
        { value: "25%", label: "Increase in average order value" },
        { value: "99.9%", label: "POS system uptime" },
    ],
}

export default function RetailPage() {
    return <ExploreProductPage data={data} />
}
