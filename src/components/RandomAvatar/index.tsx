import { cn } from "@/lib/utils";
import { minidenticon } from "minidenticons";
import { useMemo } from "react";
interface RandomAvatarProps {
  address: string;
  bgColor: string;
  saturation?: number;
  lightness?: number;
  className?: string;
}
const RandomAvatar = ({
  address,
  bgColor,
  saturation = 90,
  lightness = 30,
  className,
}: RandomAvatarProps) => {
  const COLOR = [
    "rgba(242, 31, 127, 0.8)",
    "rgba(252, 212, 54, 0.8)",
    "rgba(38, 187, 217, 0.8)",
    "rgba(255, 145, 66, 0.8)",
    "rgba(168, 92, 215, 0.8)",
    "rgba(76, 195, 114, 0.8)",
    "rgba(147, 163, 161, 0.8)",
  ];
  const lastTwoChars = address.slice(-2);
  const decimal = parseInt(lastTwoChars, 16);
  const index = decimal % COLOR.length;
  const defaultBgColor = COLOR[index];
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(address, saturation, lightness)),
    [address, saturation, lightness]
  );

  return (
    <img
      src={svgURI}
      alt={address}
      className={cn("w-6 h-6 rounded-full", className)}
      style={{
        backgroundColor: bgColor ? bgColor : defaultBgColor,
      }}
    />
  );
};
export default RandomAvatar;
