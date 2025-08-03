import { useParams } from "react-router";
import { useRequest } from "ahooks";
import { appCISettingApi } from "@/apis";
import { useLingui } from "@lingui/react/macro";
import { notification, Spin } from "antd";
import AppGitSetting from "@/views/app/detail/setting/components/AppGitSetting.tsx";

export default function AppDetailBuildSetting() {
    const { name } = useParams();
    const { t } = useLingui();
    const [notify, notifyContext] = notification.useNotification();
    const { loading, data: CISetting } = useRequest(appCISettingApi.appCISettingServiceGet.bind(appCISettingApi), {
        defaultParams: [{ name: name as string }],
        onError: (err) => {
            notify.error({
                message: t`get application ci setting error`,
                description: err.message,
            });
        },
    });
    return (
        <Spin spinning={loading}>
            {notifyContext}
            <AppGitSetting gitUrl={CISetting?.gitUrl} />
        </Spin>
    );
}
