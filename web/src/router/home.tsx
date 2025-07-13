import type { Route } from "@/router/index.tsx";
import { HomeOutlined } from "@ant-design/icons";
import AppLayout from "@/layout";
import { Trans } from "@lingui/react/macro";

export const Home = (): Route => {
    return {
        path: "/",
        element: <AppLayout />,
        menu: {
            label: <Trans>Home</Trans>,
            icon: <HomeOutlined />,
        },
        children: [
            {
                path: "",
                element: <div>home</div>,
            },
        ],
    };
};
