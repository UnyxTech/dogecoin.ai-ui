import React from "react";

const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className="w-full pt-8">
      <div className={`max-w-[1200px] mx-auto ${className}`}>{children}</div>
    </div>
  );
};

export default Container;
