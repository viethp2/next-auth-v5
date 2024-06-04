"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    throw new Error("Token does not exist");
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) {
    throw new Error("Token has expired");
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    throw new Error("User does not exist");
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return "Email verified";
};
