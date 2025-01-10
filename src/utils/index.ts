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
}
