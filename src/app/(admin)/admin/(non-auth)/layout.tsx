import AdminPathHandler from "@/lib/context/AdminPathHandler";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AdminNonAuthLayout = (props: Props) => {
  return <AdminPathHandler>{props.children}</AdminPathHandler>;
};

export default AdminNonAuthLayout;
