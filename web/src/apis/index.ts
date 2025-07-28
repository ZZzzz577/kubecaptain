import { AppCISettingServiceApi, AppServiceApi, Configuration } from "@/generate";

const config = new Configuration({
    basePath: "http://localhost:8000",
});

export const appApi = new AppServiceApi(config);
export const appCISettingApi = new AppCISettingServiceApi(config);
