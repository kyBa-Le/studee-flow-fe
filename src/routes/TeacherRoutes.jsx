import { Route } from "react-router-dom";
import { TeacherHome } from "../pages/teacher/Home";
import { ProtectedRoute } from "./ProtectedRoutes";

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