import { Link, matchRoutes, useLocation } from "react-router";
import routes, { type Route } from "@/router";
import { Breadcrumb as BreadCrumb, type BreadcrumbProps } from "antd";

export default function Breadcrumb() {
    const { pathname } = useLocation();
    const matchList = matchRoutes(routes, pathname) ?? [];
    const items: BreadcrumbProps["items"] = matchList
        .filter((item) => !!item.route.menu)
        .map((item) => {
            const route = item.route;
            const menu = route.menu;
            const children = route.children?.filter((child: Route) => !!child.menu);
            if (children?.length) {
                return {
                    title: (
                        <>
                            {menu?.icon}
                            <span>{menu?.label}</span>
                        </>
                    ),
                    menu: {
                        items: children.map((child) => ({
                            key: child.path,
                            label: child.menu?.label,
                        })),
                    },
                };
            }
            return {
                title: (
                    <Link to={route.path ?? ""} className={"text-inherit p-0"}>
                        {menu?.icon}
                        <span className={"ml-1"}>{menu?.label}</span>
                    </Link>
                ),
            };
        });
    return <BreadCrumb items={items} />;
}
