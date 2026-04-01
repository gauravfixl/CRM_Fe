"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Heart,
    Users,
    TrendingUp,
    Mail,
    BarChart3,
    Lock,
} from "lucide-react"

const data = {
    name: "Non-Profit",
    tagline: "Donor management & fundraising platform for non-profits",
    description:
        "CubicleERP Non-Profit is purpose-built for NGOs, charities, foundations, and social enterprises. Manage donors, track donations, automate fundraising campaigns, and measure impact with integrated donor relationship management, grant tracking, volunteer coordination, and comprehensive reporting designed specifically for non-profit operations.",
    icon: Heart,
    color: "#7C3AED",
    lightColor: "#EDE9FE",
    heroImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80",
    features: [
        {
            icon: Users,
            title: "Donor Relationship Management",
            description:
                "Centralized donor database with complete giving history, communication preferences, and engagement tracking. Segment donors by giving level, interests, and demographics. Automate personalized communications and track donor lifecycle from prospect to major donor.",
        },
        {
            icon: TrendingUp,
            title: "Fundraising Campaign Management",
            description:
                "Create and manage multiple fundraising campaigns simultaneously. Track campaign performance, donor responses, and ROI. Automated email campaigns, peer-to-peer fundraising, and donation tracking. Monitor progress toward campaign goals in real-time.",
        },
        {
            icon: Mail,
            title: "Donation & Grant Tracking",
            description:
                "Track all donations, grants, and sponsorships in one place. Automated donation receipts and tax documentation. Grant application management with deadline tracking and reporting requirements. Monitor restricted vs. unrestricted funds.",
        },
        {
            icon: BarChart3,
            title: "Impact Measurement & Reporting",
            description:
                "Track program outcomes and measure social impact. Generate impact reports for donors and stakeholders. Monitor key performance indicators specific to your mission. Create compelling impact stories with data-driven insights.",
        },
        {
            icon: Users,
            title: "Volunteer Coordination",
            description:
                "Manage volunteer recruitment, scheduling, and tracking. Assign volunteers to programs and events. Track volunteer hours and contributions. Generate volunteer reports and recognition programs.",
        },
        {
            icon: Lock,
            title: "Financial Management & Compliance",
            description:
                "Integrated accounting for non-profit financial management. Track restricted and unrestricted funds separately. Generate compliance reports for audits and regulatory requirements. Support for fund accounting and grant compliance tracking.",
        },
    ],
    benefits: [
        {
            title: "Maximize Donor Engagement",
            description:
                "Build stronger relationships with donors through personalized communication and transparent impact reporting. Increase donor retention and lifetime value with targeted engagement strategies.",
        },
        {
            title: "Increase Fundraising Efficiency",
            description:
                "Automate fundraising workflows and reduce manual data entry. Identify high-value prospects and optimize campaign performance. Spend more time on mission-critical work and less on administrative tasks.",
        },
        {
            title: "Demonstrate Impact",
            description:
                "Measure and communicate the real impact of your programs. Create compelling impact reports that inspire donors and stakeholders. Show how donations are making a difference in your community.",
        },
        {
            title: "Streamline Operations",
            description:
                "Unified platform for donor management, fundraising, volunteer coordination, and financial management. Eliminate data silos and reduce manual work. Improve team collaboration and efficiency.",
        },
        {
            title: "Ensure Compliance",
            description:
                "Built-in compliance features for non-profit accounting and reporting. Generate required financial statements and donor reports. Maintain audit trails for all transactions and donor interactions.",
        },
        {
            title: "Scale Your Impact",
            description:
                "Grow your donor base and fundraising revenue without proportional increase in administrative overhead. Support multiple programs and initiatives from a single platform.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Non-Profit Assessment",
            description:
                "Our team conducts a thorough assessment of your fundraising processes, donor management needs, program tracking, and financial requirements. We create a customized implementation plan aligned with your mission and organizational structure.",
        },
        {
            step: "2",
            title: "Configuration & Data Migration",
            description:
                "We configure CubicleERP for your non-profit workflows, migrate existing donor and financial data, set up fundraising campaigns, and integrate with your accounting systems. Your team receives comprehensive training on all features.",
        },
        {
            step: "3",
            title: "Launch & Optimization",
            description:
                "We conduct thorough testing and quality assurance before launch. Phased rollout ensures smooth transition. Ongoing support and optimization to maximize adoption and impact measurement.",
        },
    ],
    useCases: [
        {
            title: "Charities & Foundations",
            description:
                "Large charities and foundations use CubicleERP to manage thousands of donors, track grants and donations, and measure program impact across multiple initiatives.",
            highlights: [
                "Centralized donor database with giving history",
                "Grant tracking and compliance reporting",
                "Impact measurement and donor reporting",
            ],
        },
        {
            title: "NGOs & Social Enterprises",
            description:
                "NGOs and social enterprises use CubicleERP to coordinate fundraising, manage volunteers, track program outcomes, and maintain financial compliance.",
            highlights: [
                "Volunteer coordination and tracking",
                "Program outcome measurement",
                "Fundraising campaign management",
            ],
        },
        {
            title: "Community Organizations",
            description:
                "Community organizations use CubicleERP to manage local fundraising, engage community members, and track the impact of their programs.",
            highlights: [
                "Local donor engagement and retention",
                "Community program tracking",
                "Peer-to-peer fundraising support",
            ],
        },
    ],
    faqs: [
        {
            question: "Is CubicleERP suitable for small non-profits?",
            answer:
                "Yes. CubicleERP is designed to scale from small grassroots organizations to large national charities. Start with basic donor management and fundraising, then add more features as you grow. Pricing is flexible and based on your organization's size and needs.",
        },
        {
            question: "Can CubicleERP help with grant management?",
            answer:
                "Yes. CubicleERP includes grant tracking features to manage grant applications, deadlines, reporting requirements, and compliance. Track grant funding separately and generate required reports for grantmakers.",
        },
        {
            question: "How does CubicleERP handle restricted funds?",
            answer:
                "CubicleERP supports fund accounting with separate tracking of restricted and unrestricted funds. Ensure compliance with donor restrictions and generate financial reports that properly categorize fund usage.",
        },
        {
            question: "Can donors access their giving history?",
            answer:
                "Yes. CubicleERP includes a donor portal where donors can view their giving history, receive tax receipts, and access impact reports. This increases transparency and strengthens donor relationships.",
        },
        {
            question: "Does CubicleERP integrate with accounting software?",
            answer:
                "Yes. CubicleERP integrates with popular accounting software like QuickBooks and Xero. Donations and grants automatically sync to your accounting system for accurate financial reporting.",
        },
    ],
    stats: [
        { value: "500+", label: "Non-profit organizations" },
        { value: "$2B+", label: "Donations tracked" },
        { value: "50K+", label: "Active volunteers managed" },
        { value: "99.9%", label: "Platform uptime SLA" },
    ],
}

export default function NonProfitPage() {
    return <ExploreProductPage data={data} />
}
