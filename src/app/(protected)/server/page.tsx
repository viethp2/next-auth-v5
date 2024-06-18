import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";

type Props = {};

const ServerPage = async (props: Props) => {
  const user = await currentUser();
  return <UserInfo label="Server component" user={user} />;
};

export default ServerPage;
