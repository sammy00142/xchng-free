import React, { ReactNode } from "react";
import { checkRole } from "@/lib/utils/role";
import { redirect } from "next/navigation";

type Props = {
  children: ReactNode;
};
const AdminLayout = (props: Props) => {
  const isAdmin = checkRole("admin");

  if (!isAdmin) {
    redirect("/sell");
  }

  return <>{props.children}</>;
};

export default AdminLayout;
