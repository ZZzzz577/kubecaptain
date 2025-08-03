import type { Route } from "@/routes/index.tsx";
import { HomeOutlined } from "@ant-design/icons";
import AppLayout from "@/layout";
import { Trans } from "@lingui/react/macro";
import DockerfileEditor from "@/components/editor/dockerfile/DockerfileEditor.tsx";

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
                element: <DockerfileEditor />,
            },
        ],
    };
};
