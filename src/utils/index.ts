import { KlineTime } from "@/api/types";
import { formatUnits } from "viem";

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr: string) => {
  const upperAfterLastTwo = addr.slice(0, 6) + addr.slice(2);
  return `${upperAfterLastTwo.substring(0, 6)}...${upperAfterLastTwo.substring(
    39
  )}`;
};
/**
 * Format blockchain address display
 * @param address The address to format
 * @param prefixLength Length of prefix to show (including 0x), defaults to 6
 * @param suffixLength Length of suffix to show, defaults to 4
 * @param ellipsis Ellipsis string, defaults to ...
 * @returns Formatted address string
 *
 * @example
 * // Default format (0x1234...5678)
 * formatAddress('0x1234567890abcdef1234567890abcdef12345678')
 *
 * // Custom lengths (0x123456...345678)
 * formatAddress('0x1234567890abcdef1234567890abcdef12345678', 8, 6)
 *
 * // Custom ellipsis (0x1234***5678)
 * formatAddress('0x1234567890abcdef1234567890abcdef12345678', 6, 4, '***')
 */
export const formatAddressNew = (
  address?: string,
  prefixLength = 6,
  suffixLength = 4,
  ellipsis = "..."
): string => {
  if (!address) return "";
  if (address.length < prefixLength + suffixLength) return address;
  if (prefixLength < 2) return address;
  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);
  return `${prefix}${ellipsis}${suffix}`;
};
export const formatTimestamp = (timestamp: number): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
};
export const copyToClipboard = (textToCopy: string | number) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy.toString());
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy.toString();
    textArea.style.position = "absolute";
    textArea.style.opacity = "0";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((res, rej) => {
      if (document.execCommand("copy")) {
        res();
      } else {
        rej();
      }
      textArea.remove();
    });
  }
};
/**
 * Formats a bigint token amount to a human-readable string with specified decimals
 *
 * @param amount The token amount as bigint (e.g., 1000000000000000000n for 1 token)
 * @param decimals The number of decimals for the token (default: 18 for most ERC20 tokens)
 * @param displayDecimals The number of decimal places to show in the formatted string (default: 4)
 * @returns A formatted string representation of the token amount
 *
 * @example
 * // Returns "1.0000"
 * formatTokenAmount(1000000000000000000n)
 *
 * @example
 * // Returns "1.2345"
 * formatTokenAmount(1234500000000000000n)
 *
 * @example
 * // Returns "1.23" (USDC with 6 decimals)
 * formatTokenAmount(1234567n, 6, 2)
 */
export const formatTokenAmount = (
  amount: bigint,
  decimals: number = 18,
  displayDecimals: number = 4
): string => {
  const formatted = formatUnits(amount, decimals);
  return Number(formatted).toFixed(displayDecimals);
};
export const getColorByAgentName = (agentName: string) => {
  switch (agentName) {
    case "Productivity":
      return "bg-first text-white";
    case "Entertainment":
      return "bg-yellow text-first";
    case "Information":
      return "bg-green text-white";
    default:
      return "bg-gray text-first";
  }
};
/**
 * Convert TradingView resolution to API KlineTime type
 * @param resolution - TradingView time interval string
 * @returns KlineTime - API corresponding time interval type
 *
 * @example
 * getKlineType("1")  // returns "one_minute"
 * getKlineType("60") // returns "one_hour"
 * getKlineType("D")  // returns "one_day"
 * getKlineType("W")  // returns "one_week"
 */
export const getKlineType = (resolution: string): KlineTime => {
  switch (resolution) {
    // case "1S":
    //   return "one_second";
    // case "5S":
    //   return "five_second";
    // case "10S":
    //   return "ten_second";
    // case "15S":
    //   return "fifteen_second";
    // case "30S":
    //   return "thirty_second";
    case "1":
      return "one_minute";
    case "5":
      return "five_minute";
    case "15":
      return "fifteen_minute";
    case "30":
      return "thirty_minute";
    case "60":
      return "one_hour";
    case "120":
      return "two_hour";
    case "240":
      return "four_hour";
    case "480":
      return "eight_hour";
    case "720":
      return "twelve_hour";
    case "D":
      return "one_day";
    case "3D":
      return "three_day";
    case "W":
      return "one_week";
    case "M":
      return "one_month";
    default:
      return "one_minute";
  }
};
/**
 * Get interval milliseconds based on TradingView resolution
 * @param resolution - TradingView time interval string
 * @returns number - Interval in milliseconds
 */
export const getIntervalByResolution = (resolution: string): number => {
  switch (resolution) {
    case "1S":
      return 1000; // 1 second
    case "5S":
      return 5 * 1000; // 5 seconds
    case "10S":
      return 10 * 1000; // 10 seconds
    case "15S":
      return 15 * 1000; // 15 seconds
    case "30S":
      return 30 * 1000; // 30 seconds
    case "1":
      return 60 * 1000; // 1 minute
    case "5":
      return 5 * 60 * 1000; // 5 minutes
    case "15":
      return 15 * 60 * 1000; // 15 minutes
    case "30":
      return 30 * 60 * 1000; // 30 minutes
    case "60":
      return 60 * 60 * 1000; // 1 hour
    case "120":
      return 120 * 60 * 1000; // 2 hours
    case "240":
      return 240 * 60 * 1000; // 4 hours
    case "480":
      return 480 * 60 * 1000; // 8 hours
    case "720":
      return 720 * 60 * 1000; // 12 hours
    case "D":
      return 24 * 60 * 60 * 1000; // 1 day
    case "3D":
      return 3 * 24 * 60 * 60 * 1000; // 3 days
    case "W":
      return 7 * 24 * 60 * 60 * 1000; // 1 week
    case "M":
      return 30 * 24 * 60 * 60 * 1000; // 1 month 
    default:
      return 60 * 1000; // default to 1 minute
  }
};
