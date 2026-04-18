"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Factory,
  Settings,
  Wrench,
  ClipboardList,
  CheckCircle,
  Activity,
} from "lucide-react"

const data = {
  name: "Manufacturing",
  tagline: "Streamline your production and material planning",
  description:
    "CubicleERP Manufacturing (MRP) connects your shop floor to your business. Manage Bills of Materials, track work orders in real-time, optimize machine capacity, and assure quality while keeping everything tightly synced with your inventory and finance operations.",
  icon: Factory,
  color: "#D32F2F",
  lightColor: "#FFEBEE",
  heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80",
  variant: 1 as const,
  features: [
    {
      icon: ClipboardList,
      title: "Bill of Materials (BOM)",
      description:
        "Create complex, multi-level BOMs defining exact quantities of raw materials and sub-assemblies needed for final products. Manage revisions easily.",
    },
    {
      icon: Settings,
      title: "Production Planning",
      description:
        "Schedule manufacturing orders based on demand and material availability. Ensure components arrive just-in-time to minimize holding costs.",
    },
    {
      icon: Activity,
      title: "Shop Floor Tracking",
      description:
        "Monitor work-in-progress (WIP) in real time. Track time spent at each workstation and identify bottlenecks before they delay final delivery.",
    },
    {
      icon: Wrench,
      title: "Equipment Maintenance",
      description:
        "Schedule preventative maintenance for machinery. Reduce unplanned downtime and ensure your equipment operates at peak efficiency.",
    },
    {
      icon: CheckCircle,
      title: "Quality Control",
      description:
        "Define quality checkpoints throughout the manufacturing process. Automatically trigger rework orders if components fail inspections.",
    },
    {
      icon: Factory,
      title: "Capacity Planning",
      description:
        "Visualize the load on your work centers. Balance production schedules to avoid overloading specific machines or personnel.",
    },
  ],
  benefits: [
    {
      title: "Increased Production Efficiency",
      description:
        "Eliminate idle time by ensuring materials and machine availability align perfectly with your production schedules.",
    },
    {
      title: "Accurate Costing",
      description:
        "Capture direct and indirect costs, including labor and machine overhead, to calculate the true cost of goods sold (COGS).",
    },
    {
      title: "Reduced Wastage",
      description:
        "Minimize scrap and material waste through better planning and stricter quality control protocols on the shop floor.",
    },
    {
      title: "Faster Time to Market",
      description:
        "Accelerate production cycles with streamlined workflows that automatically convert sales orders into manufacturing tasks.",
    },
    {
      title: "Better Traceability",
      description:
        "Track lot and serial numbers from raw materials to finished goods, simplifying compliance and recall management.",
    },
    {
      title: "Seamless ERP Integration",
      description:
        "Automatically deduct raw materials from inventory and add finished goods upon completion, keeping accounting accurate.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Define the BOM",
      description:
        "Input your recipes or assemblies, mapping materials, labor, and expected machine overhead costs.",
    },
    {
      step: "2",
      title: "Schedule Production",
      description:
        "Generate manufacturing orders and assign them to specific work centers based on priority and availability.",
    },
    {
      step: "3",
      title: "Execute & Complete",
      description:
        "Track progress, log time, and register finished goods into inventory instantly for fulfillment.",
    },
  ],
  useCases: [
    {
      title: "Process Manufacturing",
      description:
        "Ideal for food and beverage, chemicals, or cosmetics where mixing ingredients based on precise formulas and batch tracking is critical.",
      highlights: [
        "Recipe and formula management",
        "Batch and lot traceability",
        "Shelf-life and expiration tracking",
      ],
    },
    {
      title: "Discrete Manufacturing",
      description:
        "Perfect for electronics, furniture, or automotive parts where products are assembled from distinct components.",
      highlights: [
        "Multi-level routing",
        "Sub-assembly management",
        "Scrap and rework handling",
      ],
    },
    {
      title: "Make-to-Order Businesses",
      description:
        "Connect sales directly to the factory floor, ensuring custom products are planned and produced efficiently upon order confirmation.",
      highlights: [
        "Direct Sales-to-Manufacturing links",
        "Custom configurations support",
        "Real-time customer status updates",
      ],
    },
  ],
  faqs: [
    {
      question: "Can I track labor costs individually per production order?",
      answer:
        "Yes, workers can log their time against specific work center operations, allowing you to capture precise direct labor costs for every batch.",
    },
    {
      question: "Does it support multi-level BOMs?",
      answer:
        "Yes. You can nest BOMs infinitely, meaning a final product can consist of sub-assemblies that themselves have their own BOMs and routing.",
    },
    {
      question: "How does it handle material shortages?",
      answer:
        "The system will alert you when you try to schedule an order without sufficient components in stock and can automatically generate purchase requests for procurement.",
    },
    {
      question: "Is there a specific dashboard for floor workers?",
      answer:
        "Yes, there is a simplified 'Shop Floor' view optimized for tablets where workers can clock in, view instructions, report scrap, and mark operations as complete.",
    },
    {
      question: "Does it help with compliance tracking?",
      answer:
        "Absolutely. Full batch and serial number tracking ensures you can trace the journey of any component from supplier to final customer, aiding in ISO and FDA compliance.",
    },
  ],
  stats: [
    { value: "25%", label: "Increase in production output" },
    { value: "99%", label: "Inventory accuracy" },
    { value: "30%", label: "Reduction in downtime" },
    { value: "20%", label: "Lower scrap rates" },
  ],
  capabilities: [
    {
      title: "Advanced BOM and Routing Management",
      description:
        "Build and maintain complex, multi-level Bills of Materials with revision control, engineering change order tracking, and alternative component definitions. Define detailed routing sequences that specify the exact operations, work centers, setup times, and run times required to produce each product.",
      keyPoints: [
        "Multi-level BOM nesting with unlimited depth for complex assemblies",
        "Engineering change order workflow with approval and effective date control",
        "Alternative component and substitute material definitions for flexibility",
        "Routing-level costing with operation-specific labor and overhead rates",
      ],
    },
    {
      title: "Real-Time Shop Floor Execution",
      description:
        "Equip your production floor with a tablet-optimized interface that allows operators to clock into operations, report output quantities, log scrap and rework, and record quality inspection results. Every action updates the production schedule and inventory in real time, giving management instant visibility into work-in-progress status.",
      keyPoints: [
        "Tablet-friendly shop floor terminal with simplified operator interface",
        "Real-time WIP tracking with operation-level progress reporting",
        "Scrap and rework logging with reason code classification",
        "Digital work instructions and technical drawings at each workstation",
      ],
    },
    {
      title: "Material Requirements Planning (MRP)",
      description:
        "Run MRP calculations that analyze your sales orders, forecasts, current inventory, and lead times to generate precise procurement and production recommendations. The system determines what to make, what to buy, and when — ensuring materials arrive just in time to meet production schedules without excess holding costs.",
      keyPoints: [
        "Net requirements computation considering on-hand stock and open orders",
        "Automatic generation of planned production and purchase orders",
        "Lead time offsetting to ensure materials arrive when operations need them",
        "Configurable planning horizons with frozen and flexible scheduling zones",
      ],
    },
    {
      title: "Quality Management System",
      description:
        "Embed quality control directly into your manufacturing process with inspection checkpoints at receiving, in-process, and final stages. Define quality plans with specific parameters, tolerances, and sampling rules. Non-conforming materials trigger automated disposition workflows for rework, scrap, or return to supplier.",
      keyPoints: [
        "Configurable inspection plans with statistical sampling methods",
        "In-process quality checkpoints integrated into production routing",
        "Non-conformance management with root cause analysis tracking",
        "Certificate of Analysis generation for outbound quality documentation",
      ],
    },
  ],
  integrations: [
    { name: "AutoCAD", category: "Design" },
    { name: "SolidWorks", category: "Design" },
    { name: "SAP", category: "ERP" },
    { name: "Siemens Opcenter", category: "MES" },
    { name: "QuickBooks", category: "Accounting" },
    { name: "Power BI", category: "Analytics" },
    { name: "Slack", category: "Communication" },
    { name: "Jira", category: "Project Management" },
    { name: "Zebra Printers", category: "Labeling" },
    { name: "Google Sheets", category: "Productivity" },
  ],
  testimonials: [
    {
      quote:
        "CubicleERP Manufacturing transformed our production planning. We went from a whiteboard-and-spreadsheet approach to a fully digital system that schedules work orders, tracks WIP, and updates inventory automatically. Our on-time delivery rate has improved dramatically.",
      author: "Robert Chen",
      role: "Plant Manager",
      company: "Precision Components Ltd.",
      metric: "25% increase in on-time delivery",
    },
    {
      quote:
        "The quality control module alone justified the investment. We embedded inspection checkpoints into every routing, and our defect escape rate dropped to near zero. Our biggest customer noticed the improvement and increased their order volume.",
      author: "Anita Sharma",
      role: "Quality Director",
      company: "TechFab Industries",
      metric: "90% reduction in customer-reported defects",
    },
    {
      quote:
        "MRP planning used to take our team an entire week to compute manually. Now the system runs it overnight and we have accurate purchase and production recommendations waiting for us every morning. It has completely changed how we operate.",
      author: "Klaus Weber",
      role: "Director of Operations",
      company: "Alpine Manufacturing GmbH",
      metric: "85% reduction in planning cycle time",
    },
  ],
  comparisons: [
    { feature: "Production Scheduling", traditional: "Whiteboards and spreadsheets", cubicleErp: "Automated capacity planning" },
    { feature: "BOM Management", traditional: "Static documents", cubicleErp: "Version-controlled digital BOMs" },
    { feature: "Shop Floor Tracking", traditional: "Paper-based reporting", cubicleErp: "Real-time digital tracking" },
    { feature: "Quality Control", traditional: "Manual inspection logs", cubicleErp: "Integrated QC checkpoints" },
    { feature: "Material Planning", traditional: "Manual MRP spreadsheets", cubicleErp: "Automated MRP engine" },
    { feature: "Costing", traditional: "Estimated after production", cubicleErp: "Real-time actual costing" },
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
    { label: "Supply Chain", href: "/explore/scm" },
    { label: "Inventory", href: "/explore/inventory" },
    { label: "Automation", href: "/explore/automation" },
  ],
}

export default function ManufacturingPage() {
  return <ExploreProductPage data={data} />
}
