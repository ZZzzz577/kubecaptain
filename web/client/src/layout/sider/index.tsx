import { theme } from "antd";
import type { CSSProperties } from "react";
import Sider from "antd/es/layout/Sider";
import Menu from "@/layout/sider/components/Menu.tsx";

export default function AppSider(props: { collapsed: boolean }) {
    const { collapsed } = props;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const siderStype: CSSProperties = {
        backgroundColor: colorBgContainer,
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: "thin",
    };
    return (
        <Sider style={siderStype} collapsed={collapsed}>
            <Menu />
        </Sider>
    );
}
