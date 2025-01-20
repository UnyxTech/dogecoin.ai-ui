import { useParams } from "react-router-dom";
import TokenInfoHeader from "./TokenInfoHeader";
import TokenInfoTabs from "./tokenInfoTabs";
import TradingViewChart from "./tradingview";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
import InfoAndTradingviewSkeletions from "@/components/skeletons/tokenDetail/InfoAndTradingviewSkeletions";

const TokenMarketInfo = () => {
  const { characterId } = useParams();
  const { data: tokenInfo, isLoading } = useAgentInfo(characterId!);
  return (
    <div className="w-full rounded-[6px] overflow-hidden flex flex-col gap-4">
      {isLoading ? (
        <InfoAndTradingviewSkeletions />
      ) : (
        <div className="w-full bg-dayBg1 p-6">
          <TokenInfoHeader tokenInfo={tokenInfo!} />
          <div className="h-96 mt-4">
            <TradingViewChart key="tradingview" tokenInfo={tokenInfo!} />
          </div>
        </div>
      )}
      <div className="w-full bg-dayBg1 px-6 py-2">
        <TokenInfoTabs />
      </div>
    </div>
  );
};

export default TokenMarketInfo;
