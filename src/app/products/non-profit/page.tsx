"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
    Landmark,
    HeartHandshake,
    Megaphone,
    FileCheck,
    UsersRound,
    ClipboardList,
    BarChart3,
} from "lucide-react"

const data = {
    name: "Non-Profit",
    tagline: "Empower your mission with smarter donor management & fundraising",
    description:
        "CubicleERP Non-Profit is a comprehensive platform purpose-built for NGOs, charities, foundations, and social enterprises. Manage donors, orchestrate fundraising campaigns, track grants, coordinate volunteers, and measure program impact — all from a single unified system designed to help you focus on what matters most: advancing your mission and creating lasting change in your community.",
    icon: Landmark,
    color: "#16A34A",
    lightColor: "#DCFCE7",
    heroImage:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&q=80",
    variant: 2 as const,
    features: [
        {
            icon: HeartHandshake,
            title: "Donor Relationship Management",
            description:
                "Build and nurture lasting relationships with every donor using a centralized database that captures complete giving history, communication preferences, and engagement milestones. Segment donors by giving level, interests, demographics, and recency to craft highly personalized outreach strategies. Automate thank-you emails, annual appeals, and milestone acknowledgements to move supporters seamlessly from first-time givers to loyal major donors.",
        },
        {
            icon: Megaphone,
            title: "Fundraising Campaign Management",
            description:
                "Design, launch, and monitor multiple fundraising campaigns simultaneously with real-time dashboards that track donations, donor responses, and return on investment. Leverage built-in tools for email campaigns, peer-to-peer fundraising pages, crowdfunding, and recurring giving programs to diversify your revenue streams. Set campaign goals, A/B test messaging, and automatically route donations to the correct funds so your team can focus on storytelling rather than spreadsheets.",
        },
        {
            icon: FileCheck,
            title: "Grant Tracking & Compliance",
            description:
                "Manage the entire grant lifecycle from prospecting and application to award, reporting, and renewal in one centralized workspace. Track deadlines, deliverables, and restricted-fund allocations to ensure full compliance with grantor requirements and avoid costly reporting errors. Generate detailed grant expenditure reports on demand, giving program officers and auditors the transparency they need without manual data gathering.",
        },
        {
            icon: UsersRound,
            title: "Volunteer Coordination",
            description:
                "Recruit, onboard, schedule, and retain volunteers through a dedicated portal that matches skills and availability to organizational needs. Track volunteer hours, certifications, and contributions across events and programs to recognize top contributors and satisfy reporting requirements. Automate shift reminders, send post-event surveys, and build a searchable volunteer directory that grows with your organization.",
        },
        {
            icon: ClipboardList,
            title: "Program & Event Management",
            description:
                "Plan and execute programs, workshops, and fundraising events with integrated project timelines, task assignments, and budget tracking. Manage registrations, ticketing, sponsorship commitments, and attendee communications from a single dashboard that keeps every team member aligned. Link event outcomes directly to program goals so you can demonstrate the connection between activities and measurable community impact.",
        },
        {
            icon: BarChart3,
            title: "Impact Reporting & Analytics",
            description:
                "Measure the real-world outcomes of your programs with customizable KPIs, outcome frameworks, and visual dashboards that translate data into compelling narratives. Generate board-ready impact reports, donor stewardship summaries, and annual reviews in minutes instead of weeks. Share interactive reports with stakeholders through a branded portal, building trust and transparency that drives continued support and engagement.",
        },
    ],
    benefits: [
        {
            title: "Strengthen Donor Retention",
            description:
                "Personalized engagement workflows and transparent impact updates keep donors informed and invested in your mission. Organizations using CubicleERP see measurable improvements in donor retention by replacing generic outreach with data-driven, relationship-centered communication.",
        },
        {
            title: "Amplify Fundraising Revenue",
            description:
                "Automate repetitive fundraising tasks, identify high-potential prospects through smart scoring, and optimize campaigns with real-time analytics. Your team spends more time building relationships and less time on data entry, resulting in higher fundraising efficiency.",
        },
        {
            title: "Prove Your Impact",
            description:
                "Turn program data into powerful stories that resonate with donors, board members, and grantmakers. Quantifiable impact metrics demonstrate exactly how contributions translate into community outcomes, making the case for continued and increased support.",
        },
        {
            title: "Simplify Compliance & Reporting",
            description:
                "Built-in fund accounting, automated donation receipts, and audit-ready financial reports ensure your organization meets regulatory and grantor requirements without manual reconciliation. Stay compliant with tax documentation standards effortlessly.",
        },
        {
            title: "Unify Your Operations",
            description:
                "Replace disconnected spreadsheets, email lists, and legacy tools with a single platform that connects donor management, fundraising, volunteering, programs, and finances. Eliminate data silos and give every team member a shared source of truth.",
        },
        {
            title: "Scale Without Overhead",
            description:
                "Grow your donor base, expand programs, and onboard more volunteers without a proportional increase in administrative staff. Automation and self-service portals allow your organization to scale its impact while keeping operational costs lean.",
        },
    ],
    steps: [
        {
            step: "1",
            title: "Mission Discovery & Planning",
            description:
                "Our non-profit specialists conduct a thorough assessment of your fundraising workflows, donor management practices, program tracking needs, and financial reporting requirements. We collaborate with your leadership team to create a tailored implementation roadmap that aligns with your mission, organizational structure, and growth goals.",
        },
        {
            step: "2",
            title: "Configuration & Data Migration",
            description:
                "We configure CubicleERP to match your unique non-profit workflows, migrate existing donor records, donation history, and financial data, and set up fundraising campaigns, grant tracking, and volunteer portals. Your team receives hands-on training so everyone is confident from day one.",
        },
        {
            step: "3",
            title: "Launch & Continuous Optimization",
            description:
                "After rigorous testing and a phased rollout, your organization goes live with full support from our team. We provide ongoing optimization sessions, quarterly reviews, and proactive recommendations to help you maximize donor engagement, fundraising performance, and impact measurement over time.",
        },
    ],
    useCases: [
        {
            title: "Charities & Foundations",
            description:
                "Large charities and family foundations use CubicleERP to manage thousands of donors, oversee multi-million-dollar grant portfolios, and produce stakeholder impact reports across dozens of program areas.",
            highlights: [
                "Centralized donor database with lifetime giving history and wealth screening",
                "Restricted and unrestricted fund tracking with automated compliance alerts",
                "Board-ready impact dashboards and annual report generation",
            ],
        },
        {
            title: "NGOs & International Development",
            description:
                "International NGOs rely on CubicleERP to coordinate field programs, manage institutional grants, track volunteer deployments, and report outcomes to government and multilateral funders.",
            highlights: [
                "Multi-currency donation processing and grant disbursement tracking",
                "Volunteer deployment scheduling across regions and programs",
                "Grantor-specific reporting templates for USAID, EU, and UN agencies",
            ],
        },
        {
            title: "Community & Faith-Based Organizations",
            description:
                "Local community groups and faith-based organizations use CubicleERP to engage members, run grassroots fundraising events, manage tithing and pledges, and track neighborhood program outcomes.",
            highlights: [
                "Member and congregation engagement with personalized outreach",
                "Event registration, ticketing, and sponsorship management",
                "Peer-to-peer fundraising pages and recurring giving programs",
            ],
        },
    ],
    faqs: [
        {
            question: "Is CubicleERP suitable for small non-profits with limited budgets?",
            answer: "Absolutely. CubicleERP is designed to scale from small grassroots organizations with a handful of volunteers to large national charities managing millions in donations. You can start with core donor management and fundraising features, then activate additional modules like grant tracking, volunteer coordination, and impact reporting as your organization grows. Pricing is flexible and based on your organization's size and needs, so you only pay for what you use.",
        },
        {
            question: "How does CubicleERP handle donation receipts and tax compliance?",
            answer: "CubicleERP automatically generates and distributes tax-compliant donation receipts to donors via email immediately after each gift is processed. The system supports year-end giving statements, in-kind donation valuations, and batch receipt generation for offline gifts. All receipt templates are customizable with your organization's branding and include the legal language required for tax-deductible contributions in your jurisdiction.",
        },
        {
            question: "Can we track restricted funds and grant expenditures separately?",
            answer: "Yes. CubicleERP includes full fund accounting capabilities that allow you to track restricted, temporarily restricted, and unrestricted funds in separate ledgers. Every donation, grant, and expenditure can be tagged to a specific fund or program, and the system enforces spending restrictions automatically. You can generate fund-level financial statements, grant expenditure reports, and donor-restricted fund summaries at any time for auditors or grantmakers.",
        },
        {
            question: "Does CubicleERP support online donation pages and peer-to-peer fundraising?",
            answer: "Yes. CubicleERP provides branded, mobile-responsive online donation pages that you can embed on your website or share via social media and email campaigns. Supporters can also create their own peer-to-peer fundraising pages for events like walkathons, birthday fundraisers, and giving days. All donations flow directly into your CRM with full donor attribution, campaign tracking, and automated thank-you messaging.",
        },
        {
            question: "How does the volunteer management module work?",
            answer: "The volunteer module lets you create a self-service portal where volunteers can sign up, view available opportunities, select shifts, and log hours. Administrators can manage background checks, track certifications, assign roles based on skills, and generate reports on total volunteer hours and impact. Automated reminders, post-event feedback surveys, and recognition milestones help you retain and engage your volunteer community over the long term.",
        },
    ],
    stats: [
        { value: "500+", label: "Non-profit organizations served" },
        { value: "$2B+", label: "Donations tracked annually" },
        { value: "60K+", label: "Volunteers coordinated" },
        { value: "99.9%", label: "Platform uptime guarantee" },
    ],
}

export default function NonProfitPage() {
    return <ExploreProductPage data={data} />
}
