import type { Route } from "@/routes/index.tsx";
import { AppstoreOutlined } from "@ant-design/icons";
import AppLayout from "@/layout";
import { Trans } from "@lingui/react/macro";
import AppList from "@/views/app/list";
import AppCreate from "@/views/app/create";
import AppDetail from "@/views/app/detail";
import AppDetailOverview from "@/views/app/detail/overview";
import AppDetailBuildSetting from "@/views/app/detail/setting";
import AppEdit from "@/views/app/detail/overview/edit";

export const Application = (): Route => {
    return {
        path: "/app",
        element: <AppLayout />,
        name: <Trans>application management</Trans>,
        menu: {
            icon: <AppstoreOutlined />,
        },
        children: [
            {
                path: "",
                name: <Trans>application</Trans>,
                menu: {},
                element: <AppList />,
            },
            {
                path: ":name",
                name: ":name",
                element: <AppDetail />,
                children: [
                    {
                        path: "",
                        name: <Trans>overview</Trans>,
                        element: <AppDetailOverview />,
                    },
                    {
                        path: "edit",
                        name: <Trans>edit application</Trans>,
                        element: <AppEdit />,
                    },
                    {
                        path: "setting",
                        name: <Trans>build setting</Trans>,
                        element: <AppDetailBuildSetting />,
                    },
                ]
            },
            {
                path: "create",
                name: <Trans>create application</Trans>,
                element: <AppCreate />,
            },

        ],
    };
};