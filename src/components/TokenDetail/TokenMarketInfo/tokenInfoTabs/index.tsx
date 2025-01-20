import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { lazy, Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomProgress } from "@/components/ui/custom/CustomProgress";
import { LoadingComp } from "@/components/loading";
const PostContent = lazy(() => import("./PostContent"));
const InformationContent = lazy(() => import("./InformationContent"));
const HolderContent = lazy(() => import("./HolderContent"));
const TAB_TYPES = {
  POST: "Post",
  INFORMATION: "Information",
  HOLDER: "Holder",
} as const;

type TabType = (typeof TAB_TYPES)[keyof typeof TAB_TYPES];

export function DialogDemo() {
  return (
    <Dialog
      onOpenChange={(open) => {
        console.log(open);
        // if (open === false) {
        // }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="submit"
          variant="outline"
          className="rounded-sm py-2 px-4 hover:border-[#12122A] focus:outline-none active:border-none active:outline-none border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
        >
          Add Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[432px]">
        <DialogHeader>
          <DialogTitle className="text-dayT1 font-SwitzerMedium">
            Post a feed of Doggee
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex justify-between items-center mt-2 mb-3">
            <div className="flex items-center">
              <span className="font-SwitzerMedium text-dayT1">Prompt</span>
              <span className="text-red ml-0.5">*</span>
            </div>
            <span className="text-dayT4">generate</span>
          </div>
          <textarea
            placeholder="Set the character and behavior of the agent"
            className="bg-dayBg3 w-full h-[110px] focus:outline-none px-3 py-4 border resize-none border-gray-300 rounded-md text-dayT3"
          />
        </div>
        <div>
          <div className="mt-2 mb-3">
            <span className="font-SwitzerMedium text-dayT1">Preview</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-dayBg3 w-full h-[200px] e px-3 py-4 border  border-gray-300 rounded-md text-dayT3">
            <h5 className="text-dayT1 text-sm">Generating</h5>
            <CustomProgress value={12} className="w-1/2 h-2.5 mt-4" />
          </div>
        </div>
        <div>
          <p className="mb-5 mt-4">Generating fee: 1 $DOGE</p>
          <Button className="w-full rounded-sm py-4 hover:border-[#12122A] focus:outline-none active:border-none border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]">
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
        {activeTab === TAB_TYPES.POST && <DialogDemo />}
      </div>
      <Separator className="mb-6" />
      <Suspense fallback={<LoadingComp loading={true} size={16} />}>
        {getContent(activeTab)}
      </Suspense>
    </>
  );
};
export default TokenInfoTabs;
