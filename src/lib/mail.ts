import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your two-factor authentication code",
    html: `<p>Your two-factor authentication code is: <strong>${token}</strong></p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink =
    "http://localhost:3000/auth/new-verification?token=" + token;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<a href="${confirmLink}">Click here to confirm your email</a>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = "http://localhost:3000/auth/new-password?token=" + token;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<a href="${resetLink}">Click here to reset your password</a>`,
  });
};
