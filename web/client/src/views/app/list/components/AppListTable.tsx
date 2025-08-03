import { appApi } from "@/apis";
import { notification, Table, Tag } from "antd";
import { useRequest } from "ahooks";
import { useLingui } from "@lingui/react/macro";
import type { ColumnsType } from "antd/es/table";
import type { KubecaptainApiV1AppApp } from "@/generate";
import { Link } from "react-router";

export default function AppListTable() {
    const { t } = useLingui();
    const [notify, notifyContext] = notification.useNotification();
    const { loading, data } = useRequest(appApi.appServiceList.bind(appApi), {
        onError: (err) => {
            notify.error({
                message: t`list app error`,
                description: err.message,
            });
        },
    });
    const columns: ColumnsType<KubecaptainApiV1AppApp> = [
        {
            title: t`name`,
            dataIndex: "name",
            key: "name",
            render: (name: string) => <Link to={`/app/${name}`}>{name}</Link>,
        },
        {
            title: t`description`,
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: t`users`,
            dataIndex: "users",
            key: "users",
            render: (users: string[]) => {
                return users.map((user) => (
                    <Tag color="blue" key={user}>
                        {user}
                    </Tag>
                ));
            },
        },
        {
            title: t`create time`,
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: Date) => {
                return createdAt.toLocaleString();
            },
        },
    ];
    return (
        <>
            {notifyContext}
            <Table
                rowKey={"name"}
                columns={columns}
                loading={loading}
                dataSource={data?.items}
                pagination={{
                    showTotal: (total) => t`Total ${total} items`,
                }}
            />
        </>
    );
}
