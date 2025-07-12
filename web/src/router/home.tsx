import type { Route } from "@/router/index.tsx";
import { HomeOutlined } from "@ant-design/icons";
import AppLayout from "@/layout";

export const Home = ():Route => {
  return {
      path: "/",
      element: <AppLayout/>,
      menu: {
          label: "Home",
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