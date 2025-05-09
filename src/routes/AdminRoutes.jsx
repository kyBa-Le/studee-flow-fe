import { Route } from "react-router-dom";
import Home from '../pages/student/Home/Home';
import { ProtectedRoute } from "./ProtectedRoutes";
import { StudentManagement } from "../pages/admin/Student/StudentManagement";

const adminRoutes = [
    {path: '/admin/teacher-management', element: <Home /> },
    {path: '/admin/student-management', element: <StudentManagement /> },
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