import React from "react";
import TokenInfoHeader from "./TokenInfoHeader";
import TradingView from "./tradingview";

const TokenMarketInfo = () => {
  return (
    <div className="p-6 bg-dayBg1  rounded-[6px]">
      <TokenInfoHeader />
      <div className="w-full h-96 bg-black mt-6">
        <TradingView />
      </div>
    </div>
  );
};

export default TokenMarketInfo;
