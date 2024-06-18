"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

type Props = {};

const ClientPage = (props: Props) => {
  const user = useCurrentUser();
  return <UserInfo label="Client component" user={user} />;
};

export default ClientPage;
