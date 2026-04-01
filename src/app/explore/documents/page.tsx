"use client"

import ExploreProductPage from "@/components/landingpage2/explore/ExploreProductPage"
import {
  FileText,
  CloudUpload,
  GitBranch,
  FileCheck,
  PenTool,
  ShieldCheck,
  Search,
} from "lucide-react"

const data = {
  name: "Documents",
  tagline: "Organize, share, and collaborate on documents effortlessly",
  description:
    "CubicleERP Documents gives your team a centralized, secure hub for every file in your organization. From contracts and invoices to SOPs and onboarding packets, store everything in the cloud, control who sees what, and find any document in seconds with powerful full-text search.",
  icon: FileText,
  color: "#1976D2",
  lightColor: "#E3F2FD",
  heroImage: "https://images.unsplash.com/photo-1568667256549-094345857637?w=1920&q=80",
  variant: 3 as const,

  features: [
    {
      icon: CloudUpload,
      title: "Cloud Storage",
      description:
        "Upload and store files of any type directly in CubicleERP. Every document is replicated across geo-redundant servers so your data is always available, even during regional outages. Access your files from any device, anywhere.",
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description:
        "Every edit creates a new version automatically. Compare revisions side-by-side, restore previous versions with one click, and see a complete audit trail of who changed what and when -- no more overwriting a colleague's work.",
    },
    {
      icon: FileCheck,
      title: "Document Templates",
      description:
        "Create reusable templates for contracts, proposals, NDAs, and more. Lock formatting and required fields so every document your team produces is consistent, on-brand, and compliant with company standards.",
    },
    {
      icon: PenTool,
      title: "E-Signatures",
      description:
        "Request legally binding electronic signatures without leaving CubicleERP. Signers receive an email link, review the document, and sign from any device. Track signature status in real time and store signed copies automatically.",
    },
    {
      icon: ShieldCheck,
      title: "Access Control",
      description:
        "Define granular permissions at the folder, document, or even page level. Assign viewer, editor, or admin roles to individuals or teams, set expiration dates on shared links, and revoke access instantly when needed.",
    },
    {
      icon: Search,
      title: "Full-Text Search",
      description:
        "Search inside PDFs, Word documents, spreadsheets, and scanned images with built-in OCR. Filter results by date, author, tag, or file type to pinpoint exactly the document you need in under two seconds.",
    },
  ],

  benefits: [
    {
      title: "Find Anything Fast",
      description:
        "Stop wasting time digging through folder hierarchies and email attachments. Full-text search with OCR indexes every word in every document so your team can locate critical files in seconds instead of minutes.",
    },
    {
      title: "Eliminate Version Chaos",
      description:
        "No more files named 'Contract_v3_FINAL_FINAL.docx.' Automatic version history keeps a clean, numbered record of every change and lets you roll back to any point with a single click.",
    },
    {
      title: "Secure Sharing",
      description:
        "Share documents with external partners using password-protected, expiring links. Internal sharing uses role-based permissions so sensitive files are only visible to authorized personnel.",
    },
    {
      title: "Compliance Ready",
      description:
        "Meet regulatory requirements with immutable audit logs, retention policies, and automated archival. Whether you need SOC 2, GDPR, or HIPAA compliance, CubicleERP Documents has you covered.",
    },
    {
      title: "Team Collaboration",
      description:
        "Multiple team members can comment, annotate, and suggest edits on the same document simultaneously. Threaded conversations keep feedback organized and tied directly to the relevant content.",
    },
    {
      title: "Reduce Paper Usage",
      description:
        "Digitize paper-based workflows with scan-to-cloud, e-signatures, and digital forms. Organizations using CubicleERP Documents report an average 80% reduction in paper consumption within the first year.",
    },
  ],

  steps: [
    {
      step: "1",
      title: "Upload Documents",
      description:
        "Drag and drop files from your desktop, import from Google Drive or OneDrive, or scan physical documents directly into CubicleERP. Bulk uploads handle thousands of files at once.",
    },
    {
      step: "2",
      title: "Organize & Tag",
      description:
        "Arrange documents into folders, apply custom tags and metadata, and let smart auto-categorization sort incoming files for you. Set up retention rules to archive or delete documents on schedule.",
    },
    {
      step: "3",
      title: "Share & Collaborate",
      description:
        "Invite team members or external contacts to view, comment, or edit. Use e-signatures for approvals, track activity with real-time notifications, and keep every conversation in context.",
    },
  ],

  useCases: [
    {
      title: "Legal Teams",
      description:
        "Manage contracts, NDAs, court filings, and client correspondence in a single secure repository. Version control ensures you always reference the latest signed agreement, and full-text search cuts legal research time dramatically.",
      highlights: [
        "Contract lifecycle management with automated renewal alerts",
        "Redaction tools for sensitive information before disclosure",
        "Audit-ready logs for litigation holds and e-discovery",
      ],
    },
    {
      title: "HR Departments",
      description:
        "Centralize employee records, offer letters, performance reviews, and policy documents. Role-based access keeps personal data private, while templates ensure every new hire receives consistent onboarding materials.",
      highlights: [
        "Employee self-service portal for pay stubs and tax forms",
        "Automated onboarding packets with e-signature workflows",
        "Retention policies aligned with labor law requirements",
      ],
    },
    {
      title: "Compliance & Audit",
      description:
        "Maintain an unbroken chain of custody for regulated documents. Immutable version histories, timestamped access logs, and automated retention schedules help your organization pass audits with confidence.",
      highlights: [
        "SOC 2, GDPR, and HIPAA-compliant storage and access controls",
        "Automated document retention and disposition workflows",
        "One-click audit report generation with full activity trails",
      ],
    },
  ],

  faqs: [
    {
      question: "What file types does CubicleERP Documents support?",
      answer:
        "CubicleERP Documents supports virtually every file format including PDF, DOCX, XLSX, PPTX, JPG, PNG, SVG, MP4, ZIP, and more. Our built-in viewers let you preview most file types directly in the browser without downloading, and OCR processing indexes the text inside scanned images and PDFs for search.",
    },
    {
      question: "Is there a storage limit?",
      answer:
        "All paid plans include unlimited storage. Free trial accounts receive 5 GB of storage to evaluate the platform. If you need to import a large existing archive, our migration team can assist with bulk transfers from network drives, SharePoint, Google Drive, or Dropbox at no extra cost.",
    },
    {
      question: "How is my data secured?",
      answer:
        "Documents are encrypted with AES-256 both at rest and in transit. Our infrastructure runs on SOC 2 Type II certified data centers with geo-redundant backups. Access is protected by role-based permissions, optional two-factor authentication, and IP whitelisting for enterprise accounts.",
    },
    {
      question: "Can external users collaborate on documents?",
      answer:
        "Yes. You can share individual documents or entire folders with external users via secure, password-protected links. External collaborators can view, comment, or sign documents without needing a CubicleERP account. You control permissions and can revoke access at any time.",
    },
    {
      question: "Does CubicleERP Documents integrate with other tools?",
      answer:
        "Absolutely. CubicleERP Documents integrates natively with every other CubicleERP module -- CRM, HRM, Finance, and more. It also connects with Google Workspace, Microsoft 365, Slack, and Zapier so you can embed document workflows into the tools your team already uses.",
    },
  ],

  stats: [
    { value: "90%", label: "Faster document search" },
    { value: "100%", label: "Version control coverage" },
    { value: "256-bit", label: "AES encryption standard" },
    { value: "Unlimited", label: "Cloud storage on paid plans" },
  ],
}

export default function DocumentsPage() {
  return <ExploreProductPage data={data} />
}
