import { Button, Form, notification, Select, Space } from "antd";
import { useLingui } from "@lingui/react/macro";
import type { KubecaptainApiV1AppApp } from "@/generate";
import TextArea from "antd/es/input/TextArea";
import { appApi } from "@/apis";
import { useRequest } from "ahooks";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";

export default function AppEditForm(props: { app?: KubecaptainApiV1AppApp }) {
    const { t } = useLingui();
    const { app } = props;
    const { name } = useParams();
    const navigate = useNavigate();
    const [notify, notifyContext] = notification.useNotification();
    const { loading, run } = useRequest(appApi.appServiceUpdate.bind(appApi), {
        manual: true,
        onSuccess: () => {
            notify.success({
                message: t`edit application success`,
            });
            setTimeout(() => {
                navigate(`/app/${name}`);
            }, 1000);
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
    useEffect(() => {
        if (app) {
            form.setFieldsValue(app);
        }
    }, [app, form]);
    const onFinish = (values: KubecaptainApiV1AppApp) => {
        if (name) {
            run({
                appName: name,
                kubecaptainApiV1AppApp: values,
            });
        }
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
                <Item className={"w-full max-w-200"} label={t`name`}>
                    {name}
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
                    <Space>
                        <Button type={"primary"} htmlType={"submit"} loading={loading}>{t`save`}</Button>
                        <Button onClick={() => navigate(`/app/${name}`)}>{t`cancel`}</Button>
                    </Space>
                </Item>
            </Form>
        </>
    );
}
