"use client";

import Link from "next/link";
import React from "react";
import { formatTime } from "@/lib/utils/formatTime";
import {
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils/thousandSeperator";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

type Props = {
  params: {
    id: string;
  };
};

const TradeDetail = ({ params }: Props) => {
  const router = useRouter();

  const { data: trade, isLoading } = api.trade.getTradeById.useQuery({
    tradeId: params.id,
  });

  const { mutate: updateStatus } = api.trade.updateTradeStatus.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Trade status updated",
        description: "The trade status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while updating the trade status.",
        variant: "destructive",
      });
    },
  });

  const handleCancel = () => {
    updateStatus({
      tradeId: params.id,
      status: "CANCELLED",
    });
  };

  const handleApprove = () => {
    updateStatus({
      tradeId: params.id,
      status: "COMPLETED",
    });
  };

  const date = trade ? formatTime(trade.createdAt.toISOString()) : "";

  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-1/2" />
      </div>
    );
  }

  if (!trade) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Trade Not Found</CardTitle>
          <CardDescription>
            The requested trade details could not be found.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.back()}>Go Back</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={trade.asset.coverImage || "/logoplace.svg"}
                alt={trade.asset.name}
              />
              <AvatarFallback>
                {trade.asset.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{trade.asset.name}</CardTitle>
              <CardDescription>{trade.asset.category}</CardDescription>
            </div>
          </div>
          <Badge
            className={statusColor[trade.status as keyof typeof statusColor]}
          >
            {trade.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Amount</p>
              <p className="text-2xl font-bold">
                {trade.currency} {formatCurrency(trade.amountInCurrency ?? "0")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Date</p>
              <p className="text-2xl font-bold">{date}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={trade.user.imageUrl ?? "/logoplace.svg"} />
              <AvatarFallback>{`${trade.user.firstName?.charAt(
                0
              )}${trade.user.lastName?.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {trade.user.firstName} {trade.user.lastName}
              </p>
              <p className="text-sm">{trade.user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-2">
          <Link href={`/admin/chat/${trade.chatId}`}>
            <Button
              className="flex items-center md:justify-center justify-start gap-2 w-full"
              variant={"outline"}
            >
              <MessageCircle className="h-4 w-4" />
              <span>View Conversation</span>
            </Button>
          </Link>

          {trade.status !== "COMPLETED" && trade.status !== "CANCELLED" && (
            <div className="flex flex-col md:flex-row space-y-2 md:space-x-2 md:space-y-0 mt-2">
              <Button
                variant={"outline"}
                onClick={handleApprove}
                className="flex items-center md:justify-center justify-start gap-2 w-full"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Approve Trade
              </Button>
              <Button
                variant={"outline"}
                onClick={handleCancel}
                className="flex items-center md:justify-center justify-start gap-2 w-full text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" /> Cancel Trade
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {trade.chat.messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trade.chat.messages.slice(0, 3).map((message) => (
                <div key={message.id} className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={message.sender.imageUrl ?? "/logoplace.svg"}
                    />
                    <AvatarFallback>
                      {message.sender.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {message.sender.firstName}
                    </p>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs">
                      {formatTime(message.createdAt.toISOString())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/admin/chat/${trade.chatId}`}>
                View Full Conversation
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TradeDetail;
