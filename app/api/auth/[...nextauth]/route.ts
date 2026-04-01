import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordsMatch) {
          throw new Error("Incorrect password");
        }
        
        // Ensure primary administrator account dynamically
        if (user.email === "zyed.maaz@gmail.com" && !user.isAdmin) {
           user = await prisma.user.update({
             where: { id: user.id },
             data: { isAdmin: true }
           });
        }

        return { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } as any;
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token && session.user) {
        (session.user as { id: string, isAdmin: boolean }).id = token.sub;
        (session.user as { id: string, isAdmin: boolean }).isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-local-dev-only",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
