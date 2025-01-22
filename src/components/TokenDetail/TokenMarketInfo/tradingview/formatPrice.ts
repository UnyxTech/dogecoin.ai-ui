export const formatTvPrice = (price: number) => {
  if (typeof price !== "number") {
    return "";
  }
  if (price === 0) {
    return "0.00";
  }
  const parts = Number(price).toFixed(16).toString().split(".");
  if (parts.length === 1) {
    return `${parts[0]}.00`;
  }
  const integerPart = parts[0];
  const fractionalPart = parts[1].replace(/0+$/, "");
  const leadingZeros = fractionalPart.match(/^0+/)?.[0].length ?? 0;
  const significantPart = fractionalPart.slice(leadingZeros);
  if (leadingZeros <= 5) {
    const formattedFraction = fractionalPart.slice(0, 4).padEnd(2, "0");
    return `${integerPart}.${formattedFraction}`;
  }
  const subscripts: { [key: string]: string } = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
  };

  const subscriptZeros = leadingZeros
    .toString()
    .split("")
    .map((digit) => subscripts[digit])
    .join("");

  return `${integerPart}.0${subscriptZeros}${significantPart}`;
};
