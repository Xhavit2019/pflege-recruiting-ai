import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [CredentialsProvider({
    name: "Credentials",
    credentials: { email: {}, password: {} },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;
      const user = await prisma.user.findUnique({ where: { email: credentials.email } });
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!ok) return null;
      return { id: user.id, email: user.email, name: user.name, role: user.role } as any;
    }
  })],
  callbacks: {
    async jwt({ token, user }) { if (user) token.role = (user as any).role; return token; },
    async session({ session, token }) { (session.user as any).role = token.role; return session; }
  }
};
