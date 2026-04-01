"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Headphones,
  Building2,
} from "lucide-react"

const fontFamily = "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Our support team typically responds within 2 hours during business days.",
    detail: "support@cubicle-erp.com",
    color: "#0067B8",
    bg: "#EBF3FB",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our team for urgent inquiries or enterprise questions.",
    detail: "+1 (555) 123-4567",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our headquarters is located in the heart of San Francisco's tech district.",
    detail: "100 Market Street, Suite 400, San Francisco, CA 94105",
    color: "#8B5CF6",
    bg: "#F3EBF9",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "Our global support team covers multiple time zones for your convenience.",
    detail: "Mon - Fri: 8:00 AM - 8:00 PM PST",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
]

const faqs = [
  {
    question: "How quickly can I expect a response?",
    answer:
      "Our support team aims to respond to all inquiries within 2 business hours. For Enterprise plan customers, we offer a guaranteed 30-minute response time during business hours and 24/7 priority support.",
  },
  {
    question: "Do you offer phone support?",
    answer:
      "Yes, phone support is available for all paid plans during business hours (Mon-Fri, 8AM-8PM PST). Enterprise customers get access to a dedicated phone line with 24/7 availability.",
  },
  {
    question: "Can I schedule a product demo?",
    answer:
      "Absolutely! You can request a personalized demo by selecting 'Product Demo' as the subject in our contact form above. Our sales team will reach out within one business day to schedule a time that works for you.",
  },
  {
    question: "What support channels are available?",
    answer:
      "We offer support through email, phone, live chat (available in-app), and our comprehensive help center. Enterprise customers also get access to a dedicated Slack channel with their account team.",
  },
  {
    question: "How do I report a bug or technical issue?",
    answer:
      "You can report bugs through our contact form by selecting 'Technical Support' as the subject. Please include your account email, a description of the issue, and any relevant screenshots. For critical issues, call our support line directly.",
  },
  {
    question: "Do you have offices outside the US?",
    answer:
      "Yes, we have regional offices in London (UK), Bangalore (India), and Sydney (Australia). Our distributed team provides support coverage across all major time zones.",
  },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div style={{ fontFamily }} className="bg-white min-h-screen">
      <LP2Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Subtle dark overlay for readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,15,30,0.55) 0%, rgba(10,15,30,0.40) 50%, rgba(10,15,30,0.50) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)" }} />
        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-md border border-white/20">
              We&apos;d Love to Hear From You
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
              Get in Touch
            </h1>
            <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}>
              Have a question, need a demo, or want to discuss how CubicleERP can transform your business? Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #F0F4F8 0%, #E8EDF3 50%, #F0F4F8 100%)" }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#0067B8]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1A1A1A]">Send Us a Message</h2>
                    <p className="text-sm text-[#6B7280]">Fill out the form and we&apos;ll get back to you shortly.</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0067B8]/20 focus:border-[#0067B8] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0067B8]/20 focus:border-[#0067B8] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0067B8]/20 focus:border-[#0067B8] transition-all bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="demo">Product Demo</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="billing">Billing Question</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0067B8]/20 focus:border-[#0067B8] transition-all resize-none"
                    />
                  </div>
                  <button className="w-full sm:w-auto bg-[#0067B8] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#005A9E] transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-4"
            >
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-xl p-5 hover:shadow-md transition-all group border"
                  style={{ backgroundColor: info.bg, borderColor: info.color + "20" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: info.bg }}
                    >
                      <info.icon className="w-5 h-5" style={{ color: info.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">{info.title}</h3>
                      <p className="text-xs text-[#6B7280] mb-2">{info.description}</p>
                      <p className="text-sm font-medium" style={{ color: info.color }}>
                        {info.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Our Global Offices
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              Visit us at any of our office locations around the world.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white"
          >
            <div className="h-[400px] bg-gradient-to-br from-[#EBF3FB] to-[#F0F4FF] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#0067B8]/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-[#0067B8]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Interactive Map</h3>
                <p className="text-sm text-[#6B7280] max-w-sm">
                  100 Market Street, Suite 400, San Francisco, CA 94105
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                  {["San Francisco", "London", "Bangalore", "Sydney"].map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0067B8] bg-[#0067B8]/10 px-3 py-1.5 rounded-full"
                    >
                      <MapPin className="w-3 h-3" />
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #FAFBFD 0%, #F0F4F8 50%, #FAFBFD 100%)" }}>
        <div className="max-w-[800px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EBF3FB] flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-[#0067B8]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#6B7280] text-lg">
              Quick answers to common questions about reaching our team.
            </p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border border-blue-100 rounded-xl overflow-hidden hover:border-blue-200 transition-colors bg-blue-50/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-semibold text-[#1A1A1A] pr-4">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-[#0067B8] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-sm text-[#6B7280] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Support */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Headphones,
                title: "Live Chat Support",
                description: "Chat with our support team in real-time directly from within the CubicleERP platform.",
                link: "Open Live Chat",
              },
              {
                icon: HelpCircle,
                title: "Help Center",
                description: "Browse our extensive knowledge base with tutorials, guides, and troubleshooting articles.",
                link: "Visit Help Center",
              },
              {
                icon: MessageSquare,
                title: "Community Forum",
                description: "Connect with other CubicleERP users, share tips, and get peer-to-peer support.",
                link: "Join Community",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FB] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-[#0067B8]" />
                </div>
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6B7280] mb-4">{item.description}</p>
                <span className="text-sm font-medium text-[#0067B8] hover:underline cursor-pointer">
                  {item.link} &rarr;
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LP2CTA />
      <LP2Footer />
    </div>
  )
}
