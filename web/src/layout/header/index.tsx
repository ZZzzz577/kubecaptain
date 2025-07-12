import { Flex, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import MenuFoldToggler from "@/layout/header/component/MenuFoldToggler.tsx";
import Breadcrumb from "@/layout/header/component/Breadcrumb.tsx";
import DarkModeToggle from "@/layout/header/component/ThemeToggler.tsx";

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
                   <DarkModeToggle />
                </Flex>
            </Flex>
        </Header>
    );
}
