import React from "react";
import { ClockIcon, Download, Reply, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { MessageWithRelations } from "@/server/db/schema";
import Image from "next/image";
import { downloadMedia } from "@/lib/utils/download-media";

interface ChatMessageProps {
  message: MessageWithRelations;
  onReply: (messageId: string) => void;
  replyMessage?: MessageWithRelations;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onReply,
  replyMessage,
}) => {
  return (
    <div
      className={`${
        message.isAdmin ? "justify-start" : "justify-end"
      } grid grid-flow-col align-middle place-items-center group gap-2 mb-1.5 active:scale-[0.98] ease-out duration-200 transition-all relative`}
      id={message.id}
      onDoubleClick={() => onReply(message.id)}
    >
      <div className={`w-full ${message.isAdmin ? "text-left" : "text-right"}`}>
        {message.parentId && replyMessage && (
          <div
            className={`text-[13px] dark:bg-neutral-800 w-fit py-1 pr-6 pl-2 rounded-sm rounded-br-[2px] text-muted-foreground border leading-none truncate ${
              message.isAdmin ? "justify-self-start" : "justify-self-end"
            }`}
          >
            {replyMessage.text}
          </div>
        )}
        {message.mediaUrl && (
          <div className="mb-1 mt-5 p-0 w-fit text-xs underline">
            <Image
              className={"rounded-[6px]"}
              src={message.mediaUrl}
              alt={"Attachment"}
              width={250}
              height={250}
            />
          </div>
        )}
        <div
          className={`inline-block py-2 pl-3 ${
            !message.isAdmin ? "pr-10" : "pr-3"
          } py-1 leading-none rounded-sm ${
            message.parentId && "rounded-tr-[2px] "
          } ${
            !message.mediaUrl
              ? message.isAdmin
                ? "dark:bg-muted bg-neutral-200/80 rounded-tl-[2px]"
                : "bg-primary rounded-tr-[2px] text-white"
              : message.isAdmin
              ? "dark:bg-muted bg-neutral-200/80 rounded-tl-[2px]"
              : "dark:bg-muted bg-neutral-200/80 rounded-tr-[2px]"
          }`}
        >
          <p className="text-[13px] leading-4">{message.text}</p>

          {message.status === "NOT_SENT" ? (
            <span
              className={`${
                message.isAdmin && "hidden"
              } opacity-80 font-medium text-[10px] absolute bottom-1.5 right-2`}
            >
              <ClockIcon size={12} />
            </span>
          ) : (
            <span
              className={`${
                message.isAdmin && "hidden"
              } opacity-80 font-medium text-[10px] absolute bottom-1.5 right-2`}
            >
              {format(message.createdAt, "HH:mm")}
            </span>
          )}
        </div>
      </div>

      <div
        className={`${
          message.isAdmin ? "order-1" : "-order-1"
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
          message.isAdmin ? "order-1" : "-order-1"
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
    </div>
  );
};
