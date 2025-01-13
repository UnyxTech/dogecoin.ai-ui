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
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const agentList = [
    {
      name: "Aixbt",
      type: "Productivity",
      icon: "/images/avatar.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
      address: "xxxxxxx",
    },
    {
      name: "G.A.M.E",
      type: "Entertainment",
      icon: "/images/avatar.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
      address: "xxxxxxx",
    },
    {
      name: "Toshi",
      type: "Information",
      icon: "/images/avatar.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
      address: "xxxxxxx",
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
      address: "xxxxxxx",
    },
    {
      name: "G.A.M.E",
      type: "Entertainment",
      icon: "/images/avatar.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
      address: "xxxxxxx",
    },
    {
      name: "Toshi",
      type: "Information",
      icon: "/images/avatar.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
      address: "xxxxxxx",
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
      address: "xxxxxxx",
    },
    {
      name: "G.A.M.E",
      type: "Entertainment",
      icon: "/images/avatar.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
      address: "xxxxxxx",
    },
    {
      name: "Toshi",
      type: "Information",
      icon: "/images/avatar.svg",
      marketCap: "$250.00",
      change: "+8.0%",
      tvl: "$25m",
      holderCount: "123,345",
      volume: "$250.00",
      address: "xxxxxxx",
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
      address: "xxxxxxx",
    },
  ];
  const navigate = useNavigate();
  return (
    <Container>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 py-2 px-6 rounded-full bg-gray">
          <span className="text-14 font-SwitzerMedium">All sentient</span>
          <img
            className="w-[16px] h-[16px]"
            src="/images/icon_people.svg"
            alt=""
          />
          <img
            className="w-[16px] h-[16px]"
            src="/images/arrow_down.svg"
            alt=""
          />
        </div>
        <Button>Create new AI agent</Button>
      </div>
      <div className="mt-5 w-full h-[calc(100vh-260px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AI agents</TableHead>
              <TableHead>Market cap</TableHead>
              <TableHead>24h</TableHead>
              <TableHead>Total value locked</TableHead>
              <TableHead>Holder count</TableHead>
              <TableHead>24h Vol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentList.map((agent) => (
              <TableRow>
                <TableCell
                  onClick={() => navigate(`/token/${agent.address}`)}
                  className="flex items-center gap-3"
                >
                  <img src={agent.icon} alt="icon" className="w-8 h-8" />
                  <div className="flex flex-col gap-1">
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
                      <img
                        className="w-[10px] h-[10px]"
                        src="/images/white_people.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>{agent.marketCap}</TableCell>
                <TableCell>{agent.change}</TableCell>
                <TableCell>{agent.tvl}</TableCell>
                <TableCell>{agent.holderCount}</TableCell>
                <TableCell>{agent.volume}</TableCell>
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
    </Container>
  );
};

export default HomePage;
