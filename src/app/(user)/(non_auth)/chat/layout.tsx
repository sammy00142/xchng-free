import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const UserChatLayout = (props: Props) => {
  return <>{props.children}</>;
};

export default UserChatLayout;
