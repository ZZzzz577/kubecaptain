import { Card } from "antd";
import AppListTable from "@/views/app/list/components/AppListTable.tsx";
import AppListExtra from "@/views/app/list/components/AppListExtra.tsx";

export default function AppList() {
    return (
        <Card>
            <AppListExtra />
            <AppListTable />
        </Card>
    );
}
