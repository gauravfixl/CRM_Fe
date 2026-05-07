"use client"

import * as React from "react"
import { FileSignature } from "lucide-react"
import { LegalShell } from "../_components/LegalShell"

export default function DataProcessingAddendumPage() {
    return (
        <LegalShell
            title="Data Processing Addendum"
            subtitle="GDPR-compliant addendum governing how Fixl Solutions processes personal data on behalf of your organization."
            lastUpdated="2026-04-30"
            effectiveDate="2026-05-01"
            accent="#8b5cf6"
            icon={<FileSignature className="w-6 h-6 text-white" />}
            sections={[
                {
                    heading: "Definitions",
                    bullets: [
                        "\"Customer\" means the organization that has subscribed to Cubicle ERP.",
                        "\"Customer Personal Data\" means any personal data uploaded to or generated through Customer's use of the Service.",
                        "\"Processor\" / \"Sub-processor\" carry the meanings given under GDPR Article 4.",
                        "\"Applicable Data Protection Law\" includes GDPR, UK GDPR, CCPA/CPRA, and the India DPDP Act 2023.",
                        "Capitalized terms not defined here have the meanings given in the Terms of Service.",
                    ],
                },
                {
                    heading: "Roles of the Parties",
                    body: (
                        <p>
                            Customer is the controller of Customer Personal Data and Fixl Solutions is the processor. Fixl
                            Solutions will process Customer Personal Data only on documented instructions from Customer, including
                            those embodied in the configuration of the Service, support requests, and the Terms of Service.
                        </p>
                    ),
                },
                {
                    heading: "Subject Matter, Duration & Nature",
                    bullets: [
                        "Subject matter: provision of Cubicle ERP cloud software-as-a-service.",
                        "Duration: the term of the subscription plus 30-day post-termination retention.",
                        "Nature & purpose: storage, retrieval, organization, computation, transmission and deletion of records relating to Customer's CRM, HRM, accounting and supply-chain workflows.",
                        "Categories of data subjects: Customer's employees, contractors, customers, vendors, leads and other business contacts.",
                        "Categories of data: contact details, identifiers, employment metadata, financial transactions, and content uploaded to records.",
                    ],
                },
                {
                    heading: "Customer Instructions & Compliance",
                    bullets: [
                        "Customer represents that it has provided all required notices and obtained all consents necessary for the processing under this DPA.",
                        "Customer shall not upload special-category data (health, biometrics, religion) outside designated fields without enabling appropriate encryption.",
                        "Fixl Solutions will inform Customer if instructions appear to violate Applicable Data Protection Law and may suspend processing pending resolution.",
                    ],
                },
                {
                    heading: "Confidentiality of Personnel",
                    body: (
                        <p>
                            All Fixl Solutions personnel with access to Customer Personal Data are bound by written confidentiality
                            obligations and have received training on data-protection principles. Access is granted on a strict
                            need-to-know basis and revoked promptly upon role change or termination.
                        </p>
                    ),
                },
                {
                    heading: "Security Measures",
                    bullets: [
                        "Encryption: TLS 1.2+ in transit, AES-256 at rest, AWS KMS-managed keys with quarterly rotation.",
                        "Access control: SSO, MFA-enforced for all employees, RBAC with quarterly access reviews.",
                        "Network security: VPC isolation, WAF, DDoS protection, intrusion-detection logs retained 12 months.",
                        "Application security: SAST and DAST scans on every release, dependency monitoring, annual third-party penetration tests.",
                        "Operational security: 24×7 monitoring, on-call rotation, incident-response runbooks tested quarterly.",
                        "Resilience: multi-AZ deployment, point-in-time backup retained 30 days, RPO ≤ 1 hour, RTO ≤ 4 hours.",
                    ],
                },
                {
                    heading: "Sub-processors",
                    body: (
                        <p>
                            Customer authorizes Fixl Solutions to engage sub-processors to support delivery of the Service. The
                            current list is published at <span className="font-mono text-[12px]">cubicleerp.com/subprocessors</span>{" "}
                            and includes Amazon Web Services (hosting), SendGrid (transactional email), Twilio (SMS), and Sentry
                            (error monitoring). Fixl Solutions will provide 30 days&apos; notice of new sub-processors via in-app
                            notification, during which Customer may object on reasonable data-protection grounds.
                        </p>
                    ),
                },
                {
                    heading: "International Transfers",
                    bullets: [
                        "Primary processing region: AWS Asia-Pacific (Mumbai, ap-south-1).",
                        "Where data is transferred outside the EEA/UK/India, transfers rely on Standard Contractual Clauses (Module Two, controller-to-processor).",
                        "Supplementary measures (encryption, access controls, transparency reports) are applied per the EDPB recommendations.",
                    ],
                },
                {
                    heading: "Data Subject Requests",
                    body: (
                        <p>
                            Fixl Solutions provides self-service tooling within the Service to enable Customer to fulfill data
                            subject access, rectification, erasure, restriction and portability requests. Where additional
                            assistance is required, Fixl Solutions will respond to Customer requests within 10 business days
                            without additional charge for reasonable volumes.
                        </p>
                    ),
                },
                {
                    heading: "Personal Data Breach Notification",
                    bullets: [
                        "Fixl Solutions will notify Customer of a confirmed Personal Data Breach without undue delay and in any case within 72 hours of discovery.",
                        "The notification will include the nature of the breach, categories and approximate volumes of records affected, likely consequences, and measures taken or proposed.",
                        "Fixl Solutions will cooperate with Customer's regulatory notification obligations and provide reasonable assistance.",
                    ],
                },
                {
                    heading: "Data Protection Impact Assessments",
                    body: (
                        <p>
                            Fixl Solutions will provide reasonable assistance with Customer&apos;s data protection impact assessments
                            and prior consultations with supervisory authorities, taking into account the nature of processing
                            and the information available to Fixl Solutions.
                        </p>
                    ),
                },
                {
                    heading: "Audit Rights",
                    body: (
                        <p>
                            Customer may audit Fixl Solutions&apos; compliance with this DPA once per 12-month period at Customer&apos;s
                            expense, on at least 30 days&apos; written notice and during business hours, subject to reasonable
                            confidentiality obligations. Fixl Solutions makes available SOC 2 Type II reports and ISO 27001
                            certificates which will satisfy most audit requirements.
                        </p>
                    ),
                },
                {
                    heading: "Return & Deletion of Data",
                    bullets: [
                        "On termination, Fixl Solutions will, at Customer's choice, return or delete Customer Personal Data within 30 days.",
                        "Backups are overwritten on a 30-day rolling cycle and any residual copies are securely deleted within 60 days of termination.",
                        "A deletion certificate will be provided on written request.",
                    ],
                },
                {
                    heading: "Liability & Order of Precedence",
                    body: (
                        <p>
                            Liability under this DPA is subject to the limitations and exclusions in the Terms of Service. In the
                            event of any conflict between this DPA, the Terms of Service and any other agreement between the
                            parties, the order of precedence is: (1) this DPA for matters relating to processing of personal
                            data; (2) the Terms of Service; (3) the order form.
                        </p>
                    ),
                },
            ]}
        />
    )
}
