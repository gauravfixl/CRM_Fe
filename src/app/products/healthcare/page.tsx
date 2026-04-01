"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  Heart,
  Shield,
  Users,
  Lock,
  BarChart3,
  Workflow,
} from "lucide-react"

const data = {
  name: "Healthcare",
  tagline: "HIPAA-compliant ERP for healthcare organizations",
  description:
    "CubicleERP Healthcare is purpose-built for hospitals, clinics, medical practices, and healthcare networks. With built-in HIPAA compliance, patient data protection, integrated scheduling, and healthcare-specific workflows, manage patient care, billing, and operations on a single secure platform designed for the unique demands of modern healthcare delivery.",
  icon: Heart,
  color: "#DC2626",
  lightColor: "#FEE2E2",
  heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80",
  features: [
    {
      icon: Shield,
      title: "HIPAA Compliance Built-In",
      description:
        "Every feature is designed with HIPAA requirements in mind. Automatic audit trails for all patient data access, role-based access controls, data encryption at rest and in transit, and secure patient communication channels. Generate compliance reports instantly for audits and regulatory reviews.",
    },
    {
      icon: Users,
      title: "Patient Management & Scheduling",
      description:
        "Centralized patient records with complete medical history, appointment scheduling with automated reminders, and integrated telemedicine capabilities. Manage patient communications, consent forms, and insurance information all in one secure location with full HIPAA compliance.",
    },
    {
      icon: Lock,
      title: "Secure Patient Data Protection",
      description:
        "Advanced encryption, role-based access controls, and automatic session timeouts protect sensitive patient information. Track every access to patient records with detailed audit logs. Support for multi-factor authentication and SSO integration for healthcare staff.",
    },
    {
      icon: Workflow,
      title: "Clinical Workflow Automation",
      description:
        "Automate referral processes, lab order workflows, prescription management, and clinical documentation. Create custom workflows for your specific clinical protocols and ensure consistent, compliant care delivery across all departments and locations.",
    },
    {
      icon: BarChart3,
      title: "Healthcare Analytics & Reporting",
      description:
        "Track patient outcomes, clinical quality metrics, operational efficiency, and financial performance. Generate reports on readmission rates, patient satisfaction, staff utilization, and revenue cycle metrics. Identify trends and opportunities for improvement with healthcare-specific KPIs.",
    },
    {
      icon: Heart,
      title: "Billing & Insurance Management",
      description:
        "Integrated medical billing with insurance claim management, automated eligibility verification, and revenue cycle optimization. Reduce claim denials, accelerate reimbursement, and improve cash flow with healthcare-specific billing workflows and compliance checks.",
    },
  ],
  benefits: [
    {
      title: "Ensure Patient Safety & Quality Care",
      description:
        "Integrated clinical workflows, automated safety checks, and complete patient history reduce medical errors and improve care quality. Every clinical decision is supported by complete, accurate patient data.",
    },
    {
      title: "Maintain HIPAA Compliance Effortlessly",
      description:
        "Built-in compliance features eliminate the need for manual compliance tracking. Automatic audit trails, encryption, and access controls ensure your organization stays compliant without additional effort or cost.",
    },
    {
      title: "Improve Revenue Cycle Performance",
      description:
        "Reduce claim denials, accelerate reimbursement, and improve cash flow with integrated billing and insurance management. Healthcare organizations using CubicleERP see an average 25% improvement in revenue cycle metrics.",
    },
    {
      title: "Enhance Patient Experience",
      description:
        "Patient portals, appointment reminders, secure messaging, and integrated telemedicine improve patient satisfaction and engagement. Patients can access their records, schedule appointments, and communicate with providers securely.",
    },
    {
      title: "Streamline Operations",
      description:
        "Unified platform for clinical, administrative, and financial operations reduces manual work, eliminates data silos, and improves staff efficiency. Your team spends less time on paperwork and more time on patient care.",
    },
    {
      title: "Support Multi-Location Networks",
      description:
        "Manage multiple clinics, hospitals, or urgent care centers from a single platform. Maintain consistent clinical protocols while allowing location-specific customization. Share patient records securely across your network.",
    },
  ],
  steps: [
    {
      step: "1",
      title: "Healthcare Assessment",
      description:
        "Our healthcare specialists conduct a thorough assessment of your clinical workflows, billing processes, compliance requirements, and technology infrastructure. We create a detailed implementation plan tailored to your organization's specific needs.",
    },
    {
      step: "2",
      title: "Configuration & Integration",
      description:
        "We configure CubicleERP for your clinical workflows, integrate with existing EHR systems and medical devices, migrate patient data securely, and set up HIPAA-compliant communication channels. Your team receives comprehensive training on all clinical and administrative features.",
    },
    {
      step: "3",
      title: "Compliance Verification & Go-Live",
      description:
        "We conduct thorough compliance testing, verify HIPAA controls, and perform security audits before go-live. Phased rollout with parallel running periods ensures smooth transition. 24/7 support during go-live and ongoing optimization for maximum adoption.",
    },
  ],
  useCases: [
    {
      title: "Hospital Networks",
      description:
        "Large hospital systems use CubicleERP to standardize clinical workflows, billing processes, and compliance across multiple facilities while maintaining local autonomy in care delivery.",
      highlights: [
        "Unified patient records across all hospital locations",
        "Centralized billing with location-level financial tracking",
        "Standardized clinical protocols with local customization",
      ],
    },
    {
      title: "Medical Practices & Clinics",
      description:
        "Independent practices and small clinic networks use CubicleERP to manage patient care, scheduling, billing, and compliance without the complexity of enterprise EHR systems.",
      highlights: [
        "Simple patient scheduling and appointment management",
        "Integrated medical billing and insurance claims",
        "HIPAA compliance without IT overhead",
      ],
    },
    {
      title: "Specialty Healthcare Networks",
      description:
        "Specialty practices (cardiology, orthopedics, oncology, etc.) use CubicleERP with specialty-specific workflows, referral management, and clinical documentation tailored to their specialty.",
      highlights: [
        "Specialty-specific clinical workflows and templates",
        "Integrated referral and consultation management",
        "Specialty-specific reporting and analytics",
      ],
    },
  ],
  faqs: [
    {
      question: "Is CubicleERP Healthcare truly HIPAA compliant?",
      answer:
        "Yes. CubicleERP Healthcare is designed from the ground up with HIPAA compliance in mind. We maintain comprehensive audit trails, enforce role-based access controls, encrypt all patient data at rest and in transit, and provide detailed compliance reporting. However, HIPAA compliance is a shared responsibility — your organization must also implement appropriate administrative and physical safeguards. We provide the technical controls; you implement organizational policies.",
    },
    {
      question: "Can CubicleERP integrate with our existing EHR system?",
      answer:
        "Yes. CubicleERP provides HL7 and FHIR integration capabilities for connecting with major EHR systems like Epic, Cerner, Athena, and others. We also support custom integrations via our REST API. Our healthcare integration team can help design and implement the integration that works best for your organization.",
    },
    {
      question: "How do you handle patient data security?",
      answer:
        "Patient data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. We maintain detailed audit logs of all patient data access, enforce role-based access controls, support multi-factor authentication, and conduct regular security audits and penetration testing. All data is stored in HIPAA-compliant data centers with redundant backups.",
    },
    {
      question: "Can patients access their own records?",
      answer:
        "Yes. CubicleERP includes a secure patient portal where patients can view their medical records, appointment history, test results, and billing information. Patients can also schedule appointments, request prescription refills, and communicate securely with their healthcare providers.",
    },
    {
      question: "How does CubicleERP handle multi-location patient records?",
      answer:
        "CubicleERP maintains a unified patient record across all locations in your network. When a patient visits any location, their complete medical history, medications, allergies, and previous treatments are immediately available to clinical staff. This improves care quality and reduces duplicate testing.",
    },
  ],
  stats: [
    { value: "200+", label: "Healthcare organizations" },
    { value: "100%", label: "HIPAA compliant" },
    { value: "25%", label: "Revenue cycle improvement" },
    { value: "99.99%", label: "Platform uptime SLA" },
  ],
}

export default function HealthcarePage() {
  return <ExploreProductPage data={data} />
}
