import { useContext, useState } from "react";
import { ConfigProvider, Layout } from "antd";
import AppSider from "@/layout/sider";
import AppHeader from "@/layout/header";
import AppContent from "@/layout/content";
import { ThemeContext } from "@/component/theme/context.ts";

export default function AppLayout() {
    const [siderCollapsed, setSiderCollapsed] = useState(false);
    const toggleSiderCollapsed = () => {
        setSiderCollapsed((prev) => !prev);
    };
    const { currentTheme } = useContext(ThemeContext);
    return (
        <ConfigProvider theme={currentTheme}>
            <Layout className={"min-h-screen"}>
                <AppSider collapsed={siderCollapsed} />
                <Layout>
                    <AppHeader collapsed={siderCollapsed} triggerCollapsed={toggleSiderCollapsed} />
                    <AppContent />
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
