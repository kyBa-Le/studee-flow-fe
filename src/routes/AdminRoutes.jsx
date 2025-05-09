import { Route } from "react-router-dom";
import Home from '../pages/student/Home/Home';
import { CreateStudentsForm } from "../pages/admin/CreateStudentsForm";
import { ProtectedRoute } from "./ProtectedRoutes";
import { StudentManagement } from "../pages/admin/Student/StudentManagement";

const adminRoutes = [
    {path: '/admin/teacher-management', element: <Home /> },
    {path: '/admin/student-management', element: <StudentManagement /> },
    {path: '/admin/create-student-accounts', element: <CreateStudentsForm/>},
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