import React from "react";

type Props = {
  tradeData: {
    isBuy: boolean;
    amount: string;
  };
  setTradeData: React.Dispatch<
    React.SetStateAction<{
      isBuy: boolean;
      amount: string;
    }>
  >;
};

const TradeTypeButton = ({ tradeData, setTradeData }: Props) => {
  return (
    <div className="h-11 bg-[#D4D3D3]  shadow-tokenTrade text-dayBg1 my-5">
      <div className="relative h-full w-full items-center px-[3px] py-[2px] overflow-hidden text-base">
        <div
          className={`z-10 h-full w-1/2 ${
            tradeData.isBuy ? "" : "translate-x-full"
          } ${
            tradeData.isBuy
              ? "bg-gradient-to-b from-buy-from to-buy-to"
              : "bg-gradient-to-b from-sell-from to-sell-to"
          } transition-all duration-500 `}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full bg-transparent">
          <div
            className={`z-20 flex h-full flex-1 items-center justify-center bg-transparent  ${
              tradeData.isBuy ? "text-dayBg1" : "text-dayT3 font-medium"
            } transition-all duration-500`}
            onClick={() => {
              setTradeData(() => ({ isBuy: true, amount: "" }));
            }}
          >
            Buy
          </div>
          <div
            className={`z-20 flex h-full flex-1 items-center justify-center bg-transparent ${
              !tradeData.isBuy ? "text-dayBg1" : "text-dayT3 font-medium"
            } transition-all duration-500`}
            onClick={() => {
              setTradeData(() => ({ isBuy: false, amount: "" }));
            }}
          >
            Sell
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeTypeButton;
