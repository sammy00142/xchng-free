"use client";
import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { SunIcon } from "@heroicons/react/24/outline";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { startChat } from "@/server/actions/start-chat";
import { AssetSelect } from "@/server/db/schema";
import { postToast } from "../postToast";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/stores/chat-store";

interface CardSelectorProps {
  card: AssetSelect;
}

interface CardDetails {
  name: string;
  price: string;
}

const MINIMUM_PRICE = 3;
const CURRENCIES = ["USD", "NGN", "EUR", "GBP", "AUD", "CAD", "JPY"] as const;
type Currency = (typeof CURRENCIES)[number];

const currenciesSymbol = {
  USD: "$",
  NGN: "₦",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
};

export const CardSelector: React.FC<CardSelectorProps> = ({ card }) => {
  const [price, setPrice] = useState<number | undefined>();
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addChat } = useChatStore();

  const { isSignedIn, isLoaded } = useUser();

  const isSubmitDisabled = useMemo(() => {
    return (
      !price || price < MINIMUM_PRICE || isLoading || (isLoaded && !isSignedIn)
    );
  }, [price, isLoading, isSignedIn, isLoaded]);

  const generateWhatsappLink = useCallback((cardInfo: CardDetails) => {
    const whatsappMessage = `Trade a ${cardInfo.price} ${cardInfo.name} giftcard`;
    return `https://api.whatsapp.com/send?phone=${
      process.env.WHATSAPP_HANDLE
    }&text=${encodeURIComponent(whatsappMessage)}`;
  }, []);

  const handleStartChat = useCallback(async () => {
    if (isSubmitDisabled) return;

    if (!price) {
      toast({
        title: "Error!",
        description: "Please fill the price field",
      });
      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);
      const res = await startChat({
        type: "TRADE",
        assetId: card.id,
        amountInCurrency: price.toString(),
        currency,
        assetName: card.name,
        assetType: card.type,
      });

      if (res.error) {
        toast({
          description: res.error,
          variant: "destructive",
        });
        setIsLoading(false);

        return;
      }

      if (!res.data?.data) {
        toast({
          description: res.data?.error ?? "Failed to start chat",
          variant: "destructive",
        });
        setIsLoading(false);

        return;
      }

      if (res?.data?.data?.id) {
        addChat(res.data.data);
        router.push(`/chat/${res.data.data.id}`);
      }

      toast({ description: "Chat started. Redirecting..." });
    } catch (error) {
      toast({
        title: "Error!",
        description: "An error occurred. Please try again.",
        duration: 3500,
      });
      setIsLoading(false);
    }
  }, [addChat, card.id, card.name, card.type, currency, isSubmitDisabled, price, router]);

  const handleWhatsappClick = useCallback(() => {
    if (!price) {
      postToast("Please fill the price field");
      return;
    }

    const cardInfo = {
      ...card,
      price: `$${price}`,
    };

    window.location.href = generateWhatsappLink(cardInfo);
  }, [card, price, generateWhatsappLink]);

  if (!card) {
    return (
      <div className="p-16 text-center text-neutral-400">No card selected</div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto duration-300">
      <div className="grid place-items-center justify-center gap-6">
        <h5 className="text-center text-base w-[60vw]">{card.name} Giftcard</h5>
        <Image
          src={card.coverImage || "/logoplace.svg"}
          width={65}
          height={65}
          alt="Vendor Logo"
          priority
          className="text-xs"
        />
      </div>

      <div className="my-4 space-y-5 duration-300">
        <div>
          <Label className="text-neutral-400" htmlFor="currency">
            Currency
          </Label>
          <Select
            value={currency}
            onValueChange={(value: Currency) => setCurrency(value)}
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Currency</SelectLabel>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-neutral-400" htmlFor="price">
            Price
          </Label>
          <div className="relative mt-2 rounded-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-neutral-400 sm:text-sm">
                {currenciesSymbol[currency]}
              </span>
            </div>
            <Input
              type="number"
              name="price"
              required
              disabled={isLoading}
              aria-disabled={isLoading}
              id="price"
              autoComplete="off"
              minLength={3}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              value={price || ""}
              className="block w-full rounded-md border-0 pl-12 text-neutral-900 ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6 py-7 font-medium text-lg dark:text-white dark:ring-neutral-700"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="w-full grid place-items-center">
          <Button
            disabled={isSubmitDisabled}
            aria-disabled={isSubmitDisabled}
            onClick={handleStartChat}
            type="submit"
            className={`${
              isLoading ? "bg-neutral-200 text-neutral-400" : ""
            } md:w-[70%] w-full py-6 shadow-lg`}
          >
            {isLoading ? (
              <>
                <SunIcon width={18} className="animate-spin mr-1" /> Please
                wait...
              </>
            ) : (
              "Live chat"
            )}
          </Button>
        </div>
      </div>

      <p className="text-center text-neutral-500 dark:text-neutral-300 font-normal my-2">
        or
      </p>

      <div className="w-full grid place-items-center">
        <Button
          variant="ghost"
          disabled={isSubmitDisabled}
          aria-disabled={isSubmitDisabled}
          onClick={handleWhatsappClick}
          className="mx-auto text-xs duration-300 border w-fit"
        >
          Continue to WhatsApp
        </Button>
      </div>

      {isLoaded && !isSignedIn && (
        <p className="text-[14px] text-center w-fit px-3 mx-auto rounded-xl bg-purple-200 dark:bg-purple-800 dark:bg-opacity-20 dark:text-white text-purple-900 font-medium mt-6">
          Please sign in to use our in-app{" "}
          <span className="font-extrabold">chat feature</span>.
        </p>
      )}
    </div>
  );
};

export default CardSelector;
