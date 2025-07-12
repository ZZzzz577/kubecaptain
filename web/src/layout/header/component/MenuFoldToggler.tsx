import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

interface MenuFoldTogglerProps {
    collapsed: boolean;
    triggerCollapsed: () => void;
}

export default function MenuFoldToggler({ collapsed, triggerCollapsed }: MenuFoldTogglerProps) {
    return collapsed ? (
        <MenuUnfoldOutlined onClick={triggerCollapsed} className={"text-xl"} />
    ) : (
        <MenuFoldOutlined onClick={triggerCollapsed} className={"text-xl"} />
    );
}
