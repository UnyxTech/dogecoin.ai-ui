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
import { getColorByAgentName } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Users } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE, getAllAgentList } from "@/api/api";
import { PaginationView } from "./pagination";
// import { LoadingComp } from "@/components/loading";
import { useLoginStore } from "@/store/login";
import BigNumber from "bignumber.js";

const HomePage = () => {
  const { evmAddress } = useAuth();
  const navigate = useNavigate();
  const token = useLoginStore((state) => state.token);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["agents"],
    // enabled: !!token,
    // enabled: false,
    queryFn: ({ pageParam = currentPage }) => getAllAgentList(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.rows.length === DEFAULT_PAGE_SIZE
        ? lastPage.current + 1
        : undefined,
  });
  console.log(status, hasNextPage);

  // const totalPages = data?.pages[0]?.totalPages || 1;
  // if (status === "pending") return <LoadingComp loading />;
  // if (status === "error") return <LoadingComp loading />;

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
        <div className="flex items-center gap-3 py-[10px] px-[14px] rounded-[4px] bg-white">
          <Users size={16} />
          <span className="text-14 font-SwitzerMedium">All sentient</span>
          <ChevronDown size={16} />
        </div>
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
              <TableHead className="w-[14%]">Market cap</TableHead>
              <TableHead className="w-[14%]">24h</TableHead>
              <TableHead className="w-[14%]">Total value locked</TableHead>
              <TableHead className="w-[14%]">Holder count</TableHead>
              <TableHead className="w-[14%]">24h Vol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages[currentPage - 1]?.rows?.map((agent, index) => (
              <TableRow
                key={`agent_${index}`}
                className="last:mb-0 border-none"
              >
                <TableCell colSpan={6} className="px-0 pt-3 pb-0">
                  <div className="bg-white rounded-[4px] flex items-center gap-4">
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
                            getColorByAgentName(agent.agentType)
                          )}
                        >
                          <span className="text-10">{agent.agentType}</span>
                          <Users size={10} color="white" />
                        </div>
                        <span>$GAME</span>
                      </div>
                    </div>
                    <div className="w-[14%] px-4">{agent.marketCap}</div>
                    <div
                      className={cn(
                        "w-[14%] px-4",
                        new BigNumber(agent.price24Change).gt(0)
                          ? "text-green"
                          : "text-red"
                      )}
                    >
                      {agent.price24Change}
                    </div>
                    <div className="w-[14%] px-4">{agent.totalLocked}</div>
                    <div className="w-[14%] px-4">{agent.holder}</div>
                    <div className="w-[14%] px-4">{agent.volume24h}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationView
          // totalPages={totalPages}
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
