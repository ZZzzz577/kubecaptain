import { notification, Spin } from "antd";
import { useLingui } from "@lingui/react/macro";
import { useRequest } from "ahooks";
import { appApi } from "@/apis";
import { useParams } from "react-router";
import AppOverviewDescription from "@/views/app/detail/overview/components/AppOverviewDescription.tsx";

export default function AppDetailOverview() {
    const { t } = useLingui();
    const { name } = useParams();
    const [notify, notifyContext] = notification.useNotification();

    const { data: app, loading } = useRequest(appApi.appServiceGet.bind(appApi), {
        defaultParams: [{ name: name as string }],
        onError: (err) => {
            notify.error({
                message: t`get application detail error`,
                description: err.message,
            });
        },
    });

    return (
        <Spin spinning={loading}>
            {notifyContext}
            <AppOverviewDescription app={app} />
        </Spin>
    );
}