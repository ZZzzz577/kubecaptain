import { Flex, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import MenuFoldToggler from "@/layout/header/component/MenuFoldToggler.tsx";
import Breadcrumb from "@/layout/header/component/Breadcrumb.tsx";
import FullScreenToggler from "@/layout/header/component/FullScreenToggler.tsx";
import ThemeToggler from "@/layout/header/component/ThemeToggler.tsx";
import LocalesToggler from "@/layout/header/component/LocalesToggler.tsx";

interface HeaderProps {
    collapsed: boolean;
    triggerCollapsed: () => void;
}

export default function AppHeader({ collapsed, triggerCollapsed }: HeaderProps) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Header style={{ padding: 8, background: colorBgContainer }}>
            <Flex className={"h-full p-4"} justify={"space-between"}>
                <Flex align={"center"} gap={"middle"}>
                    <MenuFoldToggler collapsed={collapsed} triggerCollapsed={triggerCollapsed} />
                    <Breadcrumb />
                </Flex>
                <Flex align={"center"} gap={"middle"}>
                    <FullScreenToggler />
                    <ThemeToggler />
                    <LocalesToggler />
                </Flex>
            </Flex>
        </Header>
    );
}
