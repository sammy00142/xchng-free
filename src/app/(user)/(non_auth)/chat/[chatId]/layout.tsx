import { Metadata } from "next";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Live Chat",
  description:
    "Great exchange is a giftcard exchange company, we buy your giftcards at high rates.",
};

const ChatIDLayout = (props: Props) => {
  return <>{props.children}</>;
};

export default ChatIDLayout;
