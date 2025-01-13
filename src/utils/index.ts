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
