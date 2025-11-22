import Link from "next/link";
import React from "react";
import {
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import useAdminConversations from "@/lib/hooks/useAdminConversations";
import { api } from "@/trpc/react";

const navBoxes = [
  {
    name: "Messages",
    icon: <ChatBubbleBottomCenterTextIcon width={24} color="white" />,
    desc: "View all conversations",
    color: "blue",
    link: "/admin/chat",
  },
  {
    name: "Trades",
    icon: <CurrencyDollarIcon width={24} color="white" />,
    desc: "Your trades",
    color: "green",
    link: "/admin/trades",
  },
  {
    name: "Users",
    icon: <UserIcon width={24} color="white" />,
    desc: "Manage users",
    color: "purple",
    link: "/admin/users",
  },
  {
    name: "Tickets",
    icon: <InformationCircleIcon width={24} color="white" />,
    desc: "View reported issues",
    color: "orange",
    link: "/admin/tickets",
  },
];

const NavCards = () => {
  const { allConversations } = useAdminConversations();

  const { data: unReadConversationsNumber } =
    api.adminChat.getUnreadMessagesCount.useQuery();

  console.log("unReadConversationsNumber", unReadConversationsNumber);

  const activeTransaction = allConversations?.filter((conversation) => {
    return (
      conversation.data.transaction.status === "pending" ||
      conversation.data.transaction.status === "processing"
    );
  })?.length as number;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      {navBoxes.map((box, idx) => {
        return (
          <Link
            href={box.link}
            key={idx}
            className="rounded-3xl dark:shadow-lg py-6 ring-4 ring-transparent hover:ring-pink-400/20 duration-300 bg-neutral-300/20 dark:bg-black/20"
          >
            <div className="grid align-middle place-items-center justify-center">
              <div
                className={`flex align-middle place-items-center ${
                  box.name === "Messages"
                    ? "bg-blue-400 shadow-blue-200 dark:bg-blue-500 dark:shadow-blue-600/40"
                    : box.name === "Reports"
                    ? "bg-orange-400 shadow-orange-200 dark:bg-orange-500 dark:shadow-orange-600/40"
                    : box.name === "Trades"
                    ? "bg-green-400 shadow-green-200 dark:bg-green-500 dark:shadow-green-600/40"
                    : box.name === "Users"
                    ? "bg-purple-400 shadow-purple-200 dark:bg-purple-500 dark:shadow-purple-600/40"
                    : "bg-yellow-400 shadow-yellow-200 dark:bg-yellow-500 dark:shadow-yellow-600/40"
                }  p-3.5 shadow-md rounded-xl relative`}
              >
                {box.icon}
                {box.name === "Messages" &&
                  unReadConversationsNumber &&
                  unReadConversationsNumber > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 text-[10px] grid align-middle place-items-center text-center font-semibold text-white">
                      <h4>{unReadConversationsNumber}</h4>
                    </div>
                  )}
                {box.name === "Trades" && activeTransaction > 0 && (
                  <div className="absolute -top-1 -right-1  bg-red-500 rounded-full h-4 w-4 text-[10px] grid align-middle place-items-center text-center font-semibold text-white">
                    <h4>{activeTransaction}</h4>
                  </div>
                )}
              </div>
              <h4 className="font-medium mt-2">{box.name}</h4>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default NavCards;
