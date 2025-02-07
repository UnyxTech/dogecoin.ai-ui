import { AgentItem } from "@/api/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AgentType } from "@/types";
import {
  copyToClipboard,
  formatAddressNew,
  getColorByAgentType,
  getTextByAgentType,
} from "@/utils";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdaptiveBalance from "../adaptiveBalance";
import BigNumber from "bignumber.js";
import { LinkItem } from "@/layout/navBar";
import { DrawerClose } from "../ui/drawer";

type Props = {
  agent: AgentItem;
};

const SearchAgentItem = ({ agent }: Props) => {
  const navigate = useNavigate();
  return (
    <DrawerClose asChild>
      <div
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/token/${agent.characterId}`);
        }}
        className="bg-white cursor-pointer hover:bg-hover py-3 px-4 "
      >
        {/* name address */}
        <div className="flex gap-3 flex-1">
          <img
            src={agent.image}
            alt="icon"
            className="w-[40px] h-[40px] sm:w-[80px] sm:h-[80px]"
          />
          <div className="flex flex-col gap-3">
            <div className="flex-1 gap-1">
              <div className="flex items-center">
                <div className="text-14 font-SwitzerMedium">{agent.name}</div>
                <div className="text-10 text-second font-SwitzerMedium px-1">
                  ${agent.symbol}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(agent.tokenAddress);
                    toast({
                      title: "Copied",
                      variant: "default",
                      duration: 3000,
                    });
                  }}
                  className="flex items-center gap-[2px] bg-white px-[6px] rounded-full border border-border"
                >
                  <span className="text-10 text-second">
                    {formatAddressNew(agent.tokenAddress)}
                  </span>
                  <img
                    className="w-[10px] h-[10px] opacity-50"
                    src="/images/icon_copy.svg"
                    alt=""
                  />
                </div>
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
                <Users
                  size={10}
                  color={
                    agent.agentType === AgentType.Productivity
                      ? "white"
                      : "black"
                  }
                />
              </div>
              {agent.twitter && (
                <LinkItem url={agent.twitter} icon="/images/twitter.svg" />
              )}
              {agent.telegram && (
                <LinkItem url={agent.telegram} icon="/images/telegram.svg" />
              )}
              {agent.discord && (
                <LinkItem url={agent.discord} icon="/images/discord.svg" />
              )}
              {agent.youtube && (
                <LinkItem url={agent.youtube} icon="/images/youtube.svg" />
              )}
              {agent.website && (
                <LinkItem url={agent.website} icon="/images/website.svg" />
              )}
            </div>
          </div>
        </div>
        {/* data */}
        <div>
          <div className="flex items-center justify-between text-sm font-SwitzerMedium mt-2">
            <span className="text-second text-xs">Market cap</span>
            <div>
              $<AdaptiveBalance balance={agent.marketCap.toString()} />
            </div>
          </div>
          <div className="flex items-center justify-between font-SwitzerMedium mt-2">
            <span className="text-second text-xs">24h</span>
            <div
              className={cn(
                new BigNumber(agent.price24Change).gt(0)
                  ? "text-green"
                  : "text-red"
              )}
            >
              {agent.price24Change}%
            </div>
          </div>
          <div className="flex items-center justify-between font-SwitzerMedium mt-2">
            <span className="text-second text-xs">Total value locked</span>
            <div>
              $<AdaptiveBalance balance={agent.totalLocked} />
            </div>
          </div>
        </div>
      </div>
    </DrawerClose>
  );
};
export default SearchAgentItem;
