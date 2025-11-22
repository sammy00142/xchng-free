import React from "react";

type Props = {
  children: React.ReactNode;
};

const SellLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default SellLayout;