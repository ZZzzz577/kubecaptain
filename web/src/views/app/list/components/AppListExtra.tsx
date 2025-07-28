import { Button, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useLingui } from "@lingui/react/macro";
import { useNavigate } from "react-router";

export default function AppListExtra() {
    const { t } = useLingui();
    const navigate = useNavigate();
    return (
        <Flex className={"!pb-3"} justify={"end"}>
            <Button type={"primary"} icon={<PlusOutlined />} onClick={() => navigate("/app/create")}>
                {t`create application`}
            </Button>
        </Flex>
    );
}