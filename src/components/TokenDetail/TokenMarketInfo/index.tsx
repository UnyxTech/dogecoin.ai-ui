import React from "react";
import TokenInfoHeader from "./TokenInfoHeader";
import TokenInfoTabs from "./tokenInfoTabs";
import TradingViewChart from "./tradingview";

const TokenMarketInfo = () => {
  return (
    <div className="w-full rounded-[6px] overflow-hidden flex flex-col gap-4">
      <div className="w-full bg-dayBg1 p-6">
        <TokenInfoHeader />
        <div className="w-full h-96 mt-6">
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
