import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin"
import AzureADProvider from "next-auth/providers/azure-ad" // Microsoft login
import CredentialsProvider from "next-auth/providers/credentials" // For OTP simulation

const handler = NextAuth({
  providers: [
    // Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // LinkedIn
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),

    // Microsoft (Azure AD)
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),

    // Simulated OTP (you can replace later with a real backend)
    CredentialsProvider({
      name: "Mobile OTP",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.phone) {
          return { id: "otp-user", name: "Mobile User", phone: credentials.phone }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/upload/signin", // optional custom UI route
  },
  session: { strategy: "jwt" },
})

export { handler as GET, handler as POST }
