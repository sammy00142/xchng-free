"use client";

import { UserProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import React from "react";

type Props = {};

const ProfilePage = (props: Props) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen w-full flex place-items-center justify-center p-1 transition-all duration-500 ease-out">
      <UserProfile
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
};

export default ProfilePage;
