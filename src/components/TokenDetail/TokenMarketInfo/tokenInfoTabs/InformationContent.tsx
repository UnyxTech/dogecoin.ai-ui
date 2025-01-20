import AdaptiveBalance from "@/components/adaptiveBalance";
import { Separator } from "@/components/ui/separator";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/utils";
import dayjs from "dayjs";
import { useState } from "react";
import { useParams } from "react-router-dom";
const Title = ({ text, className }: { text: string; className?: string }) => (
  <h1 className={cn("font-SwitzerBold text-xl", className)}>{text}</h1>
);
const Description = ({
  text,
  slice = 200,
}: {
  text: string;
  slice?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > slice;
  const truncatedText = shouldTruncate ? text.slice(0, slice) + "..." : text;
  return (
    <div>
      <Title text="Description" className="mb-3" />
      <div>
        <p className="text-dayT2 text-base">
          {isExpanded ? text : truncatedText}
        </p>
        {shouldTruncate && (
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-dayT1 font-medium"
          >
            {isExpanded ? "Read less" : "Read more"}
          </span>
        )}
      </div>
    </div>
  );
};

interface SocialItemProps {
  icon: string;
  label: string;
  link: string;
}
const SocialItem = ({ icon, label, link }: SocialItemProps) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-dayBg3 rounded-lg pr-2 overflow-hidden hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-2 bg-dayBg3 rounded-lg pr-2 overflow-hidden">
        <div className="w-12 h-12 bg-black flex justify-center items-center">
          <img src={icon} alt="" width={24} height={24} />
        </div>
        <span className="text-dayT1">{label}</span>
      </div>
    </a>
  );
};
const InformationContent = () => {
  const { characterId } = useParams();
  const { data: tokenInfo } = useAgentInfo(characterId!);
  return (
    <div className="flex flex-col gap-14 pb-10">
      <div>
        <Title text={`${tokenInfo?.symbol} market info`} className="mb-5" />
        <div className="flex gap-2 ">
          <div className="flex-1 py-1 px-4 bg-[#FAFAFD]">
            <div className="flex justify-between items-center py-4">
              <span className="text-dayT3">Market cap(FDV)</span>
              <AdaptiveBalance
                balance={tokenInfo?.marketCap.toString() ?? ""}
                prefix="$"
              />
            </div>
            <Separator />
            <div className="flex justify-between items-center py-4">
              <span className="text-dayT3">24 hours change</span>
              <AdaptiveBalance
                balance={tokenInfo?.price24Change ?? ""}
                suffix=" %"
              />
              {/* <span className="text-dayT1">{tokenInfo?.marketCap ?? 0}%</span> */}
            </div>
            <Separator />
            <div className="flex justify-between items-center py-4">
              <span className="text-dayT3">Total value locked</span>
              <AdaptiveBalance
                balance={tokenInfo?.totalLocked ?? ""}
                prefix="$"
              />
            </div>
          </div>
          <div className="flex-1 py-1 px-4 bg-[#FAFAFD]">
            <div className="flex justify-between items-center py-4">
              <span className="text-dayT3">Holders count</span>
              <span className="text-dayT1">
                {formatCompactNumber(Number(tokenInfo?.holder ?? 0), 0)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-4">
              <span className="text-dayT3">24 hours volume</span>
              <AdaptiveBalance
                balance={tokenInfo?.volume24h ?? ""}
                prefix="$"
              />
            </div>
            <Separator />
            <div className="flex justify-between items-center py-4">
              <span className="text-dayT3">Created at</span>
              <span className="text-dayT1">
                {dayjs(tokenInfo?.agentCreatedTime).format("YYYY-MM-DD HH:mm")}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Description */}
      <Description text={tokenInfo?.description ?? "--"} slice={200} />
      {/* Social links */}
      <div>
        <Title text="Social links" className="mb-5" />
        <div className="flex items-center gap-4">
          {tokenInfo?.twitter && (
            <SocialItem
              icon="/public/images/x.svg"
              label="Twitter"
              link={tokenInfo?.twitter}
            />
          )}
          {tokenInfo?.telegram && (
            <SocialItem
              icon="/public/images/tg.svg"
              label="Telegram"
              link={tokenInfo?.telegram}
            />
          )}
          {tokenInfo?.youtube && (
            <SocialItem
              icon="/public/images/youtube.svg"
              label="Youtube"
              link={tokenInfo?.youtube}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InformationContent;
