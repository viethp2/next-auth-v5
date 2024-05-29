"use server";

import { AuthError } from "next-auth";
import * as z from "zod";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.password || !existingUser.email) {
    throw new Error("Email does not exist!");
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);

    return "Confirm email sent!";
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  }).catch((error) => {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          throw new Error("Invalid credentials");
        default:
          throw new Error("Something went wrong");
      }
    }
    throw error;
  });
};
