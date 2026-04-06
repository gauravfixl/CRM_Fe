"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Heart,
  Shield,
  Users,
  Lock,
  BarChart3,
  Workflow,
  Stethoscope,
  CalendarCheck,
  FileHeart,
  ClipboardCheck,
  Video,
  Building2,
} from "lucide-react"

const data = {
  name: "Healthcare",
  tagline: "HIPAA-Compliant ERP Built for Modern Healthcare Organizations",
  description:
    "CubicleERP Healthcare is a comprehensive, purpose-built platform for hospitals, clinics, medical practices, and healthcare networks. Featuring built-in HIPAA compliance, end-to-end patient lifecycle management, integrated medical billing, clinical workflow automation, telemedicine capabilities, and secure EHR integration, it empowers healthcare organizations to deliver exceptional patient care while maintaining regulatory compliance and operational efficiency on a single unified platform.",
  icon: Heart,
  color: "#DC2626",
  lightColor: "#FEE2E2",
  heroImage:
    "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1920&q=80",
  variant: 4 as const,
  features: [
    {
      icon: Shield,
      title: "HIPAA Compliance & Regulatory Readiness",
      description:
        "Every module within CubicleERP Healthcare is engineered with HIPAA requirements at its core, ensuring automatic audit trails for every patient data access event, granular role-based access controls, and end-to-end encryption for data at rest and in transit. Generate compliance reports on demand for OCR audits, state regulatory reviews, and internal governance checks without scrambling to compile documentation. Our platform continuously monitors compliance posture and proactively alerts administrators to any policy violations or access anomalies, keeping your organization audit-ready at all times.",
    },
    {
      icon: Users,
      title: "Patient Management & Scheduling",
      description:
        "Manage the entire patient lifecycle from registration through discharge with centralized patient records that include complete medical history, demographics, insurance details, consent forms, and communication preferences. Intelligent appointment scheduling with automated reminders via SMS, email, and patient portal notifications reduces no-shows by up to 35%, while waitlist management and multi-provider scheduling ensure maximum clinic utilization. Integrated telemedicine capabilities allow seamless virtual visits directly within the platform, expanding access to care for remote and mobility-limited patients.",
    },
    {
      icon: Stethoscope,
      title: "Medical Billing & Revenue Cycle Management",
      description:
        "Streamline your entire revenue cycle with integrated medical billing that covers charge capture, insurance eligibility verification, claim submission, denial management, and patient collections on a single platform. Automated coding assistance with ICD-10, CPT, and HCPCS validation reduces claim denials and accelerates reimbursement timelines, while real-time analytics on days in accounts receivable, clean claim rates, and payer mix help you optimize financial performance. Built-in support for Medicare, Medicaid, and commercial payer rules ensures compliant billing across all payer types.",
    },
    {
      icon: Workflow,
      title: "Clinical Workflow Automation",
      description:
        "Design and deploy custom clinical workflows that match your organization's unique care delivery protocols, from patient intake and triage to referral management, lab ordering, prescription routing, and discharge planning. Automated task assignment and escalation rules ensure that no clinical action falls through the cracks, while configurable approval chains maintain proper clinical oversight and documentation standards. Pre-built workflow templates for common specialties accelerate deployment while allowing full customization to match your specific clinical processes and regulatory requirements.",
    },
    {
      icon: Lock,
      title: "Secure Data & EHR Integration",
      description:
        "Connect CubicleERP seamlessly with existing EHR systems like Epic, Cerner, Athenahealth, and AllScripts through native HL7 FHIR and HL7v2 integration interfaces, enabling bidirectional data exchange without disrupting established clinical workflows. AES-256 encryption at rest combined with TLS 1.3 in transit, multi-factor authentication, automatic session timeouts, and detailed access logging protect sensitive patient information across every touchpoint. Regular third-party penetration testing and SOC 2 Type II compliance ensure that your security posture meets the highest industry standards for healthcare data protection.",
    },
    {
      icon: Video,
      title: "Telemedicine & Patient Portal",
      description:
        "Offer patients a modern, secure digital front door with an integrated patient portal where they can view medical records, lab results, and visit summaries, schedule and manage appointments, request prescription refills, and communicate securely with their care team. Built-in HIPAA-compliant video conferencing enables telemedicine visits directly within the platform, complete with virtual waiting rooms, screen sharing for diagnostic review, and automatic visit documentation. Patient engagement tools including health reminders, educational content delivery, and satisfaction surveys help drive better outcomes and stronger patient relationships.",
    },
  ],
  benefits: [
    {
      title: "Ensure Patient Safety & Quality of Care",
      description:
        "Integrated clinical decision support, automated drug interaction checks, allergy alerts, and complete patient history at the point of care significantly reduce medical errors and improve clinical outcomes. Every care decision is backed by accurate, real-time patient data accessible to authorized clinical staff.",
    },
    {
      title: "Achieve Effortless HIPAA Compliance",
      description:
        "Built-in compliance controls eliminate manual tracking and reduce the risk of costly HIPAA violations. Automatic audit trails, encryption, access controls, and breach notification workflows keep your organization compliant without adding administrative burden or requiring dedicated compliance software.",
    },
    {
      title: "Accelerate Revenue Cycle Performance",
      description:
        "Reduce claim denial rates by up to 40%, shorten days in A/R, and improve net collection rates with automated eligibility verification, coding validation, and proactive denial management. Healthcare organizations using CubicleERP see an average 25% improvement across key revenue cycle metrics.",
    },
    {
      title: "Elevate the Patient Experience",
      description:
        "Empower patients with self-service appointment scheduling, secure messaging, online bill pay, and access to their health records through a modern patient portal. Reduced wait times, automated reminders, and telemedicine options drive higher patient satisfaction and retention scores.",
    },
    {
      title: "Unify Clinical & Administrative Operations",
      description:
        "A single platform for clinical documentation, scheduling, billing, inventory, human resources, and compliance eliminates data silos and reduces manual work across departments. Staff spend less time on redundant data entry and context switching, freeing up more time for direct patient care.",
    },
    {
      title: "Scale Across Multi-Location Networks",
      description:
        "Manage multiple clinics, hospitals, urgent care centers, or specialty practices from one centralized platform while maintaining location-specific configurations and clinical protocols. Unified patient records follow patients across your network, improving care continuity and reducing duplicate testing.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Healthcare Assessment & Planning",
      description:
        "Our healthcare specialists conduct a comprehensive assessment of your clinical workflows, billing processes, compliance posture, and technology infrastructure. We map your current state, identify optimization opportunities, and create a detailed implementation roadmap tailored to your organization's size, specialty mix, and operational requirements.",
    },
    {
      step: "2",
      title: "Configuration, Integration & Training",
      description:
        "We configure CubicleERP to match your clinical workflows and administrative processes, integrate with existing EHR systems and medical devices via HL7 FHIR, securely migrate patient and financial data, and set up HIPAA-compliant communication channels. Your clinical and administrative teams receive role-specific hands-on training to ensure confident adoption from day one.",
    },
    {
      step: "3",
      title: "Compliance Verification & Go-Live",
      description:
        "We perform thorough HIPAA compliance testing, verify all security controls and access policies, and conduct penetration testing before go-live. A phased rollout with parallel running periods ensures zero disruption to patient care. Dedicated 24/7 support during the transition period and ongoing optimization help maximize adoption and return on investment.",
    },
  ],
  useCases: [
    {
      title: "Hospital Networks & Health Systems",
      description:
        "Large hospital systems and integrated delivery networks use CubicleERP to standardize clinical workflows, billing processes, supply chain management, and regulatory compliance across multiple facilities while preserving local clinical autonomy.",
      highlights: [
        "Unified patient records accessible across all hospital locations and departments",
        "Centralized revenue cycle management with facility-level financial tracking and reporting",
        "Standardized clinical protocols with specialty and location-specific customization",
      ],
    },
    {
      title: "Medical Practices & Outpatient Clinics",
      description:
        "Independent practices, physician groups, and outpatient clinic networks use CubicleERP to manage patient care, scheduling, billing, and compliance without the complexity and cost of enterprise EHR platforms designed for large hospitals.",
      highlights: [
        "Intuitive appointment scheduling with automated patient reminders and waitlist management",
        "Integrated medical billing with insurance eligibility verification and claim tracking",
        "Full HIPAA compliance without dedicated IT staff or expensive third-party tools",
      ],
    },
    {
      title: "Specialty & Allied Healthcare Providers",
      description:
        "Specialty practices in cardiology, orthopedics, oncology, behavioral health, and allied health disciplines use CubicleERP with specialty-specific workflow templates, referral coordination, and clinical documentation tailored to their unique care delivery models.",
      highlights: [
        "Specialty-specific clinical workflows, documentation templates, and outcome measures",
        "Integrated referral management with automated tracking and status notifications",
        "Specialty-focused analytics dashboards with benchmarking against industry standards",
      ],
    },
  ],
  faqs: [
    {
      question: "Is CubicleERP Healthcare truly HIPAA compliant?",
      answer:
        "Yes. CubicleERP Healthcare is architected from the ground up with HIPAA compliance embedded into every layer of the platform. We implement comprehensive technical safeguards including AES-256 encryption at rest, TLS 1.3 encryption in transit, role-based access controls, automatic audit trails for all PHI access, multi-factor authentication, and automatic session management. We also provide Business Associate Agreements (BAAs) and support your administrative and physical safeguard requirements with policy templates and compliance documentation. However, HIPAA compliance is a shared responsibility -- your organization must implement appropriate administrative policies and physical safeguards alongside our technical controls.",
    },
    {
      question: "Can CubicleERP integrate with our existing EHR system?",
      answer:
        "Absolutely. CubicleERP provides native HL7 FHIR R4 and HL7v2 integration interfaces for connecting with major EHR systems including Epic, Cerner, Athenahealth, AllScripts, eClinicalWorks, and NextGen. We support bidirectional data exchange for patient demographics, clinical documents, lab results, medication lists, and scheduling data. For systems without standard interfaces, our REST API and webhook framework enable custom integrations. Our dedicated healthcare integration team works with your IT staff to design, implement, test, and validate every integration before go-live.",
    },
    {
      question: "How does CubicleERP handle patient data security?",
      answer:
        "Patient data security is our highest priority. All protected health information is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. We enforce granular role-based access controls so staff only see the data relevant to their role, maintain immutable audit logs of every PHI access event, support multi-factor authentication and single sign-on via SAML/OAuth, and implement automatic session timeouts for inactive users. Our infrastructure is hosted in HIPAA-compliant, SOC 2 Type II certified data centers with geographic redundancy. We conduct regular third-party penetration testing and vulnerability assessments to continuously validate our security posture.",
    },
    {
      question: "Can patients access their own health records through the platform?",
      answer:
        "Yes. CubicleERP includes a secure, mobile-responsive patient portal that gives patients 24/7 access to their medical records, lab results, visit summaries, medication lists, immunization history, and billing statements. Patients can also schedule and manage appointments, request prescription refills, complete intake forms before visits, make online payments, and communicate securely with their care team via encrypted messaging. The portal supports the ONC Cures Act requirements for patient data access and interoperability, ensuring your organization meets federal information blocking regulations.",
    },
    {
      question:
        "How does CubicleERP support multi-location healthcare networks?",
      answer:
        "CubicleERP maintains a unified, longitudinal patient record that is securely accessible across all locations in your network. When a patient visits any facility, their complete medical history, active medications, allergies, problem lists, and previous encounters are immediately available to authorized clinical staff, improving care quality and eliminating duplicate testing. Each location can maintain its own scheduling templates, provider configurations, fee schedules, and workflow customizations while sharing a common patient database. Centralized reporting provides network-wide visibility into clinical quality, financial performance, and operational efficiency, with drill-down capability to individual locations.",
    },
  ],
  stats: [
    { value: "200+", label: "Healthcare organizations served" },
    { value: "100%", label: "HIPAA compliance guarantee" },
    { value: "25%", label: "Average revenue cycle improvement" },
    { value: "99.99%", label: "Platform uptime SLA" },
  ],
}

export default function HealthcarePage() {
  return <ExploreProductPage data={data} />
}
