"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  ShoppingCart,
  CreditCard,
  Tag,
  Monitor,
  Smartphone,
  TrendingUp,
} from "lucide-react"

const data = {
  name: "E-Commerce & POS",
  tagline: "Unify your online and offline sales channels",
  description:
    "CubicleERP E-Commerce & POS delivers a seamless omnichannel experience. Manage physical storefronts with our lightning-fast Point of Sale while running a fully integrated online store. Every sale, online or offline, synchronizes your inventory and accounts in real-time.",
  icon: ShoppingCart,
  color: "#E65100",
  lightColor: "#FFF3E0",
  heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: Monitor,
      title: "Integrated Storefront",
      description:
        "Launch a beautiful, responsive online store natively connected to your ERP. No third-party connectors needed. Product updates reflect instantly online.",
    },
    {
      icon: Smartphone,
      title: "Lightning-Fast POS",
      description:
        "Empower retail staff with a Point of Sale interface designed for speed. Supports barcode scanners, receipt printers, and cash drawers out of the box.",
    },
    {
      icon: Tag,
      title: "Omnichannel Pricing",
      description:
        "Set universal pricing or maintain separate price lists for retail, wholesale, and web. Easily deploy promotions, coupons, and loyalty programs across all channels.",
    },
    {
      icon: ShoppingCart,
      title: "Unified Cart & Checkout",
      description:
        "Provide flexible purchasing options like Buy Online, Pick Up In-Store (BOPIS) to merge the convenience of digital with physical fulfillment.",
    },
    {
      icon: CreditCard,
      title: "Integrated Payments",
      description:
        "Accept major credit cards, digital wallets, and custom payment methods. Payments reconcile automatically in your CubicleERP Finance module.",
    },
    {
      icon: TrendingUp,
      title: "Sales Analytics",
      description:
        "Track performance across multiple registers and locations. Identify best-selling items, peak hours, and top-performing staff from a unified dashboard.",
    },
  ],
  benefits: [
    {
      title: "Real-Time Inventory Sync",
      description:
        "Never oversell an item. When a product is bought in-store, online inventory is updated instantly, and vice versa.",
    },
    {
      title: "Simplified Management",
      description:
        "Stop managing two disparate systems. Handle product catalogs, descriptions, images, and inventory from a single, centralized database.",
    },
    {
      title: "Enhanced Customer Experience",
      description:
        "Recognize customers whether they buy at the physical register or online. Offer unified loyalty points and comprehensive purchase histories.",
    },
    {
      title: "Offline Reliability",
      description:
        "Keep ringing up customers even if the internet drops. The POS system works offline and syncs data to the cloud seamlessly when connection is restored.",
    },
    {
      title: "Frictionless Accounting",
      description:
        "Daily shift closures and online transactions post directly to your general ledger without manual data entry or end-of-day spreadsheet importing.",
    },
    {
      title: "Agile Promotions",
      description:
        "React to market trends quickly. Implement flash sales or discounts globally across all retail branches and the web in just a few clicks.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Build Your Catalog",
      description:
        "Publish your inventory to the web and POS simultaneously. Assign images, variants, and pricing tiers effortlessly.",
    },
    {
      step: "2",
      title: "Start Selling Anywhere",
      description:
        "Launch your online storefront and deploy the POS interface on tablets and registers at your physical locations.",
    },
    {
      step: "3",
      title: "Fulfill & Grow",
      description:
        "Manage all orders from a central hub. Dispatch shipping for web orders and hand over physical goods, all tracked by the system.",
    },
  ],
  useCases: [
    {
      title: "Retail Stores",
      description:
        "Perfect for boutiques, electronics, or grocers looking to speed up checkout lines while maintaining an accurate ledger.",
      highlights: [
        "Hardware-agnostic POS interface",
        "Employee shift and cash drawer management",
        "Barcode and scale integrations",
      ],
    },
    {
      title: "B2B Wholesalers",
      description:
        "Provide clients with customized self-service portals to place bulk orders online using their specific negotiated price lists.",
      highlights: [
        "Customer-specific pricing catalogs",
        "Credit limits and net-terms invoicing",
        "Bulk order grids",
      ],
    },
    {
      title: "Multi-Location Chains",
      description:
        "Consolidate sales data from dozens of branches into one headquarters dashboard while allowing local stock transfers.",
      highlights: [
        "Store-specific inventory tracking",
        "Inter-branch transfers",
        "Consolidated group reporting",
      ],
    },
  ],
  faqs: [
    {
      question: "Can I use my existing POS hardware?",
      answer:
        "Yes, the CubicleERP POS is browser-based and compatible with most standard USB/Bluetooth barcode scanners, ESC/POS receipt printers, and cash drawers.",
    },
    {
      question: "Does it support product variants like size and color?",
      answer:
        "Absolutely. You can create matrix items with multiple attributes (size, color, material) and track inventory at the variant level.",
    },
    {
      question: "Can customers buy online and return in-store?",
      answer:
        "Yes, since all sales data resides in the same database, your retail staff can easily locate web orders and process refunds or exchanges at the physical register.",
    },
    {
      question: "Which payment gateways do you support?",
      answer:
        "We support major gateways like Stripe, PayPal, and Authorize.Net for e-commerce, as well as standalone terminals and integrated card readers for the POS.",
    },
    {
      question: "Is the e-commerce storefront customizable?",
      answer:
        "Yes, the built-in online store features a flexible template engine. You can adjust themes, colors, and layouts to perfectly match your brand identity.",
    },
  ],
  stats: [
    { value: "0", label: "Inventory sync delays" },
    { value: "40%", label: "Faster checkout times" },
    { value: "1 Platform", label: "For online & offline sales" },
    { value: "50%", label: "Less admin work" },
  ],
  capabilities: [
    {
      title: "Omnichannel Order Management",
      description:
        "Centralize every order from your website, POS terminals, marketplace listings, and phone sales into a single order management hub. Each order follows a unified fulfillment workflow regardless of its origin, giving your operations team one place to manage picking, packing, shipping, and returns.",
      keyPoints: [
        "Unified order queue aggregating web, POS, and marketplace sales",
        "Configurable fulfillment workflows with automated status updates",
        "Split shipment and partial fulfillment handling for complex orders",
        "Customer order tracking page with real-time shipping status",
      ],
    },
    {
      title: "Dynamic Pricing and Promotions Engine",
      description:
        "Create sophisticated pricing rules that adapt to customer segments, purchase volumes, time windows, and inventory levels. Run flash sales, bundle deals, tiered discounts, and loyalty reward redemptions across all your sales channels from a single configuration interface.",
      keyPoints: [
        "Customer-segment-specific pricing tiers for retail, wholesale, and VIP",
        "Time-bound promotional campaigns with automatic activation and expiry",
        "Bundle and kit pricing with dynamic component margin calculations",
        "Coupon code engine with usage limits, minimum order values, and exclusions",
      ],
    },
    {
      title: "Multi-Store and Multi-Location Architecture",
      description:
        "Operate multiple online storefronts and physical retail locations from a single CubicleERP instance. Each store can have its own branding, product catalog subset, pricing rules, and tax configuration while sharing a common inventory pool and back-office operations layer.",
      keyPoints: [
        "Independent storefronts with unique domains, branding, and catalogs",
        "Location-specific tax rules and payment gateway configurations",
        "Shared inventory pool with location-based stock allocation",
        "Consolidated reporting across all stores with per-location drill-down",
      ],
    },
    {
      title: "Customer Loyalty and Retention",
      description:
        "Build and manage loyalty programs that reward repeat customers with points, discounts, and exclusive offers. Track customer lifetime value, purchase frequency, and engagement patterns to deliver targeted campaigns that increase retention and average order value across all channels.",
      keyPoints: [
        "Points-based loyalty program with flexible earning and redemption rules",
        "Customer segmentation based on purchase behavior and lifetime value",
        "Automated win-back campaigns for lapsed customers",
        "Unified loyalty balance visible at both POS checkout and online cart",
      ],
    },
  ],
  integrations: [
    { name: "Stripe", category: "Payments" },
    { name: "PayPal", category: "Payments" },
    { name: "Shopify", category: "E-Commerce" },
    { name: "WooCommerce", category: "E-Commerce" },
    { name: "Amazon", category: "Marketplace" },
    { name: "Google Shopping", category: "Marketplace" },
    { name: "Mailchimp", category: "Email Marketing" },
    { name: "ShipStation", category: "Shipping" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Google Analytics", category: "Analytics" },
    { name: "Meta Ads", category: "Advertising" },
    { name: "Klaviyo", category: "Marketing Automation" },
  ],
  testimonials: [
    {
      quote:
        "We used to run our online store and three retail locations on completely separate systems. Inventory mismatches were constant. Since moving to CubicleERP, we have a single source of truth and have not oversold a product once.",
      author: "Sarah Mitchell",
      role: "Director of Operations",
      company: "UrbanCraft Home Goods",
      metric: "Zero overselling incidents since launch",
    },
    {
      quote:
        "The POS system is remarkably fast and intuitive. Our checkout staff were trained in under an hour, and our average transaction time has dropped significantly. Customers notice the difference during peak hours.",
      author: "Tom Alvarez",
      role: "Store Manager",
      company: "Freshfield Organics",
      metric: "40% faster average checkout time",
    },
    {
      quote:
        "Running promotions used to require coordination between three different tools. Now we set it up once in CubicleERP and it applies everywhere — online, in-store, and on our wholesale portal. The time savings are enormous.",
      author: "Nina Johansson",
      role: "Head of Marketing",
      company: "Nordic Apparel Co.",
      metric: "75% less time managing cross-channel promotions",
    },
  ],
  comparisons: [
    { feature: "Inventory Sync", traditional: "Delayed batch updates", cubicleErp: "Real-time across channels" },
    { feature: "POS Setup", traditional: "Expensive hardware lock-in", cubicleErp: "Browser-based, any device" },
    { feature: "Online Store", traditional: "Separate platform needed", cubicleErp: "Built-in and connected" },
    { feature: "Promotions", traditional: "Per-channel configuration", cubicleErp: "Single setup, all channels" },
    { feature: "Payment Reconciliation", traditional: "Manual end-of-day", cubicleErp: "Automatic ledger posting" },
    { feature: "Customer Data", traditional: "Fragmented across systems", cubicleErp: "Unified customer profile" },
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
    { label: "Supply Chain", href: "/explore/scm" },
    { label: "Analytics", href: "/explore/analytics" },
  ],
}

export default function EcommercePage() {
  return <ExploreProductPage data={data} />
}
