import { CircleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { WrapperHoverCardConnect } from "@/components/ui/custom/WrapperHoverCardConnect";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProgressCard } from "./ProgressCard";
import TradeTypeButton from "./TradeTypeButton";
import { useAccount, useBalance } from "wagmi";
import { parseUnits } from "viem";

const TokenSwap = () => {
  const account = useAccount();
  const [showModal, setShowModal] = useState(false);
  const [tradeData, setTradeData] = useState({
    isBuy: true,
    amount: "",
  });
  const result = useBalance({
    address: account.address,
  });

  // const { data, refetch } = useGetAmountOutQuery({
  //   token: "0x650b89f5e67927fc9081F211B2a2fAd9487D1A69",
  //   amountIn: tradeData.isBuy
  //     ? parseUnits(tradeData.amount, 18)
  //     : BigInt(Number(tradeData.amount) ** 10 * BASE_TOKEN.decimals),
  //   isBuy: tradeData.isBuy,
  // });
  // isEfficientBalance
  const isEfficientBalance = useMemo(() => {
    const amountInWei = parseUnits(tradeData.amount, 18);
    const balance = result.data?.value || 0n;
    if (tradeData.isBuy) {
      return balance ? amountInWei <= balance : false;
    }
    return balance ? amountInWei <= balance : false;
  }, [tradeData.amount, tradeData.isBuy, result.data?.value]);
  // Doge || Meme token
  const buyAmountOutUI = tradeData.isBuy && +tradeData.amount > 0;
  const sellAmountOutUI = !tradeData.isBuy && +tradeData.amount > 0;
  // tradeAmount
  const handleAmountChange = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    let formattedValue = value;
    if (value !== "0" && !value.startsWith("0.")) {
      formattedValue = value.replace(/^0+/, "");
    }
    setTradeData((state) => ({
      ...state,
      amount: formattedValue,
    }));
  };
  return (
    <div className="p-6 pb-8 bg-white">
      <h1 className="text-2xl text-dayT1 font-SwitzerBold">Swap</h1>
      {/* Trade Type button */}
      <TradeTypeButton tradeData={tradeData} setTradeData={setTradeData} />
      {/*Trade input */}
      <div className="flex w-full max-w-sm items-center px-4 border border-dayL1">
        <Input
          type="text"
          placeholder="0"
          className="border-none flex-1 p-0"
          value={tradeData.amount}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <img src="/images/icon_doge.svg" alt="logo" className="w-7 h-7" />
          <span>{tradeData.isBuy ? "Doge" : "TargetToken"}</span>
        </div>
      </div>
      {tradeData.isBuy ? (
        <div className="flex items-center gap-3 my-4">
          {["10", "100", "1000"].map((value) => {
            return (
              <div
                key={value}
                className="flex items-center p-2 bg-dayBg3 gap-1 cursor-pointer"
                onClick={() => handleAmountChange(value)}
              >
                <span className="text-sm">{value}</span>
                <img
                  src="/images/icon_doge.svg"
                  alt="logo"
                  className="flex-shrink-0 w-4 h-4"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 my-4">
          {["25", "50", "75", "100"].map((value) => {
            return (
              <div
                key={value}
                className="flex items-center justify-center p-2 bg-dayBg3 gap-1 cursor-pointer"
                onClick={() => {
                  const valueC = (123 * +value) / 100;
                  handleAmountChange(valueC.toString());
                }}
              >
                <span className="text-sm">{value}%</span>
              </div>
            );
          })}
        </div>
      )}
      {buyAmountOutUI && (
        <div className="text-dayT1">
          <p className="font-semibold text-20 ">111,1111 GAME</p>
          <p className="text-xs">$11.12</p>
        </div>
      )}
      {sellAmountOutUI && (
        <div className="text-dayT1">
          <p className="font-semibold text-20 ">111,1111 Eth</p>
          <p className="text-xs">$1</p>
        </div>
      )}
      <HoverCard>
        <div className="flex items-center mt-4 mb-5 text-dayT3 gap-1.5">
          <span className="text-sm">Trading Fee</span>
          <HoverCardTrigger>
            <CircleAlert size={16} className="cursor-pointer" />
          </HoverCardTrigger>
        </div>
        <WrapperHoverCardConnect
          align="start"
          alignOffset={-20}
          sideOffset={12}
          className="w-full bg-dayT2 opacity-100 text-white  text-xs leading-[130%] rounded-[8px] font-SwitzerLight"
        >
          1% trading fee applies to all buys and sells
        </WrapperHoverCardConnect>
      </HoverCard>
      {/*Trade button  */}
      {account.address ? (
        <Button
          onClick={() => setShowModal(true)}
          disabled={!isEfficientBalance || !tradeData.amount}
          className={`trade-button border-0
          ${
            tradeData.isBuy
              ? "bg-gradient-to-b from-buy-from to-buy-to"
              : "bg-gradient-to-b from-sell-from to-sell-to"
          } transition-all duration-700`}
        >
          <img src="/public/images/dage_trade_b_i.png" alt="" />
          <span className="text-white [-webkit-text-stroke:1.5px_#12122A] [text-stroke:1.5px_#12122A] font-WendyOne text-xl leading-[140%] tracking-wide capitalize">
            {isEfficientBalance ? "Trade" : "Insufficient balance"}
          </span>
        </Button>
      ) : (
        <Button
          onClick={() => setShowModal(true)}
          className={`w-full rounded-sm py-6 bg-[linear-gradient(to_bottom,#626286_-9.05%,#34344B_51.88%)]`}
        >
          <img src="/public/images/wallet.svg" alt="" />
          <span className="text-white [-webkit-text-stroke:1.5px_#12122A] [text-stroke:1.5px_#12122A] font-WendyOne text-xl leading-[140%] tracking-wide capitalize">
            Connect Wallet
          </span>
        </Button>
      )}
      <Separator className="my-10" />
      <ProgressCard />
      <Separator className="my-10" />
      <h1 className="font-SwitzerMedium text-xl">
        Holder Distribution (7 holders)
      </h1>
      {showModal && (
        <ConnectWalletModal
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TokenSwap;
