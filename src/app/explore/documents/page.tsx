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

  capabilities: [
    {
      title: "Intelligent Document Classification",
      description:
        "Let AI automatically categorize, tag, and route incoming documents based on their content. The classification engine recognizes document types like invoices, contracts, receipts, and correspondence, then applies the appropriate metadata and filing rules without manual intervention.",
      keyPoints: [
        "Pre-trained models recognize 50+ common business document types out of the box with 95%+ accuracy",
        "Custom training lets you teach the system to recognize industry-specific or proprietary document formats",
        "Auto-tagging extracts key entities like vendor names, invoice amounts, contract dates, and PO numbers from document content",
        "Smart routing sends classified documents directly to the right team, folder, or approval workflow",
      ],
    },
    {
      title: "Document Workflow Automation",
      description:
        "Build end-to-end document workflows that handle review, approval, signing, and archival automatically. From purchase order approvals to contract renewals, every step is tracked and every stakeholder is notified at the right time.",
      keyPoints: [
        "Visual workflow designer lets you map multi-step approval chains with parallel and sequential routing",
        "Conditional routing sends documents to different approvers based on amount, department, document type, or any custom field",
        "Deadline enforcement with automatic escalation ensures documents never sit in someone's queue indefinitely",
      ],
    },
    {
      title: "Advanced OCR and Data Extraction",
      description:
        "Transform paper documents and scanned images into searchable, structured data. The OCR engine handles handwritten text, low-quality scans, and multi-language documents, extracting key fields that feed directly into your business systems.",
      keyPoints: [
        "Process scanned invoices, receipts, and forms with 99% character-level accuracy across 40+ languages",
        "Template-free extraction identifies and captures key-value pairs without pre-defining field locations",
        "Extracted data flows directly into CubicleERP modules like Finance, CRM, and Inventory for automated processing",
        "Batch processing handles thousands of pages per hour for large-scale digitization projects",
      ],
    },
    {
      title: "Retention Policy and Compliance Engine",
      description:
        "Enforce document lifecycle policies automatically to meet regulatory requirements. Define how long each document type must be retained, when it should be reviewed, and when it can be safely disposed of, all with complete audit trails.",
      keyPoints: [
        "Configure retention schedules by document type, department, or regulatory framework (GDPR, HIPAA, SOX)",
        "Automated disposition workflows notify stakeholders before documents are archived or permanently deleted",
        "Legal hold functionality preserves documents involved in litigation or investigations, overriding normal retention rules",
      ],
    },
  ],

  integrations: [
    { name: "Google Drive", category: "Storage" },
    { name: "Microsoft OneDrive", category: "Storage" },
    { name: "Dropbox", category: "Storage" },
    { name: "Slack", category: "Communication" },
    { name: "Microsoft 365", category: "Productivity" },
    { name: "Google Workspace", category: "Productivity" },
    { name: "DocuSign", category: "E-Signatures" },
    { name: "Adobe Acrobat", category: "Document Tools" },
    { name: "SharePoint", category: "Storage" },
    { name: "Zapier", category: "Automation" },
    { name: "Notion", category: "Productivity" },
    { name: "Box", category: "Storage" },
  ],

  testimonials: [
    {
      quote:
        "Our legal team was drowning in contract versions scattered across email, shared drives, and desktops. CubicleERP Documents gave us a single source of truth with version history, and our contract review cycle time dropped from 12 days to 3.",
      author: "Katherine Lawson",
      role: "General Counsel",
      company: "Apex Financial Services",
      metric: "75% faster contract review cycles",
    },
    {
      quote:
        "We digitized 15 years of paper records in under two months using the bulk scan and OCR features. Now any employee can find a document in seconds instead of spending 20 minutes in the file room. It has been transformational for our operations.",
      author: "Rajesh Patel",
      role: "Chief Operating Officer",
      company: "MedCore Health Systems",
      metric: "15 years of records digitized in 2 months",
    },
    {
      quote:
        "During our last SOC 2 audit, the auditors were impressed that we could produce any document's complete access and edit history in under a minute. CubicleERP Documents made compliance something we barely think about instead of a quarterly fire drill.",
      author: "Elena Vasquez",
      role: "Compliance Director",
      company: "TrustBridge Insurance",
      metric: "Audit preparation time reduced by 90%",
    },
  ],

  comparisons: [
    { feature: "Document search", traditional: "Folder browsing only", cubicleErp: "Full-text search with OCR" },
    { feature: "Version management", traditional: "Manual file renaming", cubicleErp: "Automatic version history" },
    { feature: "Collaboration", traditional: "Email attachments back and forth", cubicleErp: "Real-time co-editing" },
    { feature: "Security", traditional: "Shared folder permissions", cubicleErp: "Granular role-based access" },
    { feature: "Compliance", traditional: "Manual audit log tracking", cubicleErp: "Automated retention policies" },
    { feature: "Signatures", traditional: "Print, sign, scan, email", cubicleErp: "Built-in e-signatures" },
  ],

  subNavItems: [
    { label: "Overview", sectionId: "hero" },
    { label: "Features", sectionId: "features" },
    { label: "Capabilities", sectionId: "capabilities" },
    { label: "Benefits", sectionId: "benefits" },
    { label: "Integrations", sectionId: "integrations" },
    { label: "Use Cases", sectionId: "use-cases" },
    { label: "FAQs", sectionId: "faqs" },
    { label: "Project Management", href: "/explore/project-management" },
    { label: "Client Portal", href: "/explore/client-portal" },
    { label: "Automation", href: "/explore/automation" },
  ],
}

export default function DocumentsPage() {
  return <ExploreProductPage data={data} />
}
