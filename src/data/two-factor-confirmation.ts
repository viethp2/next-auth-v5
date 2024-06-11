import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  return db.twoFactorConfirmation
    .findUnique({
      where: {
        userId,
      },
    })
    .catch(() => null);
};
