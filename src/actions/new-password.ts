"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    throw new Error("Missing token");
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid field");
  }

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    throw new Error("Invalid token");
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) {
    throw new Error("Token has expired");
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    throw new Error("User does not exist");
  }

  const password = validatedFields.data.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return "Password updated";
};
