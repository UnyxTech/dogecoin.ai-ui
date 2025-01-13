import * as React from "react";
import { HoverCardContent } from "../hover-card";
interface CustomHoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardContent> {
  showTriangle?: boolean;
}

const WrapperHoverCardConnect = React.forwardRef<
  React.ElementRef<typeof HoverCardContent>,
  CustomHoverCardContentProps
>(({ className, children, ...props }, ref) => (
  <HoverCardContent ref={ref} className={className} {...props}>
    <svg
      className={`absolute top-0 -translate-y-[7px]  translate-x-1/2`}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
    >
      <path d="M6 0L12 8H0L6 0Z" fill="#616184" />
    </svg>
    {children}
  </HoverCardContent>
));

WrapperHoverCardConnect.displayName = "CustomHoverCardContent";

export { WrapperHoverCardConnect };
