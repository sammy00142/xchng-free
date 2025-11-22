import React, { SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { Conversation } from "../../../chat";

type Props = {
  currId?: string;
  openSlide: boolean;
  setOpenSlide: React.Dispatch<SetStateAction<boolean>>;
  conversation: Conversation;
};

const ImagesCarousel = ({
  openSlide,
  setOpenSlide,
  currId,
  conversation,
}: Props) => {
  const [slideApi, setSlideApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!slideApi) {
      return;
    }

    slideApi.scrollTo(currentImage);

    setCurrent(currentImage || slideApi.selectedScrollSnap() + 1);

    slideApi.on("slidesChanged", () => {
      setCurrent(currentImage || slideApi.selectedScrollSnap() + 1);
    });
  }, [currentImage, current, slideApi]);

  useEffect(() => {
    // Calculate media position
    const position = conversation.messages.findIndex((msg) => {
      return msg.id === currId;
    });

    if (position) {
      setCurrentImage((position + 1) as number);
    }
  }, [conversation, currId]);

  const renderImage = conversation.messages.map((message, idx) => {
    if (message.type === "media")
      return (
        <CarouselItem
          key={idx}
          className="grid place-items-center align-middle"
        >
          <TransformWrapper centerZoomedOut>
            <TransformComponent>
              <Image
                src={message.content.url}
                alt=""
                width={600}
                height={600}
                priority
                className="max-h-[90vh] object-contain"
              />
              <h4 className="border bg-black">{message.content.caption}</h4>
            </TransformComponent>
          </TransformWrapper>
        </CarouselItem>
      );
  });

  return (
    <Dialog open={openSlide} onOpenChange={setOpenSlide}>
      <DialogContent className="p-1 h-fit max-h-screen grid place-items-center">
        <Carousel setApi={setSlideApi} className="h-fit">
          <CarouselContent className="h-fit">{renderImage}</CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default ImagesCarousel;
