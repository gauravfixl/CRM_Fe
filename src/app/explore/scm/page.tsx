"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Truck,
  Package,
  Globe,
  RefreshCcw,
  Route,
  CheckSquare,
} from "lucide-react"

const data = {
  name: "Supply Chain Management",
  tagline: "Optimize your end-to-end supply chain operations",
  description:
    "CubicleERP SCM provides complete visibility into your supply chain, from procurement to delivery. Manage suppliers, track shipments in real-time, optimize inventory levels, and ensure seamless logistics to reduce costs and improve delivery times.",
  icon: Truck,
  color: "#2E7D32",
  lightColor: "#E8F5E9",
  heroImage: "/api/scm-hero",
  variant: 1 as const,
  features: [
    {
      icon: Route,
      title: "Logistics Tracking",
      description:
        "Track shipments across all modes of transportation in real-time. Get automated alerts for delays and estimated times of arrival to keep your operations running smoothly.",
    },
    {
      icon: Package,
      title: "Inventory Optimization",
      description:
        "Maintain the perfect balance of stock. Avoid stockouts and overstocking with predictive analytics that forecast demand based on historical data and market trends.",
    },
    {
      icon: Globe,
      title: "Supplier Management",
      description:
        "Centralize supplier information, track performance metrics, and automate purchase orders. Build stronger vendor relationships through automated communication and portals.",
    },
    {
      icon: RefreshCcw,
      title: "Order Fulfillment",
      description:
        "Streamline the pick, pack, and ship process. Seamlessly integrate with third-party logistics providers (3PLs) and shipping carriers to automate label generation.",
    },
    {
      icon: CheckSquare,
      title: "Quality Assurance",
      description:
        "Enforce quality standards across the supply chain. Track defect rates, manage returns (RMA), and ensure compliance with industry regulations.",
    },
    {
      icon: Truck,
      title: "Fleet Management",
      description:
        "Monitor your own fleet's performance. Track vehicle maintenance schedules, fuel efficiency, and driver routes to optimize delivery costs.",
    },
  ],
  benefits: [
    {
      title: "Reduce Operational Costs",
      description:
        "Cut down on holding costs and minimize shipping expenses with optimized routing, better inventory forecasting, and consolidated shipments.",
    },
    {
      title: "Improve Delivery Speed",
      description:
        "Meet customer expectations for fast delivery with automated fulfillment workflows and real-time tracking.",
    },
    {
      title: "Enhance Visibility",
      description:
        "Gain a bird's-eye view of your entire supply network. Identify bottlenecks early and make proactive decisions before they impact customers.",
    },
    {
      title: "Mitigate Supply Risks",
      description:
        "Diversify suppliers and monitor localized disruptions. Built-in alerts help you respond quickly to global supply chain shocks.",
    },
    {
      title: "Streamline Procurement",
      description:
        "Automate reorder points and purchase approvals. Spend less time manually placing orders and more time negotiating better rates.",
    },
    {
      title: "Data-Driven Insights",
      description:
        "Leverage comprehensive analytics to measure supplier performance, cost variances, and overall supply chain health.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Connect Your Network",
      description:
        "Onboard your suppliers, integrate with your logistics partners, and sync your existing inventory systems.",
    },
    {
      step: "2",
      title: "Automate Workflows",
      description:
        "Set up minimum stock rules, automated reorder triggers, and approval chains for large purchases.",
    },
    {
      step: "3",
      title: "Optimize & Scale",
      description:
        "Use AI-driven insights to refine routes, renegotiate contracts, and scale your operations without adding overhead.",
    },
  ],
  useCases: [
    {
      title: "Wholesale Distributors",
      description:
        "Manage complex networks of manufacturers and retailers. Ensure you always have the right stock in the right warehouse.",
      highlights: [
        "Multi-warehouse inventory routing",
        "Automated bulk purchase orders",
        "Dropshipping management",
      ],
    },
    {
      title: "Retail Chains",
      description:
        "Keep store shelves stocked while minimizing holding costs at distribution centers.",
      highlights: [
        "Store replenishment automation",
        "Cross-docking operations",
        "Demand forecasting by region",
      ],
    },
    {
      title: "E-commerce Brands",
      description:
        "Handle high volumes of orders with varying shipping requirements and manage global supplier lead times.",
      highlights: [
        "Real-time carrier integration",
        "Returns management workflows",
        "International shipping compliance",
      ],
    },
  ],
  faqs: [
    {
      question: "Does the SCM module integrate with third-party carriers?",
      answer:
        "Yes, CubicleERP SCM integrates natively with major carriers like FedEx, UPS, DHL, and local delivery partners to generate labels and track shipments automatically.",
    },
    {
      question: "Can I manage multiple warehouses?",
      answer:
        "Absolutely. You can track inventory across an unlimited number of physical and virtual warehouses, including in-transit stock and supplier locations.",
    },
    {
      question: "How does it help with demand forecasting?",
      answer:
        "The system analyzes historical sales data, seasonality, and promotional schedules to predict future inventory needs, helping you avoid both stockouts and excess inventory.",
    },
    {
      question: "Is there a portal for our suppliers?",
      answer:
        "Yes, the platform includes a dedicated vendor portal where suppliers can acknowledge purchase orders, update shipping statuses, and submit invoices directly into your system.",
    },
    {
      question: "Does it support barcode scanning?",
      answer:
        "Yes, our mobile app supports barcode and QR code scanning for receiving goods, cycle counts, and picking/packing processes in the warehouse.",
    },
  ],
  stats: [
    { value: "30%", label: "Reduction in stockouts" },
    { value: "15%", label: "Lower logistics costs" },
    { value: "2x", label: "Faster fulfillment times" },
    { value: "20%", label: "Better inventory turnover" },
  ],
  capabilities: [
    {
      title: "Demand Forecasting and Planning",
      description:
        "Leverage historical sales data, seasonal trends, and market signals to generate accurate demand forecasts. CubicleERP SCM uses statistical models to predict future inventory requirements, enabling proactive purchasing decisions that prevent stockouts while avoiding costly overstock situations.",
      keyPoints: [
        "Statistical forecasting models calibrated to your historical demand patterns",
        "Seasonal and promotional demand adjustment overlays",
        "Safety stock optimization based on lead time variability and service levels",
        "What-if scenario planning to evaluate the impact of demand shifts",
      ],
    },
    {
      title: "Procurement Automation",
      description:
        "Transform your purchasing process from reactive and manual to proactive and automated. The system monitors inventory levels against configurable reorder points, generates purchase orders automatically, routes them through approval workflows, and sends them to preferred suppliers — all without human intervention.",
      keyPoints: [
        "Auto-generated purchase orders triggered by minimum stock thresholds",
        "Multi-tier approval workflows based on order value and category",
        "Supplier lead time tracking with automatic delivery date estimation",
        "Blanket order and contract pricing management for recurring purchases",
      ],
    },
    {
      title: "End-to-End Shipment Visibility",
      description:
        "Track every shipment across your supply chain in real time from the moment it leaves the supplier until it reaches the customer's door. Consolidate tracking data from multiple carriers, modes of transport, and logistics partners into a single live dashboard with proactive exception alerts.",
      keyPoints: [
        "Multi-carrier tracking consolidated into a unified shipment timeline",
        "Proactive delay alerts with estimated impact on delivery commitments",
        "Proof of delivery capture and automated customer notifications",
        "Customs and border clearance status tracking for international shipments",
      ],
    },
    {
      title: "Supplier Performance Management",
      description:
        "Evaluate and rank your suppliers based on objective, data-driven scorecards that track on-time delivery rates, quality defect percentages, pricing competitiveness, and responsiveness. Use these insights to negotiate better terms, consolidate spend with top performers, and phase out underperforming vendors.",
      keyPoints: [
        "Automated supplier scorecards updated with every purchase receipt",
        "On-time delivery rate and lead time accuracy tracking",
        "Quality defect rate monitoring tied to goods receipt inspections",
        "Spend analysis dashboards for strategic sourcing decisions",
      ],
    },
  ],
  integrations: [
    { name: "FedEx", category: "Shipping" },
    { name: "UPS", category: "Shipping" },
    { name: "DHL", category: "Shipping" },
    { name: "ShipStation", category: "Shipping" },
    { name: "SAP", category: "ERP" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Shopify", category: "E-Commerce" },
    { name: "Amazon Seller Central", category: "Marketplace" },
    { name: "Slack", category: "Communication" },
    { name: "Google Maps Platform", category: "Logistics" },
    { name: "Stripe", category: "Payments" },
    { name: "Power BI", category: "Analytics" },
  ],
  testimonials: [
    {
      quote:
        "Before CubicleERP SCM, we managed our supply chain with spreadsheets and phone calls. Now we have real-time visibility across 12 warehouses and 200 suppliers, and our stockout rate has dropped dramatically.",
      author: "Marcus Bennett",
      role: "VP of Operations",
      company: "Atlas Distribution Co.",
      metric: "30% reduction in stockout incidents",
    },
    {
      quote:
        "The demand forecasting module paid for itself within the first quarter. We reduced excess inventory by a significant margin and freed up working capital that we reinvested into expanding our product line.",
      author: "Priya Nair",
      role: "Supply Chain Director",
      company: "GreenLeaf Consumer Goods",
      metric: "22% reduction in excess inventory costs",
    },
    {
      quote:
        "Our procurement team used to spend most of their week placing and tracking purchase orders manually. With CubicleERP automating reorder points and PO generation, they now focus on strategic supplier negotiations instead.",
      author: "James Kowalczyk",
      role: "Head of Procurement",
      company: "Vertex Manufacturing",
      metric: "60% less time spent on manual PO processing",
    },
  ],
  comparisons: [
    { feature: "Shipment Tracking", traditional: "Manual carrier checks", cubicleErp: "Real-time unified view" },
    { feature: "Demand Forecasting", traditional: "Spreadsheet guesswork", cubicleErp: "AI-driven predictions" },
    { feature: "Purchase Orders", traditional: "Manual creation", cubicleErp: "Auto-generated" },
    { feature: "Supplier Evaluation", traditional: "Periodic manual review", cubicleErp: "Live scorecards" },
    { feature: "Multi-Warehouse", traditional: "Separate systems", cubicleErp: "Unified dashboard" },
    { feature: "Returns Processing", traditional: "Email and phone", cubicleErp: "Automated RMA workflow" },
  ],
  subNavItems: [
    { label: "Overview", sectionId: "hero" },
    { label: "Features", sectionId: "features" },
    { label: "Capabilities", sectionId: "capabilities" },
    { label: "Benefits", sectionId: "benefits" },
    { label: "Integrations", sectionId: "integrations" },
    { label: "How It Works", sectionId: "how-it-works" },
    { label: "Use Cases", sectionId: "use-cases" },
    { label: "FAQs", sectionId: "faqs" },
    { label: "Inventory", href: "/explore/inventory" },
    { label: "E-Commerce", href: "/explore/ecommerce" },
    { label: "Manufacturing", href: "/explore/manufacturing" },
  ],
}

export default function SCMPage() {
  return <ExploreProductPage data={data} />
}
