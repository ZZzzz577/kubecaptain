import { Card } from "antd";
import { useLingui } from "@lingui/react/macro";
import AppCreateForm from "@/views/app/create/components/AppCreateForm.tsx";

export default function AppCreate() {
    const { t } = useLingui();
    return (
        <Card title={t`create application`}>
            <AppCreateForm />
        </Card>
    );
}