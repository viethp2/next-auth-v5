import { db } from "@/lib/db";

export const getVerificationTokenByEmail = (email: string) => {
  return db.verificationToken
    .findFirst({ where: { email } })
    .then((token) => {
      return token;
    })
    .catch((error) => {
      console.error("getVerificationTokenByEmail", error);
      return null;
    });
};

export const getVerificationTokenByToken = (token: string) => {
  return db.verificationToken
    .findFirst({ where: { token } })
    .then((token) => {
      return token;
    })
    .catch((error) => {
      console.error("getVerificationTokenByToken", error);
      return null;
    });
};