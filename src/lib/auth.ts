import { auth } from "@/auth";

export const currentUser = () => auth().then((session) => session?.user);
