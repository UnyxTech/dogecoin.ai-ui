import { useEffect, useState } from "react";
import { Masonry } from "masonic";
import cats from "./cats";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import PostCard from "./PostCard";

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
    <main className="w-full h-[600px]">
      <div className="w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Masonry
          items={items}
          columnGutter={8}
          columnWidth={150}
          overscanBy={3}
          render={(props) => (
            <PostCard
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

export default PostContent;
