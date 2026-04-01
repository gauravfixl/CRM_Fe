"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  Shield,
  Database,
  Eye,
  Lock,
  Globe,
  Cookie,
  UserCheck,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const sections = [
  { id: "information-we-collect", title: "Information We Collect", icon: Database },
  { id: "how-we-use", title: "How We Use Your Information", icon: Eye },
  { id: "data-storage", title: "Data Storage & Security", icon: Lock },
  { id: "third-party", title: "Third-Party Services", icon: Globe },
  { id: "cookies", title: "Cookies", icon: Cookie },
  { id: "your-rights", title: "Your Rights", icon: UserCheck },
  { id: "childrens-privacy", title: "Children's Privacy", icon: Baby },
  { id: "changes", title: "Changes to Policy", icon: RefreshCw },
  { id: "contact-us", title: "Contact Us", icon: Mail },
]

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -60% 0px" }
    )

    sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ fontFamily }} className="bg-white min-h-screen">
      <LP2Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0067B8] via-[#0078D4] to-[#005A9E] pt-32 pb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-white/80 text-base max-w-xl mx-auto">
              Last updated: March 15, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="lg:sticky lg:top-24">
                <h3 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === section.id
                          ? "bg-[#EBF3FB] text-[#0067B8] font-medium"
                          : "text-[#6B7280] hover:bg-gray-50 hover:text-[#1A1A1A]"
                      }`}
                    >
                      <section.icon className="w-4 h-4 flex-shrink-0" />
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="prose-sm max-w-none"
              >
                <div className="bg-[#EBF3FB] border border-[#0067B8]/10 rounded-xl p-6 mb-10">
                  <p className="text-sm text-[#1A1A1A] leading-relaxed">
                    At CubicleERP (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and related services (collectively, the &quot;Services&quot;). By using our Services, you agree to the terms of this Privacy Policy.
                  </p>
                </div>

                {/* Section: Information We Collect */}
                <div id="information-we-collect" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Database className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">1. Information We Collect</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>We collect information in several ways to provide and improve our Services:</p>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] mb-2">Personal Information You Provide</h4>
                      <ul className="list-disc pl-5 space-y-1.5">
                        <li><strong>Account Information:</strong> Name, email address, phone number, company name, job title, and password when you create an account.</li>
                        <li><strong>Billing Information:</strong> Payment method details, billing address, and transaction history when you subscribe to a paid plan.</li>
                        <li><strong>Profile Information:</strong> Profile picture, bio, preferences, and other details you choose to provide.</li>
                        <li><strong>Communications:</strong> Content of messages sent through our support channels, emails, or in-platform communications.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] mb-2">Information Collected Automatically</h4>
                      <ul className="list-disc pl-5 space-y-1.5">
                        <li><strong>Usage Data:</strong> Pages visited, features used, click patterns, time spent on the platform, and interaction data.</li>
                        <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, screen resolution, and language settings.</li>
                        <li><strong>Log Data:</strong> IP addresses, access times, referring URLs, and error logs.</li>
                        <li><strong>Location Data:</strong> Approximate geographic location derived from your IP address.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] mb-2">Information from Third Parties</h4>
                      <ul className="list-disc pl-5 space-y-1.5">
                        <li><strong>Single Sign-On (SSO):</strong> Profile information from identity providers (e.g., Google, Microsoft) if you use SSO to authenticate.</li>
                        <li><strong>Integrations:</strong> Data from third-party services you connect to CubicleERP, such as email providers, calendar apps, or payment processors.</li>
                        <li><strong>Public Sources:</strong> Publicly available business information used to enhance your account profile.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section: How We Use Your Information */}
                <div id="how-we-use" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Eye className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">2. How We Use Your Information</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>We use the information we collect for the following purposes:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Service Delivery:</strong> To provide, maintain, and improve our platform, including processing transactions, managing your account, and delivering customer support.</li>
                      <li><strong>Personalization:</strong> To customize your experience, recommend features, and tailor content and communications based on your usage patterns and preferences.</li>
                      <li><strong>Analytics & Improvement:</strong> To analyze usage trends, monitor platform performance, diagnose technical issues, and develop new features and products.</li>
                      <li><strong>Communication:</strong> To send transactional notifications (e.g., account confirmations, billing receipts), product updates, security alerts, and, where permitted, promotional materials.</li>
                      <li><strong>Security & Compliance:</strong> To detect and prevent fraud, enforce our Terms of Service, comply with legal obligations, and protect the rights and safety of our users and the public.</li>
                      <li><strong>AI & Machine Learning:</strong> To train and improve our AI-powered features such as lead scoring, predictive analytics, and automated workflows. Your business data is not used to train models shared with other customers.</li>
                    </ul>
                  </div>
                </div>

                {/* Section: Data Storage & Security */}
                <div id="data-storage" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Lock className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">3. Data Storage & Security</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>We take the security of your data seriously and implement industry-leading measures to protect it:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.</li>
                      <li><strong>Infrastructure:</strong> Our Services are hosted on SOC 2 Type II and ISO 27001 certified cloud infrastructure with data centers in the United States, European Union, and Asia-Pacific regions.</li>
                      <li><strong>Access Controls:</strong> Strict role-based access controls (RBAC) ensure that only authorized personnel can access customer data, and all access is logged and audited.</li>
                      <li><strong>Backups:</strong> Automated daily backups with point-in-time recovery capabilities. Backups are encrypted and stored in geographically separate locations.</li>
                      <li><strong>Monitoring:</strong> Continuous security monitoring, intrusion detection systems, and regular penetration testing by independent third-party firms.</li>
                      <li><strong>Incident Response:</strong> We maintain a comprehensive incident response plan and will notify affected users within 72 hours of discovering a data breach, in compliance with applicable regulations.</li>
                    </ul>
                    <p>Data is retained for as long as your account is active or as needed to provide you with our Services. Upon account termination, we will delete or anonymize your personal data within 90 days, except where retention is required by law.</p>
                  </div>
                </div>

                {/* Section: Third-Party Services */}
                <div id="third-party" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Globe className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">4. Third-Party Services</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>We may share your information with third-party service providers who assist us in operating our platform:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Payment Processors:</strong> We use Stripe and other PCI-DSS compliant payment processors to handle billing. We do not store your full credit card number on our servers.</li>
                      <li><strong>Analytics Providers:</strong> We use analytics services to understand platform usage and improve the user experience. These providers collect anonymized or pseudonymized data.</li>
                      <li><strong>Cloud Infrastructure:</strong> Our platform is hosted on reputable cloud providers that maintain strict security and compliance certifications.</li>
                      <li><strong>Communication Services:</strong> Email delivery, push notifications, and in-app messaging are handled by trusted third-party providers under strict data processing agreements.</li>
                      <li><strong>Customer Support Tools:</strong> Support ticketing and live chat platforms process conversations to help us assist you effectively.</li>
                    </ul>
                    <p>All third-party providers are contractually obligated to protect your data and use it only for the specific purposes for which it was shared. We conduct regular security assessments of our vendors and require them to maintain adequate data protection standards.</p>
                    <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</p>
                  </div>
                </div>

                {/* Section: Cookies */}
                <div id="cookies" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Cookie className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">5. Cookies</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>We use cookies and similar tracking technologies to enhance your experience on our platform:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Essential Cookies:</strong> Required for the platform to function properly, including authentication, session management, and security features. These cannot be disabled.</li>
                      <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform by collecting anonymized usage data, page load times, and error reports.</li>
                      <li><strong>Functional Cookies:</strong> Remember your preferences, language settings, and display options to provide a personalized experience.</li>
                      <li><strong>Marketing Cookies:</strong> Used to track visitors across our website and display relevant advertisements. These are only enabled with your explicit consent.</li>
                    </ul>
                    <p>You can manage your cookie preferences at any time through your browser settings or our in-platform cookie consent tool. Please note that disabling certain cookies may impact the functionality of our Services.</p>
                    <p>We also use pixel tags, web beacons, and similar technologies in our emails to track open rates and engagement, which helps us improve our communications.</p>
                  </div>
                </div>

                {/* Section: Your Rights */}
                <div id="your-rights" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <UserCheck className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">6. Your Rights</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you at any time.</li>
                      <li><strong>Right to Rectification:</strong> You can request correction of inaccurate or incomplete personal data.</li>
                      <li><strong>Right to Erasure:</strong> You can request deletion of your personal data, subject to legal retention requirements.</li>
                      <li><strong>Right to Portability:</strong> You can request your data in a structured, machine-readable format for transfer to another service.</li>
                      <li><strong>Right to Restrict Processing:</strong> You can request that we limit how we use your data in certain circumstances.</li>
                      <li><strong>Right to Object:</strong> You can object to the processing of your data for direct marketing or where processing is based on legitimate interests.</li>
                      <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you can withdraw that consent at any time without affecting prior processing.</li>
                    </ul>
                    <p>To exercise any of these rights, please contact us at <strong>privacy@cubicle-erp.com</strong>. We will respond to your request within 30 days. We may ask you to verify your identity before processing your request.</p>
                    <p>For users in the European Economic Area (EEA), we process data under the lawful bases set forth in the GDPR. For California residents, we comply with the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA).</p>
                  </div>
                </div>

                {/* Section: Children's Privacy */}
                <div id="childrens-privacy" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Baby className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">7. Children&apos;s Privacy</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>Our Services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we learn that we have inadvertently collected personal data from a child under 16, we will take steps to delete such information as promptly as possible.</p>
                    <p>If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <strong>privacy@cubicle-erp.com</strong> so we can take appropriate action.</p>
                  </div>
                </div>

                {/* Section: Changes to Policy */}
                <div id="changes" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <RefreshCw className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">8. Changes to This Policy</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes, we will:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>Update the &quot;Last updated&quot; date at the top of this policy.</li>
                      <li>Notify you via email or an in-platform notification at least 30 days before the changes take effect.</li>
                      <li>Provide a summary of the key changes for your convenience.</li>
                    </ul>
                    <p>Your continued use of our Services after the updated policy takes effect constitutes your acceptance of the changes. We encourage you to review this policy periodically.</p>
                  </div>
                </div>

                {/* Section: Contact Us */}
                <div id="contact-us" className="mb-4 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Mail className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">9. Contact Us</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
                    <div className="bg-[#F9FAFB] rounded-xl p-5 border border-gray-100">
                      <p className="mb-1"><strong>CubicleERP, Inc.</strong></p>
                      <p className="mb-1">Data Protection Officer</p>
                      <p className="mb-1">100 Market Street, Suite 400</p>
                      <p className="mb-1">San Francisco, CA 94105, United States</p>
                      <p className="mb-1">Email: <span className="text-[#0067B8]">privacy@cubicle-erp.com</span></p>
                      <p>Phone: +1 (555) 123-4567</p>
                    </div>
                    <p>If you are not satisfied with our response to your privacy concern, you have the right to lodge a complaint with your local data protection authority.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <LP2CTA />
      <LP2Footer />
    </div>
  )
}
