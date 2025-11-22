import TicketCard from "@/components/admin/tickets/TicketCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUserTickets } from "@/lib/utils/actions/getUserTickets";
import { getUserCookie } from "@/lib/utils/getUserCookie";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

// const iconMap = {
//   "Bug Report": (
//     <BugAntIcon className="text-fuchsia-700 dark:text-fuchsia-500" width={20} />
//   ),
//   "Transaction issues": <CreditCardIcon className="text-rose-500" width={20} />,
//   "Improvement suggestion": (
//     <SparklesIcon className="text-blue-500" width={20} />
//   ),
//   Question: <QuestionMarkCircleIcon className="text-yellow-500" width={20} />,
// };

const UserSupportPage = async () => {
  const tickets = await getUserTickets();
  const uc = await getUserCookie();

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="p-4">
        <div className="mb-6 grid grid-flow-row gap-4">
          <h2 className="text-2xl font-bold">Hey there</h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm">
            Send us reports, questions, technical issues, and improvements
            suggestions.
          </p>
        </div>

        <div className="bg-neutral-200 dark:bg-black bg-opacity-60 rounded-md grid grid-flow-row ">
          <Link
            href={"/support/ticket"}
            className="flex align-middle justify-start gap-4 place-items-center w-full p-3"
          >
            <div className="p-1 w-fit rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
              <PlusCircleIcon className="text-green-500" width={30} />
            </div>
            <h4 className="font-medium">Submit new ticket</h4>
          </Link>
          <Link
            href="mailto:djayableez@gmail.com"
            className="flex align-middle justify-start gap-4 place-items-center w-full p-3"
          >
            <div className="p-1 w-fit rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center">
              <ChatBubbleOvalLeftEllipsisIcon
                className="text-purple-500"
                width={30}
              />
            </div>
            <h4 className="font-medium">Contact us via email</h4>
          </Link>
        </div>
        {uc && (
          <div className="mt-8">
            <div className="mb-6">
              <div className="flex align-middle place-items-center justify-between">
                <h4 className="font-semibold">Your tickets</h4>
                <Link
                  href={"/support"}
                  className="flex align-middle place-items-center gap-2 shadow-none hover:text-neutral-600"
                >
                  <ReloadIcon width={16} />
                  <span>Refresh</span>
                </Link>
              </div>
              <div className="mt-4">
                {!tickets.success ? (
                  <div>
                    <p className="text-neutral-500 text-xs p-4 text-center">
                      {tickets.message}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-flow-row gap-1">
                    {tickets.data
                      ?.filter((ticket) => !ticket.status.addressed)
                      .map((ticket, idx) => {
                        if (!ticket.status.addressed)
                          return (
                            <TicketCard
                              key={idx}
                              ticket={ticket}
                              idx={idx}
                              link={`/support/ticket/${ticket.id}`}
                            />
                          );
                      })}
                  </div>
                )}
              </div>
            </div>
            {tickets?.data?.find((ticket) => ticket.status.addressed) && (
              <Accordion type="single" collapsible>
                <AccordionItem value="addressedTickets">
                  <AccordionTrigger className="no-underline border-none">
                    <h4 className="font-semibold flex align-middle place-items-center justify-start gap-2">
                      <CheckCircleIcon
                        className="text-neutral-500"
                        width={20}
                      />
                      <span>Addressed</span>
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {tickets.data
                        ?.filter((ticket) => ticket.status.addressed)
                        .map((ticket, idx) => {
                          if (ticket.status.addressed)
                            return (
                              <TicketCard
                                key={idx}
                                ticket={ticket}
                                idx={idx}
                                link={`/support/ticket/${ticket.id}`}
                              />
                            );
                        })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSupportPage;
