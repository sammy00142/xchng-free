import React, { Suspense } from "react";
import { getTotalPagesAction } from "@/lib/utils/adminActions/getAllUsers";
import Search from "./_components/search";
import UsersTable from "./_components/users-table";
import PagePagination from "./_components/pagination";

type Props = {
  searchParams: {
    username: string;
    page: string;
  };
};

const CreateUser = async ({ searchParams }: Props) => {
  const query = searchParams?.username || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await getTotalPagesAction(query);

  return (
    <div className="mx-auto max-w-screen-md">
      <div className="p-2">
        <h4 className="font-bold text-xl">Users</h4>
      </div>

      <Search />

      <Suspense
        key={query + currentPage}
        fallback={
          <div className="p-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="w-full dark:bg-neutral-900 align-middle place-items-center justify-start px-6 animate-pulse h-10 rounded-lg mb-2"
              />
            ))}
          </div>
        }
      >
        <UsersTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <PagePagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default CreateUser;
