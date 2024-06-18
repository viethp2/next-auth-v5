import { auth } from "@/auth";

export const currentUser = () => auth().then((session) => session?.user);

export const currentRole = () => auth().then((session) => session?.user.role);
