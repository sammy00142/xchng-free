import React from "react";
import { Message } from "../../../../chat";
import { formatTime } from "@/lib/utils/formatTime";
import { ClockIcon } from "@heroicons/react/24/outline";

type Props = {
  message: Message;
  idx: number;
};

const AdminTextMessage = ({ idx, message }: Props) => {
  if (message.content.text === "") return null;

  return (
    <div
      key={idx}
      className={`max-w-[270px] md:max-w-[500px] transition-all duration-500 px-2 ${
        message.recipient === "admin"
          ? "justify-self-start"
          : "justify-self-end"
      }`}
    >
      <div
        className={`${
          message.recipient === "user"
            ? "bg-purple-600/70 dark:bg-purple-500/50 text-white rounded-l-md rounded-br-md rounded-tr-[3px]"
            : "rounded-r-md rounded-bl-md rounded-tl-[3px] bg-neutral-200/50 dark:bg-neutral-800 text-black/70 dark:text-white"
        } flex align-middle place-items-end justify-between px-3.5 gap-2 py-2`}
      >
        <div className="flex align-middle place-items-end gap-4">
          <p className={`text-xs font-medium`}>{message.content.text}</p>
          <p className="text-[8px] font-light leading-3">
            {message.read_receipt.delivery_status === "not_sent" ? (
              <ClockIcon width={14} />
            ) : (
              formatTime(
                new Date(
                  (message?.timeStamp?.seconds ?? 0) * 1000 +
                    (message?.timeStamp?.nanoseconds ?? 0) / 1e6
                ).toISOString()
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminTextMessage;
