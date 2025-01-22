import { minidenticon } from "minidenticons";
import { useMemo } from "react";
interface RandomAvatarProps {
  address: string;
  bgColor: string;
  saturation?: number;
  lightness?: number;
}
const RandomAvatar = ({
  address,
  bgColor,
  saturation = 90,
  lightness = 30,
}: RandomAvatarProps) => {
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
      className="w-6 h-6 rounded-full"
      style={{
        backgroundColor: bgColor,
      }}
    />
  );
};
export default RandomAvatar;
