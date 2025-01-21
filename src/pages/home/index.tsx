import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getColorByAgentType, getTextByAgentType } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE, getAllAgentList } from "@/api/api";
import { PaginationView } from "./pagination";
import { LoadingComp } from "@/components/loading";
import BigNumber from "bignumber.js";
import AdaptiveBalance from "@/components/adaptiveBalance";
import { AgentTypeSelect } from "@/components/agentTypeSelect";
import { AgentType } from "@/types";

interface SortType {
  sortBy: string;
  value: string;
}

const HomePage = () => {
  const { evmAddress } = useAuth();
  const navigate = useNavigate();
  const [showConnectWallet, setShowConnectWallet] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentAgentType, setCurrentAgentType] = useState<string>("all");
  const [sortType, setSortType] = useState<SortType>({
    sortBy: "createdTime",
    value: "desc",
  });
  const [sortMarketValue, setSortMarketValue] = useState<string>("asc");
  const [sortTotalLockedValue, setSortTotalLockedValue] =
    useState<string>("asc");

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["agents", currentAgentType, sortType.sortBy, sortType.value],
    queryFn: ({ pageParam = currentPage }) =>
      getAllAgentList(
        pageParam,
        currentAgentType === "all" ? undefined : currentAgentType,
        sortType.sortBy,
        sortType.value
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.rows.length === DEFAULT_PAGE_SIZE
        ? lastPage.current + 1
        : undefined,
    // refetchInterval(query) {
    //   return 100000;
    // },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [currentAgentType]);

  useEffect(() => {
    if (currentPage > 1 && currentPage > (data?.pages.length || 0)) {
      fetchNextPage();
    }
  }, [currentPage, data?.pages.length, fetchNextPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <div className="flex items-center justify-between pt-4">
        <AgentTypeSelect
          className="w-[170px]"
          showAll
          onChange={(val: string) => setCurrentAgentType(val)}
          selectType={currentAgentType}
        />
        <Button
          variant="yellow"
          onClick={() => {
            if (!evmAddress) {
              setShowConnectWallet(true);
            } else {
              navigate("/create");
            }
          }}
        >
          <img className="w-7 h-7" src="/images/logo2.svg" alt="" />
          Create new AI agent
        </Button>
      </div>
      <div className="mt-5 w-full h-[calc(100vh-260px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">AI agents</TableHead>
              <TableHead
                onClick={() => {
                  const value = sortMarketValue === "desc" ? "asc" : "desc";
                  setSortType({
                    sortBy: "price",
                    value: value,
                  });
                  setSortMarketValue(value);
                }}
                className="w-[14%] cursor-pointer"
              >
                <div className=" flex items-center gap-1">
                  Market cap
                  <img
                    src={
                      sortMarketValue === "asc"
                        ? "/images/sort_up.svg"
                        : "/images/sort_down.svg"
                    }
                    alt=""
                  />
                </div>
              </TableHead>
              <TableHead className="w-[14%]">24h</TableHead>
              <TableHead
                onClick={() => {
                  const value =
                    sortTotalLockedValue === "desc" ? "asc" : "desc";
                  setSortType({
                    sortBy: "totalValueLocked",
                    value: value,
                  });
                  setSortTotalLockedValue(value);
                }}
                className="w-[14%] cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  Total value locked
                  <img
                    src={
                      sortTotalLockedValue === "asc"
                        ? "/images/sort_up.svg"
                        : "/images/sort_down.svg"
                    }
                    alt=""
                  />
                </div>
              </TableHead>
              <TableHead className="w-[14%]">Holder count</TableHead>
              <TableHead className="w-[14%]">24h Vol</TableHead>
            </TableRow>
          </TableHeader>
          {/* {status === "pending" && (
            <LoadingComp
              className="fixed w-full left-0 h-[50%]"
              size={50}
              loading
              text="Loading..."
            />
          )} */}
          <TableBody>
            {data?.pages[currentPage - 1]?.rows?.map((agent, index) => (
              <TableRow
                key={`agent_${index}`}
                className="last:mb-0 border-none"
              >
                <TableCell colSpan={6} className="px-0 pt-3 pb-0">
                  <div
                    onClick={() => navigate(`/token/${agent.characterId}`)}
                    className="bg-white cursor-pointer border border-border hover:bg-hover rounded-[4px] flex items-center gap-4"
                  >
                    <div className="flex items-center gap-3 w-[30%] p-3">
                      <img
                        src={agent.image}
                        alt="icon"
                        className="w-[132px] h-[132px]"
                      />
                      <div className="flex flex-col gap-3">
                        <div className="text-14 font-SwitzerMedium">
                          {agent.name}
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-[2px] px-[6px] rounded-full",
                            getColorByAgentType(agent.agentType)
                          )}
                        >
                          <span className="text-10">
                            {getTextByAgentType(agent.agentType)}
                          </span>
                          <Users
                            size={10}
                            color={
                              agent.agentType === AgentType.Productivity
                                ? "white"
                                : "black"
                            }
                          />
                        </div>
                        <span>${agent.symbol}</span>
                      </div>
                    </div>
                    <div className="w-[14%]">
                      $
                      <AdaptiveBalance balance={agent.marketCap.toString()} />
                    </div>
                    <div
                      className={cn(
                        "w-[14%]",
                        new BigNumber(agent.price24Change).gt(0)
                          ? "text-green"
                          : "text-red"
                      )}
                    >
                      {agent.price24Change}%
                    </div>
                    <div className="w-[14%]">
                      $<AdaptiveBalance balance={agent.totalLocked} />
                    </div>
                    <div className="w-[14%]">{agent.holder}</div>
                    <div className="w-[14%]">
                      $<AdaptiveBalance balance={agent.volume24h} />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationView
          // totalPages={totalPages}
          showCurrentPage
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          handlePageChange={handlePageChange}
        />
      </div>
      {showConnectWallet && (
        <ConnectWalletModal
          open={showConnectWallet}
          nestStep={() => navigate("/create")}
          onClose={() => setShowConnectWallet(false)}
        />
      )}
    </Container>
  );
};

export default HomePage;
