import { useEffect, useState } from "react";
import { Masonry } from "masonic";
import cats from "./cats";
import { Heart, X } from "lucide-react";
import { createPortal } from "react-dom";

const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Cat ${i}`,
    src: randomChoice(cats),
  }));
};

// @ts-expect-error test
const randomChoice = (items) => items[Math.floor(Math.random() * items.length)];

const ImageModal = ({ src, onClose }: { src: string; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt="Enlarged view"
        className="max-h-screen max-w-screen p-4 object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
};

const PostContent = () => {
  const [items] = useState(() => generateItems(50));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="w-full h-[700px]">
      <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Masonry
          items={items}
          columnGutter={8}
          columnWidth={150}
          overscanBy={5}
          render={(props) => (
            <FakeCard
              {...props}
              onImageClick={() => setSelectedImage(props.data.src)}
            />
          )}
        />
      </div>
      {selectedImage && (
        <ImageModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </main>
  );
};

interface CardProps {
  data: {
    id: number;
    name: string;
    src: string;
  };
  onImageClick?: () => void;
}

const FakeCard = ({ data: { src }, onImageClick }: CardProps) => (
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

export default PostContent;
