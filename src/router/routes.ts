import { lazy, type ComponentType } from "react";

export interface Route {
  path: string;
  Component: ComponentType;
  exact?: boolean;
  children?: Route[];
}

const HomePage = lazy(() => import("@/pages/home"));
const CreatePage = lazy(() => import("@/pages/create"));
const TokenDetailPage = lazy(() => import("@/pages/TokenDetailPage"));

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
    path: "/token/:address",
    Component: TokenDetailPage,
    exact: true,
  },
  {
    path: "/create",
    Component: CreatePage,
    exact: true,
  },
];
