import { Card } from "antd";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { useLingui } from "@lingui/react/macro";
import type { CardTabListType } from "antd/es/card/Card";
import { useMemo } from "react";
import AppDetailExtra from "@/views/app/detail/components/AppDetailExtra.tsx";

export default function AppDetail() {
    const { name } = useParams();
    const { t } = useLingui();
    const navigate = useNavigate();
    const location = useLocation();
    const defaultActiveTab = useMemo(() => {
        const segments = location.pathname.split("/").filter(Boolean);
        return segments.length > 0 ? segments[segments.length - 1] : "";
    }, [location]);

    const tabList: CardTabListType[] = [
        {
            label: t`overview`,
            key: "",
        },
        {
            label: t`build setting`,
            key: "setting",
        },
    ];
    const handleTabChange = (key: string) => {
        navigate(`/app/${name}/${key}`);
    };

    return (
        <Card
            title={name}
            tabProps={{
                size: "middle",
            }}
            defaultActiveTabKey={defaultActiveTab}
            tabList={tabList}
            onTabChange={handleTabChange}
            extra={<AppDetailExtra appName={name} />}
            styles={{ title: { fontSize: 20, marginBottom: 10 } }}
        >
            <Outlet />
        </Card>
    );
}
