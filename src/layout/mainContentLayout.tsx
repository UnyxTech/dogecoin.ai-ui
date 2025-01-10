import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import NavBar from "./navBar";

interface MainContentLayoutProps {
  children: ReactNode;
}

export const MainContentLayout = ({ children }: MainContentLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    if (location.pathname === "/") {
      navigate("/home");
    }
  }, []);
  return (
    <div className="w-full">
      <NavBar />
      {children}
    </div>
  );
};
