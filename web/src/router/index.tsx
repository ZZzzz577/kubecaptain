import type { ReactNode } from "react";
import type { RouteObject } from "react-router";
import { Home } from "@/router/home.tsx";

interface RouteMenuConfig {
    label?: ReactNode;
    icon?: ReactNode;
}

export type Route = RouteObject & {
    menu?: RouteMenuConfig;
    children?: Route[];
};

const routes: Route[] = [Home()];
export default routes;
