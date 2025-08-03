import { Space } from "antd";
import AppDeleteButton from "@/views/app/detail/components/AppDeleteButton.tsx";

export default function AppDetailExtra(props: { appName?: string }) {
    const { appName } = props;
    return (
        <Space>
            <AppDeleteButton name={appName} />
        </Space>
    );
}
