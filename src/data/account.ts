import { db } from "@/lib/db";

export const getAccountByUserId = (userId: string) =>
  db.account.findFirst({ where: { userId } }).catch(() => null);
