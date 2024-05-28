import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
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
