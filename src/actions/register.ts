"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/schemas";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { email, name, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await getUserByEmail(email);

  if (user) {
    throw new Error("User already exists");
  }

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(email, verificationToken.token);

  // TODO: send verification email

  return { success: "Confirmation email sent" };
};
