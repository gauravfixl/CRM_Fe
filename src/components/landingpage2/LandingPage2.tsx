"use client"

import LP2Navbar from "./LP2Navbar"
import LP2Hero from "./LP2Hero"
import LP2AIShowcase from "./LP2AIShowcase"
import LP2TabNavigation from "./LP2TabNavigation"
import LP2Overview from "./LP2Overview"
import LP2Solutions from "./LP2Solutions"
import LP2ProductDemos from "./LP2ProductDemos"
import LP2Workflow from "./LP2Workflow"
import LP2Integrations from "./LP2Integrations"
import LP2CustomerStories from "./LP2CustomerStories"
import LP2SecurityTrust from "./LP2SecurityTrust"
import LP2FeaturedNews from "./LP2FeaturedNews"
import LP2NextSteps from "./LP2NextSteps"
import LP2CTA from "./LP2CTA"
import LP2Footer from "./LP2Footer"

export default function LandingPage2() {
  return (
    <main className="relative antialiased bg-white" style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <LP2Navbar />
      <LP2Hero />
      <LP2AIShowcase />
      <LP2TabNavigation />
      <LP2Overview />
      <LP2Solutions />
      <LP2ProductDemos />
      <LP2Workflow />
      <LP2Integrations />
      <LP2CustomerStories />
      <LP2SecurityTrust />
      <LP2FeaturedNews />
      <LP2NextSteps />
      <LP2CTA />
      <LP2Footer />
    </main>
  )
}
