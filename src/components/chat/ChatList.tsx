import { ChatWithRelations } from "@/server/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatListProps {
  chats?: ChatWithRelations[];
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
  isLoading?: boolean;
}

export const ChatList = ({
  chats,
  onChatSelect,
  selectedChatId,
  isLoading,
}: ChatListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <ChatSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!chats?.length) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground">No chats found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {chats.map((chat) => (
        <button
          key={chat.id}
          className={cn(
            "flex w-full cursor-pointer items-center gap-4 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left",
            selectedChatId === chat.id && "bg-gray-100"
          )}
          onClick={() => onChatSelect(chat.id)}
        >
          <Avatar>
            <AvatarImage src={chat.user?.imageUrl ?? ""} />
            <AvatarFallback>
              {chat.user?.firstName?.[0] ??
                chat.user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium truncate">
                {chat.user?.firstName ?? chat.user?.email}
              </p>
              {chat.lastMessageTime && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(chat.lastMessageTime), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground truncate">
                {chat.lastMessageText ?? "No messages yet"}
              </p>

              {chat.type && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  {chat.type}
                </Badge>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

const ChatSkeleton = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-3 w-[160px]" />
    </div>
  </div>
);
