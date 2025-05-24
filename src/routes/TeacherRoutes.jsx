import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { TeacherHome } from "../pages/teacher/Home/TeacherHome";
import {StudentProfile} from "../pages/teacher/StudentProfile";
import { Classroom } from "../pages/teacher/Classroom/Classroom";
import { TeacherLayout } from "../components/layouts/MainLayouts/TeacherLayout";


const teacherRoutes = [
    { path: '/teacher/home', element: <TeacherHome /> },
    { path: '/teacher/classroom/:classroomId', element: <Classroom /> },
    { path: '/teacher/StudentProfile', element: <StudentProfile /> },
];

export function TeacherRoutes() {
    return teacherRoutes.map(({ path, element }) => (
        <Route
            key={path}
            path={path}
            element={
                <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherLayout>
                        {element}
                    </TeacherLayout>
                </ProtectedRoute>
            }
        />
    ));
}