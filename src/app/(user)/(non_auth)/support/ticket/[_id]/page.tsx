import { fetchTicketData } from "@/lib/utils/actions/fetchTicketData";
import React from "react";
import { TicketsData } from "../../../../../../../types";
import {
  ArrowLeftIcon,
  BugAntIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { formatDateOnly } from "@/lib/utils/formatTime";
import Image from "next/image";
import Link from "next/link";
import { getUserByUid } from "@/lib/utils/fetchUserUid";
import { NewType } from "@/app/(admin)/admin/(non-auth)/users/page-cp";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  params: {
    _id: string;
  };
};

const TicketViewPages = async ({ params }: Props) => {
  const { _id } = params;

  const fetchTicket = await fetchTicketData(_id);

  if (!fetchTicket.success || !fetchTicket.data) {
    return (
      <div className="text-center p-16">
        <h4 className="text-2xl font-bold">Oopps</h4>
        <p>{fetchTicket.message}</p>
      </div>
    );
  }

  const data = fetchTicket.data as TicketsData;

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <div className="mb-6 flex align-middle place-items-center justify-between gap-2">
        <div className="flex align-middle place-items-center justify-start gap-2">
          <Link
            href={"/support"}
            className="shadow-sm hover:shadow-none p-3 rounded-md border"
          >
            <ArrowLeftIcon width={16} />
          </Link>
          <h2 className="text-2xl font-bold">Ticket</h2>
        </div>
        {data.status.addressed && (
          <h4 className="text-xs text-neutral-500 flex align-middle place-items-center gap-1">
            <CheckCircleIcon className="text-green-500" width={16} />
            <span>Addressed</span>
          </h4>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="md:text-lg text-base font-medium mb-2 flex align-middle place-items-center justify-start gap-2">
            {(() => {
              switch (data.content.type) {
                case "Bug Report":
                  return (
                    <BugAntIcon
                      className="text-fuchsia-700 dark:text-fuchsia-500"
                      width={24}
                    />
                  );
                case "Transaction issues":
                  return (
                    <CreditCardIcon className="text-rose-500" width={24} />
                  );
                case "Improvement suggestion":
                  return <SparklesIcon className="text-blue-500" width={24} />;
                case "Question":
                  return (
                    <QuestionMarkCircleIcon
                      className="text-yellow-500"
                      width={24}
                    />
                  );
                default:
                  return null;
              }
            })()}
            {data.content.type}
          </h4>
          <h4 className="md:text-xs text-[10px]">
            {formatDateOnly(
              new Date(
                (data.date.seconds ?? 0) * 1000 +
                  (data.date.nanoseconds ?? 0) / 1e6
              ).toISOString()
            )}
          </h4>
        </div>

        <div className="text-sm p-4 rounded-md bg-neutral-200 bg-opacity-50 dark:bg-black">
          <h5 className="font-medium text-[10px] text-neutral-500">
            Description:{" "}
          </h5>
          <p className="text-neutral-600 dark:text-neutral-200 text-xs leading-5 md:text-left text-justify">
            {data.content.description}
          </p>
        </div>

        <div className="my-8">
          <h4 className="text-sm text-neutral-500 mb-2">Gallery</h4>
          <div className="rounded-md p-4 bg-neutral-200 bg-opacity-50 dark:bg-black">
            {data.content.images.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-sm text-neutral-500">No images</p>
              </div>
            ) : (
              <div className="flex align-middle place-items-start justify-start flex-wrap gap-4 w-full">
                {data.content.images.map((image, index) => {
                  return (
                    <Image
                      className="rounded-md mx-auto"
                      key={index}
                      src={image}
                      alt=""
                      width={220}
                      height={220}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md p-4 bg-neutral-200 bg-opacity-50 dark:bg-black mb-6">
          {data.adminReply?.length === 0 ? (
            <div>
              <h6>No replies yet</h6>
            </div>
          ) : (
            <div className="grid grid-flow-row gap-6">
              {data.adminReply?.map(async (reply, idx) => {
                const admin = reply.adminId
                  ? ((await getUserByUid(reply.adminId as string)) as NewType)
                  : null;

                return (
                  <div
                    key={idx}
                    className="flex align-middle justify-start gap-5"
                  >
                    <div className="grid grid-flow-row gap-0.5 mt-2 h-3">
                      <div className="bg-pink-300 w-0.5 h-0.5 rounded-full" />
                      <div className="bg-pink-300 w-0.5 h-0.5 rounded-full" />
                      <div className="bg-pink-300 w-0.5 h-0.5 rounded-full" />
                    </div>
                    <div>
                      <p className="text-neutral-600 text-xs dark:text-neutral-200 leading-5 md:text-left text-justify">
                        {reply?.message}
                      </p>
                      <h4 className="text-xs font flex mt-4 w-full text-neutral-400 gap-2">
                        <span>by {admin?.username || "Greatexc"}</span>
                        {formatDateOnly(
                          new Date(
                            (reply.date?.seconds ?? 0) * 1000 +
                              (reply.date?.nanoseconds ?? 0) / 1e6
                          ).toISOString()
                        )}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketViewPages;
