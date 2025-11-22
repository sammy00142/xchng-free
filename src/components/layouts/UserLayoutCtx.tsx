"use client";
import SellNavbar from "@/components/sellPage/SellNavbar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface UserLayoutCtxProps {
  children: ReactNode;
}

const UserLayoutCtx: React.FC<UserLayoutCtxProps> = ({ children }) => {
  const pathName = usePathname();
  const hideNavbarRegex = /^\/chat\//;
  const hideNavbarOnprofileRegex = /^\/profile\//;


  const isChatPage = pathName.startsWith("/chat");
  const isProfilePage = pathName.startsWith("/profile");

  console.log("isProfilePage", isProfilePage);
  const pageTitle = pathName.split("/")[1];

  return (
    <div className="max-w-screen-lg mx-auto">
      {!isChatPage && !isProfilePage ? <SellNavbar /> : null}
      <div>{children}</div>
    </div>
  );
};

export default UserLayoutCtx;
