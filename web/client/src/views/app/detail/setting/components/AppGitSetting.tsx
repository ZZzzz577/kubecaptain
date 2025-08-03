import { Descriptions, type DescriptionsProps } from "antd";
import { useLingui } from "@lingui/react/macro";

export default function AppGitSetting(props: { gitUrl?: string }) {
    const { t } = useLingui();
    const { gitUrl } = props;
    const items: DescriptionsProps["items"] = [
        {
            label: t`url`,
            children: gitUrl,
        },
    ];
    return (
        <Descriptions
            title={t`git setting`}
            bordered
            items={items}
            styles={{
                label: { width: 120 },
            }}
        />
    );
}
