import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
import TokenInfoHeader from "./TokenInfoHeader";
import TokenInfoTabs from "./tokenInfoTabs";
import TradingViewChart from "./tradingview";
import { useAgentInfoStore } from "@/store/tokenDetail";
import { useEffect } from "react";

const TokenMarketInfo = ({ characterId }: { characterId: string }) => {
  const setAgent = useAgentInfoStore((state) => state.setAgent);
  const { data: tokenInfo } = useAgentInfo(characterId);
  useEffect(() => {
    if (tokenInfo) {
      setAgent(tokenInfo);
    }
  }, [tokenInfo, setAgent]);
  return (
    <div className="w-full rounded-[6px] overflow-hidden flex flex-col gap-4">
      <div className="w-full bg-dayBg1 p-6">
        <TokenInfoHeader />
        <div className="h-96 mt-4">
          <TradingViewChart />
        </div>
      </div>
      <div className="w-full bg-dayBg1 px-6 py-2">
        <TokenInfoTabs />
      </div>
    </div>
  );
};

export default TokenMarketInfo;
