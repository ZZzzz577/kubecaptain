import { Button, Descriptions, type DescriptionsProps, Tag } from "antd";
import { useLingui } from "@lingui/react/macro";
import type { KubecaptainApiV1AppApp } from "@/generate";
import { useNavigate, useParams } from "react-router";

export default function AppOverviewDescription(props: { app?: KubecaptainApiV1AppApp }) {
    const { app } = props;
    const { t } = useLingui();
    const navigate = useNavigate();
    const { name } = useParams();

    const items: DescriptionsProps["items"] = [
        {
            key: "name",
            label: t`name`,
            children: app?.name,
        },
        {
            key: "users",
            label: t`users`,
            children: app?.users?.map((user) => <Tag color={"blue"} key={user} children={user} />),
        },
        {
            key: "description",
            label: t`description`,
            children: app?.description,
        },
        {
            key: "createdAt",
            label: t`create time`,
            children: app?.createdAt?.toLocaleString(),
        },
    ];
    return (
        <Descriptions
            title={t`basic info`}
            extra={<Button type={"primary"} ghost onClick={() => navigate(`/app/${name}/edit`)}>{t`edit`}</Button>}
            column={1}
            bordered
            styles={{
                label: { width: 120 },
            }}
            items={items}
        />
    );
}
