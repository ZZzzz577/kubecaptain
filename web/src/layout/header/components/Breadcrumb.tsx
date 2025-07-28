import { Link, matchRoutes, useLocation, useParams } from "react-router";
import { Breadcrumb as BreadCrumb, type BreadcrumbProps } from "antd";
import router, { type Route } from "@/routes";

export default function Breadcrumb() {
    const { pathname } = useLocation();
    const matchList = matchRoutes(router, pathname) ?? [];
    const params = useParams();
    const items: BreadcrumbProps["items"] = matchList
        .filter((item) => !!item.route.menu || !!item.route.name)
        .map((item) => {
            const route = item.route;
            let routeName = route.name;
            if (typeof routeName === "string" && routeName.startsWith(":")) {
                routeName = params?.[routeName.slice(1)] ?? routeName;
            }
            const menu = route.menu;
            const children = route.children?.filter((child: Route) => !!child.menu);
            if (children?.length) {
                return {
                    title: (
                        <>
                            {menu?.icon}
                            <span>{routeName}</span>
                        </>
                    ),
                    menu: {
                        items: children.map((child) => ({
                            key: child.path,
                            label: child.name,
                        })),
                    },
                };
            }
            return {
                title: (
                    <Link to={route.path ?? ""} className={"text-inherit p-0"}>
                        {menu?.icon}
                        <span className={"ml-1"}>{routeName}</span>
                    </Link>
                ),
            };
        });
    return <BreadCrumb items={items} />;
}