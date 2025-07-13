import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "@/router";
import ThemeProvider from "@/component/theme/provider.tsx";
import LocalesProvider from "@/component/locales/provider.tsx";

function App() {
    return (
        <ThemeProvider>
            <LocalesProvider>
                <RouterProvider router={createBrowserRouter(routes)} />
            </LocalesProvider>
        </ThemeProvider>
    );
}

export default App;
