import NextAuth, { type AuthOptions, type Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

type TokenWithRole = JWT & { role?: string }
type SessionWithRole = Session & { user?: { role?: string } }

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: TokenWithRole; user?: unknown }) {
      if (typeof user === "object" && user !== null && "role" in user) {
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }: { session: SessionWithRole; token: TokenWithRole }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
