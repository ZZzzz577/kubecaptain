import { createBrowserRouter, RouterProvider } from "react-router";

import ThemeProvider from "@/components/theme/provider.tsx";
import LocalesProvider from "@/components/locales/provider.tsx";
import router from "@/routes";

function App() {
    return (
        <ThemeProvider>
            <LocalesProvider>
                <RouterProvider router={createBrowserRouter(router)} />
            </LocalesProvider>
        </ThemeProvider>
    );
}

export default App;
