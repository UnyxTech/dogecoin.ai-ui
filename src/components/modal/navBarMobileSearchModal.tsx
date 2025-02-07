"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/custom/customDrawer";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { AgentItem } from "@/api/types";
import { debounce } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { searchAgentList } from "@/api/api";
import SearchAgentItem from "../mobile/searchAgentItem";
import { LoadingComp } from "../loading";

export function NavBarMobileSearchModal() {
  const [searchStr, setSearchStr] = useState<string>("");
  const [searchResult, setSearchResult] = useState<AgentItem[]>();
  const searchMutation = useMutation({
    mutationFn: searchAgentList,
    onSuccess(data: AgentItem[]) {
      console.log(data);
      setSearchResult(data);
    },
  });

  const handleSearch = debounce((e: any) => {
    const val = e.target.value;
    if (!val) {
      setSearchResult([]);
      return;
    }
    searchMutation.mutate(val);
  }, 300);
  const reset = () => {
    setSearchResult([]);
    setSearchStr("");
  };
  return (
    <Drawer direction="right" activeSnapPoint="false" onOpenChange={reset}>
      <DrawerTrigger asChild>
        <Search className="text-black w-5 h-5" />
      </DrawerTrigger>
      <DrawerContent className="w-full h-full rounded-none">
        <div className="w-full">
          <header className="bg-yellow w-full h-16 flex justify-between items-center">
            <div className="relative flex-1 mx-6">
              <Input
                value={searchStr}
                className="px-10"
                placeholder="Search Agent/CA"
                onChange={(e) => {
                  setSearchStr(e.target.value);
                  handleSearch(e);
                }}
              />
              <Search className="absolute text-second left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
              {searchStr && (
                <DrawerClose asChild>
                  <img
                    onClick={() => {
                      setSearchStr("");
                      setSearchResult(undefined);
                    }}
                    className="h-[16px] w-[16px] absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    src="/images/icon_close.svg"
                    alt=""
                  />
                </DrawerClose>
              )}
            </div>
          </header>
          <div className="px-4">
            <h6 className="py-3 text-dayT3 text-xs">AI agents</h6>
            {searchStr && searchMutation.status === "pending" ? (
              <LoadingComp loading size={32} className="py-6" />
            ) : searchResult?.length ? (
              searchResult?.map((agent) => {
                return <SearchAgentItem key={agent?.txHash} agent={agent} />;
              })
            ) : (
              <div className="h-[482px] w-full flex flex-col items-center justify-center gap-[10px]">
                <img
                  className="w-[120px] h-[120px]"
                  src="/images/no_data.svg"
                  alt=""
                />
                <span className="text-second">No search result</span>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
