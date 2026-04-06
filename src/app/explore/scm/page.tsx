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
}

export default function SCMPage() {
  return <ExploreProductPage data={data} />
}
