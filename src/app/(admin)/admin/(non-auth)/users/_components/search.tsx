"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";



const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("username", term);
    } else {
      params.delete("username");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div>
      <div className="relative bg-pink-50 p-2 dark:bg-black">
        <Input
          className="w-full pr-10"
          placeholder={`Search for username...`}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("username")?.toString()}
        />
        <SearchIcon
          size={20}
          className="absolute right-6 top-[19px] bg-blackp-1 z-40"
        />
        {searchParams.get("username")?.toString() && (
          <Button
            variant={"ghost"}
            className="absolute right-3 top-[9px] scale-90 bg-white dark:bg-black z-40"
            onClick={() => {
              handleSearch("");
            }}
            size={"icon"}
          >
            <XIcon size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Search;
