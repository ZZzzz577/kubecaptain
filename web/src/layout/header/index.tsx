import { Flex, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import MenuFoldToggler from "@/layout/header/components/MenuFoldToggler.tsx";
import Breadcrumb from "@/layout/header/components/Breadcrumb.tsx";
import FullScreenToggler from "@/layout/header/components/FullScreenToggler.tsx";
import ThemeToggler from "@/layout/header/components/ThemeToggler.tsx";
import LocalesToggler from "@/layout/header/components/LocalesToggler.tsx";

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
