import { Skeleton } from "@/components/ui/skeleton";

const InfoAndTradingviewSkeletions = () => {
  return (
    <div className="w-full bg-dayBg1 p-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-10 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-96 mt-4" />
    </div>
  );
};

export default InfoAndTradingviewSkeletions;
