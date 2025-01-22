import RandomAvatar from "@/components/RandomAvatar";
import { Heart } from "lucide-react";

interface CardProps {
  data: {
    id: number;
    name: string;
    src: string;
  };
  onImageClick?: () => void;
}

const PostCard = ({ data: { src }, onImageClick }: CardProps) => (
  <div className="group mb-2 bg-gray-800 w-full min-h-[100px] transition-transform duration-200 hover:shadow-lg">
    <img
      className="w-full block cursor-pointer"
      alt="kitty"
      src={src}
      onClick={onImageClick}
    />
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2 text-dayT3">
        {/* <img src="/images/icon_doge.svg" alt="" /> */}
        <RandomAvatar address={"0xaa"} bgColor="rgba(242, 31, 127, 0.8)" />
        <span>0xaa</span>
      </div>
      <div className="flex items-center text-dayT3">
        <Heart size={16} />
        <span>13</span>
      </div>
    </div>
  </div>
);
export default PostCard;
