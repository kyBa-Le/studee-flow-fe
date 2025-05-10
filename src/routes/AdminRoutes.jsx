import { Route } from "react-router-dom";
import Home from '../pages/student/Home/Home';
import { CreateStudentsForm } from "../pages/admin/Student/CreateStudentsForm";
import { ProtectedRoute } from "./ProtectedRoutes";
import { StudentManagement } from "../pages/admin/Student/StudentManagement";
import { TeacherManagement } from "../pages/admin/TeacherManagement/TeacherManagement";
import { AdminLayout } from "../components/layouts/MainLayouts/AdminLayout";

const adminRoutes = [
    { path: '/admin/teacher-management', element: <TeacherManagement /> },
    { path: '/admin/student-management', element: <StudentManagement /> },
    { path: '/admin/create-student-accounts', element: <CreateStudentsForm /> },
]
export function AdminRoutes() {
    return (
        adminRoutes.map(({ path, element }) => (
            <Route
                key={path}
                path={path}
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout>
                            {element}
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
        )
        ));
}