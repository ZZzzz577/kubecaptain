import type { Route } from "@/routes/index.tsx";
import { HomeOutlined } from "@ant-design/icons";
import AppLayout from "@/layout";
import { Trans } from "@lingui/react/macro";

export const Home = (): Route => {
    return {
        path: "/",
        element: <AppLayout />,
        name: <Trans>home</Trans>,
        menu: {
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
