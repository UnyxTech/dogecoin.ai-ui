import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { lazy, Suspense, useState } from "react";

const PostContent = lazy(() => import("./PostContent"));
const InformationContent = lazy(() => import("./InformationContent"));
const HolderContent = lazy(() => import("./HolderContent"));
const TAB_TYPES = {
  POST: "Post",
  INFORMATION: "Information",
  HOLDER: "Holder",
} as const;

type TabType = (typeof TAB_TYPES)[keyof typeof TAB_TYPES];

const TokenInfoTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TAB_TYPES.POST);

  const getContent = (tab: TabType) => {
    switch (tab) {
      case TAB_TYPES.POST:
        return <PostContent />;
      case TAB_TYPES.INFORMATION:
        return <InformationContent />;
      case TAB_TYPES.HOLDER:
        return <HolderContent />;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 transition-all duration-100">
          {Object.values(TAB_TYPES).map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "text-dayT1 border-b-[3px] border-black"
                  : "text-dayT3"
              } text-base font-SwitzerMedium py-2 `}
            >
              {tab}
            </div>
          ))}
        </div>
        {activeTab === TAB_TYPES.POST && (
          <Button
            type="submit"
            variant="outline"
            className="rounded-sm py-2 px-4 hover:border-none border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
          >
            Add Post
          </Button>
        )}
      </div>
      <Separator className="mb-6" />
      <Suspense fallback={<div>Loading...</div>}>
        {getContent(activeTab)}
      </Suspense>
    </>
  );
};
export default TokenInfoTabs;
