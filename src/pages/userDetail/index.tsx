import Container from "@/components/container";
import { defaultChain } from "@/constant";
import { toast } from "@/hooks/use-toast";
import {
  copyToClipboard,
  formatAddressNew,
  getDetailedTimeDiff,
} from "@/utils";
import { LogOut, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DEFAULT_PAGE_SIZE,
  getcreateAgentList,
  getHeldAgentList,
} from "@/api/api";
import { LoadingComp } from "@/components/loading";
import { PaginationView } from "../home/pagination";
import { AgentItem } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import AdaptiveBalance from "@/components/adaptiveBalance";
import { useAuth } from "@/hooks/useAuth";

export const UserDetail = () => {
  const [selectTab, setSelectTab] = useState<string>("held");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: createAgentsData,
    fetchNextPage: fetchNextPageCreateAgents,
    status: statusCreateAgents,
  } = useInfiniteQuery({
    queryKey: ["createAgents"],
    queryFn: ({ pageParam = currentPage }) => getcreateAgentList(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.rows.length === DEFAULT_PAGE_SIZE
        ? lastPage.current + 1
        : undefined,
  });

  const {
    data: heldAgentsData,
    fetchNextPage: fetchNextPageHeldAgents,
    status: statusHeldAgents,
  } = useInfiniteQuery({
    queryKey: ["heldAgents"],
    queryFn: ({ pageParam = currentPage }) => getHeldAgentList(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.rows.length === DEFAULT_PAGE_SIZE
        ? lastPage.current + 1
        : undefined,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const data = selectTab === "held" ? heldAgentsData : createAgentsData;
    const nextFun =
      selectTab === "held"
        ? fetchNextPageHeldAgents
        : fetchNextPageCreateAgents;
    if (currentPage > 1 && currentPage > (data?.pages.length || 0)) {
      nextFun();
    }
  }, [
    currentPage,
    createAgentsData?.pages.length,
    heldAgentsData?.pages.length,
    fetchNextPageHeldAgents,
    fetchNextPageCreateAgents,
    selectTab,
  ]);

  return (
    <Container className="max-w-[1000px] px-4">
      <UserInfo />
      <div className="mt-8">
        <Tabs defaultValue={selectTab} className="w-full outline-none">
          <TabsList className="grid w-full grid-cols-2 text-16 mb-4 font-SwitzerMedium rounded-md bg-linear-gray shadow-inner sm:shadow-md">
            <TabsTrigger
              className="py-2 data-[state=active]:bg-yellow !outline-none !border-none"
              value="held"
              onClick={() => {
                setSelectTab("held");
                setCurrentPage(1);
              }}
            >
              Agents held
            </TabsTrigger>
            <TabsTrigger
              className="py-2 data-[state=active]:bg-yellow !outline-none !border-none"
              value="created"
              onClick={() => {
                setSelectTab("created");
                setCurrentPage(1);
              }}
            >
              Agents created
            </TabsTrigger>
          </TabsList>
          <TabsContent value="held">
            {statusHeldAgents === "pending" && (
              <LoadingComp loading text="Loading..." />
            )}
            <div className="flex flex-col gap-6 justify-end">
              <div className="grid lg:grid-cols-5 gap-x-3 gap-y-1 mdd:grid-cols-4 md:grid-cols-3 grid-cols-2">
                {heldAgentsData?.pages[currentPage - 1]?.rows?.map(
                  (agent, index) => (
                    <AgentItemView key={`held_${index}`} agent={agent} />
                  )
                )}
              </div>
              <PaginationView
                showCurrentPage
                currentPage={currentPage}
                hasNextPage={
                  heldAgentsData?.pages[currentPage - 1]?.rows.length ===
                  DEFAULT_PAGE_SIZE
                }
                handlePageChange={handlePageChange}
              />
            </div>
          </TabsContent>
          <TabsContent value="created">
            {statusCreateAgents === "pending" && (
              <LoadingComp loading text="Loading..." />
            )}
            <div className="flex flex-col gap-6 justify-end">
              <div className="grid lg:grid-cols-5 gap-x-3 gap-y-1 mdd:grid-cols-4 md:grid-cols-3 grid-cols-2">
                {createAgentsData?.pages[currentPage - 1]?.rows?.map(
                  (agent, index) => (
                    <AgentItemView key={`create_${index}`} agent={agent} />
                  )
                )}
              </div>
              <PaginationView
                showCurrentPage
                currentPage={currentPage}
                hasNextPage={
                  createAgentsData?.pages[currentPage - 1]?.rows.length ===
                  DEFAULT_PAGE_SIZE
                }
                handlePageChange={handlePageChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

const UserInfo: React.FC = () => {
  const { disconnectApp } = useAuth();
  const { address } = useAccount();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col pt-4 pb-12 px-6 bg-user-detail shadow-grayShadow rounded-[10px] bordder-[3px] border-white">
      <div className="flex justify-end">
        <div
          onClick={() => {
            disconnectApp();
            navigate(-1);
          }}
          className="flex items-center rounded-full border border-border py-2 px-3 gap-[10px] bg-white cursor-pointer text-second text-12 font-SwitzerMedium hover:text-first hover:border-second"
        >
          Log out
          <LogOut className="text-red" size={16} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <img className="w-[70px] h-[70px]" src="/images/icon_doge.svg" alt="" />
        <div
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(address ?? "");
            toast({
              title: "Copied",
              variant: "default",
            });
          }}
          className="flex flex-col gap-2 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-16 w-full">
            <span className="break-all">{address}</span>
            <img
              className="w-[16px] h-[16px]"
              src="/images/icon_copy.svg"
              alt=""
            />
          </div>
          <div
            onClick={() => {
              window.open(
                `${defaultChain.blockExplorers?.default.url}/address/${address}`,
                "_blank"
              );
            }}
            className="flex items-center gap-1 text-second text-16 cursor-pointer"
          >
            View on basescan
            <SquareArrowOutUpRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface AgentItemProps {
  agent: AgentItem;
}

const AgentItemView: React.FC<AgentItemProps> = ({ agent }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/token/${agent?.characterId}`)}
      className="p-2 bg-white hover:bg-hover min-w-fit border border-border rounded-[6px] flex flex-col gap-1 cursor-pointer"
    >
      <div
        style={{ backgroundImage: `url(${agent.image})` }}
        className={`h-[174px] w-full rounded-[6px] border border-border bg-cover bg-no-repeat`}
      ></div>
      <div className="text-first text-14">${agent.symbol}</div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          window.open(
            `${defaultChain.blockExplorers?.default.url}/token/${agent.tokenAddress}`,
            "_blank"
          );
        }}
        className="text-first text-14 flex items-center gap-2"
      >
        CA: {formatAddressNew(agent.tokenAddress)}
        <SquareArrowOutUpRight size={14} />
      </div>
      <div className="rounded-[2px] px-1 bg-border text-second text-10 w-fit">
        {getDetailedTimeDiff(agent?.createdTime ?? "--")}
      </div>

      <div className="text-14 text-first">
        <AdaptiveBalance balance={agent.holdingAmount ?? ""} />
      </div>
      <div className="text-second text-12">
        $<AdaptiveBalance balance={agent.holdingAmountUsd ?? ""} />
      </div>
    </div>
  );
};
