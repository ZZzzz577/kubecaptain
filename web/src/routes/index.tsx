import type { ReactNode } from "react";
import type { RouteObject } from "react-router";
import { Home } from "@/routes/home.tsx";
import { Application } from "@/routes/app.tsx";

interface RouteMenuConfig {
    icon?: ReactNode;
}

export type Route = RouteObject & {
    name?: ReactNode;
    menu?: RouteMenuConfig;
    children?: Route[];
};

const router: Route[] = [
    Home(),
    Application(),
];
export default router;