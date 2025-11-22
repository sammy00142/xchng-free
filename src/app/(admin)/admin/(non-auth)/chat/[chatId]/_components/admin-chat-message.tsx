import React from "react";
import { ClockIcon, Download, Reply } from "lucide-react";
import { format } from "date-fns";
import { MessageWithRelations, UserSelect } from "@/server/db/schema";
import Image from "next/image";
import { downloadMedia } from "@/lib/utils/download-media";

interface AdminChatMessageProps {
  message: MessageWithRelations;
  onReply: (messageId: string) => void;
  replyMessage?: MessageWithRelations;
  user: UserSelect;
}

export const AdminChatMessage: React.FC<AdminChatMessageProps> = ({
  message,
  onReply,
  replyMessage,
  user,
}) => {
  return (
    <button
      type="button"
      onKeyDown={(e) => e.key === "Enter" && onReply(message.id)}
      className={`${
        message.isAdmin ? "justify-end" : "justify-start"
      } grid grid-flow-col align-top place-items-center group gap-2 mb-1.5 active:scale-[0.99] ease-out duration-200 transition-all relative w-full text-left`}
      id={message.id}
      onDoubleClick={() => onReply(message.id)}
    >
      {!message.isAdmin && (
        <Image
          src={user?.imageUrl ?? "/logoplace.svg"}
          alt="DP"
          width={22}
          height={22}
          className="rounded-full"
        />
      )}
      <div className={`w-full ${message.isAdmin ? "text-right" : "text-left"}`}>
        {message.parentId && replyMessage && (
          <div
            className={`text-[13px] dark:bg-neutral-800 w-fit py-1 pr-2 pl-2 rounded-sm ${
              message.isAdmin ? "rounded-br-[2px]" : "rounded-bl-[2px]"
            } text-muted-foreground dark:opacity-70 border leading-none truncate ${
              message.isAdmin ? "justify-self-end" : "justify-self-start"
            }`}
          >
            {replyMessage.text}
          </div>
        )}
        {message.mediaUrl && (
          <div className="mb-1 mt-5 p-0 w-fit text-xs">
            <Image
              className={"rounded-[6px]"}
              src={message.mediaUrl}
              alt={"Attachment"}
              width={200}
              height={200}
            />
          </div>
        )}
        <div
          className={`inline-block pl-3 ${
            !message.isAdmin ? "pr-3" : "pr-10"
          } py-1 leading-none rounded-sm ${
            message.parentId && message.isAdmin ? "rounded-tr-[2px]" : ""
          } ${
            message.isAdmin
              ? "bg-primary text-white rounded-tr-[2px]"
              : "dark:bg-muted bg-neutral-200/80 rounded-tl-[2px]"
          }`}
        >
          <p className="text-[12px]">{message.text}</p>

          {message.status === "NOT_SENT" ? (
            <span
              className={`opacity-80 font-medium text-[10px] absolute bottom-1.5 ${
                message.isAdmin ? "right-2" : "left-2"
              }`}
            >
              <ClockIcon size={12} />
            </span>
          ) : (
            <span
              className={`opacity-80 font-medium text-[10px] absolute bottom-1.5 ${
                message.isAdmin ? "right-2" : "hidden"
              }`}
            >
              {format(message.createdAt, "HH:mm")}
            </span>
          )}
        </div>
      </div>

      <div
        className={`${
          message.isAdmin ? "-order-1" : "order-1"
        } text-xs opacity-0 translate-y-0.5 group-hover:opacity-100 group-hover:-translate-y-0 duration-300 ease-out transition-all text-muted-foreground scale-90`}
      >
        <button
          onClick={() => onReply(message.id)}
          className="p-2 rounded-full"
        >
          <Reply size={16} />
        </button>
      </div>

      {message.mediaUrl && (
        <div
          className={`${
            message.isAdmin ? "-order-1" : "order-1"
          } text-xs opacity-0 translate-y-0.5 group-hover:opacity-100 group-hover:-translate-y-0 duration-300 ease-out transition-all text-muted-foreground scale-90`}
        >
          <button
            onClick={() => downloadMedia(message.mediaUrl ?? "")}
            className="p-2 rounded-full"
          >
            <Download size={16} />
          </button>
        </div>
      )}
    </button>
  );
};
