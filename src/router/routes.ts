import type { ComponentType } from "react";
import HomePage from "@/pages/home";

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
];
