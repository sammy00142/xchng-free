import { Skeleton } from "../ui/skeleton";

const TransactionSkeleton = () => {
  return (
    <div className="px-4">
      <div className="mb-4">
        <div className="grid grid-flow-col">
          <Skeleton className="w-12 h-12 rounded-full aspect-square my-1" />
          <div className="">
            <Skeleton className="max-w-[170px] h-4 my-1" />
            <Skeleton className="max-w-[100px] h-4 my-1" />
          </div>
        </div>
      </div>
      <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
      {/* Seperator /> */}
      <div className="grid grid-flow-row py-4 gap-2">
        <div className="">
          <Skeleton className="max-w-[170px] h-4 my-1" />
          <Skeleton className="max-w-[100px] h-4 my-1" />
        </div>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
        {/* Seperator /> */}
        <div className="">
          <Skeleton className="max-w-[170px] h-4 my-1" />
          <Skeleton className="max-w-[100px] h-4 my-1" />
        </div>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
        {/* Seperator /> */}
        <div className="">
          <Skeleton className="max-w-[170px] h-4 my-1" />
          <Skeleton className="max-w-[100px] h-4 my-1" />
        </div>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
        {/* Seperator /> */}
        <div className="">
          <Skeleton className="max-w-[170px] h-4 my-1" />
          <Skeleton className="max-w-[100px] h-4 my-1" />
        </div>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
        {/* Seperator /> */}
        <div className="">
          <Skeleton className="max-w-[170px] h-4 my-1" />
          <Skeleton className="max-w-[100px] h-4 my-1" />
        </div>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
        {/* Seperator /> */}
        <div className="">
          <Skeleton className="max-w-[170px] h-4 my-1" />
          <Skeleton className="max-w-[100px] h-4 my-1" />
        </div>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
        {/* Seperator /> */}
        <div className="">
          <Skeleton className="max-w-[170px] h-4 my-1" />
        </div>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700 py-0.5" />
        {/* Seperator /> */}
      </div>
      <div className="my-6 grid grid-flow-row gap-1 text-sm">
        <Skeleton className="max-w-[250px] h-8 my-1" />
        <Skeleton className="max-w-[250px] h-8 my-1" />
      </div>
    </div>
  );
};

export default TransactionSkeleton;
