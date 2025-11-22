"use client";
import NavCards from "@/components/admin/dashboard/navCards";
import React from "react";
import QuickView from "@/components/admin/chat/QuickView";
import PostReview from "@/components/admin/chat/PostReview";

const AdminPage = function () {
  return (
    <div className="pb-4 max-w-screen-md mx-auto md:px-0 px-4">
      <NavCards />
      <QuickView />
      {/* <PostReview /> */}
    </div>
  );
};

export default AdminPage;
