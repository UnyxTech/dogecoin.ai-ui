import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { CreateAgentParams, useAIContract } from "@/hooks/useAIContract";
import { cn } from "@/lib/utils";
import { AgentInfo } from "@/types";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import BigNumber from "bignumber.js";
import { formatUnits, parseUnits } from "viem";
import { BASE_TOKEN, createFee, TOTAL_AMOUNT } from "@/constant";
import { debounce } from "lodash";

interface CreateAgentModalProps {
  open: boolean;
  onClose: () => void;
  agentInfo: AgentInfo;
}

export const CreateAgentModal = ({
  open,
  onClose,
  agentInfo,
}: CreateAgentModalProps) => {
  const { createAgent, getBuyAmountOut } = useAIContract();
  const [amount, setAmount] = useState<string>("0");
  const [receiveAmount, setReceiveAmount] = useState<string>("0");
  const handleCreate = async () => {
    try {
      const buyAmount = parseUnits(amount, BASE_TOKEN.decimals);
      const obj: CreateAgentParams = {
        agentId: agentInfo.agentId ?? "",
        symbol: agentInfo.symbol,
        name: agentInfo.agentName,
        buyAmount,
      };
      const hash = await createAgent(obj);
      console.log(hash);
      toast({
        title: "Agent successfully created !",
        variant: "default",
      });
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        title: "created Failed!",
        variant: "destructive",
      });
    }
  };

  const handleChangeAmount = debounce(async (e: any) => {
    const val = e.target.value;
    setAmount(val);
    if (new BigNumber(val).lte(0)) {
      setReceiveAmount("0");
      return;
    }
    const buyAmount = parseUnits(val, BASE_TOKEN.decimals);
    const receive: any = await getBuyAmountOut({
      token: BASE_TOKEN.address,
      amountIn: buyAmount,
    });
    setReceiveAmount(formatUnits(receive[2], BASE_TOKEN.decimals));
  }, 300);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[690px] p-5 rounded-md shadow-lg gap-6">
        <DialogHeader hidden>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 border-b-[1px] border-border pb-2">
          <div className="text-24 font-SwitzerMedium">
            Choose the amount of ${agentInfo.symbol} you want to buy
          </div>
          <div className="text-second text-14">
            It's optional, but buying a small amount of coins can help protect
            your coin from snipers.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-16">Doge</Label>
          <Input
            type="number"
            className="bg-gray border-border border-[0.5px]"
            placeholder="0"
            onChange={handleChangeAmount}
          />
          <div className="text-second text-14">
            You will receive{" "}
            <span className="text-first">
              {receiveAmount} ${agentInfo.symbol} (
              {new BigNumber(receiveAmount)
                .div(new BigNumber(TOTAL_AMOUNT))
                .multipliedBy(100)
                .toFixed(2)}
              %)
            </span>
          </div>
          <div className="text-second text-14 flex items-center gap-2">
            Trading fee
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="border-none">
                  <CircleAlert
                    size={16}
                    className="transform rotate-180 cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent side="right" className="w-[180px]">
                  <p>Creation requires a fee of {createFee} $DOGE.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-gray p-[14px] rounded-[2px] border-[0.5px] border-border flex flex-col gap-2">
            <FeeItem
              title="Agent creation fee"
              value={createFee.toString()}
              classname="text-second"
            />
            <FeeItem
              title="Your initial buy"
              value={amount}
              classname="text-second"
            />
            {/* <div className="flex justify-end">
              <div className="flex items-center gap-3 rounded-full bg-white px-3 py-[6px] text-second text-14">
                <span>0 ( 100% )</span>
                <img className="w-[20px]" src="/images/icon_doge2.svg" alt="" />
              </div>
            </div> */}
            <FeeItem
              classname="text-first font-SwitzerMedium"
              title="Total"
              value={new BigNumber(amount).plus(createFee).toString()}
            />
          </div>
        </div>
        <Button
          className="mx-[51px]"
          onClick={() => {
            handleCreate();
          }}
          variant="yellow"
        >
          🚀 Create agent
        </Button>
      </DialogContent>
    </Dialog>
  );
};

interface IFeeItem {
  title: string;
  value: string;
  classname?: string;
}

const FeeItem: React.FC<IFeeItem> = ({ title, value, classname }) => {
  return (
    <div className="flex items-center justify-between py-3 pr-3">
      <span className={cn("text-second text-14", classname)}>{title}</span>
      <div className="flex items-center gap-3">
        <span className={cn("text-second text-14", classname)}>{value}</span>
        <img className="w-[20px]" src="/images/icon_doge2.svg" alt="" />
      </div>
    </div>
  );
};
