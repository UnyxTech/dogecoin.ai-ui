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
      className="w-full block rounded-t-sm cursor-pointer"
      alt="kitty"
      src={src}
      onClick={onImageClick}
    />
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <img src="/images/icon_doge.svg" alt="" />
        <span>xxxxx</span>
      </div>
      <div className="flex items-center">
        <Heart size={16} />
        <span>13</span>
      </div>
    </div>
  </div>
);
export default PostCard;
