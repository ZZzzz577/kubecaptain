import { type ReactNode, useEffect, useState } from "react";
import { getBrowserLanguage, type Locales, LocalesContext } from "./context.ts";
import { i18n } from "@lingui/core";
import { messages as zh } from "@/locales/zh/messages.ts";
import { messages as en } from "@/locales/en/messages.ts";
import { I18nProvider } from "@lingui/react";

i18n.load("zh", zh);
i18n.load("en", en);
const language = getBrowserLanguage();
i18n.activate(language);

export default function LocalesProvider(props: { children: ReactNode }) {
    const { children } = props;

    const [locales, setLocales] = useState<Locales>(language);
    useEffect(() => {
        i18n.activate(locales);
    }, [locales]);

    return (
        <LocalesContext.Provider value={{ locales, setLocales }}>
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </LocalesContext.Provider>
    );
}