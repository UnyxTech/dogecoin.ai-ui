import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { effectiveBalance } from "@/utils";

interface iAdaptiveBalance {
  balance: string;
  prefix?: string;
  suffix?: string;
}
/**
 * Adaptive Balance Display Component
 * @description
 * 1. Handles large numbers: uses k(thousand), m(million), b(billion) suffixes
 * 2. Handles decimal display:
 *    - Uses scientific notation for extremely small numbers, e.g., 0.0¹²1
 *    - Maintains two decimal places for regular numbers
 * 3. Supports prefix addition (e.g., currency symbols)
 *
 * @example
 * // Basic usage
 * <AdaptiveBalance balance="1234.56" />  // Displays: 1.23k
 *
 * // With currency prefix
 * <AdaptiveBalance balance="1234.56" prefix="$" />  // Displays: $1.23k
 *
 * // Extremely small numbers
 * <AdaptiveBalance balance="0.0000000000001" />  //
 */
const AdaptiveBalance = ({
  balance,
  prefix = "",
  suffix = "",
}: iAdaptiveBalance) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isEmpty(balance)) {
      setContent("-");
      return;
    }

    const normalBalance = parseFloat(balance).toFixed(15);
    let formattedBalance = "";
    const parts = normalBalance.split(".");

    if (parts.length === 2 && parts[1].length > 1 && Number(parts[1]) > 0) {
      const zerosMatch = parts[1].match(/^0+/);
      if (zerosMatch && zerosMatch[0].length > 4) {
        const exponent = parts[1].substring(zerosMatch[0].length);
        const significantDigits = exponent.substring(0, 4).replace(/0+$/, "");
        formattedBalance = `${parts[0]}.<span>0<sub>${zerosMatch[0].length}</sub>${significantDigits}</span>`;
      } else {
        formattedBalance = `<span>${effectiveBalance(normalBalance)}</span>`;
      }
    } else {
      formattedBalance = `<span>${effectiveBalance(normalBalance)}</span>`;
    }

    setContent(formattedBalance);
  }, [balance]);

  const createMarkup = (htmlString: string) => ({ __html: htmlString });

  return (
    <span
      dangerouslySetInnerHTML={createMarkup(
        prefix + (content ? content : "0") + suffix
      )}
    />
  );
};

export default AdaptiveBalance;
