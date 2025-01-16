import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

interface CreateAgentModalProps {
  open: boolean;
  onClose: () => void;
  ticker: string;
}

export const CreateAgentModal = ({
  open,
  onClose,
  ticker,
}: CreateAgentModalProps) => {
  const [amount, setAmount] = useState<string>("");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[690px] p-5 rounded-md shadow-lg gap-6">
        <div className="flex flex-col gap-2 border-b-[1px] border-border pb-2">
          <div className="text-24 font-SwitzerMedium">
            Choose the amount of ${ticker} you want to buy
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
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="text-second text-14">
            You will receive 393 ${ticker}( 0% )
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
                  <p>Creation requires a fee of 3 $DOGE.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-gray p-[14px] rounded-[2px] border-[0.5px] border-border flex flex-col gap-2">
            <FeeItem title="Agent creation fee" value="100" />
            <FeeItem title="Your initial buy" value="0" />
            <div className="flex justify-end">
              <div className="flex items-center gap-3 rounded-full bg-white px-3 py-[6px] text-second text-14">
                <span>0 ( 100% )</span>
                <img className="w-[20px]" src="/images/icon_doge2.svg" alt="" />
              </div>
            </div>
            <FeeItem
              classname="text-first font-SwitzerMedium"
              title="Total"
              value="100"
            />
          </div>
        </div>
        <Button
          className="mx-[51px]"
          onClick={() => {
            toast({
              title: "Agent successfully created !",
              variant: "default",
            });
            onClose();
          }}
          variant="yellow"
          disabled={!amount}
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
    <div
      className={cn(
        "text-second text-14 flex items-center justify-between py-3 pr-3",
        classname
      )}
    >
      <span>{title}</span>
      <div className="flex items-center gap-3">
        <span>{value}</span>
        <img className="w-[20px]" src="/images/icon_doge2.svg" alt="" />
      </div>
    </div>
  );
};
