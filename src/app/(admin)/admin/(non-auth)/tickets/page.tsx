// import { getTickets } from "@/lib/utils/fetchTickets";
// import Link from "next/link";
// import TicketCard from "@/components/admin/tickets/TicketCard";
// import { TicketsData } from "../../../../../../types";

// ;

// const AdminTickets = async (props: Props) => {
//   const fetchedTickets = await getTickets();

//   if (!fetchedTickets || !fetchedTickets.success) {
//     return (
//       <div className="grid grid-flow-row place-items-center justify-center align-middle gap-6">
//         <h4 className="text-lg font-bold">Sorry,</h4>
//         <div>Could not fetch tickets</div>
//         <Link
//           className="py-2 font-medium px-6 rounded-md bg-primary text-white shadow-sm"
//           href="/admin/tickets"
//         >
//           Retry
//         </Link>
//       </div>
//     );
//   }

//   const tickets = fetchedTickets?.data as TicketsData[];

//   const renderTickets = tickets.map((ticket, idx) => {
//     return (
//       <TicketCard
//         key={idx}
//         idx={idx}
//         ticket={ticket}
//         link={`/admin/tickets/${ticket.id}`}
//       />
//     );
//   });

//   return (
//     <div className="duration-300 max-w-screen-md mx-auto px-4">
//       {/* <nav className="my-2 grid grid-flow-col grid-cols-3 align-middle justify-between place-items-center bg-white dark:bg-neutral-700 bg-opacity-40 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 rounded-lg w-fit p-1 mx-auto md:mx-0">
//         <button
//           className={`px-3 py-1.5 rounded-md duration-150 w-full bg-primary shadow-md shadow-pink-500/30 font-medium text-white`}
//         >
//           All
//         </button>
//         <button className={`px-3 py-1.5 rounded-md duration-150 w-full`}>
//           Ticket
//         </button>
//         <button className={`px-3 py-1.5 rounded-md duration-150 w-full`}>
//           Feedback
//         </button>
//       </nav> */}
//       <div className="grid grid-flow-row divide-y divide-neutral-200 dark:divide-neutral-700">
//         {renderTickets}
//       </div>
//     </div>
//   );
// };

// export default AdminTickets;

import Link from "next/link";
import React from "react";

const Tickets = () => {
  return (
    <div>
      This feature is under maintenance. Please reach out to support via{" "}
      <Link
        className="underline text-primary font-semibold"
        href="mailto:djayableez@gmail.com"
      >
        djayableez@gmail.com
      </Link>{" "}
      if you need help.
    </div>
  );
};

export default Tickets;
