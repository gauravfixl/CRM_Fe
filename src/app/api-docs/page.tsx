"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import LP2Navbar from "@/components/landingpage2/LP2Navbar"
import LP2CTA from "@/components/landingpage2/LP2CTA"
import LP2Footer from "@/components/landingpage2/LP2Footer"
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Lock,
  Gauge,
  BookOpen,
  Terminal,
  Key,
  Shield,
  Zap,
  CheckCircle2,
  Globe,
  FileCode2,
  Server,
  Clock,
  Package,
} from "lucide-react"

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/contacts",
    description: "Retrieve a paginated list of all contacts in your organization.",
    methodColor: "#107C10",
  },
  {
    method: "POST",
    path: "/api/v1/deals",
    description: "Create a new deal with associated contact and pipeline stage.",
    methodColor: "#0067B8",
  },
  {
    method: "PUT",
    path: "/api/v1/deals/:id",
    description: "Update an existing deal's properties, stage, or assigned owner.",
    methodColor: "#D83B01",
  },
  {
    method: "GET",
    path: "/api/v1/analytics/revenue",
    description: "Fetch revenue analytics with filters for date range and pipeline.",
    methodColor: "#107C10",
  },
  {
    method: "DELETE",
    path: "/api/v1/contacts/:id",
    description: "Permanently remove a contact and optionally cascade to related deals.",
    methodColor: "#DC2626",
  },
  {
    method: "POST",
    path: "/api/v1/webhooks",
    description: "Register a new webhook endpoint for real-time event notifications.",
    methodColor: "#0067B8",
  },
]

const sdks = [
  {
    name: "Node.js",
    color: "#107C10",
    bg: "#E8F5E9",
    install: "npm install @cubicle-erp/sdk",
    snippet: `const Cubicle = require("@cubicle-erp/sdk");
const client = new Cubicle({ apiKey: "YOUR_KEY" });

const contacts = await client.contacts.list({
  limit: 25,
  sort: "created_at:desc"
});`,
  },
  {
    name: "Python",
    color: "#0067B8",
    bg: "#EBF3FB",
    install: "pip install cubicle-erp",
    snippet: `from cubicle_erp import CubicleClient

client = CubicleClient(api_key="YOUR_KEY")

contacts = client.contacts.list(
    limit=25,
    sort="created_at:desc"
)`,
  },
  {
    name: "PHP",
    color: "#5C2D91",
    bg: "#F3EBF9",
    install: "composer require cubicle-erp/sdk",
    snippet: `use CubicleERP\\Client;

$client = new Client(["apiKey" => "YOUR_KEY"]);

$contacts = $client->contacts->list([
    "limit" => 25,
    "sort" => "created_at:desc"
]);`,
  },
  {
    name: "Ruby",
    color: "#D83B01",
    bg: "#FFF0E8",
    install: "gem install cubicle_erp",
    snippet: `require "cubicle_erp"

client = CubicleERP::Client.new(api_key: "YOUR_KEY")

contacts = client.contacts.list(
  limit: 25,
  sort: "created_at:desc"
)`,
  },
]

const rateLimits = [
  { plan: "Free", requests: "100 / minute", daily: "5,000 / day", burst: "20 / second" },
  { plan: "Pro", requests: "500 / minute", daily: "50,000 / day", burst: "100 / second" },
  { plan: "Business", requests: "2,000 / minute", daily: "500,000 / day", burst: "500 / second" },
  { plan: "Enterprise", requests: "Custom", daily: "Unlimited", burst: "Custom" },
]

const gettingStartedSteps = [
  {
    step: 1,
    title: "Create an API key",
    description: "Navigate to Settings > API Keys in your CubicleERP dashboard and generate a new key.",
    icon: Key,
  },
  {
    step: 2,
    title: "Install an SDK",
    description: "Choose the SDK for your language and install it via your package manager.",
    icon: Package,
  },
  {
    step: 3,
    title: "Make your first request",
    description: "Initialize the client with your API key and call any endpoint to verify your setup.",
    icon: Terminal,
  },
  {
    step: 4,
    title: "Go to production",
    description: "Set up webhooks, configure error handling, and you are ready to ship.",
    icon: Zap,
  },
]

export default function ApiDocsPage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <LP2Navbar />

      {/* Hero */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #EBF3FB 0%, #E0F2F1 50%, #F3EBF9 100%)" }}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6">
          <Link
            href="/#overview"
            className="inline-flex items-center gap-1.5 text-[#505050] text-sm hover:text-[#0067B8] transition-colors mb-6 relative z-10"
          >
            <ArrowLeft size={15} /> Back to overview
          </Link>
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/50 text-[#0067B8] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-5">
              <Code2 size={14} /> REST API v1
            </span>
            <h1 className="text-[36px] lg:text-[48px] font-bold text-[#1A1A1A] leading-tight">
              CubicleERP API Documentation
            </h1>
            <p className="mt-5 text-lg text-[#505050] leading-relaxed">
              Build powerful integrations with our comprehensive REST API. Access contacts, deals, analytics,
              and more with simple, well-documented endpoints.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0067B8] text-white font-semibold text-[15px] hover:bg-[#005DA6] transition-colors"
              >
                Get API key <Key size={16} />
              </Link>
              <Link
                href="/integrations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#E5E5E5] text-[#1A1A1A] font-semibold text-[15px] hover:bg-[#F5F5F5] transition-colors bg-white/60"
              >
                View integrations
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">API Overview</h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              The CubicleERP API is organized around REST. It accepts JSON request bodies, returns JSON
              responses, and uses standard HTTP status codes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Base URL",
                detail: "https://api.cubicle-erp.com/v1",
                desc: "All API requests are made to this base URL with your resource path appended.",
              },
              {
                icon: FileCode2,
                title: "JSON Format",
                detail: "Content-Type: application/json",
                desc: "Send and receive data in JSON. All responses include appropriate status codes.",
              },
              {
                icon: Server,
                title: "Versioned",
                detail: "Currently on v1",
                desc: "We version our API to ensure backwards compatibility. Breaking changes get a new version.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FB] flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-[#0067B8]" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-1">{item.title}</h3>
                <code className="text-[13px] text-[#0067B8] bg-[#EBF3FB] px-2 py-0.5 rounded">{item.detail}</code>
                <p className="text-[14px] text-[#6B7280] leading-relaxed mt-3">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-20 bg-[#FAFBFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">Core Endpoints</h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              Here are some of the most commonly used endpoints. Full documentation covers 100+ endpoints
              across all modules.
            </p>
          </motion.div>

          <div className="space-y-4">
            {endpoints.map((ep, i) => (
              <motion.div
                key={`${ep.method}-${ep.path}`}
                className="bg-[#1E1E1E] rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <span
                  className="inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-bold text-white shrink-0 w-[70px]"
                  style={{ backgroundColor: ep.methodColor }}
                >
                  {ep.method}
                </span>
                <code className="text-[#D4D4D4] font-mono text-sm shrink-0">{ep.path}</code>
                <span className="text-[#888] text-sm md:ml-auto">{ep.description}</span>
              </motion.div>
            ))}
          </div>

          {/* Example Request/Response */}
          <motion.div
            className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#1E1E1E] rounded-2xl p-6 font-mono text-sm shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28CA42]" />
                <span className="ml-3 text-[#888] text-xs">Request</span>
              </div>
              <pre className="text-[#D4D4D4] leading-relaxed overflow-x-auto">
                <code>{`curl -X GET "https://api.cubicle-erp.com/v1/contacts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "limit": 10,
    "sort": "created_at:desc"
  }'`}</code>
              </pre>
            </div>

            <div className="bg-[#1E1E1E] rounded-2xl p-6 font-mono text-sm shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28CA42]" />
                <span className="ml-3 text-[#888] text-xs">Response (200 OK)</span>
              </div>
              <pre className="text-[#D4D4D4] leading-relaxed overflow-x-auto">
                <code>{`{
  "data": [
    {
      "id": "cnt_8xk2m9",
      "name": "Jane Cooper",
      "email": "jane@example.com",
      "company": "Acme Inc",
      "created_at": "2026-03-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1284,
    "page": 1,
    "limit": 10
  }
}`}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Authentication */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center mb-5">
                <Lock size={22} className="text-[#107C10]" />
              </div>
              <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-5">Authentication</h2>
              <p className="text-[16px] text-[#505050] leading-relaxed mb-4">
                The CubicleERP API uses Bearer token authentication. Include your API key in the
                Authorization header of every request.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "API keys are scoped to your organization",
                  "Support for read-only and read-write keys",
                  "OAuth 2.0 available for third-party integrations",
                  "Keys can be rotated at any time from the dashboard",
                  "All requests must be made over HTTPS",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14px] text-[#505050]">
                    <CheckCircle2 size={16} className="text-[#107C10] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="bg-[#1E1E1E] rounded-2xl p-6 font-mono text-sm shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28CA42]" />
                  <span className="ml-3 text-[#888] text-xs">authentication.sh</span>
                </div>
                <pre className="text-[#D4D4D4] leading-relaxed overflow-x-auto">
                  <code>{`# Include your API key in the header
Authorization: Bearer cbk_live_a1b2c3d4e5f6

# Example authenticated request
curl https://api.cubicle-erp.com/v1/me \\
  -H "Authorization: Bearer cbk_live_a1b2c3d4e5f6"

# Response
{
  "id": "org_x9k2m4",
  "name": "Your Organization",
  "plan": "business",
  "api_calls_remaining": 498000
}`}</code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-20 bg-[#FAFBFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF0E8] flex items-center justify-center mx-auto mb-5">
              <Gauge size={22} className="text-[#D83B01]" />
            </div>
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">Rate Limits</h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              Rate limits vary by plan. If you exceed your limit, the API returns a 429 status code with a
              Retry-After header.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5] bg-[#FAFBFC]">
                    <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">
                      Requests / Minute
                    </th>
                    <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">
                      Daily Limit
                    </th>
                    <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider">
                      Burst Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rateLimits.map((rl, i) => (
                    <tr key={rl.plan} className={i < rateLimits.length - 1 ? "border-b border-[#E5E5E5]" : ""}>
                      <td className="px-6 py-4 text-[15px] font-semibold text-[#1A1A1A]">{rl.plan}</td>
                      <td className="px-6 py-4 text-[14px] text-[#505050]">{rl.requests}</td>
                      <td className="px-6 py-4 text-[14px] text-[#505050]">{rl.daily}</td>
                      <td className="px-6 py-4 text-[14px] text-[#505050]">{rl.burst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">Official SDKs</h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              Get started quickly with our official libraries. Each SDK wraps the REST API with idiomatic
              methods for your language.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sdks.map((sdk, i) => (
              <motion.div
                key={sdk.name}
                className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: sdk.color }}
                    >
                      {sdk.name.charAt(0)}
                    </div>
                    <span className="text-[16px] font-semibold text-[#1A1A1A]">{sdk.name}</span>
                  </div>
                  <code className="text-[12px] px-2 py-1 rounded" style={{ backgroundColor: sdk.bg, color: sdk.color }}>
                    {sdk.install}
                  </code>
                </div>
                <div className="bg-[#1E1E1E] p-5 font-mono text-sm">
                  <pre className="text-[#D4D4D4] leading-relaxed overflow-x-auto">
                    <code>{sdk.snippet}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20 bg-[#FAFBFC]">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[30px] font-semibold text-[#1A1A1A] mb-4">Getting Started</h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              From zero to your first API call in under 5 minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gettingStartedSteps.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-[#0067B8] text-white text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                  <step.icon size={20} className="text-[#0067B8]" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-2">{step.title}</h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">{step.description}</p>
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
