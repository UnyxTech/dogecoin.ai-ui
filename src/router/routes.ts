import type { ComponentType } from "react";
import HomePage from "@/pages/home";
import TokenDetailPage from "@/pages/TokenDetailPage";

export interface Route {
  path: string;
  Component: ComponentType;
  exact?: boolean;
  children?: Route[];
}

export const routes: Route[] = [
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/home",
    Component: HomePage,
    exact: true,
  },
  {
    path: "/token/:address", // 使用动态路由参数
    Component: TokenDetailPage,
    exact: true,
  },
];
