"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TicketsData } from "../../../../types";
import { replyTicket } from "@/lib/utils/adminActions/replyTicket";
import { postToast } from "@/components/postToast";
import Loading from "@/app/loading";

type Props = {
  ticket: TicketsData;
};

const ReplyTicketAlertDialog = ({ ticket }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const send = replyTicket.bind(null, ticket.id);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {loading && <Loading />}
      <AlertDialogTrigger className="bg-primary px-3 py-2 shadow-md hover:shadow-none shadow-pink-200 dark:shadow-pink-950 rounded-md text-white">
        Send a reply
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Send a reply</AlertDialogTitle>
        <form
          action={(e) => {
            setLoading(true);

            send(e)
              .then((res) => {
                if (res.success) {
                  setOpen(false);
                  postToast("Done", { description: "Reply sent successfully" });
                  window.location.reload();
                } else {
                  postToast("Error", {
                    description: "An error occured. Please try again",
                  });
                }
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Textarea
            name="message"
            className="mb-3 border-2"
            placeholder="Enter..."
            title="Enter a reply to send back to user..."
            disabled={loading}
            required
          />

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                type="button"
                title="Close"
                className="text-black dark:text-white hover:text-opacity-50"
              >
                Close
              </Button>
            </AlertDialogCancel>

            <Button type="submit" title="Send reply" disabled={loading}>
              Send
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReplyTicketAlertDialog;
