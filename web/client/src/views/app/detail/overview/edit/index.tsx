import { useLingui } from "@lingui/react/macro";
import { useParams } from "react-router";
import { notification, Spin } from "antd";
import { useRequest } from "ahooks";
import { appApi } from "@/apis";
import AppEditForm from "@/views/app/detail/overview/edit/components/AppEditForm.tsx";

export default function AppEdit() {
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
            <AppEditForm app={app} />
        </Spin>
    );
}
