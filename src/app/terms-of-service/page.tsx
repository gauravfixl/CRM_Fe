"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  FileText,
  CheckSquare,
  UserPlus,
  Settings,
  CreditCard,
  Award,
  Shield,
  XCircle,
  AlertTriangle,
  Scale,
  Mail,
} from "lucide-react"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", icon: CheckSquare },
  { id: "account-registration", title: "Account Registration", icon: UserPlus },
  { id: "use-of-services", title: "Use of Services", icon: Settings },
  { id: "payment-terms", title: "Payment Terms", icon: CreditCard },
  { id: "intellectual-property", title: "Intellectual Property", icon: Award },
  { id: "data-protection", title: "Data Protection", icon: Shield },
  { id: "termination", title: "Termination", icon: XCircle },
  { id: "limitation-of-liability", title: "Limitation of Liability", icon: AlertTriangle },
  { id: "governing-law", title: "Governing Law", icon: Scale },
  { id: "contact", title: "Contact", icon: Mail },
]

export default function TermsOfServicePage() {
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
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Terms of Service
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
                    Welcome to CubicleERP. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the CubicleERP platform, website, applications, and related services (collectively, the &quot;Services&quot;) provided by CubicleERP, Inc. (&quot;CubicleERP,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). Please read these Terms carefully before using our Services.
                  </p>
                </div>

                {/* Section: Acceptance of Terms */}
                <div id="acceptance" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <CheckSquare className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">1. Acceptance of Terms</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, and references to &quot;you&quot; and &quot;your&quot; will refer to both you individually and the organization.</p>
                    <p>If you do not agree to these Terms, you must not access or use our Services. We reserve the right to modify these Terms at any time. Material changes will be communicated through email notification or an in-platform banner at least 30 days before they take effect. Your continued use of the Services after the effective date of the revised Terms constitutes your acceptance of the changes.</p>
                    <p>These Terms constitute the entire agreement between you and CubicleERP regarding the use of our Services, superseding any prior agreements or understandings, whether written or oral.</p>
                  </div>
                </div>

                {/* Section: Account Registration */}
                <div id="account-registration" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <UserPlus className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">2. Account Registration</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>To access certain features of our Services, you must create an account. When registering, you agree to:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Accurate Information:</strong> Provide accurate, current, and complete information during registration and keep your account information updated.</li>
                      <li><strong>Account Security:</strong> Maintain the confidentiality of your login credentials and are responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use.</li>
                      <li><strong>Age Requirement:</strong> Be at least 16 years of age. If you are under 18, you must have parental or guardian consent to use the Services.</li>
                      <li><strong>One Account Per Person:</strong> Maintain only one account per individual. Creating multiple accounts for the purpose of circumventing restrictions is prohibited.</li>
                    </ul>
                    <p>We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe have been compromised. Organization administrators are responsible for managing user access within their organization and ensuring all users comply with these Terms.</p>
                  </div>
                </div>

                {/* Section: Use of Services */}
                <div id="use-of-services" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Settings className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">3. Use of Services</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>You are granted a limited, non-exclusive, non-transferable, revocable license to access and use our Services in accordance with these Terms. You agree not to:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>Use the Services for any unlawful purpose or in violation of any applicable local, state, national, or international laws or regulations.</li>
                      <li>Reverse engineer, decompile, disassemble, or attempt to discover the source code of the Services or any part thereof.</li>
                      <li>Modify, adapt, translate, or create derivative works based on the Services without prior written consent.</li>
                      <li>Use automated scripts, bots, or scrapers to access the Services, or attempt to gain unauthorized access to any systems or networks connected to the Services.</li>
                      <li>Interfere with or disrupt the integrity or performance of the Services, including transmitting viruses, malware, or other harmful code.</li>
                      <li>Resell, sublicense, lease, or distribute the Services to any third party without our express written authorization.</li>
                      <li>Upload, transmit, or store content that infringes on intellectual property rights of others, or that is defamatory, obscene, or otherwise objectionable.</li>
                      <li>Use the Services to send unsolicited communications (spam) or engage in any deceptive practices.</li>
                    </ul>
                    <p>We may establish usage limits, rate limits, or storage quotas applicable to your subscription plan. Exceeding these limits may result in additional charges or temporary service restrictions.</p>
                  </div>
                </div>

                {/* Section: Payment Terms */}
                <div id="payment-terms" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <CreditCard className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">4. Payment Terms</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>Certain features of our Services require a paid subscription. By subscribing to a paid plan, you agree to the following:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Billing Cycle:</strong> Subscriptions are billed in advance on a monthly or annual basis, depending on the plan you select. The billing date is based on the date you initially subscribed.</li>
                      <li><strong>Payment Methods:</strong> You must provide a valid payment method (credit card, debit card, or other accepted methods). You authorize us to charge your payment method for all fees incurred.</li>
                      <li><strong>Price Changes:</strong> We reserve the right to adjust pricing. For existing subscribers, price changes will take effect at the start of the next billing cycle following at least 30 days&apos; notice.</li>
                      <li><strong>Taxes:</strong> All fees are exclusive of applicable taxes (e.g., sales tax, VAT, GST). You are responsible for payment of all such taxes, unless exempt.</li>
                      <li><strong>Refunds:</strong> Annual subscriptions are eligible for a full refund within 14 days of initial purchase. Monthly subscriptions are non-refundable. Partial-month refunds are not available upon cancellation.</li>
                      <li><strong>Failed Payments:</strong> If a payment fails, we will attempt to process the charge up to three times. If unsuccessful, your account may be downgraded or suspended until payment is resolved.</li>
                    </ul>
                    <p>Free trial periods, if offered, will automatically convert to a paid subscription at the end of the trial unless you cancel before the trial expires. You will be notified before any charges are applied.</p>
                  </div>
                </div>

                {/* Section: Intellectual Property */}
                <div id="intellectual-property" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Award className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">5. Intellectual Property</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>All intellectual property rights in the Services, including but not limited to software, design, text, graphics, logos, trademarks, and all underlying technology, are owned by CubicleERP or its licensors and are protected by applicable intellectual property laws.</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Our Content:</strong> You may not copy, reproduce, distribute, modify, or create derivative works of our proprietary content without our express written permission.</li>
                      <li><strong>Your Content:</strong> You retain all ownership rights to the data and content you upload, create, or store through our Services (&quot;Your Content&quot;). By using the Services, you grant CubicleERP a limited, non-exclusive license to process, store, and display Your Content solely for the purpose of providing the Services to you.</li>
                      <li><strong>Feedback:</strong> Any suggestions, ideas, or feedback you provide regarding the Services may be freely used by CubicleERP without any obligation to you, including for product development and improvement.</li>
                      <li><strong>Trademarks:</strong> &quot;CubicleERP,&quot; the CubicleERP logo, and all related product and service names are trademarks of CubicleERP, Inc. You may not use our trademarks without prior written consent.</li>
                    </ul>
                  </div>
                </div>

                {/* Section: Data Protection */}
                <div id="data-protection" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Shield className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">6. Data Protection</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>We take the protection of your data seriously. Our data practices are governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Data Processing:</strong> Where we process personal data on your behalf (e.g., data about your customers or employees stored in CubicleERP), we act as a data processor and you act as the data controller. A Data Processing Agreement (DPA) is available upon request for Enterprise customers.</li>
                      <li><strong>Data Ownership:</strong> You retain full ownership of all data you input into the Services. We will not access, use, or share your data except as necessary to provide the Services or as required by law.</li>
                      <li><strong>Data Export:</strong> You may export your data at any time using our built-in export tools. Upon account termination, we will provide a reasonable period (minimum 30 days) for you to export your data before deletion.</li>
                      <li><strong>Compliance:</strong> We comply with applicable data protection laws, including GDPR, CCPA/CPRA, and other relevant regulations. We maintain SOC 2 Type II certification and undergo annual security audits.</li>
                      <li><strong>Sub-processors:</strong> We maintain a list of sub-processors that handle your data, available at our Trust Center. We will notify you of any new sub-processors at least 30 days in advance.</li>
                    </ul>
                  </div>
                </div>

                {/* Section: Termination */}
                <div id="termination" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <XCircle className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">7. Termination</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>Either party may terminate the use of Services as follows:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>By You:</strong> You may cancel your account at any time through your account settings or by contacting our support team. Cancellation of paid subscriptions will take effect at the end of the current billing period.</li>
                      <li><strong>By Us:</strong> We may suspend or terminate your access to the Services immediately, without prior notice or liability, if you breach these Terms. We may also terminate the Services with 90 days&apos; prior notice for any reason.</li>
                      <li><strong>Effect of Termination:</strong> Upon termination, your right to use the Services ceases immediately. You will have 30 days to export your data. After this period, we will delete your data in accordance with our data retention policy.</li>
                      <li><strong>Survival:</strong> Provisions regarding intellectual property, limitation of liability, indemnification, and governing law will survive termination of these Terms.</li>
                    </ul>
                    <p>Outstanding fees owed at the time of termination remain payable. We will not provide refunds for any unused portion of a subscription period following termination for breach of these Terms.</p>
                  </div>
                </div>

                {/* Section: Limitation of Liability */}
                <div id="limitation-of-liability" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <AlertTriangle className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">8. Limitation of Liability</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</li>
                      <li>CUBICLE ERP DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</li>
                      <li>IN NO EVENT SHALL CUBICLE ERP BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.</li>
                      <li>CUBICLE ERP&apos;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNT PAID BY YOU FOR THE SERVICES IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED US DOLLARS ($100).</li>
                    </ul>
                    <p>Some jurisdictions do not allow the exclusion or limitation of certain warranties or liability. In such jurisdictions, our liability is limited to the fullest extent permitted by law. Nothing in these Terms excludes or limits liability for fraud, death, or personal injury caused by negligence, or any other liability that cannot be excluded by law.</p>
                  </div>
                </div>

                {/* Section: Governing Law */}
                <div id="governing-law" className="mb-12 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Scale className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">9. Governing Law</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>These Terms are governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li><strong>Dispute Resolution:</strong> Any disputes arising from these Terms or the Services shall first be attempted to be resolved through good-faith negotiations between the parties for a period of 30 days.</li>
                      <li><strong>Arbitration:</strong> If negotiations fail, disputes shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall be conducted in San Francisco, California.</li>
                      <li><strong>Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted on an individual basis and not as a class action, consolidated action, or representative action.</li>
                      <li><strong>Injunctive Relief:</strong> Notwithstanding the above, either party may seek injunctive or equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement of intellectual property rights.</li>
                    </ul>
                    <p>For users outside the United States, if mandatory consumer protection laws in your jurisdiction provide you with rights that cannot be waived by contract, those rights shall apply to the extent required by law.</p>
                  </div>
                </div>

                {/* Section: Contact */}
                <div id="contact" className="mb-4 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                      <Mail className="w-4.5 h-4.5 text-[#0067B8]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">10. Contact</h2>
                  </div>
                  <div className="space-y-4 text-sm text-[#4B5563] leading-relaxed pl-12">
                    <p>If you have questions about these Terms of Service, please contact us:</p>
                    <div className="bg-[#F9FAFB] rounded-xl p-5 border border-gray-100">
                      <p className="mb-1"><strong>CubicleERP, Inc.</strong></p>
                      <p className="mb-1">Legal Department</p>
                      <p className="mb-1">100 Market Street, Suite 400</p>
                      <p className="mb-1">San Francisco, CA 94105, United States</p>
                      <p className="mb-1">Email: <span className="text-[#0067B8]">legal@cubicle-erp.com</span></p>
                      <p>Phone: +1 (555) 123-4567</p>
                    </div>
                    <p>For general support inquiries, please visit our <span className="text-[#0067B8]">Help Center</span> or contact <span className="text-[#0067B8]">support@cubicle-erp.com</span>.</p>
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
