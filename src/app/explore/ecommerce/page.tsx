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
}

export default function EcommercePage() {
  return <ExploreProductPage data={data} />
}
