import { CircleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { WrapperHoverCardConnect } from "@/components/ui/custom/WrapperHoverCardConnect";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProgressCard } from "./ProgressCard";
import TradeTypeButton from "./TradeTypeButton";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { Address, erc20Abi, formatUnits, parseUnits } from "viem";
import {
  // useAIContract,
  useGetAmountOutQuery,
  useTrade,
} from "@/hooks/useAIContract";
import { BASE_TOKEN } from "@/constant";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { GetAgentInfoResponse } from "@/api/types";
const TokenLogoSwitch = ({
  isBuy,
  dogeImage,
  tokenImage,
  symbol,
}: {
  isBuy: boolean;
  dogeImage: string;
  tokenImage: string;
  symbol: string;
}) => {
  const imageSrc = isBuy ? dogeImage : tokenImage;

  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 relative flex items-center justify-center">
        <img
          key={imageSrc}
          src={imageSrc}
          alt=""
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>
      <span>{isBuy ? "Doge" : symbol}</span>
    </div>
  );
};

const defaultSlippage = 10n;
const TokenSwap = ({ tokenInfo }: { tokenInfo: GetAgentInfoResponse }) => {
  const { toast } = useToast();
  const account = useAccount();
  // state
  const [showModal, setShowModal] = useState(false);
  const [debouncedAmount, setDebouncedAmount] = useState<bigint>(0n);
  const [tradeData, setTradeData] = useState({
    isBuy: true,
    amount: "",
  });
  // amountOut
  // const { getBuyAmountOut, getSellAmountOut } = useAIContract();
  const { data: amountOut, refetch: refetchAmount } = useGetAmountOutQuery({
    token: tokenInfo?.tokenAddress as Address,
    amountIn: debouncedAmount,
    isBuy: tradeData.isBuy,
  });
  // debounce
  const debouncedSetAmount = useMemo(
    () =>
      debounce((value: string) => {
        const amount = value ? parseUnits(value, 18) : 0n;
        setDebouncedAmount(amount);
      }, 500),
    []
  );
  useEffect(() => {
    debouncedSetAmount(tradeData.amount);
    return () => {
      debouncedSetAmount.cancel();
    };
  }, [tradeData.amount, debouncedSetAmount]);
  // isEfficientBalance
  const { data: dogeBalance, refetch: refetchDogeBalance } = useBalance({
    address: account.address,
  });
  const { data: memeTokenBalance, refetch: refetchMemeTokenBalance } =
    useReadContract({
      abi: erc20Abi,
      address: tokenInfo?.tokenAddress as Address,
      functionName: "balanceOf",
      args: [account.address!],
    });
  const isEfficientBalance = useMemo(() => {
    const amountIn = tradeData.isBuy
      ? parseUnits(tradeData.amount, 18)
      : parseUnits(tradeData.amount, BASE_TOKEN.decimals);
    const balance = tradeData.isBuy ? dogeBalance?.value : memeTokenBalance;
    if (tradeData.isBuy) {
      return balance ? amountIn <= balance : false;
    }
    return balance ? amountIn <= balance : false;
  }, [tradeData.isBuy, tradeData.amount, dogeBalance?.value, memeTokenBalance]);
  // Doge || Meme token
  const buyAmountOutUI = tradeData.isBuy && +tradeData.amount > 0;
  const sellAmountOutUI = !tradeData.isBuy && +tradeData.amount > 0;
  // tradeAmount
  const handleAmountChange = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    // ......
    let formattedValue = value;
    if (value !== "0" && !value.startsWith("0.")) {
      formattedValue = value.replace(/^0+/, "");
    }
    setTradeData((state) => ({
      ...state,
      amount: formattedValue,
    }));
  };
  // Swap
  const { mutateAsync: treadeAsync, isPending: isTradePending } = useTrade({
    onSuccess: (data) => {
      setTradeData((state) => ({ ...state, amount: "0" }));
      toast({
        title: "Transaction Successful",
        variant: "default",
        description: (
          <div>
            <p className="mb-2">Your transaction has been confirmed.</p>
            <a
              href={`https://sepolia.basescan.org/tx/${data}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              View
            </a>
          </div>
        ),
      });
      refetchDogeBalance();
      refetchMemeTokenBalance();
      refetchAmount();
    },
  });

  const handleTrade = async () => {
    // let amountOut;
    // if (tradeData.isBuy) {
    //   const buyAmountOut = await getBuyAmountOut({
    //     token: "0x650b89f5e67927fc9081F211B2a2fAd9487D1A69",
    //     amountIn: parseUnits(tradeData.amount, 18),
    //   });
    //   amountOut = buyAmountOut[0];
    // }
    // if (!tradeData.isBuy) {
    //   const sellAmountOut = await getSellAmountOut({
    //     token: "0x650b89f5e67927fc9081F211B2a2fAd9487D1A69",
    //     amountIn: parseUnits(tradeData.amount, 18),
    //   });
    //   amountOut = sellAmountOut[0];
    // }
    if (amountOut?.length === 0) {
      console.log();
    }
    await treadeAsync({
      token: tokenInfo?.tokenAddress as Address,
      amount: parseUnits(tradeData.amount, 18),
      isBuy: tradeData.isBuy,
      amountOutMinimum: (amountOut![0] * (100n - defaultSlippage)) / 100n,
    });
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
        <TokenLogoSwitch
          isBuy={tradeData.isBuy}
          dogeImage="/images/icon_doge.svg"
          tokenImage={tokenInfo?.image ?? ""}
          symbol={tokenInfo?.symbol ?? ""}
        />
      </div>
      {tradeData.isBuy ? (
        <div className="flex items-center gap-3 my-4">
          {["10", "100", "1000"].map((value) => {
            return (
              <div
                key={value}
                className="flex items-center p-2 bg-dayBg3 gap-1 cursor-pointer"
                onClick={() => {
                  setTradeData((state) => ({ ...state, amount: value }));
                }}
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
          {[25, 50, 75, 100].map((value) => {
            return (
              <div
                key={value}
                className="flex items-center justify-center p-2 bg-dayBg3 gap-1 cursor-pointer"
                onClick={() => {
                  if (!memeTokenBalance) return;
                  const valueC = formatUnits(
                    (memeTokenBalance * BigInt(value)) / 100n,
                    18
                  );

                  handleAmountChange(valueC.toString());
                }}
              >
                <span className="text-sm">{value}%</span>
              </div>
            );
          })}
        </div>
      )}
      {buyAmountOutUI && amountOut && (
        <div className="text-dayT1">
          <p className="font-semibold text-20 ">
            {Number(formatUnits(amountOut[0], 18)).toFixed(6)}{" "}
            {tokenInfo?.symbol}
          </p>
          <p className="text-xs">$11.12</p>
        </div>
      )}
      {sellAmountOutUI && amountOut && (
        <div className="text-dayT1">
          <p className="font-semibold text-20 ">
            {Number(formatUnits(amountOut[0], 18)).toFixed(6)} Doge
          </p>
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
          key="trade"
          onClick={() => handleTrade()}
          disabled={!isEfficientBalance}
          variant={
            !isEfficientBalance
              ? "tradeDisabled"
              : tradeData.isBuy
              ? "green"
              : "red"
          }
          className={`trade-button py-5 ${
            isTradePending ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {isTradePending ? (
            <div className="flex items-center gap-2 ">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="text-white [-webkit-text-stroke:1.5px_#12122A] [text-stroke:1.5px_#12122A]  font-WendyOne text-xl leading-[140%] tracking-wide capitalize">
                Trading...
              </span>
            </div>
          ) : (
            <>
              <img src="/images/dage_trade_b_i.png" alt="" />
              <span className="text-white [-webkit-text-stroke:1.5px_#12122A] [text-stroke:1.5px_#12122A] font-WendyOne text-xl leading-[140%] tracking-wide capitalize">
                {isEfficientBalance ? "Trade" : "Insufficient balance"}
              </span>
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={() => setShowModal(true)}
          key="connectWallet"
          className={`w-full rounded-sm py-5 bg-[linear-gradient(to_bottom,#626286_-9.05%,#34344B_51.88%)]`}
        >
          <img src="/images/wallet.svg" alt="" />
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
