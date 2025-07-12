import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "@/router";
import ThemeProvider from "@/layout/component/theme/provider.tsx";

function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={createBrowserRouter(routes)} />
        </ThemeProvider>
    );
}

export default App;
