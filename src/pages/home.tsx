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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getColorByAgentName } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Users } from "lucide-react";

const HomePage = () => {
  const { evmAddress } = useAuth();
  const navigate = useNavigate();
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const agentList = [
    {
      name: "Aixbt",
      type: "Productivity",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "G.A.M.E",
      type: "Entertainment",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "Toshi",
      type: "Information",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "Toshi",
      type: "Creative",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "G.A.M.E",
      type: "Entertainment",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "Toshi",
      type: "Information",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "Toshi",
      type: "Creative",
      icon: "/images/avatar.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "G.A.M.E",
      type: "Entertainment",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "Toshi",
      type: "Information",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
    {
      name: "Toshi",
      type: "Creative",
      icon: "/images/agent.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
    },
  ];
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
            {agentList.map((agent, index) => (
              <TableRow
                key={`agent_${index}`}
                className="last:mb-0 border-none"
              >
                <TableCell colSpan={6} className="px-0 pt-3 pb-0">
                  <div className="bg-white rounded-[4px] flex items-center gap-4">
                    <div className="flex items-center gap-3 w-[30%] p-3">
                      <img
                        src={agent.icon}
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
                            getColorByAgentName(agent.type)
                          )}
                        >
                          <span className="text-10">{agent.type}</span>
                          <Users size={10} color="white" />
                        </div>
                        <span>$GAME</span>
                      </div>
                    </div>
                    <div className="w-[14%] px-4">{agent.marketCap}</div>
                    <div className="w-[14%] px-4 text-green">
                      {agent.change}
                    </div>
                    <div className="w-[14%] px-4">{agent.tvl}</div>
                    <div className="w-[14%] px-4">{agent.holderCount}</div>
                    <div className="w-[14%] px-4">{agent.volume}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">99</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">100</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
