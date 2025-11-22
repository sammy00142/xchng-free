"use client";
import React, { memo, useEffect, useState } from "react";
import { CardDetails, Conversation } from "../../../../chat";
import SetRateComp from "./setRateDialog";
import StartAdminTransaction from "./StartTransaction";
import FinishTransaction from "./FinishTransaction";
import AdminCardMessages from "./AdminCardMessages";
import ImageBubble from "@/components/chat/bubbles/image";
import ImagesCarousel from "@/components/chat/ImagesCarousel";
import AdminTextMessage from "@/components/chat/bubbles/admin-text";

type Props = {
  chatId: string;
  scrollToBottom: React.RefObject<HTMLDivElement>;
  card: CardDetails;
  data: Conversation;
};

const AdminRenderMessages = memo(function AdminRenderMessages({
  card,
  chatId,
  data,
  scrollToBottom,
}: Props) {
  const [openStartTransaction, setOpenStartTransaction] = useState(false);
  const [finishTransaction, setFinishTransaction] = useState(false);
  const [openRate, setOpenRate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resend, setResend] = useState(false);
  const [update, setUpdate] = useState({
    status: "",
  });
  const [openSlide, setOpenSlide] = useState(false);
  const [currId, setCurrId] = useState<string>("");

  useEffect(() => {
    if (copied)
      setTimeout(() => {
        setCopied(false);
      }, 1800);
  }, [copied]);

  const renderUI = data?.messages.map((message, idx) => {
    if (
      message.type === "text" &&
      message.content.text !== "" &&
      message.content.media?.text !== "" &&
      message.content.media?.caption !== ""
    ) {
      return <AdminTextMessage message={message} idx={idx} key={idx} />;
    }

    if (message.type === "card") {
      return (
        <AdminCardMessages
          setCopied={setCopied}
          key={idx}
          idx={idx}
          setResend={setResend}
          setUpdate={setUpdate}
          setOpenRate={setOpenRate}
          message={message}
          setOpenStartTransaction={setOpenStartTransaction}
          setFinishTransaction={setFinishTransaction}
          copied={copied}
        />
      );
    }

    if (message.type === "media" && message.content.url) {
      return (
        <ImageBubble
          message={message}
          setCurrId={setCurrId}
          setOpenSlide={setOpenSlide}
          key={idx}
          scrollToBottom={scrollToBottom}
        />
      );
    }
  });

  return (
    <>
      <div className="grid gap-1.5">{renderUI}</div>
      <ImagesCarousel
        conversation={data}
        openSlide={openSlide}
        setOpenSlide={setOpenSlide}
        currId={currId}
      />
      <StartAdminTransaction
        openStartTransaction={openStartTransaction}
        setOpenStartTransaction={setOpenStartTransaction}
        card={data}
        chatId={chatId}
        resend={resend}
        update={update}
      />
      {data?.transaction.crypto ?? (
        <FinishTransaction
          finishTransaction={finishTransaction}
          setFinishTransaction={setFinishTransaction}
          card={data}
          chatId={chatId}
          resend={resend}
          update={update}
        />
      )}
      <SetRateComp
        card={card}
        chatId={chatId}
        edit={true}
        openRate={openRate}
        setOpenRate={setOpenRate}
      />
    </>
  );
});

export default AdminRenderMessages;
