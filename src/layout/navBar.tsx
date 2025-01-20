import { useState } from "react";
import {
  copyToClipboard,
  formatAddress,
  formatAddressNew,
  getColorByAgentType,
  getTextByAgentType,
} from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Users } from "lucide-react";
import { debounce } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { searchAgentList } from "@/api/api";
import { AgentItem } from "@/api/types";
import AdaptiveBalance from "@/components/adaptiveBalance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import BigNumber from "bignumber.js";
import { LoadingComp } from "@/components/loading";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const { evmAddress } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
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
    searchMutation.mutate(val);
  }, 300);

  return (
    <>
      <header className="bg-yellow w-full h-16 flex justify-between items-center">
        <div className="w-full h-full flex justify-between items-center py-4 px-6 cursor-pointer">
          <div
            onClick={() => navigate("/home")}
            className="flex items-center gap-3"
          >
            <img
              src="/images/logo.svg"
              className="w-[32px] h-[32px]"
              alt="logo"
            />
            <img
              src="/images/logo_title.svg"
              className="w-[143px] h-[34px]"
              alt="logo"
            />
          </div>
          <div className="relative flex-1 max-w-[560px] mx-6">
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
              <img
                onClick={() => setSearchStr("")}
                className="h-[16px] w-[16px] absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                src="/images/icon_close.svg"
                alt=""
              />
            )}
            {searchStr && (
              <div className="absolute top-[calc(100%+10px)] p-6 min-w-[680px] left-0 w-full bg-white rounded-[4px] shadow-lg z-50">
                {searchMutation.status === "pending" ? (
                  <LoadingComp loading size={32} className="py-6" />
                ) : (
                  <SearchAgentList
                    agentList={searchResult}
                    onClose={() => setSearchStr("")}
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex gap-6">
            {evmAddress && (
              <div className="flex gap-2 items-center text-first text-14 font-SwitzerMedium">
                <img
                  src="/images/icon_doge.svg"
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                <span>2,345,444.04 Doge</span>
              </div>
            )}
            <div
              className="p-[6px] border-[1px] border-first rounded-[2px] cursor-pointer text-14 text-first min-w-fit"
              onClick={() => {
                setShowModal(!showModal);
              }}
            >
              {evmAddress ? (
                <div className="flex items-center gap-1 font-SwitzerMedium">
                  <img
                    src="/images/icon_wallet.svg"
                    className="w-[24px] h-[24px]"
                    alt="wallet"
                  />
                  {formatAddress(evmAddress)}
                </div>
              ) : (
                "Connect Wallet"
              )}
            </div>
          </div>
        </div>
      </header>
      {showModal && (
        <ConnectWalletModal
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;

interface ISearchAgentList {
  agentList?: AgentItem[];
  onClose: () => void;
}
const SearchAgentList: React.FC<ISearchAgentList> = ({
  agentList,
  onClose,
}) => {
  const navigate = useNavigate();
  return agentList?.length ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-12 text-second">AI agents</TableHead>
          <TableHead className="w-[15%] text-12 text-second text-nowrap">
            Market cap
          </TableHead>
          <TableHead className="w-[15%] text-12 text-second">24h</TableHead>
          <TableHead className="w-[15%] text-12 text-nowrap">
            Total value locked
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agentList?.map((agent, index) => (
          <TableRow key={`agent_${index}`} className="last:mb-0">
            <TableCell colSpan={4} className="p-0">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/token/${agent.characterId}/${agent.tokenAddress}`);
                  onClose();
                }}
                className="bg-white cursor-pointer hover:bg-hover flex items-center gap-4"
              >
                <div className="flex items-center gap-3 p-3 flex-1">
                  <img
                    src={agent.image}
                    alt="icon"
                    className="w-[40px] h-[40px]"
                  />
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1">
                      <div className="text-14 font-SwitzerMedium">
                        {agent.name}
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(agent.tokenAddress);
                          toast({
                            title: "Copied",
                            variant: "default",
                          });
                        }}
                        className="flex items-center gap-[2px] bg-white px-[6px] rounded-full border border-border"
                      >
                        <span className="text-10 text-second">
                          {formatAddressNew(agent.tokenAddress)}
                        </span>
                        <img
                          className="w-[10px] h-[10px]"
                          src="/images/icon_copy.svg"
                          alt=""
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "flex items-center gap-[2px] px-[6px] rounded-full",
                          getColorByAgentType(agent.agentType)
                        )}
                      >
                        <span className="text-10">
                          {getTextByAgentType(agent.agentType)}
                        </span>
                        <Users size={10} color="white" />
                      </div>
                      {agent.twitter && (
                        <LinkItem
                          url={agent.twitter}
                          icon="/images/twitter.svg"
                        />
                      )}
                      {agent.telegram && (
                        <LinkItem
                          url={agent.telegram}
                          icon="/images/telegram.svg"
                        />
                      )}
                      {agent.discord && (
                        <LinkItem
                          url={agent.discord}
                          icon="/images/discord.svg"
                        />
                      )}
                      {agent.youtube && (
                        <LinkItem
                          url={agent.youtube}
                          icon="/images/youtube.svg"
                        />
                      )}
                      {agent.website && (
                        <LinkItem
                          url={agent.website}
                          icon="/images/website.svg"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-[15%]">
                  $<AdaptiveBalance balance={agent.marketCap.toString()} />
                </div>
                <div
                  className={cn(
                    "w-[15%]",
                    new BigNumber(agent.price24Change).gt(0)
                      ? "text-green"
                      : "text-red"
                  )}
                >
                  {agent.price24Change}%
                </div>
                <div className="w-[15%]">
                  $<AdaptiveBalance balance={agent.totalLocked} />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div className="h-[482px] w-full flex flex-col items-center justify-center gap-[10px]">
      <img className="w-[120px] h-[120px]" src="/images/no_data.svg" alt="" />
      <span className="text-second">No search result</span>
    </div>
  );
};

interface LinkItemProps {
  url: string;
  icon: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ url, icon }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        window.open(url, "_blank");
      }}
      className="flex items-center justify-center gap-[2px] w-5 h-5 bg-white rounded-full border border-border cursor-pointer"
    >
      <img className="w-[10px] h-[10px]" src={icon} alt="" />
    </div>
  );
};
