import { useParams } from "react-router-dom";
import TokenInfoHeader from "./TokenInfoHeader";
import TokenInfoTabs from "./tokenInfoTabs";
import TradingViewChart from "./tradingview";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
import InfoAndTradingviewSkeletions from "@/components/skeletons/tokenDetail/InfoAndTradingviewSkeletions";
import TokenSwapAndChat from "../TokenSwapAndChat";

const TokenMarketInfo = ({ topic }: { topic: "INFO" | "TRADE" }) => {
  const { characterId } = useParams();
  const { data: tokenInfo, isLoading } = useAgentInfo(characterId!);
  return (
    <div className="w-full rounded-[6px] overflow-hidden flex flex-col gap-4">
      {isLoading || !tokenInfo?.tokenAddress ? (
        <InfoAndTradingviewSkeletions />
      ) : (
        <div className="w-full bg-dayBg1 p-5 demo_test:p-6">
          <TokenInfoHeader tokenInfo={tokenInfo!} />
          <div className="h-96 mt-4 w-full">
            <TradingViewChart key="tradingview" tokenInfo={tokenInfo!} />
          </div>
        </div>
      )}
      <div className="hidden demo_test:block">
        <TokenInfoTabs />
      </div>
      <div>
        {topic === "INFO" ? (
          <div className="demo_test:hidden">
            <TokenInfoTabs />
          </div>
        ) : (
          <TokenSwapAndChat />
        )}
      </div>
    </div>
  );
};

export default TokenMarketInfo;
