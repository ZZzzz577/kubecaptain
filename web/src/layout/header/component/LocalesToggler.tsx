import { useContext } from "react";
import { LocalesContext } from "@/component/locales/context.ts";
import { Chinese, English } from "@icon-park/react";

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