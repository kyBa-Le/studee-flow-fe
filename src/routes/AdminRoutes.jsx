import { Route } from "react-router-dom";
import Home from '../pages/student/Home/Home';
import { ProtectedRoute } from "./ProtectedRoutes";

const adminRoutes = [
    {path: '/admin/teacher-management', element: <Home /> },
]
export function AdminRoutes() {
    return (
        adminRoutes.map(({path, element}) => (
            <Route
                key={path}
                path={path}
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        {element}
                    </ProtectedRoute>
                }
            />
        )
    ));
}