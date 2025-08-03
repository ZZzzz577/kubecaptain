import type { ThemeConfig } from "antd";
import { createContext } from "react";

interface ThemeContextType {
    currentTheme: ThemeConfig;
    toggleTheme: () => void;
    isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
    currentTheme: {},
    toggleTheme: () => {},
    isDarkMode: false,
});
