import routes, { type Route } from "@/router";
import { Menu as Menus, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];

function formatPath(path: string): string {
    if (!path || path === "/") return "/";
    const formattedStart = path.startsWith("/") ? path : `/${path}`;
    return formattedStart.endsWith("/") ? formattedStart.slice(0, -1) : formattedStart;
}

const getMenuItems = (routes?: Route[], path?: string): MenuItem[] | undefined => {
    const filterRoutes = routes?.filter((route) => !!route.menu);
    if (!filterRoutes?.length) return undefined;
    return filterRoutes.map((route) => {
        const fullPath = !path ? formatPath(route.path || "") : `${path}${formatPath(route.path || "")}`;
        const menu: MenuItem = {
            key: fullPath,
            label: route.menu?.label,
            icon: route.menu?.icon,
            children: getMenuItems(route.children, fullPath),
        };
        return menu;
    });
};

const getOpenKeys = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    const openKeys: string[] = [];
    let currentPath = "";
    for (const segment of segments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : `/${segment}`;
        openKeys.push(currentPath);
    }
    return openKeys.slice(0, -1);
};

export default function Menu() {
    const { pathname } = useLocation();
    const openKeys = getOpenKeys(pathname);
    const navigate = useNavigate();
    const handleMenuClick: MenuProps["onClick"] = (info) => {
        navigate(info.key);
    };
    const menItems = getMenuItems(routes) ?? [];
    return (
        <Menus
            mode="inline"
            items={menItems}
            defaultSelectedKeys={[pathname]}
            defaultOpenKeys={openKeys}
            onClick={handleMenuClick}
        />
    );
}
