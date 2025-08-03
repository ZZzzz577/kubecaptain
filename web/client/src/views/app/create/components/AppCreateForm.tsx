import { Button, Form, Input, notification, Select } from "antd";
import { useLingui } from "@lingui/react/macro";
import type { KubecaptainApiV1AppApp } from "@/generate";
import TextArea from "antd/es/input/TextArea";
import { appApi } from "@/apis";
import { useRequest } from "ahooks";
import { useNavigate } from "react-router";

export default function AppCreateForm() {
    const { t } = useLingui();
    const navigate = useNavigate();
    const [notify, notifyContext] = notification.useNotification();
    const { loading, run } = useRequest(appApi.appServiceCreate.bind(appApi), {
        manual: true,
        onSuccess: () => {
            notify.success({
                message: t`create application success`,
                description: t`You are about to jump to the application details page`,
                duration: 2,
                showProgress: true,
                pauseOnHover: false,
            });
            setTimeout(() => {
                navigate("/app");
            }, 2000);
        },
        onError: (err) => {
            notify.error({
                message: t`create application error`,
                description: err.message,
            });
        },
    });

    const { Item } = Form;
    const [form] = Form.useForm<KubecaptainApiV1AppApp>();
    const onFinish = (values: KubecaptainApiV1AppApp) => {
        run({
            kubecaptainApiV1AppApp: values,
        });
    };

    return (
        <>
            {notifyContext}
            <Form
                className={"flex flex-col"}
                form={form}
                labelWrap
                labelCol={{ style: { width: 100 } }}
                wrapperCol={{ style: { marginLeft: 20 } }}
                onFinish={onFinish}
            >
                <Item
                    className={"w-full max-w-200"}
                    label={t`name`}
                    name={"name"}
                    rules={[
                        {
                            required: true,
                            pattern: /^[a-z]([a-z0-9-]*[a-z0-9])?$/,
                            max: 64,
                        },
                    ]}
                >
                    <Input />
                </Item>
                <Item
                    className={"w-full max-w-200"}
                    label={t`users`}
                    name={"users"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select mode={"tags"} open={false} suffixIcon={null} />
                </Item>
                <Item
                    className={"w-full max-w-300"}
                    label={t`description`}
                    name={"description"}
                    rules={[
                        {
                            required: false,
                            max: 512,
                        },
                    ]}
                >
                    <TextArea autoSize={{ minRows: 6 }} />
                </Item>
                <Item wrapperCol={{ style: { marginLeft: 120 } }}>
                    <Button type={"primary"} htmlType={"submit"} loading={loading}>{t`create`}</Button>
                </Item>
            </Form>
        </>
    );
}
