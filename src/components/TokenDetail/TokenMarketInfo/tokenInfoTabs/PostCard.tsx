import { PostItem } from "@/api/types";

interface CardProps {
  data: PostItem;
  onImageClick?: () => void;
}

const PostCard = ({ data, onImageClick }: CardProps) => (
  <div className="group mb-2 bg-gray-800 w-full min-h-[100px] pb-2 font-Switzer">
    <img
      className="w-full block cursor-pointer"
      alt=""
      src={data?.coverImage}
      onClick={onImageClick}
    />
    {/* <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-1 text-dayT3">
        <RandomAvatar
          address={"0xaa"}
          bgColor="rgba(242, 31, 127, 0.8)"
          className="w-5 h-5"
        />
        <span className="text-sm">
          {formatAddressNew(data?.posterAddress, 3, 3)}
        </span>
      </div>
      {data?.liked ? (
        <div className="flex items-center text-[#F21F7F] gap-1">
          <img width={16} height={16} src="/images/like.svg" />
          <span className="text-sm">
            {formatCompactNumber(data?.likedCount, 0)}
          </span>
        </div>
      ) : (
        <div className="flex items-center text-dayT3 gap-1">
          <img width={16} height={16} src="/images/unlike.svg" />
          <span className="text-sm">
            {formatCompactNumber(data?.likedCount, 0)}
          </span>
        </div>
      )}
    </div> */}
  </div>
);
export default PostCard;
