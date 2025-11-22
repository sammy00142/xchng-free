"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState, useMemo, useCallback } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSellTab } from "@/lib/utils/store/sellTabs";
import type { AssetSelect } from "@/server/db/schema";

const TABS: { title: string; link: string }[] = [
  {
    title: "Most Popular",
    link: "mostpopular",
  },
  {
    title: "All",
    link: "all",
  },
];

type SearchBarProps = {
  cards: AssetSelect[];
};

const SearchBar = ({ cards }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { tab, updateTab } = useSellTab((state) => state);

  // Memoize path check - hide SearchBar on any subpaths of /sell
  const shouldHideSearchBar = useMemo(() => {
    const excludedPaths: RegExp[] = [/^\/sell\/.*/]; // Regex to match any subpath of /sell
    return excludedPaths.some((regex) => regex.test(pathname));
  }, [pathname]);

  // Memoize keyboard shortcut handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Memoize the close handler
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Memoize the toggle handler
  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // Memoize rendered cards to avoid re-rendering on every render
  const renderCards = useMemo(() => {
    if (!cards || cards.length === 0) return null;

    return cards.map((card: AssetSelect, idx: number) => (
      <Link key={card.id || idx} href={`/sell/${card.id}`}>
        <CommandItem className="flex gap-3">
          <Image
            priority
            src={card.coverImage || ""}
            width={22}
            height={22}
            alt={card.name}
            className="object-cover"
          />
          <span>{card.name}</span>
        </CommandItem>
      </Link>
    ));
  }, [cards]);

  // Hide search bar if on excluded paths
  if (shouldHideSearchBar) {
    return null;
  }

  return (
    <div className="sticky px-3 top-0 z-50 bg-white/70 backdrop-blur-xl dark:bg-black py-2.5 pt-3 shadow-sm dark:rounded-2xl max-w-screen-md mx-auto rounded-2xl dark:bg-neutral-800/70">
      <Button
        className="w-full border flex align-middle place-items-center justify-between text-neutral-500 py-0 h-9"
        aria-label="Search"
        variant={"ghost"}
        onClick={handleToggle}
      >
        <div className="flex align-middle place-items-center justify-between gap-2">
          <div>
            <MagnifyingGlassIcon width={18} />
          </div>
          <span>Search...</span>
        </div>
      </Button>
      <div className="mt-1.5 gap-2 flex w-full overflow-x-scroll py-1 px-4">
        {TABS.map((t, idx) => {
          return (
            <Link href={"/sell"} key={idx} onClick={() => updateTab(t.link)}>
              <Button
                className={`dark:bg-[#2c2c2c] h-9 shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] ${
                  tab === t.link
                    ? "bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary text-white"
                    : "bg-white dark:bg-[#2c2c2c] hover:bg-white dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-white border"
                }`}
              >
                {t.title}
              </Button>
            </Link>
          );
        })}
        <Link href={"/sell/crypto"}>
          <Button
            className={`dark:bg-[#2c2c2c] shadow-md shadow-[#fa6ed722] dark:shadow-lg dark:shadow-[#6133541f] ${
              pathname === "/sell/crypto"
                ? "bg-primary dark:bg-primary hover:bg-primary dark:hover:bg-primary text-white"
                : "bg-white dark:bg-[#2c2c2c] hover:bg-white dark:hover:bg-[#2c2c2c] text-neutral-700 dark:text-white border"
            }`}
            onClick={() => updateTab(pathname)}
          >
            Cryptocurrencies
          </Button>
        </Link>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <Button
          className="w-12 h-12 bg-neutral-100 z-50 dark:bg-black  rounded-full absolute top-0 right-0"
          onClick={handleClose}
          variant={"ghost"}
          size={"icon"}
          aria-label="Close search"
        >
          <XMarkIcon width={18} />
        </Button>
        <CommandList className="max-h-full">
          {!cards || cards.length === 0 ? (
            <CommandEmpty>No gift cards available.</CommandEmpty>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandSeparator />
              <CommandGroup heading="Gift cards">{renderCards}</CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchBar;
