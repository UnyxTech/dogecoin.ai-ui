import { CircleAlert } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { WrapperHoverCardConnect } from "@/components/ui/custom/WrapperHoverCardConnect";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProgressCard } from "./ProgressCard";

const TokenSwap = () => {
  const [showModal, setShowModal] = useState(false);
  const [isBuy, setIsBuy] = useState<boolean>(false);
  const [tradeAmount, setTradeAmount] = useState<string>("");
  console.log(tradeAmount);
  return (
    <div className="p-6 pb-8 bg-white">
      <h1 className="text-2xl text-dayT1 font-SwitzerBold">Swap</h1>
      <div className="h-11 bg-[#D4D3D3]  shadow-tokenTrade text-dayBg1 my-5">
        <div className="relative h-full w-full items-center px-[3px] py-[2px] overflow-hidden text-base">
          <div
            className={`z-10 h-full w-1/2 ${isBuy ? "" : "translate-x-full"} ${
              isBuy
                ? "bg-gradient-to-b from-buy-from to-buy-to"
                : "bg-gradient-to-b from-sell-from to-sell-to"
            } transition-all duration-700 `}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full bg-transparent">
            <div
              className={`z-20 flex h-full flex-1 items-center justify-center bg-transparent  ${
                isBuy ? "text-dayBg1" : "text-dayT3 font-medium"
              } transition-all duration-700`}
              onClick={() => {
                setIsBuy(true);
              }}
            >
              Buy
            </div>
            <div
              className={`z-20 flex h-full flex-1 items-center justify-center bg-transparent ${
                !isBuy ? "text-dayBg1" : "text-dayT3 font-medium"
              } transition-all duration-700`}
              onClick={() => {
                setIsBuy(false);
              }}
            >
              Sell
            </div>
          </div>
        </div>
      </div>
      {/* input */}
      <div className="flex w-full max-w-sm items-center px-4 border border-dayL1">
        <Input
          type="text"
          placeholder="0"
          className="border-none flex-1 p-0"
          value={tradeAmount}
          onChange={(e) => {
            const value = e.target.value;
            if (!/^\d*\.?\d*$/.test(value)) {
              return;
            }

            if (
              value.startsWith("0") &&
              value.length > 1 &&
              !value.startsWith("0.")
            ) {
              setTradeAmount(value.replace(/^0+/, ""));
              return;
            }
            if (value === "0" || value.includes(".")) {
              setTradeAmount(value);
              return;
            }
            setTradeAmount(e.target.value);
          }}
        />
        <div className="flex items-center gap-2">
          <img
            src="/images/icon_doge.svg"
            alt="logo"
            className="flex-shrink-0 w-7 h-7"
          />
          <span>Doge</span>
        </div>
      </div>
      {isBuy ? (
        <div className="flex items-center gap-3 my-4">
          {["10", "100", "1000"].map((value) => {
            return (
              <div
                key={value}
                className="flex items-center p-2 bg-dayBg3 gap-1 cursor-pointer"
                onClick={() => setTradeAmount(value)}
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
                onClick={() => setTradeAmount(value)}
              >
                <span className="text-sm">{value}%</span>
              </div>
            );
          })}
        </div>
      )}
      {+tradeAmount > 0 ? (
        <div className="text-dayT1">
          <p className="font-semibold text-20 ">111,1111 GAME</p>
          <p className="text-xs">$11.12</p>
        </div>
      ) : null}
      <HoverCard>
        <div className="flex items-center mt-4 mb-5 text-dayT3 gap-1.5">
          <span className="text-sm">Trading Fee</span>
          <HoverCardTrigger>
            <CircleAlert
              size={16}
              onMouseEnter={() => {}}
              className="cursor-pointer"
            />
          </HoverCardTrigger>
        </div>
        <WrapperHoverCardConnect
          align="start"
          alignOffset={-20}
          sideOffset={12}
          className="w-full bg-dayT2  text-white opacity-80 text-xs leading-[130%] rounded-[8px] font-SwitzerLight"
        >
          1% trading fee applies to all buys and sells
        </WrapperHoverCardConnect>
      </HoverCard>
      {/* eslint-disable-next-line no-constant-condition */}
      {false ? (
        <Button
          onClick={() => setShowModal(true)}
          className={`trade-button
          ${
            isBuy
              ? "bg-gradient-to-b from-buy-from to-buy-to"
              : "bg-gradient-to-b from-sell-from to-sell-to"
          } transition-all duration-700`}
        >
          <img src="/public/images/dage_trade_b_i.png" alt="" />
          <span className="text-white [-webkit-text-stroke:1.5px_#12122A] [text-stroke:1.5px_#12122A] font-WendyOne text-xl leading-[140%] tracking-wide capitalize">
            Trade
          </span>
        </Button>
      ) : (
        <Button
          onClick={() => setShowModal(true)}
          className={`trade-button
          bg-[linear-gradient(to_bottom,#626286_-9.05%,#34344B_51.88%)]
          transition-all duration-700`}
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
