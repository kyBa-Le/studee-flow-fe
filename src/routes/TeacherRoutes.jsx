import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { TeacherHome } from "../pages/teacher/Home/TeacherHome";

const teacherRoutes = [
    { path: '/teacher/home', element: <TeacherHome /> },
];

export function TeacherRoutes() {
    return teacherRoutes.map(({ path, element }) => (
        <Route
            key={path}
            path={path}
            element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    {element}
                </ProtectedRoute>
            }
        />
    ));
}