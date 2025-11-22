"use client";
import React, { useEffect, useState } from "react";
import DescriptionInput from "./_components/description-input";
import TicketTypeSelector from "./_components/ticket-type-selector";
import ImageUploader from "./_components/image-uploader";
import SubmitButton from "./_components/submit-button";
import { submitTicket } from "@/lib/utils/actions/submitTicket";

const TicketPage: React.FC = () => {
  const [ticketType, setTicketType] = useState("Bug report");
  const [images, setImages] = useState<
    { data: string; name: string; type: string }[] | null
  >(null);
  const [description, setDescription] = useState("");
  const [email] = useState("");
  const [fullname] = useState("");
  const [sent, setSent] = useState(false);

  const handleSetImages = (
    images: { data: string; name: string; type: string }[]
  ) => {
    setImages(images);
  };

  // Effects and loading state can be handled here
  useEffect(() => {
    localStorage.setItem("images", JSON.stringify(images));
  }, [images]);

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">New ticket</h2>
      <TicketTypeSelector selectedType={ticketType} onSelect={setTicketType} />
      <DescriptionInput
        description={description}
        setDescription={setDescription}
      />
      <ImageUploader images={images} setImages={handleSetImages} />
      <SubmitButton
        description={description}
        sent={sent}
        onSentChange={setSent}
        onSubmit={() =>
          submitTicket(
            ticketType,
            description,
            JSON.stringify(images),
            email,
            fullname
          )
        }
      />
    </div>
  );
};

export default TicketPage;
