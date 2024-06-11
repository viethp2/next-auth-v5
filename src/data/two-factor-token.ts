import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  return db.twoFactorToken
    .findUnique({
      where: {
        token,
      },
    })
    .catch(() => null);
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  return db.twoFactorToken
    .findFirst({
      where: {
        email,
      },
    })
    .catch(() => null);
};
