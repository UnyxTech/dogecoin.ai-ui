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
import { AgentItem } from "@/api/types";

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

  const { data, fetchNextPage, status } = useInfiniteQuery({
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
          Create AI agent
        </Button>
      </div>
      <ScrollableTable
        data={data}
        status={status}
        currentPage={currentPage}
        sortMarketValue={sortMarketValue}
        sortTotalLockedValue={sortTotalLockedValue}
        setSortType={setSortType}
        setSortMarketValue={setSortMarketValue}
        setSortTotalLockedValue={setSortTotalLockedValue}
      />
      <PaginationView
        // totalPages={totalPages}
        showCurrentPage
        currentPage={currentPage}
        hasNextPage={
          data?.pages[currentPage - 1]?.rows.length === DEFAULT_PAGE_SIZE
        }
        handlePageChange={handlePageChange}
      />
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

interface TableProps {
  data: any;
  status: string;
  currentPage: number;
  sortMarketValue: string;
  sortTotalLockedValue: string;
  setSortType: (val: SortType) => void;
  setSortMarketValue: (val: string) => void;
  setSortTotalLockedValue: (val: string) => void;
}

const ScrollableTable: React.FC<TableProps> = ({
  data,
  status,
  currentPage,
  sortMarketValue,
  sortTotalLockedValue,
  setSortType,
  setSortMarketValue,
  setSortTotalLockedValue,
}) => {
  const navigate = useNavigate();
  return (
    <div className="mt-5 w-full h-[calc(100vh-260px)] overflow-y-scroll relative">
      <Table className="border-separate border-spacing-y-3">
        <TableHeader className="sticky top-0 z-50 bg-[#f5f5fa] border-0 ">
          <TableRow className="[&>th]:border-b [&>th]:border-border">
            <TableHead>AI agents</TableHead>
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
              <div className="flex items-center gap-1">
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
            <TableHead>24h</TableHead>
            <TableHead
              onClick={() => {
                const value = sortTotalLockedValue === "desc" ? "asc" : "desc";
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
            <TableHead>Holder count</TableHead>
            <TableHead className="text-start">24h Vol</TableHead>
          </TableRow>
        </TableHeader>
        {status === "pending" ? (
          <LoadingComp
            className="fixed w-full left-0 h-[50%]"
            size={50}
            loading
            text="Loading..."
          />
        ) : (
          <TableBody>
            {data?.pages[currentPage - 1]?.rows?.map(
              (agent: AgentItem, index: number) => (
                <TableRow
                  key={`agent_${index}`}
                  className={cn(
                    "bg-white cursor-pointer",
                    "hover:bg-hover",
                    "rounded-[4px]",
                    "[&>td]:border-t [&>td]:border-b [&>td]:border-border ",
                    "[&>td:first-child]:border-l [&>td:first-child]:border-border ",
                    "[&>td:last-child]:border-r [&>td:last-child]:border-border "
                  )}
                  onClick={() => navigate(`/token/${agent.characterId}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={agent.image || "/placeholder.svg"}
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
                          <span className="text-10 text-nowrap">
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
                  </TableCell>
                  <TableCell>
                    <div>
                      $
                      <AdaptiveBalance balance={agent.marketCap.toString()} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        new BigNumber(agent.price24Change).gt(0)
                          ? "text-green"
                          : "text-red"
                      )}
                    >
                      {agent.price24Change}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      $<AdaptiveBalance balance={agent.totalLocked} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{agent.holder}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      $<AdaptiveBalance balance={agent.volume24h} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};
