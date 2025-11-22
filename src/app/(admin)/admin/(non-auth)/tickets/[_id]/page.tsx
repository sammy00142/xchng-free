import { fetchTicketData } from "@/lib/utils/actions/fetchTicketData";
import React from "react";
import { TicketsData } from "../../../../../../../types";
import {
  ArrowTopRightOnSquareIcon,
  BugAntIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { formatDateOnly } from "@/lib/utils/formatTime";
import Image from "next/image";
import Link from "next/link";
import { getUserByUid } from "@/lib/utils/fetchUserUid";
import { NewType } from "../../users/page-cp";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import ReplyTicketDialog from "@/components/admin/tickets/ReplyTicketDialog";
import { seenTicket } from "@/lib/utils/adminActions/replyTicket";

type Props = {
  params: {
    _id: string;
  };
};

const AdminTicketView = async ({ params }: Props) => {
  const { _id } = params;

  await seenTicket(_id);

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

  const user = data.user.id
    ? ((await getUserByUid(data.user.id as string)) as NewType)
    : null;

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <div className="mb-6 flex align-middle place-items-center justify-start gap-2">
        <h2 className="text-2xl font-bold">Ticket</h2>
      </div>

      <div className="flex align-middle placeitce justify-between gap-3 mb-8 w-full">
        <div className="flex align-middle place-items-center justify-between w-fit gap-2 p-2 rounded-md hover:bg-neutral-200 hover:bg-opacity-40 duration-300 cursor-pointer">
          <div className="bg-purple-500 rounded-full h-fit self-center p-1 grid place-items-center align-middle">
            <Image
              className="rounded-full"
              src={user?.imageUrl || "/logoplace.svg"}
              alt=""
              width={28}
              height={28}
            />
          </div>
          <div>
            <div className="flex align-middle place-items-center justify-start gap-3">
              <h4 className="text-base">{data.user.fullname}</h4>
              {data.user.id && (
                <span className="flex align-middle justify-start place-items-center gap-0.5 text-[8px] text-neutral-400">
                  <CheckBadgeIcon width={12} className="text-green-500" />
                  Verified user
                </span>
              )}
            </div>
            <h6 className="text-neutral-600 dark:text-neutral-300">
              {data.user.email}
            </h6>
          </div>
        </div>

        {data.user.id && (
          <Link
            className="text-xs flex align-middle place-items-center justify-start gap-2 text-neutral-500 hover:text-neutral-700 duration-300"
            href={`/admin/users#${data.user.id}`}
          >
            <span>View profile</span>
            <ArrowTopRightOnSquareIcon width={14} />
          </Link>
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

        <div className="text-sm p-4 rounded-md bg-neutral-200 bg-opacity-50 dark:bg-neutral-900">
          <h5 className="font-medium text-[10px] text-neutral-500">
            Description:{" "}
          </h5>
          <p className="text-neutral-600 dark:text-neutral-200 text-xs leading-5 md:text-left text-justify">
            {data.content.description}
          </p>
        </div>

        <div className="my-8">
          <h4 className="text-sm text-neutral-500 mb-2">Gallery</h4>
          <div className="rounded-md p-4 bg-neutral-200 bg-opacity-50 dark:bg-neutral-900">
            {data.content.images.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-sm text-neutral-500">No images</p>
              </div>
            ) : (
              <div className="flex align-middle place-items-center justify-start flex-wrap gap-4 w-full">
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
      </div>

      <div className="mb-6">
        <div className="flex mb-4 align-middle place-items-center justify-between w-full">
          <h4 className="text-sm text-neutral-500 mb-2">Replies</h4>
          <ReplyTicketDialog ticket={JSON.parse(JSON.stringify(data))} />
        </div>

        <div className="rounded-md p-4 bg-neutral-200 bg-opacity-50 dark:bg-neutral-900 mb-6">
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
                      <p className="text-neutral-600 text-xs dark:text-white leading-5 md:text-left text-justify">
                        {reply?.message}
                      </p>
                      <h4 className="text-xs font flex mt-4 w-full text-neutral-400 gap-2">
                        by {admin?.username || "Greatex"}
                      </h4>
                      <h6>
                        {formatDateOnly(
                          new Date(
                            (data.status.addressed_at?.seconds ?? 0) * 1000 +
                              (data.status.addressed_at?.nanoseconds ?? 0) / 1e6
                          ).toISOString()
                        )}
                      </h6>
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

export default AdminTicketView;
