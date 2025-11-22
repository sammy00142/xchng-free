import Link from "next/link";
import React from "react";
import {
  BugAntIcon,
  CreditCardIcon,
  EllipsisHorizontalCircleIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { TicketsData } from "../../../../types";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  ticket: TicketsData;
  idx: number;
  link: string;
};

const TicketCard = ({ ticket, link }: Props) => {
  return (
    <Link
      href={link}
      key={ticket.id}
      className="p-3 hover:bg-neutral-200 hover:bg-opacity-50 dark:hover:bg-black flex align-middle place-items-center justify-between relative"
    >
      {!ticket.status.seen && !ticket.status.addressed ? (
        <div className="h-2 w-2 bg-red-500 rounded-full absolute right-4 top-1/2 -translate-y-1/2" />
      ) : null}

      <div className="grid grid-flow-row gap-2">
        <div className="flex align-middle place-items-center justify-start gap-3">
          {(() => {
            switch (ticket.content.type) {
              case "Bug Ticket":
                return (
                  <BugAntIcon
                    className="text-fuchsia-700 dark:text-fuchsia-500"
                    width={20}
                  />
                );
              case "Transaction issues":
                return <CreditCardIcon className="text-rose-500" width={20} />;
              case "Improvement suggestion":
                return <SparklesIcon className="text-blue-500" width={20} />;
              case "Question":
                return (
                  <QuestionMarkCircleIcon
                    className="text-yellow-500"
                    width={20}
                  />
                );
              default:
                return null; // Return nothing for unknown types
            }
          })()}

          <h4 className="font-medium text-base">{ticket.content.type}</h4>
        </div>
        <h6 className="text-neutral-500 dark:text-neutral-400 text-xs md:max-w-[400px] max-w-[200px] truncate">
          Description: <span className="">{ticket.content.description}</span>
        </h6>
      </div>
      <div className="text-[10px] capitalize mt-2">
        {ticket.status.seen && !ticket.status.addressed ? (
          <div className="flex align-middle place-items-center justify-start gap-0.5 opacity-60">
            <EllipsisHorizontalCircleIcon
              width={10}
              className="text-yellow-600"
            />
            <span>progress</span>
          </div>
        ) : null}
        {ticket.status.addressed && (
          <div className="flex align-middle place-items-center justify-start gap-0.5 opacity-60">
            <CheckCircleIcon width={10} className="text-green-500 -mt-0.5" />
            <span>Addressed</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default TicketCard;
