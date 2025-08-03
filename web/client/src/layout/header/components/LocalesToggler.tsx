import { useContext } from "react";
import { Chinese, English } from "@icon-park/react";
import { LocalesContext } from "@/components/locales/context.ts";

export default function LocalesToggler() {
    const { locales, setLocales } = useContext(LocalesContext);
    return locales === "zh" ? (
        <English
            className={"cursor-pointer"}
            theme="outline"
            size="22"
            strokeWidth={3}
            onClick={() => setLocales("en")}
        />
    ) : (
        <Chinese
            className={"cursor-pointer"}
            theme="outline"
            size="22"
            strokeWidth={3}
            onClick={() => setLocales("zh")}
        />
    );
}
