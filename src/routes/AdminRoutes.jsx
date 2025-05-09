import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { TeacherManagement } from "../pages/admin/TeacherManagement/TeacherManagement";

const adminRoutes = [
    {path: '/admin/teachers-management', element: < TeacherManagement/> },
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