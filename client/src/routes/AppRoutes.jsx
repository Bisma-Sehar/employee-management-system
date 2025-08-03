import { createBrowserRouter } from "react-router-dom";
import { EmployeeRoutes } from "./employeeroutes.jsx"
import { HRRoutes } from "./HRroutes.jsx";
import { NotFound } from "../pages/common/NotFound.jsx";

export const router = createBrowserRouter([
    ...EmployeeRoutes,
    ...HRRoutes,
    // Catch-all route for 404 pages - must be last
    {
        path: "*",
        element: <NotFound />
    }
],
    {
        future: {
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionStatusRevalidation: true,
            v7_startTransition: true,
            v7_skipActionErrorRevalidation: true,
        }
    }
)








