import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router";

export default function AppContent() {
    return (
        <Content className={"m-3"}>
            <Outlet />
        </Content>
    );
}
