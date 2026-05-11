"use client"

import * as React from "react"
import { ShieldCheck, Lock, Server, Activity, RefreshCw, AlertTriangle, KeyRound, Users } from "lucide-react"
import { LegalShell } from "../_components/LegalShell"

export default function SecurityWhitepaperPage() {
    return (
        <LegalShell
            title="Security Whitepaper"
            subtitle="A technical overview of how Cubicle ERP protects customer data, infrastructure and the people who depend on it."
            lastUpdated="2026-04-30"
            effectiveDate="2026-05-01"
            accent="#0ea5e9"
            icon={<ShieldCheck className="w-6 h-6 text-white" />}
            sections={[
                {
                    heading: "Security Program Overview",
                    body: (
                        <p>
                            Security at Fixl Solutions is governed by a written Information Security Management System (ISMS)
                            aligned with ISO/IEC 27001:2022 and SOC 2 Trust Services Criteria. The program is owned by the
                            Chief Information Security Officer, reviewed quarterly by the executive committee, and audited
                            annually by an independent third party. Every product release passes through documented
                            secure-development checkpoints before reaching production.
                        </p>
                    ),
                },
                {
                    heading: "Infrastructure & Hosting",
                    bullets: [
                        "Hosted on Amazon Web Services in the ap-south-1 (Mumbai) region with multi-AZ deployment.",
                        "VPC isolation: public subnets for load balancers only; databases and application tier reside in private subnets without internet egress.",
                        "Web Application Firewall (AWS WAF) with managed and custom rule sets, including OWASP Top 10 coverage and rate-based rules.",
                        "DDoS protection via AWS Shield Standard with Shield Advanced available for enterprise tier.",
                        "Edge delivery via CloudFront with TLS 1.2+ termination and HTTP/2 support.",
                    ],
                    children: <InfraGrid />,
                },
                {
                    heading: "Encryption",
                    bullets: [
                        "In transit: TLS 1.2 minimum, TLS 1.3 preferred. HSTS preloaded. Weak ciphers and protocols disabled.",
                        "At rest: AES-256 via AWS KMS for databases, object storage, backups and ephemeral disks.",
                        "Customer-managed keys (BYOK) available on enterprise plans via AWS KMS external key store.",
                        "Quarterly key rotation; key access audit logs retained for 12 months.",
                        "Field-level encryption for sensitive PII (national IDs, bank account numbers) using envelope encryption.",
                    ],
                },
                {
                    heading: "Identity & Access Management",
                    bullets: [
                        "Single sign-on via SAML 2.0 and OIDC supported on Pro and Enterprise plans.",
                        "Multi-factor authentication enforceable per role; OrgAdmin and Finance roles require MFA by default.",
                        "Role-based access control (RBAC) with field-level visibility and 60+ granular permissions.",
                        "Session management with configurable idle timeout, concurrent session limits and forced logout from any device.",
                        "Audit log of all authentication events retained for 24 months.",
                    ],
                },
                {
                    heading: "Application Security",
                    bullets: [
                        "Static application security testing (SAST) on every commit; release blocked on high or critical findings.",
                        "Dynamic application security testing (DAST) on every release candidate.",
                        "Software composition analysis (SCA) with daily dependency vulnerability scanning.",
                        "Annual third-party penetration tests; report summary available under NDA.",
                        "Bug bounty program with disclosed researchers; critical findings remediated within 7 days.",
                    ],
                },
                {
                    heading: "Operational Security",
                    bullets: [
                        "Centralized logging in immutable, tamper-evident storage retained for 12 months minimum.",
                        "24×7 security monitoring via SIEM with automated alerting and on-call rotation.",
                        "Network intrusion detection and host-based intrusion detection across all production hosts.",
                        "Endpoint protection with EDR on all employee workstations; full-disk encryption mandatory.",
                        "Quarterly access reviews with automated provisioning and de-provisioning tied to HR system.",
                    ],
                },
                {
                    heading: "Backup & Disaster Recovery",
                    bullets: [
                        "Database point-in-time recovery (PITR) for the past 30 days.",
                        "Cross-region encrypted backups replicated daily with 90-day retention.",
                        "Recovery Point Objective (RPO): ≤ 1 hour. Recovery Time Objective (RTO): ≤ 4 hours.",
                        "Annual disaster-recovery drills with a documented runbook; results reviewed by executives.",
                    ],
                },
                {
                    heading: "Incident Response",
                    bullets: [
                        "Documented runbook covering detection, containment, eradication, recovery and lessons-learned phases.",
                        "Notification of confirmed personal-data breaches within 72 hours per the DPA.",
                        "Forensic capabilities including write-once log archiving and snapshot retention.",
                        "Crisis communication channels for customer-facing updates via status page, email and in-app banner.",
                        "Post-incident review (PIR) shared with affected customers within 14 days.",
                    ],
                },
                {
                    heading: "Personnel Security",
                    bullets: [
                        "Background checks for all employees with access to production systems.",
                        "Annual security awareness training and quarterly phishing simulations.",
                        "Confidentiality and acceptable-use agreements signed at hire.",
                        "Least-privilege access; production access requires just-in-time approval and is logged.",
                    ],
                },
                {
                    heading: "Compliance & Certifications",
                    bullets: [
                        "SOC 2 Type II — annual audit; report available under NDA.",
                        "ISO/IEC 27001:2022 — certified.",
                        "GDPR & UK GDPR — compliant; DPA available on request and at /modules/settings/about/legal/dpa.",
                        "India DPDP Act 2023 — compliant; data residency in ap-south-1.",
                        "HIPAA & PCI-DSS — available with additional configuration on Enterprise plans.",
                    ],
                },
                {
                    heading: "Customer-Side Best Practices",
                    bullets: [
                        "Enforce MFA for all OrgAdmin, Finance and HR roles.",
                        "Configure SSO with your identity provider to centralize authentication.",
                        "Apply the principle of least privilege when assigning roles; avoid blanket OrgAdmin grants.",
                        "Enable session timeout and IP allowlisting where supported by your subscription tier.",
                        "Review the audit log regularly and configure alerts for sensitive activities (role changes, data exports).",
                    ],
                },
                {
                    heading: "Contact",
                    body: (
                        <p>
                            Security questions, audit requests and vulnerability reports should be directed to{" "}
                            <a href="mailto:security@cubicleerp.com" className="text-[#0ea5e9] hover:underline">security@cubicleerp.com</a>.
                            Our PGP key is published at <span className="font-mono text-[12px]">cubicleerp.com/.well-known/security.txt</span>.
                        </p>
                    ),
                },
            ]}
        />
    )
}

function InfraGrid() {
    const items = [
        { icon: <Server className="w-3.5 h-3.5" />, label: "Multi-AZ", value: "3 zones" },
        { icon: <Lock className="w-3.5 h-3.5" />, label: "Encryption", value: "AES-256" },
        { icon: <KeyRound className="w-3.5 h-3.5" />, label: "Key rotation", value: "Quarterly" },
        { icon: <Activity className="w-3.5 h-3.5" />, label: "Monitoring", value: "24×7" },
        { icon: <RefreshCw className="w-3.5 h-3.5" />, label: "RPO / RTO", value: "1h / 4h" },
        { icon: <Users className="w-3.5 h-3.5" />, label: "Access reviews", value: "Quarterly" },
        { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: "Incident SLA", value: "72 hours" },
        { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Pentest", value: "Annual" },
    ]
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {items.map((it) => (
                <div key={it.label} className="border p-2.5 bg-sky-50/40 rounded-none border-sky-100">
                    <div className="flex items-center gap-1.5 text-sky-700">
                        {it.icon}
                        <span className="text-[10.5px] font-bold uppercase tracking-wider">{it.label}</span>
                    </div>
                    <p className="text-[13px] font-bold text-[#0F172A] mt-1">{it.value}</p>
                </div>
            ))}
        </div>
    )
}
