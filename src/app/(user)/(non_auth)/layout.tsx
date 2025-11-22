import Loading from "@/app/loading";
import UserLayoutCtx from "@/components/layouts/UserLayoutCtx";
import React, { ReactNode, Suspense } from "react";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <Suspense
        fallback={
          <>
            <Loading />
          </>
        }
      >
        <UserLayoutCtx>{children}</UserLayoutCtx>
      </Suspense>
    </div>
  );
};

export default UserLayout;
