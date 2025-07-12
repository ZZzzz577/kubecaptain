import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { ThemeContext } from "@/layout/component/theme/context.ts";

export default function DarkModeToggle() {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    return isDarkMode ? (
        <SunOutlined onClick={toggleTheme} className={"text-xl"} />
    ) : (
        <MoonOutlined onClick={toggleTheme} className={"text-xl"} />
    );
}
