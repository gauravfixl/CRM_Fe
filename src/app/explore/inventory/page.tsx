"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Package,
  Warehouse,
  ScanBarcode,
  BellDot,
  Layers3,
  Truck,
} from "lucide-react"

const data = {
  name: "Inventory",
  tagline: "Manage your inventory with precision and ease",
  description:
    "CubicleERP Inventory gives you complete control over your stock across every warehouse, channel, and location. From real-time stock tracking and barcode scanning to intelligent reorder alerts and supplier management, eliminate guesswork and keep your supply chain running smoothly.",
  icon: Package,
  color: "#6D4C41",
  lightColor: "#EFEBE9",
  heroImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80",
  variant: 4 as const,

  features: [
    {
      icon: Package,
      title: "Stock Tracking",
      description:
        "Monitor stock levels across all locations in real time. Every receipt, transfer, sale, and adjustment is recorded instantly, giving you an accurate picture of available inventory at any moment without manual counts.",
    },
    {
      icon: Warehouse,
      title: "Warehouse Management",
      description:
        "Organize products across multiple warehouses, zones, racks, and bins. Define storage rules, optimize picking routes, and manage inter-warehouse transfers with full traceability from origin to destination.",
    },
    {
      icon: ScanBarcode,
      title: "Barcode Scanning",
      description:
        "Speed up receiving, picking, and cycle counts with built-in barcode and QR code support. Use any smartphone or dedicated scanner to capture product data instantly, eliminating manual entry errors.",
    },
    {
      icon: BellDot,
      title: "Reorder Alerts",
      description:
        "Set minimum and maximum stock thresholds for every product. When inventory falls below your reorder point, the system automatically generates purchase suggestions or triggers purchase orders with your preferred suppliers.",
    },
    {
      icon: Layers3,
      title: "Batch & Serial Tracking",
      description:
        "Track products by batch number, lot number, serial number, or expiration date. Full traceability from supplier to customer enables rapid recalls, warranty tracking, and compliance with industry regulations.",
    },
    {
      icon: Truck,
      title: "Supplier Management",
      description:
        "Maintain a comprehensive supplier database with lead times, pricing tiers, and performance ratings. Compare vendor quotes, track purchase history, and build stronger supplier relationships with data-backed negotiations.",
    },
  ],

  benefits: [
    {
      title: "Prevent Stockouts",
      description:
        "Never lose a sale because an item is out of stock. Intelligent reorder points and demand forecasting ensure your best-selling products are always available when customers need them.",
    },
    {
      title: "Reduce Waste & Spoilage",
      description:
        "Expiration date tracking and FIFO/FEFO picking rules minimize waste for perishable goods. Batch tracking helps you identify slow-moving inventory before it becomes obsolete.",
    },
    {
      title: "Achieve Accurate Counts",
      description:
        "Barcode scanning and automated transaction logging eliminate the discrepancies caused by manual data entry. Cycle counting workflows keep your records aligned with physical stock year-round.",
    },
    {
      title: "Fulfill Orders Faster",
      description:
        "Optimized warehouse layouts and guided picking routes reduce the time from order receipt to shipment. Workers spend less time searching and more time packing and shipping.",
    },
    {
      title: "Optimize Inventory Costs",
      description:
        "Carrying too much inventory ties up capital; carrying too little costs you sales. Analytics-driven stocking recommendations help you find the sweet spot that maximizes cash flow.",
    },
    {
      title: "Gain Supply Chain Visibility",
      description:
        "Track inbound shipments, monitor supplier lead times, and identify supply chain risks before they disrupt your operations. End-to-end visibility from purchase order to delivery.",
    },
  ],

  steps: [
    {
      step: "1",
      title: "Add Products",
      description:
        "Import your product catalog via CSV or add items manually. Define SKUs, variants, units of measure, storage locations, and reorder thresholds for each product.",
    },
    {
      step: "2",
      title: "Track Stock",
      description:
        "Record receipts, sales, transfers, and adjustments as they happen. Use barcode scanning for speed and accuracy, with every movement logged in a complete audit trail.",
    },
    {
      step: "3",
      title: "Optimize Inventory",
      description:
        "Review analytics dashboards to identify slow movers, top sellers, and reorder opportunities. Let the system automate purchase orders and keep your stock at optimal levels.",
    },
  ],

  useCases: [
    {
      title: "E-commerce Businesses",
      description:
        "Online sellers managing inventory across their own warehouse, third-party logistics providers, and multiple sales channels need a unified view of stock. CubicleERP syncs inventory across Shopify, Amazon, and other platforms in real time to prevent overselling.",
      highlights: [
        "Multi-channel inventory sync in real time",
        "Automated low-stock alerts per sales channel",
        "Returns processing with stock reintegration",
      ],
    },
    {
      title: "Manufacturing",
      description:
        "Manufacturers need to track raw materials, work-in-progress, and finished goods across production stages. CubicleERP Inventory integrates with production planning to ensure materials are available when production lines need them.",
      highlights: [
        "Bill of materials with component tracking",
        "Raw material consumption linked to production",
        "Quality hold and quarantine zone management",
      ],
    },
    {
      title: "Retail & Wholesale",
      description:
        "Brick-and-mortar retailers and wholesale distributors managing stock across multiple store locations and distribution centers benefit from centralized inventory control with location-level granularity.",
      highlights: [
        "Store-level stock visibility and replenishment",
        "Bulk pricing and tiered discount management",
        "Seasonal demand planning and pre-stocking",
      ],
    },
  ],

  faqs: [
    {
      question: "What barcode formats does CubicleERP Inventory support?",
      answer:
        "CubicleERP Inventory supports all major barcode formats including UPC-A, UPC-E, EAN-13, EAN-8, Code 128, Code 39, and QR codes. You can generate barcode labels directly from the system and print them on standard label printers. Scanning works with dedicated barcode scanners, smartphones via our mobile app, and tablet cameras.",
    },
    {
      question: "Can I manage multiple warehouses and locations?",
      answer:
        "Yes, there is no limit on the number of warehouses, stores, or locations you can manage. Each location can have its own zone, rack, and bin hierarchy. You can transfer stock between locations with full tracking, set location-specific reorder points, and view consolidated or per-location inventory reports.",
    },
    {
      question: "Does it integrate with my existing e-commerce and accounting tools?",
      answer:
        "CubicleERP Inventory integrates natively with all CubicleERP modules including Finance, CRM, and Analytics. For external platforms, we offer pre-built integrations with Shopify, WooCommerce, Amazon, QuickBooks, Xero, and many more. Custom integrations are supported through our REST API and webhook system.",
    },
    {
      question: "What inventory tracking methods are supported?",
      answer:
        "The system supports FIFO (First In, First Out), LIFO (Last In, First Out), FEFO (First Expired, First Out), and weighted average costing methods. You can assign different methods to different product categories. Batch tracking, serial number tracking, and expiration date tracking are all available and can be enabled per product.",
    },
    {
      question: "How does CubicleERP Inventory scale as my business grows?",
      answer:
        "CubicleERP Inventory is built to scale from small businesses managing a single stockroom to enterprises with dozens of warehouses and millions of SKUs. The cloud-based architecture handles high transaction volumes without performance degradation. You can add new warehouses, users, and integrations at any time without migration or downtime.",
    },
  ],

  stats: [
    { value: "35%", label: "Fewer stockouts" },
    { value: "99.5%", label: "Inventory accuracy" },
    { value: "50%", label: "Faster order fulfillment" },
    { value: "20%", label: "Reduction in carrying costs" },
  ],

  capabilities: [
    {
      title: "Demand Forecasting Engine",
      description:
        "Leverage historical sales data, seasonal patterns, and market signals to predict future demand with high accuracy. The forecasting engine automatically adjusts for trends, promotions, and external factors so you order the right quantities at the right time.",
      keyPoints: [
        "Machine learning models trained on your own sales history produce SKU-level demand forecasts up to 12 months out",
        "Factor in promotional calendars, holiday seasons, and marketing campaigns for more precise predictions",
        "Automated safety stock calculations adjust dynamically based on demand variability and supplier lead times",
        "Scenario planning lets you model 'what-if' situations like supplier delays or demand spikes before they happen",
      ],
    },
    {
      title: "Multi-Channel Inventory Synchronization",
      description:
        "Sell across your own website, Amazon, Shopify, eBay, and brick-and-mortar stores while maintaining a single, accurate inventory count. Real-time sync prevents overselling and ensures stock availability is consistent everywhere.",
      keyPoints: [
        "Bi-directional sync with major e-commerce platforms updates stock counts within seconds of each sale or return",
        "Channel-specific stock reserves let you allocate inventory pools for flash sales or marketplace promotions without affecting other channels",
        "Centralized order routing engine selects the optimal fulfillment location based on proximity, stock availability, and shipping cost",
      ],
    },
    {
      title: "Warehouse Optimization Intelligence",
      description:
        "Go beyond basic storage with AI-driven recommendations for slotting, picking routes, and layout optimization. The system analyzes order patterns to minimize travel time and maximize throughput in your warehouse.",
      keyPoints: [
        "Heat-map analysis of pick frequency identifies high-velocity items that should be placed closest to packing stations",
        "Dynamic pick-path routing calculates the shortest route through the warehouse for each batch of orders",
        "Zone-based wave picking groups orders by location to reduce picker travel time by up to 40%",
        "Automated putaway rules assign incoming stock to optimal bin locations based on product velocity and dimensions",
      ],
    },
    {
      title: "Advanced Lot and Expiry Management",
      description:
        "Maintain full traceability from supplier receipt to customer delivery with granular lot, batch, and expiry tracking. Critical for food, pharmaceutical, and chemical industries where compliance is non-negotiable.",
      keyPoints: [
        "FEFO (First Expired, First Out) picking enforcement ensures products closest to expiration are shipped first",
        "Automated alerts notify warehouse staff of approaching expiration dates with configurable lead times",
        "One-click recall management identifies every customer who received products from a specific batch for rapid response",
      ],
    },
  ],

  integrations: [
    { name: "Shopify", category: "E-commerce" },
    { name: "Amazon Seller Central", category: "Marketplace" },
    { name: "WooCommerce", category: "E-commerce" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Xero", category: "Accounting" },
    { name: "ShipStation", category: "Shipping" },
    { name: "Shiprocket", category: "Shipping" },
    { name: "Razorpay", category: "Payments" },
    { name: "Google Sheets", category: "Productivity" },
    { name: "Slack", category: "Communication" },
    { name: "Tally", category: "Accounting" },
    { name: "eBay", category: "Marketplace" },
  ],

  testimonials: [
    {
      quote:
        "We used to do manual stock counts every Friday and still had discrepancies. After switching to CubicleERP Inventory with barcode scanning, our inventory accuracy went from 87% to 99.6% and we eliminated the weekly counting entirely.",
      author: "James Whitfield",
      role: "Warehouse Operations Manager",
      company: "Summit Distribution Co.",
      metric: "99.6% inventory accuracy achieved",
    },
    {
      quote:
        "Managing inventory across our Shopify store, Amazon, and two retail locations was a nightmare of spreadsheets. CubicleERP unified everything into one dashboard and we have not had an oversell incident in 8 months.",
      author: "Anita Rao",
      role: "E-commerce Director",
      company: "GreenLeaf Organics",
      metric: "Zero overselling incidents in 8 months",
    },
    {
      quote:
        "The demand forecasting feature alone justified the investment. We reduced our carrying costs by 22% in the first quarter because we stopped over-ordering slow-moving SKUs while keeping fast movers fully stocked.",
      author: "Marcus Johansson",
      role: "Supply Chain VP",
      company: "NordicTech Hardware",
      metric: "22% reduction in carrying costs",
    },
  ],

  comparisons: [
    { feature: "Stock updates", traditional: "End-of-day batch sync", cubicleErp: "Real-time across channels" },
    { feature: "Reorder management", traditional: "Manual spreadsheet checks", cubicleErp: "Automated smart alerts" },
    { feature: "Barcode scanning", traditional: "Separate hardware system", cubicleErp: "Built-in with any device" },
    { feature: "Multi-warehouse", traditional: "Separate systems per site", cubicleErp: "Unified control panel" },
    { feature: "Demand forecasting", traditional: "Gut feeling estimates", cubicleErp: "ML-powered predictions" },
    { feature: "Supplier management", traditional: "Email and phone calls", cubicleErp: "Integrated vendor portal" },
  ],

  subNavItems: [
    { label: "Overview", sectionId: "hero" },
    { label: "Features", sectionId: "features" },
    { label: "Capabilities", sectionId: "capabilities" },
    { label: "Benefits", sectionId: "benefits" },
    { label: "Integrations", sectionId: "integrations" },
    { label: "Use Cases", sectionId: "use-cases" },
    { label: "FAQs", sectionId: "faqs" },
    { label: "Supply Chain", href: "/explore/scm" },
    { label: "E-commerce", href: "/explore/ecommerce" },
    { label: "Finance", href: "/explore/finance" },
  ],
}

export default function InventoryPage() {
  return <ExploreProductPage data={data} />
}
