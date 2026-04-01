"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Truck,
    MapPin,
    BarChart3,
    Clock,
    Users,
    Shield,
} from "lucide-react"

const data = {
    name: "Logistics",
    tagline: "Fleet management & delivery tracking for logistics companies",
    description:
        "CubicleERP Logistics is purpose-built for logistics companies, courier services, and fleet operators. Real-time GPS tracking, route optimization, delivery management, driver coordination, and comprehensive analytics help you manage fleets efficiently, reduce costs, and improve customer satisfaction with complete visibility into every shipment and vehicle.",
    icon: Truck,
    color: "#EA580C",
    lightColor: "#FFEDD5",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    features: [
        {
            icon: MapPin,
            title: "Real-Time GPS Tracking",
            description:
                "Track every vehicle and shipment in real-time with live GPS tracking. Monitor driver behavior, fuel consumption, and vehicle health. Geofencing alerts for unauthorized stops. Historical tracking data for performance analysis and customer inquiries.",
        },
        {
            icon: Clock,
            title: "Route Optimization & Planning",
            description:
                "Intelligent route optimization reduces fuel costs and delivery times. Automatic route planning based on traffic, weather, and delivery windows. Multi-stop route management with priority handling. Real-time route adjustments based on changing conditions.",
        },
        {
            icon: Truck,
            title: "Delivery Management",
            description:
                "End-to-end delivery tracking from pickup to final delivery. Automated delivery notifications and proof of delivery. Customer signature capture and photo documentation. Delivery exception handling and failed delivery management.",
        },
        {
            icon: Users,
            title: "Driver & Fleet Management",
            description:
                "Comprehensive driver management with performance tracking and safety monitoring. Vehicle maintenance scheduling and compliance tracking. Driver communication and task assignment. Performance analytics and driver scorecards.",
        },
        {
            icon: BarChart3,
            title: "Logistics Analytics & Reporting",
            description:
                "Track key metrics like on-time delivery rate, fuel efficiency, and cost per delivery. Generate performance reports by driver, vehicle, and route. Identify optimization opportunities and cost-saving initiatives. Predictive analytics for demand forecasting.",
        },
        {
            icon: Shield,
            title: "Compliance & Safety",
            description:
                "Automated compliance tracking for vehicle inspections and maintenance. Driver safety monitoring and incident reporting. Hours of service compliance for regulatory requirements. Insurance and documentation management.",
        },
    ],
    benefits: [
        {
            title: "Reduce Operational Costs",
            description:
                "Optimize routes to reduce fuel consumption and vehicle wear. Improve driver efficiency and reduce idle time. Minimize failed deliveries and customer complaints. Logistics companies using CubicleERP see an average 20% reduction in operational costs.",
        },
        {
            title: "Improve On-Time Delivery",
            description:
                "Real-time tracking and route optimization ensure timely deliveries. Proactive exception handling prevents delays. Customer notifications keep expectations aligned. Increase customer satisfaction and retention.",
        },
        {
            title: "Enhance Visibility",
            description:
                "Complete visibility into fleet operations from dispatch to delivery. Real-time tracking for customer inquiries. Historical data for performance analysis and continuous improvement.",
        },
        {
            title: "Streamline Operations",
            description:
                "Automated dispatch and route planning reduce manual work. Integrated driver communication reduces coordination overhead. Unified platform for all logistics operations.",
        },
        {
            title: "Ensure Compliance",
            description:
                "Automated compliance tracking for vehicle maintenance and inspections. Hours of service monitoring for regulatory compliance. Comprehensive audit trails for all operations.",
        },
        {
            title: "Scale Your Fleet",
            description:
                "Manage growing fleets without proportional increase in administrative overhead. Support for multiple depots and distribution centers. Scalable platform grows with your business.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Logistics Assessment",
            description:
                "Our logistics specialists conduct a thorough assessment of your fleet operations, delivery processes, route patterns, and technology infrastructure. We create a detailed implementation plan tailored to your specific logistics needs.",
        },
        {
            step: "2",
            title: "Configuration & Integration",
            description:
                "We configure CubicleERP for your logistics workflows, integrate GPS devices and telematics systems, migrate existing fleet data, and set up route optimization parameters. Your team receives comprehensive training on all features.",
        },
        {
            step: "3",
            title: "Deployment & Optimization",
            description:
                "We conduct thorough testing and quality assurance before deployment. Phased rollout with pilot routes ensures smooth transition. Ongoing optimization to maximize efficiency gains and cost savings.",
        },
    ],
    useCases: [
        {
            title: "Courier & Parcel Services",
            description:
                "Courier companies use CubicleERP to manage high-volume deliveries, optimize routes, track packages in real-time, and provide customers with accurate delivery updates.",
            highlights: [
                "Real-time package tracking for customers",
                "Route optimization for high-volume deliveries",
                "Automated delivery notifications",
            ],
        },
        {
            title: "Fleet Operators",
            description:
                "Fleet operators use CubicleERP to manage vehicle maintenance, monitor driver performance, optimize fuel consumption, and ensure regulatory compliance.",
            highlights: [
                "Vehicle maintenance scheduling and tracking",
                "Driver performance monitoring",
                "Fuel efficiency optimization",
            ],
        },
        {
            title: "Distribution Networks",
            description:
                "Distribution companies use CubicleERP to manage multi-depot operations, coordinate deliveries across regions, and optimize supply chain logistics.",
            highlights: [
                "Multi-depot fleet management",
                "Regional delivery coordination",
                "Supply chain optimization",
            ],
        },
    ],
    faqs: [
        {
            question: "What GPS devices does CubicleERP support?",
            answer:
                "CubicleERP integrates with most major GPS and telematics providers including Samsara, Verizon Connect, Geotab, and others. We also support generic GPS devices via our REST API. Our integration team can help you connect your existing devices.",
        },
        {
            question: "How accurate is the route optimization?",
            answer:
                "Our route optimization engine uses real-time traffic data, historical patterns, and machine learning to provide highly accurate route recommendations. Most customers see 15-25% improvement in delivery efficiency after implementing optimized routes.",
        },
        {
            question: "Can customers track their deliveries in real-time?",
            answer:
                "Yes. CubicleERP includes a customer tracking portal where customers can see real-time delivery status, estimated arrival time, and driver contact information. This reduces customer inquiries and improves satisfaction.",
        },
        {
            question: "Does CubicleERP help with compliance?",
            answer:
                "Yes. CubicleERP automates compliance tracking for vehicle inspections, maintenance schedules, and hours of service regulations. Generate compliance reports for audits and regulatory reviews.",
        },
        {
            question: "How does CubicleERP handle failed deliveries?",
            answer:
                "CubicleERP tracks failed delivery attempts, captures reasons for failure, and automatically reschedules deliveries. Detailed exception reports help identify patterns and improve delivery success rates.",
        },
    ],
    stats: [
        { value: "300+", label: "Logistics companies" },
        { value: "50K+", label: "Vehicles managed" },
        { value: "20%", label: "Cost reduction average" },
        { value: "99.95%", label: "Platform uptime SLA" },
    ],
}

export default function LogisticsPage() {
    return <ExploreProductPage data={data} />
}
