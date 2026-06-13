// src/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Full Auth.js v5 config — Node.js runtime only (uses Prisma + bcrypt).
//
// Usage:
//   Server components / actions : const session = await auth()
//   Route handler               : export const { GET, POST } = handlers
//   Type augmentation           : session.user.id, session.user.role
//
// The proxy (Edge Runtime) uses a separate lightweight instance via auth.config.ts.
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { authConfig } from "@/src/auth.config";

// ── Type augmentation ─────────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
  }
}

// ── Full config (spreads Edge-safe base + adds Prisma adapter + provider) ─────

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,

  // Prisma adapter — handles account/session DB models for OAuth.
  // We use JWT strategy so active sessions aren't stored in DB,
  // but the adapter is kept for future OAuth provider support.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any),

  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.image,
          role:  user.role as string,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user.role as string) ?? "ADMIN";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id   as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
