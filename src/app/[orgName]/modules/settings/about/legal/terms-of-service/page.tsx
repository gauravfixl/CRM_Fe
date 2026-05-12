"use client"

import * as React from "react"
import { ScrollText } from "lucide-react"
import { LegalShell } from "../_components/LegalShell"

export default function TermsOfServicePage() {
    return (
        <LegalShell
            title="Terms of Service"
            subtitle="The contract between you, your organization and Fixl Solutions governing use of Cubicle ERP."
            lastUpdated="2026-04-30"
            effectiveDate="2026-05-01"
            accent="#2563eb"
            icon={<ScrollText className="w-6 h-6 text-white" />}
            sections={[
                {
                    heading: "Acceptance of Terms",
                    body: (
                        <p>
                            By accessing or using Cubicle ERP (the &quot;Service&quot;), you and the legal entity you represent
                            (&quot;Customer&quot;) agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree
                            with any part of these Terms, you must not use the Service. The individual accepting these Terms
                            represents that they have authority to bind the Customer.
                        </p>
                    ),
                },
                {
                    heading: "Subscription, Plans & Billing",
                    bullets: [
                        "Subscriptions renew automatically at the end of each billing period unless cancelled at least 7 days prior to renewal.",
                        "Plan pricing, included seats, storage and module entitlements are listed in the order form or active billing page.",
                        "Overages for additional users, storage or API calls are billed monthly in arrears.",
                        "All fees are exclusive of applicable taxes (GST/VAT) which will be added at the prevailing statutory rate.",
                        "Refunds are not provided for partial periods, downgrades or unused seats except where required by law.",
                    ],
                },
                {
                    heading: "License Grant & Customer Data",
                    body: (
                        <p>
                            Subject to these Terms and timely payment of fees, Fixl Solutions grants Customer a non-exclusive,
                            non-transferable, revocable license to access and use the Service during the subscription term.
                            Customer retains all right, title and interest in Customer Data. Fixl Solutions only processes
                            Customer Data to provide the Service in accordance with the Data Processing Addendum.
                        </p>
                    ),
                },
                {
                    heading: "User Accounts & Credentials",
                    bullets: [
                        "Customer is responsible for maintaining the confidentiality of all account credentials.",
                        "Each user account must be tied to a single named individual — sharing of credentials is prohibited.",
                        "Customer must promptly notify Fixl Solutions of any unauthorized access or suspected breach.",
                        "Two-factor authentication is strongly recommended for all OrgAdmin and finance-role accounts.",
                    ],
                },
                {
                    heading: "Acceptable Use",
                    body: (
                        <p>
                            You agree not to use the Service in any way that violates applicable law or the{" "}
                            <a href="../aup" className="text-[#2563eb] hover:underline">Acceptable Use Policy</a>. This includes,
                            but is not limited to, prohibitions on uploading malware, attempting to bypass access controls,
                            scraping at scale, reselling the Service without written permission, or using the Service to
                            transmit unsolicited communications.
                        </p>
                    ),
                },
                {
                    heading: "Service Availability & SLA",
                    bullets: [
                        "Target monthly uptime is 99.9% for production-tier customers, measured per the Service Level Agreement.",
                        "Scheduled maintenance windows are announced at least 48 hours in advance through the in-app banner and email.",
                        "Service credits for SLA breaches are issued upon written request within 30 days of the incident.",
                    ],
                },
                {
                    heading: "Intellectual Property",
                    body: (
                        <p>
                            The Service, including all software, designs, trademarks and documentation, is the exclusive property
                            of Fixl Solutions and its licensors. Customer receives no rights other than those expressly granted in
                            these Terms. Feedback and suggestions provided by Customer may be incorporated into the Service
                            without obligation or compensation.
                        </p>
                    ),
                },
                {
                    heading: "Confidentiality",
                    body: (
                        <p>
                            Each party agrees to protect the other&apos;s confidential information using at least the same degree of
                            care it uses for its own confidential information, and not less than reasonable care. Confidential
                            information shall not be disclosed to third parties except to employees, contractors and advisors
                            with a legitimate need to know who are bound by similar confidentiality obligations.
                        </p>
                    ),
                },
                {
                    heading: "Termination",
                    bullets: [
                        "Either party may terminate the subscription for material breach upon 30 days&apos; written notice if the breach is not cured.",
                        "Fixl Solutions may suspend the Service immediately for non-payment, security incidents or violations of the AUP.",
                        "Upon termination, Customer Data will be available for export for 30 days, after which it will be permanently deleted.",
                        "Sections relating to confidentiality, indemnification, liability and governing law survive termination.",
                    ],
                },
                {
                    heading: "Disclaimer of Warranties",
                    body: (
                        <p>
                            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. To the maximum extent permitted
                            by law, Fixl Solutions disclaims all warranties, express or implied, including warranties of
                            merchantability, fitness for a particular purpose and non-infringement. Fixl Solutions does not
                            warrant that the Service will be uninterrupted, error-free or meet Customer&apos;s specific requirements.
                        </p>
                    ),
                },
                {
                    heading: "Limitation of Liability",
                    body: (
                        <p>
                            To the maximum extent permitted by applicable law, Fixl Solutions&apos; aggregate liability arising out of
                            or relating to these Terms shall not exceed the fees paid by Customer in the twelve (12) months
                            preceding the event giving rise to the claim. In no event shall either party be liable for indirect,
                            incidental, consequential, special or punitive damages, including loss of profits, revenue, data or
                            goodwill.
                        </p>
                    ),
                },
                {
                    heading: "Governing Law & Dispute Resolution",
                    body: (
                        <p>
                            These Terms are governed by the laws of India, without regard to conflict-of-law principles. The
                            courts of Bengaluru, Karnataka shall have exclusive jurisdiction. Disputes shall first be referred
                            to mediation in good faith for a period of 30 days before commencing litigation, except where
                            urgent injunctive relief is required.
                        </p>
                    ),
                },
                {
                    heading: "Changes to These Terms",
                    body: (
                        <p>
                            Fixl Solutions may update these Terms from time to time. Material changes will be communicated by
                            email or in-app notification at least 30 days before they take effect. Continued use of the Service
                            after the effective date constitutes acceptance of the updated Terms.
                        </p>
                    ),
                },
            ]}
        />
    )
}
