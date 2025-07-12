import { type ReactNode, useState } from "react";
import { theme, type ThemeConfig } from "antd";
import { ThemeContext } from "./context.ts";

export default function ThemeProvider(props: { children: ReactNode }) {
    const { children } = props;
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const currentTheme: ThemeConfig = {
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    };
    const toggleTheme = () => setIsDarkMode((prev) => !prev);
    return <ThemeContext.Provider value={{ currentTheme, toggleTheme, isDarkMode }}>{children}</ThemeContext.Provider>;
}