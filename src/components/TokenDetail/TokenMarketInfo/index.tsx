import { useParams } from "react-router-dom";
import TokenInfoHeader from "./TokenInfoHeader";
import TokenInfoTabs from "./tokenInfoTabs";
import TradingViewChart from "./tradingview";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
import InfoAndTradingviewSkeletions from "@/components/skeletons/tokenDetail/InfoAndTradingviewSkeletions";
import TokenSwapAndChat from "../TokenSwapAndChat";
import { useState } from "react";
const TAB_TYPES = {
  POST: "Post",
  INFORMATION: "Information",
  HOLDER: "Holder",
} as const;

export type TabType = (typeof TAB_TYPES)[keyof typeof TAB_TYPES];
const TokenMarketInfo = ({ topic }: { topic: "INFO" | "TRADE" }) => {
  const { characterId } = useParams();
  const { data: tokenInfo, isLoading } = useAgentInfo(characterId!);
  const [activeTab, setActiveTab] = useState<TabType>(TAB_TYPES.POST);
  return (
    <div className="w-full rounded-[6px] overflow-hidden flex flex-col gap-4">
      {isLoading || !tokenInfo?.tokenAddress ? (
        <InfoAndTradingviewSkeletions />
      ) : (
        <div className="w-full bg-dayBg1 p-5 mdd:p-6">
          <TokenInfoHeader tokenInfo={tokenInfo!} />
          <div className="h-96 mt-4 w-full">
            <TradingViewChart key="tradingview" tokenInfo={tokenInfo!} />
          </div>
        </div>
      )}
      <div className="hidden mdd:block">
        <TokenInfoTabs setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
      <div className="mdd:hidden">
        {topic === "INFO" ? (
          <TokenInfoTabs setActiveTab={setActiveTab} activeTab={activeTab} />
        ) : (
          <TokenSwapAndChat />
        )}
      </div>
    </div>
  );
};

export default TokenMarketInfo;
