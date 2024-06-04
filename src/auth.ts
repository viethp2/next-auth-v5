import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // Auto verify email when login with Oauth (Google, Github for current).
    linkAccount: async ({ user }) => {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      // Allow OAuth without email verification.
      if (account?.provider !== "credentials") return true;

      // Prevent sign in without email verification.
      if(!user.id) return false

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    // This callback is used to modify the JWT token and pass it to the session callback.
    jwt: async ({ token }) => {
      if (!token.sub) {
        return token;
      }

      const user = await getUserById(token.sub);
      if (!user) {
        return token;
      }

      token.role = user.role;

      return token;
    },
    // This callback is used to modify the session object.
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
