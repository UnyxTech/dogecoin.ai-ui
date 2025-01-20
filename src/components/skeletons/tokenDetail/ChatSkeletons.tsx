import { Skeleton } from "@/components/ui/skeleton";
const ChatSkeletons = () => {
  return (
    <div className="p-6 pb-8 bg-white">
      <Skeleton className="h-8 w-20 rounded-[8px]" />
      <div className="mt-4 mb-8">
        <div className="flex gap-3 items-center">
          <Skeleton className="h-2.5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-[8px]" />
          <Skeleton className="h-2.5 w-32 rounded-[8px]" />
        </div>
        <div className="flex gap-3 items-center mt-4">
          <Skeleton className="h-2.5 w-5 rounded-[8px]" />
          <Skeleton className="h-1 w-6 rounded-[8px]" />
        </div>
        <Skeleton className="h-8 w-full rounded-[8px]" />
      </div>
      <div className="mt-4 mb-8">
        <div className="flex gap-3 items-center">
          <Skeleton className="h-2.5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-[8px]" />
          <Skeleton className="h-2.5 w-32 rounded-[8px]" />
        </div>
        <div className="flex gap-3 items-center mt-4">
          <Skeleton className="h-2.5 w-5 rounded-[8px]" />
          <Skeleton className="h-1 w-6 rounded-[8px]" />
        </div>
        <Skeleton className="h-8 w-full rounded-[8px]" />
      </div>
      <div className="mt-4 mb-8">
        <div className="flex gap-3 items-center">
          <Skeleton className="h-2.5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-[8px]" />
          <Skeleton className="h-2.5 w-32 rounded-[8px]" />
        </div>
        <div className="flex gap-3 items-center mt-4">
          <Skeleton className="h-2.5 w-5 rounded-[8px]" />
          <Skeleton className="h-1 w-6 rounded-[8px]" />
        </div>
        <Skeleton className="h-8 w-full rounded-[8px]" />
      </div>
    </div>
  );
};

export default ChatSkeletons;
