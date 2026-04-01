"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    ShoppingCart,
    Barcode,
    Users,
    TrendingUp,
    Package,
    Zap,
} from "lucide-react"

const data = {
    name: "Retail",
    tagline: "Unified commerce platform for modern retailers",
    description:
        "CubicleERP Retail transforms how you manage inventory, sales, and customer relationships across all channels. From point-of-sale integration and real-time inventory tracking to omnichannel order management and customer analytics — everything you need to deliver exceptional shopping experiences while optimizing operations and maximizing profitability.",
    icon: ShoppingCart,
    color: "#E74C3C",
    lightColor: "#FADBD8",
    heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    features: [
        {
            icon: Barcode,
            title: "Unified Inventory Management",
            description:
                "Real-time inventory visibility across all locations, warehouses, and sales channels. Automatic stock level alerts, intelligent reorder points, and SKU-level tracking prevent stockouts and overstock situations. Manage variants, bundles, and serial numbers with complete traceability from purchase to sale.",
        },
        {
            icon: ShoppingCart,
            title: "Omnichannel Order Management",
            description:
                "Seamlessly manage orders from physical stores, e-commerce platforms, mobile apps, and marketplaces in one unified system. Automatic order routing, split shipments, and unified fulfillment workflows ensure customers get their orders quickly regardless of channel.",
        },
        {
            icon: Users,
            title: "Customer Loyalty & Analytics",
            description:
                "Build customer profiles with purchase history, preferences, and lifetime value. Create targeted loyalty programs, personalized promotions, and segment-based marketing campaigns. Track customer behavior across channels to identify trends and optimize merchandising strategies.",
        },
        {
            icon: TrendingUp,
            title: "Sales Analytics & Reporting",
            description:
                "Real-time dashboards showing sales by category, location, salesperson, and time period. Identify top-performing products, analyze profit margins, and forecast demand. Compare performance across stores and make data-driven decisions on pricing, promotions, and inventory allocation.",
        },
        {
            icon: Package,
            title: "Supplier & Vendor Management",
            description:
                "Manage purchase orders, track deliveries, and maintain vendor performance metrics. Automated reordering based on inventory levels, supplier lead times, and seasonal demand. Negotiate better terms with data-backed supplier performance analytics.",
        },
        {
            icon: Zap,
            title: "POS Integration & Payments",
            description:
                "Connect with leading POS systems and payment processors for seamless transaction processing. Support multiple payment methods including cards, digital wallets, and buy-now-pay-later options. Real-time sales data flows directly into your accounting and inventory systems.",
        },
    ],
    benefits: [
        {
            title: "Reduce Inventory Carrying Costs",
            description:
                "Optimize stock levels with predictive analytics and demand forecasting. Reduce excess inventory by 20-30% while maintaining service levels, freeing up cash for growth initiatives.",
        },
        {
            title: "Increase Sales & Customer Lifetime Value",
            description:
                "Personalized recommendations, targeted promotions, and loyalty programs drive repeat purchases. Retailers using CubicleERP see average order value increase by 25% and customer retention improve by 35%.",
        },
        {
            title: "Streamline Operations Across Locations",
            description:
                "Centralized management of multiple stores reduces administrative overhead and ensures consistent brand experience. Standardized processes and workflows improve efficiency and reduce errors across all locations.",
        },
        {
            title: "Improve Profit Margins",
            description:
                "Better inventory management, reduced shrinkage, and optimized pricing strategies directly improve bottom-line profitability. Real-time margin analysis by product and category helps identify optimization opportunities.",
        },
        {
            title: "Enable Faster Decision-Making",
            description:
                "Real-time dashboards and automated alerts keep you informed of sales trends, inventory issues, and customer behavior. Make pricing and merchandising decisions in minutes instead of days.",
        },
        {
            title: "Scale Your Business Confidently",
            description:
                "Whether opening new locations or expanding to new channels, CubicleERP scales with you. Add stores, integrate new sales channels, and manage growth without system limitations or costly upgrades.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Assessment & Planning",
            description:
                "We analyze your current retail operations, sales channels, and pain points. We create a detailed implementation plan that minimizes disruption to your stores and ensures smooth data migration from legacy systems.",
        },
        {
            step: "2",
            title: "System Configuration & Integration",
            description:
                "We configure CubicleERP for your retail operations, integrate with your POS systems, e-commerce platforms, and payment processors. Set up inventory rules, pricing strategies, and customer loyalty programs tailored to your business model.",
        },
        {
            step: "3",
            title: "Training & Launch",
            description:
                "Comprehensive training for store managers, cashiers, and back-office staff. Phased rollout starting with pilot locations, followed by full deployment with 24/7 support during launch period.",
        },
    ],
    useCases: [
        {
            title: "Multi-Store Retail Chains",
            description:
                "Large retail chains with dozens or hundreds of locations use CubicleERP to maintain consistent operations, pricing, and customer experience across all stores while allowing local flexibility.",
            highlights: [
                "Centralized inventory management with location-level control",
                "Unified pricing with local promotion flexibility",
                "Store performance dashboards with peer comparison",
            ],
        },
        {
            title: "Omnichannel Retailers",
            description:
                "Retailers selling through physical stores, e-commerce, mobile apps, and marketplaces use CubicleERP to provide seamless shopping experiences and unified inventory across all channels.",
            highlights: [
                "Buy online, pick up in store (BOPIS) workflows",
                "Unified customer profiles across all channels",
                "Inventory visibility and allocation across channels",
            ],
        },
        {
            title: "Specialty & Boutique Retailers",
            description:
                "Specialty retailers with unique inventory management needs use CubicleERP to track complex product hierarchies, manage seasonal inventory, and build loyal customer communities.",
            highlights: [
                "Advanced product variant and bundle management",
                "Seasonal inventory planning and forecasting",
                "Customer preference tracking and personalization",
            ],
        },
    ],
    faqs: [
        {
            question: "How does CubicleERP integrate with my existing POS system?",
            answer:
                "CubicleERP integrates with all major POS systems including Square, Toast, Shopify, Lightspeed, and others through APIs or pre-built connectors. Sales transactions sync in real-time to your inventory and accounting systems. If you use a custom POS, our integration team can build a connector using our open API.",
        },
        {
            question: "Can I manage multiple sales channels from one system?",
            answer:
                "Yes. CubicleERP provides unified order management for physical stores, e-commerce platforms, mobile apps, and marketplaces like Amazon and eBay. Orders from all channels appear in one queue, inventory is shared across channels, and customer profiles are unified regardless of where they shop.",
        },
        {
            question: "How does inventory forecasting work?",
            answer:
                "CubicleERP uses historical sales data, seasonal trends, and current inventory levels to forecast demand for each product. The system automatically suggests reorder quantities and timing to maintain optimal stock levels. You can adjust forecasts based on planned promotions or market changes.",
        },
        {
            question: "What reporting and analytics are available?",
            answer:
                "CubicleERP provides real-time dashboards showing sales by category, location, and time period; inventory turnover rates; profit margins by product; customer purchase patterns; and staff performance metrics. Create custom reports and schedule automated distribution to stakeholders.",
        },
        {
            question: "How do you handle data migration from my current system?",
            answer:
                "Our implementation team handles complete data migration including product catalogs, inventory levels, customer records, and historical transactions. We validate data quality, reconcile discrepancies, and run parallel operations during transition to ensure accuracy and minimize disruption.",
        },
    ],
    stats: [
        { value: "2000+", label: "Retail locations managed" },
        { value: "25%", label: "Average AOV increase" },
        { value: "35%", label: "Customer retention improvement" },
        { value: "99.9%", label: "System uptime" },
    ],
}

export default function RetailPage() {
    return <ExploreProductPage data={data} />
}
