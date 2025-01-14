// PostContent.tsx
import { useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Heart } from "lucide-react";

interface Post {
  id: string;
  imageUrl: string;
  creator: {
    name: string;
    avatar: string;
  };
  likes: number;
  isLiked: boolean;
}

const PostContent = () => {
  // 模拟数据
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

  // 创建虚拟滚动器
  const virtualizer = useVirtualizer({
    count: items.length, // 总项目数
    getScrollElement: () =>
      // 获取滚动容器元素
      document.querySelector("#scroll-container"),
    estimateSize: () => 50, // 估计每项的大小（像素）
    overscan: 5, // 可视区域外预渲染的项目数
  });

  return (
    <div id="scroll-container" style={{ height: "400px", overflow: "auto" }}>
      {/* 内容容器，设置总高度 */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {/* 只渲染可见项 */}
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
              height: `${virtualItem.size}px`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostContent;
