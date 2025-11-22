"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Loading from "@/app/loading";
import { CopyCheck, Dices, Trash2Icon, Users2, XIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAdminChats } from "@/lib/hooks/new/admin/use-all-chats";
import { ChatWithRelations } from "@/server/db/schema";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import GroupedChatCard from "./group-chat-card";

type FilterType = "none" | "user" | "asset";

const filters = [
  {
    title: "User",
    icon: <Users2 color="red" size={16} />,
    color: "red",
    key: "user",
  },
  {
    title: "Asset",
    icon: <Dices color="#005eed" size={16} />,
    color: "blue",
    key: "asset",
  },
];

const AdminDisplayChats = () => {
  const { user } = useUser();
  const { chats, isFetchChatLoading, isFetchChatsError, loadMore, hasMore } =
    useAdminChats();
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("none");
  const utils = api.useUtils();

  const { mutate: deleteChats } = api.adminChat.deleteChat.useMutation({
    onSuccess: () => {
      toast.success("Chats deleted successfully");
      setSelectedChats(new Set());
      utils.adminChat.getAllChats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete chats");
    },
  });

  const groupChats = useCallback(() => {
    if (!chats) return [];
    const sortedChats = chats.toSorted((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    if (activeFilter === "none" || isSelectionMode) {
      return sortedChats;
    }

    const map = new Map<string, ChatWithRelations & { count: number }>();

    for (const chat of sortedChats) {
      const key = activeFilter === "user" ? chat.userId : chat.assetId;
      if (key) {
        if (map.has(key)) {
          map.get(key)!.count += 1;
        } else {
          map.set(key, { ...chat, count: 1 });
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [activeFilter, chats, isSelectionMode]);

  const groupedChats = useMemo(() => groupChats(), [groupChats]);

  // useEffect(() => {
  //   if (selectedChats.size === 0) {
  //     console.log("EFFECTING");
  //     setIsSelectionMode(false);
  //     setSelectedChats(new Set());
  //   }
  // }, [selectedChats]);

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChats((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(chatId)) {
        newSelected.delete(chatId);
      } else {
        newSelected.add(chatId);
      }
      return newSelected;
    });
  }, []);

  const handleToggleSelectionMode = useCallback(() => {
    setIsSelectionMode((prev) => !prev);
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedChats(new Set(groupedChats.map((chat) => chat.id)));
  }, [groupedChats]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedChats.size === 0) return;
    setIsDeleteDialogOpen(true);
  }, [selectedChats]);

  const confirmDelete = useCallback(() => {
    deleteChats({ chatIds: Array.from(selectedChats) });
    setIsDeleteDialogOpen(false);
  }, [deleteChats, selectedChats]);

  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter((prev) => (prev === filter ? "none" : filter));
    setIsSelectionMode(false);
    setSelectedChats(new Set());
  }, []);

  if (isFetchChatLoading && !chats) {
    return <Loading />;
  }

  if (isFetchChatsError) {
    return (
      <div className="error w-full h-screen flex flex-col gap-8 place-items-center pt-16">
        <p className="font-bold text-2xl uppercase">Error fetching chats</p>
        <p>There was an error fetching the chats. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>
          <ReloadIcon className="mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  console.log("GROUPED CHATS", groupedChats);

  if (!groupedChats || groupedChats.length === 0) {
    return (
      <div className="w-full h-[60dvh] flex flex-col gap-8 place-items-center pt-16">
        No chats found
      </div>
    );
  }

  return (
    <div>
      {isSelectionMode && (
        <div className="flex align-middle justify-between px-2 py-4 fixed top-0 left-1/2 -translate-x-1/2 z-[51] w-full dark:bg-black bg-white">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedChats(new Set());
              }}
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
            <h4 className="font-semibold">{selectedChats.size}</h4>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <EllipsisVerticalIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={"z-[52]"}>
                <DropdownMenuItem asChild>
                  <Button
                    variant={"ghost"}
                    className="w-full justify-start"
                    onClick={handleSelectAll}
                  >
                    <CopyCheck className="w-4 h-4 mr-2" />
                    Select All
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="w-full justify-start"
                      onClick={handleDeleteSelected}
                    >
                      <Trash2Icon className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to delete {selectedChats.size} chats.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="grid grid-flow-col gap-2 w-full px-4 py-2 border-b align-middle place-items-center max-w-screen-sm mx-auto">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleFilterChange(filter.key as FilterType)}
            className={`
            px-4 py-3 rounded-xl font-medium text-xs w-full
            flex align-middle place-items-center justify-start gap-2
            duration-300 ease-in-out transition-all
            bg-${filter.color}-100/90
            dark:bg-${filter.color}-500/5
            border-2 border-${filter.color}-400
            dark:border-${filter.color}-500/20
            hover:bg-${filter.color}-500/30
            hover:dark:bg-${filter.color}-500/30
            hover:border-${filter.color}-400
            hover:dark:border-${filter.color}-500/60
            ${
              activeFilter === filter.key &&
              `
              bg-${filter.color}-500/30
              dark:bg-${filter.color}-500/60
              border-${filter.color}-400
              dark:border-${filter.color}-500/60
            `
            }
          `}
          >
            {filter.icon}
            {filter.title}
          </button>
        ))}

        <Button
          variant="outline"
          className="border-red-400 dark:border-red-900/40"
          size="icon"
          onClick={() => handleFilterChange("none")}
          disabled={activeFilter === "none"}
        >
          <XIcon size={16} color="#eb0000" />
        </Button>
      </div>

      {groupedChats.map((chat) => (
        <GroupedChatCard
          key={chat.id}
          chat={chat}
          isSelected={selectedChats.has(chat.id)}
          onSelect={handleSelectChat}
          user={{ id: user?.id ?? null }}
          isSelectionMode={isSelectionMode}
          onToggleSelectionMode={handleToggleSelectionMode}
        />
      ))}
      {hasMore && (
        <div className="p-4 w-full">
          <Button
            onClick={() => loadMore()}
            variant="link"
            className="w-full mt-4"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminDisplayChats;
