"use client"

import * as React from "react"
import { Lock } from "lucide-react"
import { LegalShell } from "../_components/LegalShell"

export default function PrivacyPolicyPage() {
    return (
        <LegalShell
            title="Privacy Policy"
            subtitle="How Cubicle ERP collects, uses, stores and protects personal data of your organization's users and customers."
            lastUpdated="2026-04-30"
            effectiveDate="2026-05-01"
            accent="#10b981"
            icon={<Lock className="w-6 h-6 text-white" />}
            sections={[
                {
                    heading: "Scope & Data Controller",
                    body: (
                        <p>
                            This Privacy Policy describes how Fixl Solutions Pvt. Ltd. (&quot;we&quot;, &quot;us&quot;) handles personal
                            information when you or your organization use Cubicle ERP. For data your organization uploads about
                            its own customers, employees and partners, your organization is the data controller and Fixl
                            Solutions is the data processor — that relationship is governed by the Data Processing Addendum.
                        </p>
                    ),
                },
                {
                    heading: "Information We Collect",
                    bullets: [
                        "Account information: name, email, phone, organization, role, profile photo.",
                        "Authentication metadata: hashed passwords, 2FA secrets, login timestamps, IP address, device fingerprint.",
                        "Usage data: pages visited, features used, API endpoints called, search queries, response times.",
                        "Customer-uploaded data: leads, clients, vendors, products, invoices, employees and any custom-field content.",
                        "Communications: support tickets, in-app feedback and emails sent to support@cubicleerp.com.",
                    ],
                },
                {
                    heading: "How We Use Information",
                    bullets: [
                        "To provide, maintain and improve the Service and develop new features.",
                        "To authenticate users, secure accounts and detect fraudulent or abusive activity.",
                        "To send transactional emails (password resets, security alerts, billing receipts) and service announcements.",
                        "To provide customer support and respond to inquiries.",
                        "To comply with legal obligations including tax, accounting and law-enforcement requests.",
                    ],
                },
                {
                    heading: "Legal Bases for Processing",
                    body: (
                        <p>
                            We process personal data on the following legal bases under GDPR and equivalent regimes: (a) performance
                            of the contract with your organization; (b) our legitimate interests in operating and improving the Service;
                            (c) compliance with legal obligations; and (d) consent, where required (e.g. marketing emails). You may
                            withdraw consent at any time by contacting privacy@cubicleerp.com.
                        </p>
                    ),
                },
                {
                    heading: "Sharing & Disclosure",
                    bullets: [
                        "Sub-processors: cloud hosting (AWS — ap-south-1), email delivery, SMS gateways and analytics providers, listed in the DPA.",
                        "Service providers: payment processors, customer support tools, error monitoring (e.g. Sentry).",
                        "Legal requests: when compelled by valid subpoena, court order or applicable law, with notice to your organization where permitted.",
                        "Business transfers: in connection with a merger, acquisition or sale of assets, subject to equivalent confidentiality.",
                        "We do not sell personal data and we do not share it with advertisers.",
                    ],
                },
                {
                    heading: "Data Retention",
                    bullets: [
                        "Active account data is retained for the duration of the subscription.",
                        "Following termination, Customer Data is retained for 30 days to allow export, then permanently deleted within 60 days.",
                        "Audit logs and security records are retained for up to 24 months for fraud and security investigations.",
                        "Aggregated, anonymized usage statistics may be retained indefinitely.",
                    ],
                },
                {
                    heading: "International Transfers",
                    body: (
                        <p>
                            Cubicle ERP&apos;s primary infrastructure is hosted in AWS Asia-Pacific (Mumbai, ap-south-1). Where data is
                            transferred outside its country of origin, we rely on Standard Contractual Clauses (SCCs), adequacy
                            decisions or other appropriate safeguards. A list of sub-processor locations is published in the DPA
                            and updated when changes occur.
                        </p>
                    ),
                },
                {
                    heading: "Security Measures",
                    bullets: [
                        "Encryption in transit (TLS 1.2+) and at rest (AES-256) for all customer data.",
                        "Role-based access controls, least-privilege principles and quarterly access reviews.",
                        "24×7 monitoring, intrusion detection and automated vulnerability scanning.",
                        "Annual third-party penetration tests and SOC 2 Type II audits.",
                        "Documented incident-response plan with breach notification within 72 hours.",
                    ],
                },
                {
                    heading: "Your Rights",
                    body: (
                        <p>
                            Subject to applicable law (GDPR, CCPA, India DPDP Act), you have the right to access, correct, delete,
                            restrict or port your personal data, and to object to certain processing activities. To exercise these
                            rights, organization users should contact their OrgAdmin first; end-users may contact{" "}
                            <a href="mailto:privacy@cubicleerp.com" className="text-[#10b981] hover:underline">privacy@cubicleerp.com</a>.
                            We will respond within 30 days. You also have the right to lodge a complaint with your local data
                            protection authority.
                        </p>
                    ),
                },
                {
                    heading: "Cookies & Tracking",
                    bullets: [
                        "Strictly-necessary cookies: session authentication, CSRF tokens, language preference. Cannot be disabled.",
                        "Functional cookies: UI preferences, recently viewed items.",
                        "Analytics cookies: anonymized usage patterns, may be disabled in account preferences.",
                        "We do not use third-party advertising cookies or cross-site tracking.",
                    ],
                },
                {
                    heading: "Children's Privacy",
                    body: (
                        <p>
                            Cubicle ERP is a business-to-business product and is not directed to children under 16. We do not
                            knowingly collect personal data from children. If you believe a child has provided personal data,
                            contact privacy@cubicleerp.com so we can delete it.
                        </p>
                    ),
                },
                {
                    heading: "Changes to This Policy",
                    body: (
                        <p>
                            We may update this Privacy Policy to reflect changes in our practices, technology or legal
                            requirements. Material changes will be communicated by email or in-app notification at least 30 days
                            before they take effect.
                        </p>
                    ),
                },
                {
                    heading: "Contact",
                    body: (
                        <p>
                            Data Protection Officer · Fixl Solutions Pvt. Ltd. · 4th Floor, Brigade Tech Park, Whitefield,
                            Bengaluru 560066, India · <a href="mailto:dpo@cubicleerp.com" className="text-[#10b981] hover:underline">dpo@cubicleerp.com</a>
                        </p>
                    ),
                },
            ]}
        />
    )
}
