"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Truck,
    MapPin,
    BarChart3,
    Clock,
    Package,
    Route,
    Warehouse,
    Navigation,
    Users,
    Shield,
    DollarSign,
    Globe,
} from "lucide-react"

const data = {
    name: "Logistics",
    tagline: "Intelligent fleet management & end-to-end supply chain visibility",
    description:
        "CubicleERP Logistics is a comprehensive platform built for logistics companies, freight operators, courier services, and distribution networks. From real-time GPS tracking and AI-powered route optimization to warehouse management and last-mile delivery orchestration, gain complete control over your entire supply chain. Reduce operational costs, accelerate deliveries, and delight customers with full shipment transparency.",
    icon: Truck,
    color: "#4F46E5",
    lightColor: "#EEF2FF",
    heroImage:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    variant: 3 as const,
    features: [
        {
            icon: Navigation,
            title: "Real-Time GPS Tracking",
            description:
                "Monitor every vehicle, container, and shipment across your entire fleet with live GPS tracking and geofencing capabilities. Get instant alerts for unauthorized stops, route deviations, and idle time while tracking driver behavior, fuel consumption, and vehicle diagnostics in real time. Historical tracking data powers performance analysis, customer inquiries, and dispute resolution with full audit trails.",
        },
        {
            icon: Route,
            title: "AI-Powered Route Optimization",
            description:
                "Leverage intelligent algorithms that factor in live traffic conditions, weather forecasts, delivery windows, and vehicle capacity to generate the most efficient routes automatically. Multi-stop route planning with priority handling ensures urgent shipments are delivered first while minimizing fuel costs and drive time. Dynamic re-routing adjusts plans on the fly when conditions change, keeping your fleet agile and on schedule.",
        },
        {
            icon: Package,
            title: "Shipment & Delivery Management",
            description:
                "Manage the complete lifecycle of every shipment from pickup request through final delivery with automated status updates at each milestone. Capture electronic proof of delivery including signatures, photos, and timestamps while handling delivery exceptions, failed attempts, and automatic rescheduling seamlessly. Customers receive real-time tracking links and estimated arrival notifications, reducing inbound inquiries by up to 60%.",
        },
        {
            icon: Warehouse,
            title: "Warehouse & Inventory Integration",
            description:
                "Connect your warehouse operations directly to your logistics workflows with integrated inventory management, pick-and-pack optimization, and dock scheduling. Track stock levels across multiple warehouses and distribution centers in real time, ensuring the right products are dispatched from the nearest facility. Barcode and RFID scanning support streamlines receiving, putaway, and order fulfillment processes for faster turnaround.",
        },
        {
            icon: Users,
            title: "Driver & Fleet Management",
            description:
                "Maintain a comprehensive profile for every driver and vehicle including certifications, license expiry, insurance documents, and maintenance schedules in one centralized hub. Performance scorecards track metrics like on-time delivery rate, fuel efficiency, safety incidents, and customer ratings to identify top performers and coaching opportunities. Automated task assignment, in-app messaging, and shift scheduling keep your drivers coordinated and productive throughout the day.",
        },
        {
            icon: BarChart3,
            title: "Freight Cost & Analytics Engine",
            description:
                "Calculate freight costs accurately with support for multiple rate structures including per-mile, per-kg, zone-based, and volumetric pricing across different carrier contracts. Advanced analytics dashboards surface key metrics such as cost per delivery, revenue per route, fleet utilization, and on-time performance with drill-down capabilities. Predictive forecasting models help you anticipate demand surges, plan capacity, and negotiate better rates with carriers.",
        },
    ],
    benefits: [
        {
            title: "Cut Operational Costs by Up to 25%",
            description:
                "Optimized routing reduces fuel consumption and vehicle wear while automated dispatch eliminates manual planning overhead. Fewer failed deliveries and improved fleet utilization mean you move more freight with fewer resources, driving significant savings across your operation.",
        },
        {
            title: "Deliver On Time, Every Time",
            description:
                "Real-time tracking combined with dynamic route adjustments ensures your deliveries meet promised windows consistently. Proactive exception handling and automated customer notifications keep expectations aligned, boosting your on-time delivery rate to 98% or higher.",
        },
        {
            title: "Complete Supply Chain Visibility",
            description:
                "From warehouse shelf to customer doorstep, track every touchpoint in your supply chain with a single unified dashboard. Stakeholders, dispatchers, and customers all access the same real-time data, eliminating information silos and enabling faster, smarter decisions.",
        },
        {
            title: "Faster Last-Mile Delivery",
            description:
                "Purpose-built last-mile tools including delivery slot management, driver proximity matching, and customer self-scheduling reduce final-leg delivery times dramatically. Proof-of-delivery capture and instant confirmation close the loop and improve customer satisfaction scores.",
        },
        {
            title: "Regulatory Compliance Made Simple",
            description:
                "Automated tracking of vehicle inspections, maintenance intervals, driver hours-of-service, and emission standards keeps your fleet compliant without manual effort. Generate audit-ready compliance reports instantly and receive proactive alerts before any certification or license expires.",
        },
        {
            title: "Scale Without Growing Pains",
            description:
                "Whether you operate 10 vehicles or 10,000, CubicleERP scales seamlessly with your business across multiple depots, regions, and countries. Add new drivers, vehicles, and routes without proportional increases in administrative overhead or system complexity.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Fleet & Operations Assessment",
            description:
                "Our logistics specialists conduct a detailed assessment of your fleet size, delivery patterns, route structures, warehouse operations, and existing technology stack. We map your current workflows and identify immediate optimization opportunities to build a tailored implementation roadmap.",
        },
        {
            step: "2",
            title: "Configuration, Integration & Training",
            description:
                "We configure CubicleERP for your specific logistics workflows, integrate GPS devices and telematics hardware, connect warehouse systems, and migrate historical fleet and shipment data. Your dispatchers, drivers, and managers receive role-specific hands-on training to ensure confident adoption from day one.",
        },
        {
            step: "3",
            title: "Go-Live & Continuous Optimization",
            description:
                "After thorough testing and a phased pilot rollout across select routes, we deploy across your full operation with dedicated support. Ongoing analytics reviews and quarterly optimization sessions ensure you continuously improve efficiency, reduce costs, and adapt to changing business demands.",
        },
    ],
    useCases: [
        {
            title: "Courier & Last-Mile Delivery",
            description:
                "Courier companies and last-mile delivery operators use CubicleERP to manage thousands of daily deliveries with optimized routing, real-time package tracking, and automated customer notifications that reduce missed deliveries and support calls.",
            highlights: [
                "Real-time package tracking with customer-facing delivery links",
                "Dynamic route optimization for high-density urban deliveries",
                "Electronic proof of delivery with photo and signature capture",
            ],
        },
        {
            title: "Freight & Long-Haul Transport",
            description:
                "Freight carriers and long-haul operators rely on CubicleERP to manage cross-country shipments, monitor driver hours-of-service compliance, calculate complex freight rates, and coordinate multi-modal transport across road, rail, and intermodal networks.",
            highlights: [
                "Multi-modal freight management across road and rail",
                "Hours-of-service compliance monitoring and alerts",
                "Automated freight cost calculation with carrier rate comparison",
            ],
        },
        {
            title: "Warehouse & Distribution Networks",
            description:
                "Distribution companies use CubicleERP to synchronize warehouse operations with outbound logistics, manage multi-depot inventory allocation, and coordinate regional delivery schedules to ensure products reach retail locations and end customers on time.",
            highlights: [
                "Multi-warehouse inventory visibility and allocation",
                "Dock scheduling and load optimization",
                "Regional delivery coordination across distribution centers",
            ],
        },
    ],
    faqs: [
        {
            question: "What GPS and telematics devices does CubicleERP integrate with?",
            answer: "CubicleERP integrates with all major GPS and telematics providers including Samsara, Verizon Connect, Geotab, CalAmp, and Queclink. We also support generic OBD-II devices and any hardware that transmits data via standard protocols. Our open REST API allows custom integrations with proprietary tracking systems, and our integration team provides hands-on support to connect your existing devices within days.",
        },
        {
            question: "How does the route optimization engine work?",
            answer: "Our AI-powered route optimization engine ingests real-time traffic feeds, historical delivery data, weather conditions, vehicle capacity constraints, and customer time-window preferences to compute the most efficient route for each driver. The algorithm recalculates dynamically as conditions change throughout the day, and most customers see a 15-30% improvement in delivery efficiency along with measurable fuel savings within the first month of use.",
        },
        {
            question: "Can customers and partners track shipments in real time?",
            answer: "Absolutely. CubicleERP generates unique tracking links for every shipment that customers can access via email, SMS, or your branded tracking portal. The tracking page shows live vehicle location, estimated time of arrival, and delivery status updates at each milestone. You can also provide API access to B2B partners so they can pull tracking data directly into their own systems.",
        },
        {
            question: "How does CubicleERP handle warehouse and inventory management?",
            answer: "CubicleERP includes integrated warehouse management capabilities covering receiving, putaway, pick-and-pack, and dispatch workflows. You can manage inventory across multiple warehouses with real-time stock visibility, set reorder thresholds, and automate allocation decisions based on proximity to delivery destinations. Barcode and RFID scanning support ensures accuracy at every stage from inbound receiving to outbound loading.",
        },
        {
            question: "What reporting and analytics are available for fleet performance?",
            answer: "CubicleERP provides over 50 pre-built analytics dashboards covering fleet utilization, cost per delivery, fuel efficiency, on-time performance, driver scorecards, and route profitability. Every report supports drill-down by vehicle, driver, route, time period, and customer. You can schedule automated report delivery to stakeholders and export data in PDF, Excel, or CSV formats. Predictive analytics modules also help forecast demand and plan capacity proactively.",
        },
    ],
    stats: [
        { value: "500+", label: "Logistics companies powered" },
        { value: "75K+", label: "Vehicles tracked daily" },
        { value: "25%", label: "Average cost reduction" },
        { value: "99.97%", label: "Platform uptime SLA" },
    ],
}

export default function LogisticsPage() {
    return <ExploreProductPage data={data} />
}
