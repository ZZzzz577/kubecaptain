import { createContext } from "react";

export type Locales = "zh" | "en";
export const getBrowserLanguage = (): Locales => {
    const language = navigator.language;
    if (language.toLowerCase() === "zh" || language.toLowerCase() === "ch" || language.toLowerCase() === "zh-cn") {
        return "zh";
    }
    return "en";
};

interface LocalesContextType {
    locales: Locales;
    setLocales: (locale: Locales) => void;
}

export const LocalesContext = createContext<LocalesContextType>({
    locales: getBrowserLanguage(),
    setLocales: () => {},
});
