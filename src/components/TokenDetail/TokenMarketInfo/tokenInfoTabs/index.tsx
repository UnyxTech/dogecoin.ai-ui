import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import PostContent from "./PostContent";
import InformationContent from "./InformationContent";
import HolderContent from "./HolderContent";
import { PostDialog } from "./PostDialog";
import { useAgentsPosts } from "@/hooks/tokenDetial/useAgentPosts";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
const TAB_TYPES = {
  POST: "Post",
  INFORMATION: "Information",
  HOLDER: "Holder",
} as const;

type TabType = (typeof TAB_TYPES)[keyof typeof TAB_TYPES];

const TokenInfoTabs = () => {
  const { characterId } = useParams();
  const { data: agentsPosts, isLoading } = useAgentsPosts({
    // cursor: "",
    pageSize: 20,
    characterId: characterId!,
  });
  const { data: agentInfoData } = useAgentInfo(characterId!);
  const [activeTab, setActiveTab] = useState<TabType>(TAB_TYPES.POST);
  const getContent = (tab: TabType) => {
    switch (tab) {
      case TAB_TYPES.POST:
        return <PostContent agentsPosts={agentsPosts!} />;
      case TAB_TYPES.INFORMATION:
        return <InformationContent />;
      case TAB_TYPES.HOLDER:
        return <HolderContent />;
    }
  };
  if (isLoading || !agentInfoData?.tokenAddress) {
    return (
      <div className="min-h-[600px] ">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-8 " />
            <Skeleton className="h-5 w-20 " />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Separator className="m-6" />
        <div className="grid gap-3 grid-cols-4">
          {new Array(12).fill(undefined).map((_, index) => {
            return (
              <Skeleton key={index} className="w-full h-[230px]"></Skeleton>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-dayBg1 px-5 demo_test:px-6  py-2 ">
      <div className="flex items-center justify-between ">
        <div className="flex gap-4 transition-all duration-100">
          {Object.values(TAB_TYPES).map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "text-dayT1 border-b-[3px] border-black"
                  : "text-dayT3"
              } text-base font-SwitzerMedium py-2 hover:cursor-pointer`}
            >
              {tab}
            </div>
          ))}
        </div>
        {activeTab === TAB_TYPES.POST && <PostDialog />}
      </div>
      <Separator className="mb-6" />
      <div className="min-h-[600px] w-full">{getContent(activeTab)}</div>
    </div>
  );
};
export default TokenInfoTabs;
