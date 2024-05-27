import { db } from "@/lib/db";

export const getUserByEmail = (email: string) => {
  return db.user
    .findUnique({
      where: {
        email,
      },
    })
    .then((user) => user)
    .catch((error) => {
      console.error("getUserByEmail", error);
      return null;
    });
};

export const getUserById = (id: string) => {
  return db.user
    .findUnique({
      where: {
        id,
      },
    })
    .then((user) => user)
    .catch((error) => {
      console.error("getUserById", error);
      return null;
    });
};
