// Design tokens for LandingPage1
export const COLORS = {
  // Dark backgrounds
  heroBg: "#07072B",
  darkSection: "#0F0F2E",

  // Primary brand
  primaryPurple: "#6161FF",
  primaryPurpleHover: "#5034FF",
  primaryBlue: "#3898EC",

  // Light backgrounds
  lightSection: "#FFFFFF",
  altSection: "#F8F9FC",

  // Text
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  textOnDark: "#E2E8F0",
  textMuted: "#94A3B8",

  // Accents
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  teal: "#14B8A6",
  violet: "#8B5CF6",
  cyan: "#06B6D4",
  orange: "#F97316",
  pink: "#EC4899",
} as const

export const GRADIENTS = {
  cta: "from-[#6161FF] to-[#3898EC]",
  ctaHover: "from-[#5034FF] to-[#2B7FD4]",
  heroBlobPurple: "bg-[#6161FF]/20",
  heroBlobBlue: "bg-[#3898EC]/15",
  heroBlobViolet: "bg-[#8B5CF6]/10",
  ctaBanner: "from-[#6161FF] via-[#4A3AFF] to-[#3898EC]",
  textGradient: "from-[#6161FF] to-[#3898EC]",
} as const

export const MODULE_COLORS = {
  crm: { gradient: "from-blue-600 to-indigo-700", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600" },
  hrm: { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600" },
  pm: { gradient: "from-purple-600 to-violet-700", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" },
  finance: { gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600" },
  portal: { gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600" },
  helpdesk: { gradient: "from-cyan-500 to-blue-600", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600" },
} as const
