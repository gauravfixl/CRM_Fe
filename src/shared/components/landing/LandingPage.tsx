"use client"

import Navbar from "./Navbar"
import HeroSection from "./HeroSection"
import StatsSection from "./StatsSection"
import FeaturesSection from "./FeaturesSection"
import ModulesShowcase from "./ModulesShowcase"
import WorkflowAutomation from "./WorkflowAutomation"
import AllInOnePlatform from "./AllInOnePlatform"
import HowItWorks from "./HowItWorks"
import SecurityTrust from "./SecurityTrust"
import IntegrationsSection from "./IntegrationsSection"
import TestimonialsSection from "./TestimonialsSection"
import PricingSection from "./PricingSection"
import PricingTeaser from "./PricingTeaser"
import Footer from "./Footer"

export default function LandingPage() {
    return (
        <main className="relative font-outfit antialiased">
            {/* Fixed Navbar */}
            <Navbar />

            {/* Page Sections */}
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <ModulesShowcase />
            <WorkflowAutomation />
            <AllInOnePlatform />
            <HowItWorks />
            <SecurityTrust />
            <IntegrationsSection />
            <TestimonialsSection />
            <PricingSection />
            <PricingTeaser />
            <Footer />
        </main>
    )
}
