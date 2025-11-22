import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getUsersAction } from "@/lib/utils/adminActions/getAllUsers";
import UserActionButton from "./action-btn";
import AdminUserActionButton from "./admin-action-btn";
import { CrownIcon } from "lucide-react";

export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const users = await getUsersAction(query, currentPage);

  return (
    <div className="p-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="w-full h-14 flex place-items-center px-4 dark:bg-black border-b dark:hover:bg-neutral-900/20 duration-300 transition-all ease-in justify-between py-4"
        >
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                src={
                  user.image ??
                  "https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2Fpreview.png%3Fsize%3D144%26seed%3Dseed%26initials%3DAD%26isSquare%3Dtrue%26bgType%3Dmarble%26bgColor%3D9e9e9e%26fgType%3Dsilhouette%26fgColor%3DFFFFFF%26type%3Duser&w=48&q=75"
                }
                className={`${!user.image && "dark:opacity-60"}`}
                alt={user.username}
              />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div
              className={`${user.disabled ? "opacity-50" : ""} flex flex-col`}
            >
              <h4 className="text-sm font-semibold capitalize flex align-middle place-items-center items-center gap-2">
                {user.username}
                {user.role === "admin" && <CrownIcon color="gold" size={16} />}
              </h4>
              <p className="md:text-sm text-[12px] text-neutral-500">
                {user.email}
              </p>
            </div>
          </div>

          {user.disabled && (
            <div className="px-3 scale-[0.65] py-1 h-fit bg-orange-700 rounded-md justify-self-end">
              Banned
            </div>
          )}

          {user.role === "admin" ? (
            <AdminUserActionButton user={user} />
          ) : (
            <UserActionButton user={user} />
          )}
        </div>
      ))}
    </div>
  );
}
