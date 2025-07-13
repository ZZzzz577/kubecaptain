import { useFullscreen } from "ahooks";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

export default function FullScreenToggler() {
    const [isFullscreen, { enterFullscreen, exitFullscreen }] = useFullscreen(document.body);
    return isFullscreen ? (
        <FullscreenExitOutlined className={"text-xl"} onClick={exitFullscreen} />
    ) : (
        <FullscreenOutlined className={"text-xl"} onClick={enterFullscreen} />
    );
}
