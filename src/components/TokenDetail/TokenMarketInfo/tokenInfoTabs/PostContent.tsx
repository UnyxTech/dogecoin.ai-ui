import React, { useState } from "react";
import { Masonry } from "masonic";
import cats from "./cats";
import { Heart } from "lucide-react";
// 模拟数据
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Cat ${i}`,
    src: randomChoice(cats),
  }));
};
// @ts-expect-error test
const randomChoice = (items) => items[Math.floor(Math.random() * items.length)];
const PostContent = () => {
  const [items] = useState(() => generateItems(50));

  return (
    <main className="min-h-screen w-full">
      <div className="p-2 w-full max-w-4xl mx-auto">
        <Masonry
          items={items}
          columnGutter={8}
          columnWidth={172}
          overscanBy={5}
          render={FakeCard}
        />
      </div>
    </main>
  );
};

interface CardProps {
  data: {
    id: number;
    name: string;
    src: string;
  };
}

const FakeCard = ({ data: { src } }: CardProps) => (
  <div className="group mb-2 bg-gray-800  w-full min-h-[100px] transition-transform duration-200 hover:shadow-lg ">
    <img className="w-full block rounded-t-sm" alt="kitty" src={src} />
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2 ">
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
