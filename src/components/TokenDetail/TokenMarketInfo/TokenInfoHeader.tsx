import { GetAgentInfoResponse } from "@/api/types";
import {
  copyToClipboard,
  formatAddressNew,
  getDetailedTimeDiff,
} from "@/utils";
import { Copy, User } from "lucide-react";

interface ExternalLink {
  name: string;
  url: string;
  icon: string;
}

const TokenInfoHeader = ({
  tokenInfo,
}: {
  tokenInfo: GetAgentInfoResponse;
}) => {
  const externalLinks: ExternalLink[] = [
    {
      name: "DexScreener",
      url: `https://dexscreener.com/base/${tokenInfo?.pairAddress}`,
      icon: "/images/dexscreener.svg",
    },
    {
      name: "GeckoTerminal",
      url: `https://www.geckoterminal.com/base/pools/${tokenInfo?.pairAddress}`,
      icon: "/images/gecko.svg",
    },
  ];
  return (
    <div className="flex gap-3">
      {/* Logo  */}
      <div className="flex-shrink-0">
        <img src={tokenInfo?.image} alt="tokenLogo" className="w-32 h-32" />
      </div>
      {/* Info */}
      <div className="flex flex-col justify-between">
        <div>
          {/* name Info */}
          <div className="flex justify-start items-center">
            <span className="text-dayT1 font-Switzer text-[28px] font-semibold leading-[120%]">
              {tokenInfo?.name ?? "--"}
            </span>
            <span className="ml-2 text-dayT3 font-Switzer text-16 font-normal ">
              {tokenInfo?.symbol ?? "--"}
            </span>
          </div>
          {/* Address Info */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center py-1 px-2 justify-center gap-2.5 bg-dayBg3 rounded-sm hover:text-yellow cursor-pointer">
              <span className="text-xs font-medium ">
                {formatAddressNew(tokenInfo?.tokenAddress ?? "--")}
              </span>
              <Copy
                size={14}
                onClick={() => copyToClipboard(tokenInfo?.tokenAddress ?? "--")}
                className=" text-sm"
              />
            </div>
            <div className="flex items-center py-1 px-2 justify-center gap-2.5 bg-dayBg3 rounded-sm">
              <span className="text-xs font-medium ">Productivity</span>
              <User size={14} />
            </div>
            {tokenInfo?.pairAddress &&
              externalLinks.map((link) => {
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-full border border-dayL1 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <img src={link.icon} alt={link.name} className="w-4 h-4" />
                  </a>
                );
              })}
          </div>
        </div>
        <div className="flex items-end ">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-dayT3 text-right font-Switzer font-normal ">
              Created by
            </span>
            <div className="flex items-center gap-1">
              <img
                src="/images/icon_wallet.svg"
                className="w-4 h-4 rounded-full"
                alt="wallet"
              />
              <span className=" text-dayT1">
                {formatAddressNew(tokenInfo?.creator ?? "--", 5, 6)}
              </span>
            </div>
            <span className="text-dayT3">
              {getDetailedTimeDiff(tokenInfo?.agentCreatedTime ?? "--")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoHeader;
