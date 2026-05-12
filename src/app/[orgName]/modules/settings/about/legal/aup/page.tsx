"use client"

import * as React from "react"
import { ShieldAlert } from "lucide-react"
import { LegalShell } from "../_components/LegalShell"

export default function AcceptableUsePolicyPage() {
    return (
        <LegalShell
            title="Acceptable Use Policy"
            subtitle="Activities that are prohibited on the Cubicle ERP platform and the consequences for violation."
            lastUpdated="2026-04-30"
            effectiveDate="2026-05-01"
            accent="#f59e0b"
            icon={<ShieldAlert className="w-6 h-6 text-white" />}
            sections={[
                {
                    heading: "Purpose",
                    body: (
                        <p>
                            This Acceptable Use Policy (&quot;AUP&quot;) describes activities that are prohibited when using Cubicle ERP.
                            It applies to every user with access to the Service, including OrgAdmins, employees, contractors,
                            consultants and API integrations operating on behalf of an organization. Violations may result in
                            account suspension, termination of the subscription, and civil or criminal liability.
                        </p>
                    ),
                },
                {
                    heading: "Prohibited Content",
                    bullets: [
                        "Content that is unlawful, defamatory, obscene, hateful, harassing or that infringes intellectual property rights.",
                        "Personally identifiable information of third parties uploaded without a lawful basis or consent.",
                        "Sensitive personal data (such as health records, biometrics or government-issued identifiers) outside designated, encrypted fields and without notifying your DPO.",
                        "Content that promotes terrorism, violence, child exploitation or other criminal activity.",
                        "Content that infringes third-party copyrights, trademarks, patents or trade secrets.",
                    ],
                },
                {
                    heading: "Prohibited Activities",
                    bullets: [
                        "Reverse-engineering, decompiling, or attempting to derive the source code of the Service.",
                        "Probing, scanning or testing the vulnerability of any system without written authorization (see Responsible Disclosure).",
                        "Bypassing or attempting to bypass authentication, authorization or rate-limiting mechanisms.",
                        "Sharing accounts, credentials or API keys outside of legitimate organization use.",
                        "Reselling, sublicensing or providing the Service as a hosted offering to third parties without a written reseller agreement.",
                        "Using the Service to develop a competing product or to benchmark for publication without prior written consent.",
                    ],
                },
                {
                    heading: "Network & Infrastructure Abuse",
                    bullets: [
                        "Distributing malware, viruses, ransomware, trojans or any code intended to disrupt, damage or gain unauthorized access.",
                        "Conducting denial-of-service or distributed-denial-of-service attacks.",
                        "Sending unsolicited bulk email (\"spam\") through email-template or campaign features beyond opt-in lists.",
                        "Cryptocurrency mining or computationally-intensive workloads unrelated to documented Service features.",
                        "Excessive API calls beyond plan rate limits, scraping, or scripted scraping at scale.",
                    ],
                },
                {
                    heading: "Communication Channels (Email, SMS, WhatsApp)",
                    bullets: [
                        "Outbound communications must comply with TCPA, CAN-SPAM, GDPR-PECR and equivalent local regulations.",
                        "Recipients must have provided opt-in consent or be lawful business contacts. An unsubscribe mechanism is mandatory.",
                        "WhatsApp Business templates must be approved by Meta before being used for outbound campaigns.",
                        "Sender domains must have valid SPF, DKIM and DMARC records configured before campaigns are launched.",
                    ],
                },
                {
                    heading: "Security Researchers & Responsible Disclosure",
                    body: (
                        <p>
                            We welcome reports from security researchers. Please email{" "}
                            <a href="mailto:security@cubicleerp.com" className="text-[#f59e0b] hover:underline">security@cubicleerp.com</a>{" "}
                            with details of any vulnerability. Do not publicly disclose vulnerabilities for at least 90 days or
                            until a fix is released. We will not pursue legal action against researchers who comply with our
                            responsible disclosure guidelines and act in good faith.
                        </p>
                    ),
                },
                {
                    heading: "Reporting Violations",
                    body: (
                        <p>
                            If you become aware of activity that violates this AUP, report it to{" "}
                            <a href="mailto:abuse@cubicleerp.com" className="text-[#f59e0b] hover:underline">abuse@cubicleerp.com</a>.
                            Include URLs, screenshots, timestamps and any other evidence. We will investigate and take action
                            as appropriate, while protecting the confidentiality of reporters where possible.
                        </p>
                    ),
                },
                {
                    heading: "Enforcement",
                    bullets: [
                        "First-time minor violations: written warning and request to remediate within 7 days.",
                        "Repeat or material violations: temporary suspension of the offending account or feature.",
                        "Severe violations (illegal content, security threats): immediate suspension of the entire organization, with notice to the OrgAdmin and, where required, to law enforcement.",
                        "Termination of the subscription without refund for unremedied material violations.",
                        "We reserve the right to remove or modify content that violates this AUP without prior notice.",
                    ],
                },
                {
                    heading: "Cooperation with Authorities",
                    body: (
                        <p>
                            Fixl Solutions will cooperate with valid law-enforcement and regulatory requests, including subpoenas,
                            court orders and emergency disclosure requests. Where legally permitted, we will provide notice to the
                            affected organization before complying.
                        </p>
                    ),
                },
                {
                    heading: "Changes to this AUP",
                    body: (
                        <p>
                            We may update this AUP to address new threats, technologies or legal requirements. Material changes
                            will be communicated by email or in-app notification at least 14 days before they take effect.
                            Continued use of the Service after the effective date constitutes acceptance of the updated AUP.
                        </p>
                    ),
                },
            ]}
        />
    )
}
