import { Route } from "react-router-dom";
import { CreateStudentsForm } from "../pages/admin/StudentManagement/CreateStudentsForm";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Dashboard } from "../pages/admin/Dashboard/Dashboard";
import { StudentManagement } from "../pages/admin/StudentManagement/StudentManagement";
import { TeacherManagement } from "../pages/admin/TeacherManagement/TeacherManagement";
import { AdminLayout } from "../components/layouts/MainLayouts/AdminLayout";
import { EditStudentForm } from "../pages/admin/StudentManagement/EditStudentsForm";
import { ClassroomManagement } from "../pages/admin/ClassroomManagement/ClassroomManagement";

const adminRoutes = [
    { path: '/admin/dashboard', element: <Dashboard />, pageTitle: "DASHBOARD" },
    { path: '/admin/teacher-management', element: <TeacherManagement />, pageTitle: "TEACHER MANAGEMENT" },
    { path: '/admin/student-management', element: <StudentManagement />, pageTitle: "STUDENT MANAGEMENT" },
    { path: '/admin/create-student-accounts', element: <CreateStudentsForm />, pageTitle: "STUDENT MANAGEMENT" },
    { path: '/admin/edit-student-accounts', element: <EditStudentForm />, pageTitle: "STUDENT MANAGEMENT" },
    { path: '/admin/classroom-management', element: <ClassroomManagement />, pageTitle: "CLASSROOM MANAGEMENT" },
]
export function AdminRoutes() {
    return (
        adminRoutes.map(({ path, element, pageTitle }) => (
            <Route
                key={path}
                path={path}
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout title={pageTitle}>
                            {element}
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
        )
        ));
}