import { Skeleton } from "@/components/ui/skeleton";

const SwapSkeletons = () => {
  return (
    <div className="p-6 pb-8 bg-white">
      <Skeleton className="h-8 w-20 rounded-[8px]" />
      <Skeleton className="h-8 w-full rounded-[8px] mt-5" />
      <Skeleton className="h-8 w-full rounded-[8px] mt-5" />
      <div className="flex items-center gap-3 mt-4">
        <Skeleton className="h-8 w-9 rounded-[8px]" />
        <Skeleton className="h-8 w-11 rounded-[8px]" />
        <Skeleton className="h-8 w-11 rounded-[8px]" />
      </div>
      <Skeleton className="h-5 w-20 rounded-[8px] mt-4" />
      <Skeleton className="h-14 w-full rounded-[8px] mt-5" />
      <Skeleton className="h-[2px] w-full  my-10" />
      <Skeleton className="h-7 w-64 rounded-[8px]" />
      <Skeleton className="h-3 w-full rounded-full] mt-3" />
      <Skeleton className="h-24 w-full rounded-[8px] mt-3" />
      <Skeleton className="h-[2px] w-full  my-10" />
      <Skeleton className="h-7 w-64 rounded-[8px]" />
    </div>
  );
};

export default SwapSkeletons;
