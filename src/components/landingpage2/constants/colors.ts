// Design tokens for LandingPage2 — Microsoft Dynamics 365 inspired
export const COLORS = {
  // Primary brand
  primary: "#0067B8",
  primaryHover: "#005DA6",
  primaryDark: "#004E8C",
  primaryLight: "#E8F4FD",

  // Backgrounds
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  sectionAlt: "#FAFAFA",
  heroBg: "#F0F6FF",

  // Text
  textPrimary: "#1A1A1A",
  textSecondary: "#505050",
  textMuted: "#737373",
  textLight: "#9E9E9E",

  // Borders
  border: "#E5E5E5",
  borderLight: "#F0F0F0",

  // Accents
  blue: "#0078D4",
  darkBlue: "#002050",
  teal: "#008575",
  orange: "#D83B01",
  green: "#107C10",
  purple: "#5C2D91",

  // Hero gradient colors
  heroGradientBlue: "#4FC3F7",
  heroGradientPurple: "#CE93D8",
  heroGradientGreen: "#A5D6A7",
  heroGradientOrange: "#FFB74D",
} as const

export const GRADIENTS = {
  hero: "from-blue-200 via-purple-200 via-green-100 to-orange-200",
  heroBg: "from-[#E3F2FD] via-[#F3E5F5] via-[#E8F5E9] to-[#FFF3E0]",
  cta: "from-[#0067B8] to-[#0078D4]",
  ctaHover: "from-[#005DA6] to-[#006CBE]",
  tabActive: "#0067B8",
} as const

export const MODULE_COLORS = {
  crm: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "#0078D4" },
  hrm: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "#107C10" },
  pm: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "#5C2D91" },
  finance: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "#D83B01" },
  helpdesk: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", icon: "#008575" },
  analytics: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon: "#C30052" },
} as const
