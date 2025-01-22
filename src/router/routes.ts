import { UserDetail } from "@/pages/userDetail";
import { lazy, type ComponentType } from "react";

export interface Route {
  path: string;
  Component: ComponentType;
  exact?: boolean;
  children?: Route[];
}

const HomePage = lazy(() => import("@/pages/home"));
const CreatePage = lazy(() => import("@/pages/create"));
const TokenDetailPage = lazy(
  () => import("@/pages/tokenDetail/TokenDetailPage")
);

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
    path: "/token/:characterId",
    Component: TokenDetailPage,
    exact: true,
  },
  {
    path: "/create",
    Component: CreatePage,
    exact: true,
  },
  {
    path: "/userDetail",
    Component: UserDetail,
    exact: true,
  },
];
