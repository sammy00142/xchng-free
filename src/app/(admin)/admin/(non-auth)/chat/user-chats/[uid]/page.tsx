"use client";
import React from "react";
import Image from "next/image";
import ChatCard from "../../_components/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAdminChats } from "@/lib/hooks/new/admin/use-all-chats";
import Loading from "@/app/loading";

type Props = { params: { uid: string } };

const UserChatPage = ({ params }: Props) => {
  const {
    chats: data,
    isFetchChatLoading,
    isFetchChatsError,
  } = useAdminChats();
  const chats = data
    ?.filter((chat) => chat.userId === params.uid)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  if (isFetchChatLoading) {
    return <Loading />;
  }

  if (isFetchChatsError) {
    return <div>Error fetching chats</div>;
  }

  if (!chats)
    return (
      <div className="p-8 m-4 text-center mb-4 text-base font-medium flex flex-col place-items-center justify-center gap-2 border-b dark:border-neutral-800 border-neutral-200">
        <h4 className="capitalize">No chats found</h4>
      </div>
    );

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="p-8 my-4 text-center mb-4 text-base font-medium flex flex-col place-items-center justify-center gap-2 border-b dark:border-neutral-900 border-neutral-200">
        <Image
          src={
            chats[1]?.user?.imageUrl ??
            "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yWVVEVWpEWGZUbWRub0VZY2xtOWR3SktXdGsiLCJyaWQiOiJ1c2VyXzJvRlB6VkNQVTNjbWNWSU15SkJIbnJPU0tRZCIsImluaXRpYWxzIjoiS0gifQ"
          }
          alt={"User"}
          width={80}
          height={80}
          className="rounded-lg"
        />
        <h4 className="capitalize">
          {chats[1]?.user?.username}
          &apos;s messages
        </h4>
        <Link href={`/admin/user/${params.uid}`}>
          <Button variant="link" className="w-full mt-1.5">
            View profile
          </Button>
        </Link>
      </div>

      <div className="border-b dark:border-neutral-800 border-neutral-200 mb-2 pb-2">
        <div className="text-[10px] opacity-50 mb-1 uppercase font-medium px-4">
          Latest
        </div>
        {chats.slice(0, 1).map((chat) => (
          <div key={chat.id} className="w-full">
            <ChatCard key={chat.id} chat={chat} />
          </div>
        ))}
      </div>

      {chats.slice(1).map((chat) => (
        <div key={chat.id} className="w-full">
          <ChatCard key={chat.id} chat={chat} />
        </div>
      ))}
    </div>
  );
};

export default UserChatPage;
