import React from "react";
import { Send, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MessageWithRelations } from "@/server/db/schema";
import FileAttachment from "@/components/chat/attachment-input";

type ChatInputProps = {
  inputMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (
    contentType?: "CARD" | "MEDIA" | "TEXT",
    mediaUrl?: string,
    caption?: string
  ) => void;
  replyingTo: string | null;
  replyMessage?: MessageWithRelations;
  onCancelReply: () => void;
  onScrollToReply: (messageId: string) => void;
  attachment: FileList | null;
  chatId: string;
};

export const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  onInputChange,
  replyingTo,
  replyMessage,
  onCancelReply,
  onScrollToReply,
  chatId,
  onSendMessage,
}) => {
  return (
    <div className="px-4 pb-4 pt-2">
      {replyingTo && replyMessage && (
        <button
          onClick={() => onScrollToReply(replyingTo)}
          className="dark:bg-muted bg-neutral-200/80 mb-1 scale-95 h-fit flex justify-between items-center rounded-sm px-1 pr-2 w-full"
        >
          <div className="flex align-middle place-items-center justify-start pl-2 w-fit gap-2">
            <span className="w-[3px] bg-secondary rounded-full h-[16px]" />
            <span className="text-sm w-[200px] text-left truncate">
              {replyMessage.text}
            </span>
          </div>
          <button className="w-[14px] p-2.5 pr-4" onClick={onCancelReply}>
            <XIcon size={16} />
          </button>
        </button>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
        className="flex space-x-2"
      >
        <FileAttachment chatId={chatId} />
        <Input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={onInputChange}
          className="flex-grow"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="aspect-square w-[60px] rounded-sm h-full grid place-items-center"
              >
                <Send size={18} className="mr-0.5" />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
  );
};
