import { useContext, useState } from "react";
import { ConfigProvider, Layout } from "antd";
import AppSider from "@/layout/sider";
import AppHeader from "@/layout/header";
import AppContent from "@/layout/content";
import { ThemeContext } from "@/components/theme/context.ts";
import { LocalesContext } from "@/components/locales/context.ts";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import "dayjs/locale/zh-cn";

export default function AppLayout() {
    const [siderCollapsed, setSiderCollapsed] = useState(false);
    const toggleSiderCollapsed = () => {
        setSiderCollapsed((prev) => !prev);
    };
    const { currentTheme } = useContext(ThemeContext);
    const { locales } = useContext(LocalesContext);
    return (
        <ConfigProvider theme={currentTheme} locale={locales === "zh" ? zhCN : enUS}>
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