"use client";

import AdminNavbar from "@/components/admin/Navbar";
import CloseChatDialog from "@/components/admin/chat/CloseChatDialog";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
};

const AdminPathHandler = (props: Props) => {
  const [confirmClose, setConfirmClose] = useState(false);

  const handleClose = () => {
    setConfirmClose(true);
  };

  const isChatPage = /\/chat\//.test(usePathname());

  return (
    <>
      {!isChatPage && <AdminNavbar handleClose={handleClose} />}
      {props.children}
      <CloseChatDialog
        confirmClose={confirmClose}
        setConfirmClose={setConfirmClose}
      />
    </>
  );
};

export default AdminPathHandler;
