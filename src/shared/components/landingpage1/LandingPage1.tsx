"use client"

import LP1Navbar from "./LP1Navbar"
import LP1Hero from "./LP1Hero"
import LP1LogoMarquee from "./LP1LogoMarquee"
import LP1Stats from "./LP1Stats"
import LP1ModulesShowcase from "./LP1ModulesShowcase"
import LP1FeaturesGrid from "./LP1FeaturesGrid"
import LP1HowItWorks from "./LP1HowItWorks"
import LP1Testimonials from "./LP1Testimonials"
import LP1Integrations from "./LP1Integrations"
import LP1Pricing from "./LP1Pricing"
import LP1FAQ from "./LP1FAQ"
import LP1CTABanner from "./LP1CTABanner"
import LP1Footer from "./LP1Footer"

export default function LandingPage1() {
  return (
    <main className="relative font-outfit antialiased">
      <LP1Navbar />
      <LP1Hero />
      <LP1LogoMarquee />
      <LP1Stats />
      <LP1ModulesShowcase />
      <LP1FeaturesGrid />
      <LP1HowItWorks />
      <LP1Testimonials />
      <LP1Integrations />
      <LP1Pricing />
      <LP1FAQ />
      <LP1CTABanner />
      <LP1Footer />
    </main>
  )
}
