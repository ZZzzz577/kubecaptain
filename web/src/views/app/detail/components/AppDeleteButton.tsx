import { useRequest } from "ahooks";
import { appApi } from "@/apis";
import { useLingui } from "@lingui/react/macro";
import { Button, notification } from "antd";
import { useNavigate } from "react-router";
import { useCallback } from "react";

export default function AppDeleteButton(props: { name?: string }) {
    const { name } = props;
    const { t } = useLingui();
    const [notify, notifyContext] = notification.useNotification();
    const navigate = useNavigate();
    const { loading, run: deleteApp } = useRequest(appApi.appServiceDelete.bind(appApi), {
        manual: true,
        onSuccess: () => {
            notify.success({
                message: t`delete application success`,
                description: t`You are about to jump to the application details page`,
            });
            setTimeout(() => {
                navigate("/app");
            }, 1000);
        },
        onError: (error) => {
            console.log(error);
            notify.error({
                message: t`delete application failed`,
                description: error.message,
            });
        },
    });
    const deleteAppHandler = useCallback(() => {
        if (name) {
            deleteApp({ name });
        }
    }, [name, deleteApp]);
    return (
        <>
            {notifyContext}
            <Button type="primary" danger loading={loading} onClick={deleteAppHandler}>{t`delete`}</Button>
        </>
    );
}