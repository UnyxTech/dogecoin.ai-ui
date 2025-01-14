import { useVirtualizer } from "@tanstack/react-virtual";

const PostContent = () => {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => document.querySelector("#scroll-container"),
    estimateSize: () => 50,
    overscan: 5,
  });

  return (
    <div id="scroll-container" style={{ height: "400px", overflow: "auto" }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
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
